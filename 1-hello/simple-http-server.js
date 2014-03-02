var http = require('http');
var fs = require('fs');
var server = http.createServer();

// server.on('request', function (req, res) {
//  res.writeHead(200, {'Content-Type': 'text/plain'});
//  res.end('hello world\n');
// });

server.on('request', function (req, res) {
    res.writeHead(200, {'Content-Type': 'image/png'});
    fs.createReadStream('./mongo.png').pipe(res);
});

server.listen(3000);