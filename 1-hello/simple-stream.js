'use strict';
/**
 * Ilustra o comportamento de streams em node. Muito mais informação
 * pode ser obtida em https://github.com/substack/stream-handbook
 * (leitura altamente recomendada).
 */


var fs = require('fs'),
	stream = fs.createReadStream('./sample-big.json');

stream.on('data', function (chunk) {
	console.log("chunk: \n" + chunk);
});

stream.on('end', function () {
	console.log('finished');
});