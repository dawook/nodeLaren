const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const WEBROOT = './www';
const WEBPORT = 8086;

// 临时存放用户数据
var USERS = {};

let webServer = (req, res) => {
	if (url.parse(req.url).path === '/favicon.ico')
		return;

	let str = '';
	req.on('data', (data) => {
		str += data;
	});

	req.on('end', () => {

		// 格式化数据
		let oUrl = url.parse(req.url, true);
		const pathName = oUrl.pathname;
		const GET = oUrl.query;
		const POST = querystring.parse(str);



		if (pathName == '/user') { // 处理接口


			switch (GET.act) {
				case 'reg':
					if (USERS[GET.user]) {
						res.write('{"ok": false, "msg": "用户名已存在"}');
					} else {
						USERS[GET.user] = GET.pass;
						res.write('{"ok": true, "msg": "注册成功"}');
					}
					break;
				case 'login':
					if (!USERS[GET.user]) {
						res.write('{"ok": false, "msg": "用户名不存在"}');
					} else if (USERS[GET.user] != GET.pass) {
						res.write('{"ok": false, "msg": "用户名或密码错误"}');
					} else {
						res.write('{"ok": true, "msg": "登陆成功"}');
					}
					break;
				default:
					res.write('{"ok": false, "msg": "未知的act"}');
					break;
			}
			res.end();


		} else { // 处理文件
			let file_name = WEBROOT + pathName;
			fs.readFile(file_name, 'utf8', (err, data) => {
				if (err) {
					res.write('404');
				} else {
					res.write(data);
				}
				res.end();
			})
		}


	})

};

http.createServer(webServer).listen(WEBPORT);

console.log(`listen ${WEBPORT}`);