'use strict';
/**
 * This will show how to improve 0-simple-async.js by using req and res
 * as it should. Here's two great references:
 * http://howtonode.org/streams-explained and
 * https://github.com/substack/stream-handbook, which i'll made
 * reference to it later.
 */

var http = require('http');
var fs = require('fs');
var server = http.createServer(function (req, res) {
    var stream = fs.createReadStream(__dirname + '/sample-big.json');

    // will listen to 'data' and 'end' events fro the
    // fs.createReadStream. Now, `sample-big.json` will be written to
    // clients one chunk at a time immediately as they are received from
    // the disk. GREAT!

    // pipe() gets a readable stream (stream obj in this case) and hooks
    // the output to a destination - a writable stream.

    stream.pipe(res);
});

// the server will also heave another great benefit: node won't buffer
// chunks into memory needlessly when the remote client is on a really
// slow or high-latency connection.

server.listen(3000);