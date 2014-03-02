'use strict';
/**
 * Cria um servidor para servir arquivos estáticos.
 */

var http = require("http"),
    parse = require("url").parse,
    join = require("path").join,
    fs = require("fs"),
    root = __dirname,
    server;


///////////////////////
// NON-OPTIMIZED WAY //
///////////////////////

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


//////////////////////////
// BETTER - USING PIPE. //
//////////////////////////

server = http.createServer(function (req, res) {
    var url = parse(req.url),
        path = join(root, url.pathname),
        stream = fs.createReadStream(path);
        // here we are goingo to pipe the result of the created stream
        // to the response. More on this can be find here: http://nodejs
        // .org/api/stream.html#stream_readable_pipe_destination_options
        stream.pipe(res);

        // Temos de considerar, entretanto, que erros serao lançados
        // caso tentemos abirr um arquivo não encontrado no diretório.
        // Tal lançamento ocorre pois qualquer coisa que herde de
        // EventEMitter pode emitir um 'error' como evento.
        // fs.ReadStream herda de EventEMitter, portanto temos de tratar
        // a excecao.

        stream.on('error', function (err) {

            // agora que registramos para 'ouvir' ao evento 'error':

            res.statusCode = 500;
            res.end('Internal Server Error');
        });
});

server.listen(3000);

//////////////////
// PIPE EXAMPLE //
//////////////////

// var readStream = fs.createReadStream('./original.txt'),
//     writeStream = fs.createWriteStream('./copy.txt');

// readStream.pipe(writeStream);
