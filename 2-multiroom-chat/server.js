'use strict';

/**
 * HTTP: will provide http server and client functionality. PATH: will
 * provide filesystem path-related functionality. MIME: ability to
 * deriva a MIME type based on a filename extension.CACHE object is
 * where the contents of cached files are stored.
 */
var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    mime = require('mime'),
    chatServer = require('./lib/chat_server'),
    cache = {};

/**
 * Handles sending of 404 errors when a file that doesn't exists is
 * requested.
 * @param  {response} response the response object to return to the user
 */
function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: Resource not found.');
    response.end();
}

////////////////////////////////////////////
// FUNCTIONS FOR THE STATIC FILES SERVING //
////////////////////////////////////////////

/**
 * Serves file data. It first writes the appropriate HTTP Headers and
 * then sends the contents of the file.
 * @param  {response} response     [description]
 * @param  {string} filePath     [description]
 * @param  {[type]} fileContents [description]
 */
function sendFile(response, filePath, fileContents) {
    response.writeHead(200,
        {'Content-Type': mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

/**
 * As acessing memory storage is faster than accessing the filesys, will
 * cache the files at a first glance and then serve it. If the file
 * doesn't exists, return http404 error.
 */
function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

///////////////////////////////////////////////////
// FUNCTIONS FOR THE GENERAL PURPOSE HTTP SERVER //
///////////////////////////////////////////////////

/**
 * Creating a HTTP server using the anonymous function to define the
 * per-request behavior. As we are serving the html files as static
 * pages, it uses the same logic as it is used for the css, js and other
 * files.
 */
var server = http.createServer(function (request, response) {
    var filePath = false;
    console.log(request.url);

    // naive routing for the application

    if (request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }

    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});


//////////////////////
// START THE SERVER //
//////////////////////

server.listen(3000, function () {
    console.log("Server is listening on port 3000.\n Have fun :P");
});

/**
 * Starts socketIO server functionality, providing it with an already
 * defined http server so it can share the same tcp/ip port.
 */
chatServer.listen(server);