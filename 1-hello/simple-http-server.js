'use strict';
/**
 * Ilustra a criação de um servidor cuja resposta para os requests é uma
 * stream de uma imagem (mongo.png).
 */


var http = require('http'),
    fs = require('fs'),
    server = http.createServer();

server.on('request', function (req, res) {
    res.writeHead(200, {'Content-Type': 'image/png'});
    fs.createReadStream('./mongo.png').pipe(res);
});

server.listen(3000);