'use strict';
/**
 * Creates a server that uses ssl/tsl
 */

var https = require('https'),
    fs = require('fs'),
    options = {
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./key-cert.pem')
    };

https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("hello world \n");
}).listen(3000);

console.log("Go to https://localhost:3000 to get into the magic.");
