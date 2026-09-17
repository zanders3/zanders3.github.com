"""Small PNG-to-PNG thumbnail generator; Python standard library only."""
import argparse
from pathlib import Path
import struct
import zlib

SIGNATURE = b'\x89PNG\r\n\x1a\n'


def paeth(a, b, c):
    p = a + b - c
    distances = abs(p - a), abs(p - b), abs(p - c)
    return (a, b, c)[distances.index(min(distances))]


def read_png(path):
    data = Path(path).read_bytes()
    if not data.startswith(SIGNATURE):
        raise ValueError('expected a PNG image')
    offset, header, compressed, ended = 8, None, bytearray(), False
    while offset + 12 <= len(data):
        size = struct.unpack_from('>I', data, offset)[0]
        kind = data[offset + 4:offset + 8]
        end = offset + 8 + size
        if end + 4 > len(data):
            raise ValueError('truncated PNG chunk')
        payload = data[offset + 8:end]
        if zlib.crc32(kind + payload) != struct.unpack_from('>I', data, end)[0]:
            raise ValueError('invalid PNG checksum')
        if header is None and kind != b'IHDR':
            raise ValueError('missing PNG header')
        if kind == b'IHDR':
            if header is not None or size != 13:
                raise ValueError('invalid PNG header')
            header = struct.unpack('>IIBBBBB', payload)
        elif kind == b'IDAT':
            compressed.extend(payload)
        elif kind == b'IEND':
            ended = size == 0
            break
        elif kind == b'tRNS':
            raise ValueError('PNG color-key transparency unsupported; use RGBA')
        elif kind != b'PLTE' and not kind[0] & 32:
            raise ValueError(f'unsupported PNG chunk: {kind!r}')
        offset = end + 4
    if not ended or header is None:
        raise ValueError('incomplete PNG')
    width, height, depth, color, compression, filtering, interlace = header
    if not width or not height or depth != 8 or color not in (2, 6) or any((compression, filtering, interlace)):
        raise ValueError('supported PNGs: non-interlaced, 8-bit RGB or RGBA')
    channels = 3 if color == 2 else 4
    stride = width * channels
    try:
        raw = zlib.decompress(compressed)
    except zlib.error as error:
        raise ValueError('invalid PNG compressed data') from error
    if len(raw) != height * (stride + 1):
        raise ValueError('invalid PNG pixel data length')
    rgb, previous = bytearray(), bytearray(stride)
    for start in range(0, len(raw), stride + 1):
        filter_type = raw[start]
        if filter_type > 4:
            raise ValueError('invalid PNG row filter')
        row = bytearray(raw[start + 1:start + 1 + stride])
        for i in range(stride):
            a = row[i - channels] if i >= channels else 0
            b = previous[i]
            c = previous[i - channels] if i >= channels else 0
            predictor = (0 if filter_type == 0 else a if filter_type == 1 else b
                         if filter_type == 2 else (a + b) // 2 if filter_type == 3 else paeth(a, b, c))
            row[i] = (row[i] + predictor) & 255
        if channels == 3:
            rgb.extend(row)
        else:
            for i in range(0, stride, 4):
                alpha = row[i + 3]
                rgb.extend((v * alpha + 255 * (255 - alpha) + 127) // 255 for v in row[i:i + 3])
        previous = row
    return width, height, rgb


def resize(width, height, rgb, target_width):
    """Area average using exact integer overlap weights, with no enlargement."""
    if target_width <= 0:
        raise ValueError('width must be positive')
    out_width = min(width, target_width)
    out_height = max(1, (height * out_width + width // 2) // width)
    if (out_width, out_height) == (width, height):
        return width, height, rgb

    def weights(source, target):
        return [[(i, min((j + 1) * source, (i + 1) * target) - max(j * source, i * target))
                 for i in range(j * source // target, ((j + 1) * source + target - 1) // target)]
                for j in range(target)]

    xs, ys = weights(width, out_width), weights(height, out_height)
    result = bytearray()
    area = width * height
    for yweights in ys:
        # Sum vertically once per output row, then horizontally per output pixel.
        row = [0] * (width * 3)
        for y, weight in yweights:
            start = y * width * 3
            for i in range(width * 3):
                row[i] += rgb[start + i] * weight
        for xweights in xs:
            for channel in range(3):
                value = sum(row[x * 3 + channel] * weight for x, weight in xweights)
                result.append((value + area // 2) // area)
    return out_width, out_height, result


def write_png(output, width, height, rgb):
    def chunk(kind, payload):
        return struct.pack('>I', len(payload)) + kind + payload + struct.pack('>I', zlib.crc32(kind + payload))

    rows = bytearray()
    for start in range(0, len(rgb), width * 3):
        row = rgb[start:start + width * 3]
        rows.append(1)  # Sub filtering compresses smooth RGB images well.
        rows.extend((v - (row[i - 3] if i >= 3 else 0)) & 255 for i, v in enumerate(row))
    data = (SIGNATURE + chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(rows, 9)) + chunk(b'IEND', b''))
    if hasattr(output, 'write'):
        output.write(data)
    else:
        Path(output).write_bytes(data)


def thumbnail(input_path, output_path, width=200):
    """Write a thumbnail to a path or binary stream; return (width, height)."""
    try:
        w, h, rgb = resize(*read_png(input_path), width)
        write_png(output_path, w, h, rgb)
        return w, h
    except ValueError as error:
        raise ValueError(f'{input_path}: {error}') from error


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input')
    parser.add_argument('output')
    parser.add_argument('--width', type=int, default=200)
    args = parser.parse_args()
    try:
        thumbnail(args.input, args.output, args.width)
    except (ValueError, OSError) as error:
        parser.exit(1, f'{error}\n')
