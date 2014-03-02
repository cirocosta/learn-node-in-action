'use strict';
/**
 * Creates a server for serving static files
 */

var http = require("http"),
    parse = require("url").parse,
    join = require("path").join,
    fs = require("fs"),
    root = __dirname,
    server;

// server = http.createServer(function (req, res) {
//     var url = parse(req.url),
//         path = join(root, url.pathname),
//         stream;

//     stream = fs.createReadStream(path);
//     stream.on('data', function (chunk) {
//         res.write(chunk);
//     });
//     stream.on('end', function () {
//         res.end();
//     });
// });

server = http.createServer(function (req, res) {
    var url = parse(req.url),
        url = join(root, url.pathname),
        stream = fs.createReadStream(path);
        // here we are goingo to pipe the result of the created stream
        // to the response. More on this can be find here: http://nodejs
        // .org/api/stream.html#stream_readable_pipe_destination_options
        stream.pipe(res);
})


server.listen(3000);
