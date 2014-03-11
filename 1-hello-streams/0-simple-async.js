'use strict';
/**
 * Shows a very basic async data loading. It will load an entire file and
 * then it'll return the data with the callback. If no encoding
 * specified, it will return a Buffer obj.
 */

var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    // body...

    // fs.readFile(filename,[options], callback) simply receives a
    // filename (string), an object containing the options (encoding and
    // flag) and then a callback function, which will have `err,data`
    // data as params. Although this is a async function, it'll load
    // everything in memory and just when finished it will then send the
    // data (FOR EVERY REQUEST. OMG!).
    fs.readFile('./sample-big.json', function (err, data) {
        if (err) throw err;
        console.log(data);
    });
});

// Why this is bad? users will have to wait a bunch while the server
// buffers the entire file into the memory and then they'll also have to
// wait while all of the file is retrieved. No chunks here man!
//
// How could we improve this? `req` and `res` are badasses as both of
// them are streams by nature. @see 1-simple-http-server-w-streams.js to get in touch
// with it.

server.listen(3000);