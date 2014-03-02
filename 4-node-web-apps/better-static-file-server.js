'use strict';
/**
 * Cria um servidor que serve arquivos Estáticos. Ao invés de esperar o
 * erro provindo do stream, adiantamos isso sabendo se o arquivo não foi
 * encontrado ou algum outro tipo de erro ocorreu.
 */


var http = require("http"),
    parse = require("url").parse,
    join = require("path").join,
    fs = require("fs"),
    root = __dirname,
    server;


server = http.createServer(function (req, res) {
    var url = parse(req.url),
        path = join(root, url.pathname);

    // fs.stat will analyse the file that we are trying to obtain. More
    // on the object returned, @see
    // http://nodejs.org/api/fs.html#fs_class_fs_stats.

    fs.stat(path, function (err, stat) {

        // checking if it was possible to know something about the file.

        if (err) {

           // checking if the error ERROR NO ENTRY was returned. This
           // means that the file couldn't we accessed as it is not
           // present on the dir.

            if ('ENOENT' === err.code) {
                res.statusCode = 404;
                res.end('Not Found');
            } else {

                // if it is an exception that we don't know, simply
                // return Internal Server Error.

                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        } else {

            // setting the Content-Length header to the size of the
            // file.

            res.setHeader('Content-Length', stat.size);

            // piping it to the response.

            var stream = fs.createReadStream(path);
            stream.pipe(res);
            stream.on('error', function (err) {
                res.statusCode = 500;
                res.end('Internal Server Error');
            });
        }
    });
});

server.listen(3000);