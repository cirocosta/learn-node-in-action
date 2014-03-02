var fs = require('fs'),
	stream = fs.createReadStream('./sample-big.json');

stream.on('data', function (chunk) {
	console.log("chunk: \n" + chunk);
});

stream.on('end', function () {
	console.log('finished');
});