const http = require('http');
const url = require('url');

let webServer = (req, res) => {
	let
		sUrl = req.url,
		pathname = '',
		GET = {};

	if (sUrl.indexOf('?') !== -1) {
		let oUrl = url.parse(sUrl, true);
		pathname = oUrl.pathname;
		GET = oUrl.query;
	}

	console.log(pathname, GET);

	res.write('');
	res.end();

};

const server = http.createServer(webServer);
server.listen(8082)