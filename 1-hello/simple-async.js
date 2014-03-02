'use strict';
/**
 * Mostra um carregamento assíncrono de dados. Carrega o arquivo inteiro
 * e então retorna os dados no callback. Se não for especificado um
 * encoding, retorna um tipo buffer comum.
 */


var fs = require('fs');
fs.readFile('./sample-big.json', function (er, data) {
    if (er) {
        throw er;
    }
	console.log(data);
});