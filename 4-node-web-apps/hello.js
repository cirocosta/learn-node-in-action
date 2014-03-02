'use strict';
/**
 * A helloworld concerning servers with node.
 */

var http = require("http"),
    server = http.createServer(function (req, res) {
        // handle the request. this callback will be triggered for every
        // request received. When the request has just come, node will
        // parse the request up through the HTTP headers and provide
        // them as part of the req obj.

        var body = 'hello world';

        res.write(body);
        res.setHeader('Content-Length', body.length);
        res.setHeader('Content-Type', 'text/plain');
        res.end();
    });

server.listen(3000);