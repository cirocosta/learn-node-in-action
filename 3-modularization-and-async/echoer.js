'use strict';

/**
 * net provides us an asynchronous network wrapper.It contains methods
 * for creating both servers and clients (streams).
 */
var net = require('net'),
    // creates a new TCP server. Its structure is
    // createServer([options], [connectionListener]), with the
    // connection listeners setting automatically a listener for the
    // 'connection' event.
    server = net.createServer(function (socket) {
        console.log("Server connected");
        // registering for the 'data' event.
        socket.on('data', function (data) {
            socket.write(data);
        });

        // socket.on("end", function () {
        //     console.log("server just disconnected");
        // });

        // socket.write("hello\r\n");
        // socket.pipe(socket);
    });

server.listen(3000, function () {
    console.log("Server bound with the port 3000");
});