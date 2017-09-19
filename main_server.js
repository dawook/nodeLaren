const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const WEBROOT = './www';
const PORT = 8083;

let WebServer = (req, res) => {
	if (url.parse(req.url).path === '/favicon.ico')
		return;

	// GET
	let oGet = url.parse(req.url, true);
	let pathName = oGet.pathname;
	let GET = oGet.query;

	// POST
	let str = '';
	let POST = {};
	req.on('data', (data) => {
		str += data;
	});
	req.on('end', () => {
		POST = querystring.parse(str);
	});

	console.log(pathName, GET, POST);

	// 文件加载
	let file_name = WEBROOT + pathName;
	fs.readFile(file_name, 'utf8', (err, data) => {
		if (err) {
			res.write('404');
		} else {
			res.write(data);
		}
		res.end();
	});

};

http.createServer(WebServer).listen(PORT);