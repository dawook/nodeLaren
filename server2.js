const http = require('http');
const fs = require('fs');

const WEBROOT = './www';
const PORT = 8080;

let webServer = (req, res) => {
	let file_name = WEBROOT + req.url;

	fs.readFile(file_name, 'utf8', (err, data) => {

		if (err) {
			res.write('404');
		} else {
			res.write(data);
		}

		res.end();
	})
};

const server = http.createServer(webServer);
server.listen(PORT);
console.log('listen ' + PORT);