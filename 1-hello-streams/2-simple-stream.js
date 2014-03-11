'use strict';
/**
 * This file will illustrate the behavior of streams in Node. I strongly
 * recommend reading https://github.com/substack/stream-handbook to get
 * a better sense of streams.
 *
 * This is the Unix philosophy: Write programs that do one thing and do
 * it well. Write programs to work together. Write programs to handle
 * text streams, because that is a universal interface. -
 * http://www.faqs.org/docs/artu/ch01s06.html.
 */

///////////
// TODO  //
///////////

// Explain the 2 types of streams (streams 1 and streams 2) and create
// some readable and some writable streams, using _read and etc
// following substack's awesome article.

var http = require('http');
var fs = require('fs');
var stream = fs.createReadStream('./sample-big.json');

stream.on('data', function (chunk) {
    console.log("chunk: \n" + chunk);
});

stream.on('end', function () {
    console.log('finished');
});