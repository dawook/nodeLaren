const fs = require('fs');

// 读取文件
fs.readFile('fs_read.text', 'utf8', (err, data) => {
	if (err) throw err;

	console.log(data.toString());
});

// 向文件中写入内容
fs.writeFile('fs_write.text', '我是写入的内容', 'utf8', (err) => {
	if (err) throw err;
});