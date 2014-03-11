'use strict';
/**
 * Creates a super simple server with socket.io
 */


// socketio will attache to an instance of httpServer and then add some
// handlers to id. It wont listen to a network port on its own - unless
// the dev specifies it by calling io.listen(portNumber), which would
// then create a new HTTPServer that listens to a specific port and
// would listen to that and attach itself to it.

var app = require("http").createServer(handler),
    io = require("socket.io").listen(app),
    fs = require("fs");

app.listen(3000);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        // this is really bad for serving things :P
        res.end(data);
    });
}

io.sockets.on('connection', function (socket) {
    socket.emit('news', {hello: "world"});
    socket.on('my other event', function (data) {
        console.log(data);
    });
});