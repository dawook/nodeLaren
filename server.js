const http = require('http');

let webServer = (req, res) => {
	switch (req.url) {
		case '/1.html':
			res.write('1111111111111');
			break;
		case '/2.html':
			res.write('2222222222222');
			break;
		default:
			res.write('404');
			break;
	}
	res.end();
};

const server = http.createServer(webServer);
server.listen(8088);
console.log('listen 8088');