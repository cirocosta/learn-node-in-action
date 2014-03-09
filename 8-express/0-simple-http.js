var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello');
});

console.log("listenning to 3000");
app.listen(3000);



// Comparison using http
//---------------
//
// var http = require('http');
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.write("Hello");
//     res.end();
// }).listen(3000);

// console.log("listenning to 3000");