'use strict';
/**
 * Serves a TODO application through the web
 */

var http = require("http"),
    url = require("url"),
    items = [],     // will store the data on a simple JS array in mem.
    server = http.createServer(function (req, res) {

        // the http interface in node is carefully designed to never
        // buffer entire requests of responses - the user is able to
        // stream data.

        switch (req.method) {

            // as the IncomingMessage(req) instance is a readable
            // stream,  we're then able to perform data fetching just
            // like we would do with any other readable: using the
            // 'data' and 'end' event and then get the data through
            // chunks.

            case 'POST':
                var item = '';

                // here we are specifying which type of data we want to
                // receive. With this item specified the stream will
                // return strings of the specified encoding instead of
                // Buffer object. Remember, also, that we could have
                // received the full Buffer and then, later, called
                // `buf.toString(encoding)`.

                req.setEncoding('utf8');
                req.on('data', function (chunk) {
                    item += chunk;
                });

                req.on('end', function () {
                    items.push(item);
                    res.end('OK\n');
                });
                break;

            case 'GET':
                var body = items.map(function (item, i) {
                    return i + ') ' + item;
                }).join('\n');

                // we can't use the body.length as this would just count
                // the character length, but not the byte length, which
                // is what we actually need to be using here.

                res.setHeader('Content-Length', Buffer.byteLength(body));
                res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
                res.end(body);
                break;

            case 'DELETE':
                var path = url.parse(req.url).pathname,
                    i;
                i = parseInt(path.slice(1), 10);

                if (isNaN(1)) {
                    res.statusCode = 400;
                    res.end('Invalid item ID');
                } else if (!items[i]) {
                    res.statusCode = 404;
                    res.end('Item not found');
                } else {
                    items.splice(i, 1);
                    res.end('OK\n');
                }
                break;

            case 'PUT':
                var path = url.parse(req.url).pathname,
                    i, item = '';

                i = parseInt(path.slice(1), 10);

                if (isNaN(1)) {
                    res.statusCode = 400;
                    res.end('Invalid item ID');
                } else if (!items[i]) {
                    res.statusCode = 404;
                    res.end('Item not found');
                }

                req.on('data', function (chunk) {
                    item += chunk;
                });

                req.on('end', function () {
                    items[i] = item;
                    res.end('OK\n');
                });
        }
    });

server.listen(3000);
console.log("now listening to localhost:3000");