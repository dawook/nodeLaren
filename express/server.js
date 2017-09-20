const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');

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
app.get('/index', function(req, res) {
	res.render('1.ejs', {
		name: 'wookyao'
	});
});

// 5.处理static数据
app.use(express.static(__dirname + '/static/'))