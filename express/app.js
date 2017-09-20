const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')

const config = {
	views: __dirname + '/views/',
	port: 8088,
	secret: 'wxcdsqyjktwookyao'
};

const USERS = {
	"zhangsna": '123456',
	"lisi": '456789'
};

let app = express();
app.listen(config.port);

app.use(bodyParser.urlencoded({
	extended: false,
	limit: 1024
}));


app.use(cookieParser(config.secret));

// 一般放在 cookie-parser之后
let keys = [];
for (let i = 0; i < 100000; i++) {
	keys.push('sig_' + Math.random());
}

app.use(cookieSession({
	name: 'sses',
	keys: keys,
	maxAge: 2 * 3600 * 1000
}))

app.use('/login', (req, res) => {
	let user = req.query['user'] || req.body['user'];
	let pass = req.query['pass'] || req.body['pass'];

	if (!user) {
		res.send({
			ok: false,
			msg: '用户名不能为空'
		});
		return;
	}

	if (!pass) {
		res.send({
			ok: false,
			msg: '密码不能为空'
		});
		return;
	}

	console.log(user, pass)

	if (!USERS[user]) {
		res.send({
			ok: false,
			msg: '用户不存在'
		});
	} else {
		if (USERS[user] != pass) {
			res.send({
				ok: false,
				msg: '用户或密码不正确'
			});
		} else {
			res.send({
				ok: true,
				msg: '登陆成功'
			});
		}
	}

});


// cookie
app.use('/cookie', (req, res) => {
	res.secret = config.secret;
	res.cookie('user', 'wookyao', {
		signed: true
	});

	console.log(req.cookies, req.signedCookies)

	res.send('')

});

// session
app.use('/session', (req, res) => {
	if (!req.session['count']) {
		req.session['count'] = 1;
	} else {
		req.session['count']++;
	}

	console.log(req.session['count'])

	res.send('');
})

app.use(express.static(config.views));
console.log(`Running and Listen: ${config.port}`);