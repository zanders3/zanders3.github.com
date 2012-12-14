#!/bin/bash
s3cmd sync --exclude-from .gitignore ./ s3://www.3zanders.co.uk/
