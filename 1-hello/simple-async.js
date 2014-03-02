var fs = require('fs');
fs.readFile('./sample.json', function (er, data) {
	console.log(data);
});