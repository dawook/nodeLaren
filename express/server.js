const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const fsLib = require('fs');
const pathLib = require('path');

const config = {
	views: 'views',
	port: 8086,
	secret: 'w02xc48dsq5yj9k75twos98o5kyas5o'
};

var app = express();

app.listen(config.port)
console.log(`Running & Listening at ${config.port}`);

// 1.解析cookie
app.use(cookieParser(config.secret));


// 2.使用session
let keys = [];
for (let i = 0; i < 100000; i++) {
	keys.push('sig_' + Math.random());
}
app.use(cookieSession({
	name: 'sses',
	maxAge: 20 * 3600 * 1000,
	keys: keys
}));

// 3.post数据
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(multer({
	dest: __dirname + '/upload/'
}).any());

// 4.配置模板引擎
app.set('view engine', 'html');
app.set('views', __dirname + '/views/');
app.engine('html', consolidate.ejs);

//接收用户请求
app.get('/index', (req, res) => {
	res.render('1.ejs', {
		name: 'wookyao'
	});
});
app.get('/files', (req, res) => {
	res.render('2.ejs');
});

// 上传文件
app.post('/file_upload', (req, res) => {

	let file = req.files[0];
	let newFileName = file.path + pathLib.parse(file.originalname).ext;

	res.send(req.files)

	// fsLib.rename(file.path, newFileName, (err) => {
	// 	if (err) {
	// 		res.send('上传失败')
	// 	} else {
	// 		res.send('上传成功')
	// 	}
	// 	res.end();
	// });
})


// 5.处理static数据
app.use(express.static(__dirname + '/static/'))