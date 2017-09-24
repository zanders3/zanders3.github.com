
## zanders3.github.com

My personal site, built with [Hexo](https://hexo.io/)

## Setup

[Hexo docs has info](https://hexo.io/docs/index.html). You need [npm](http://nodejs.org/) installed. Next install the command line:

	$ npm install -g hexo-cli
	$ hexo version
	hexo: 2.8.2
	os: Darwin 16.7.0 darwin x64
	http_parser: 1.0
	node: 0.10.29
	v8: 3.14.5.9
	ares: 1.9.0-DEV
	uv: 0.10.27
	zlib: 1.2.3
	modules: 11
	openssl: 1.0.1h

Next grab the site source:

	$ git clone -b new_site https://github.com/zanders3/zanders3.github.com

## Local Testing

Add new stuff to source/\_posts/\*.md written in markdown. Test with this:

	hexo server

## Deployment

Actually make the thing live (the generated side lives on master branch)

	hexo deploy

Push code side changes (which lives on new_site branch)

	git commit -m "blah"
	git push origin new_site
