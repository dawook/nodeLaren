const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const mysql = require('mysql');

const config = {
	views: 'views',
	port: 8086,
	secret: 'w02xc48dsq5yj9k75twos98o5kyas5o'
};
const mysqlConfig = {
	host: "localhost",
	user: "root",
	password: "123456",
	port: "33060",
	database: "blog"
};

// 连接池
const DB = mysql.createPool(mysqlConfig)

// 初始化express
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
app.get('/', (req, res, next) => {
	DB.query('SELECT * FROM `banner_table`', (err, data) => {
		if (err) {
			res.status(500).send('database error').end();
		} else {
			res.banners = data;
			next();
		}
	})
});

app.get('/', (req, res, next) => {
	DB.query('SELECT id,title,summary FROM `article_table`', (err, data) => {
		if (err) {
			res.status(500).send('database error').end();
		} else {
			res.news = data;
			next();
		}
	})

});

app.get('/', (req, res, next) => {
	res.render('index.ejs', {
		banners: res.banners,
		news: res.news
	})
});

app.get('/article', (req, res) => {
	let id = req.query.id;
	if (!id) {
		res.status(404).send('page not found!').end();
	}

	DB.query(`SELECT * FROM article_table WHERE id=${id}`, (err, data) => {
		if (err) {
			res.status(500).send('database error').end();
		} else {
			let article_data = data[0];

			article_data.content = article_data.content.replace(/^/gm, '<p>').replace(/$/gm, '</p>')

			res.render('conText.ejs', {
				data: article_data
			})
		}
	})


})


// 5.处理static数据
app.use(express.static(__dirname + '/www/'))