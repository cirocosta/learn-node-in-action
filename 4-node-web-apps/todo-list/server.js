'use strict';
/**
 * Cria um servidor para receber e mostrar uma todo-list.
 */

var http = require('http'),
    join = require('path').join,
    fs = require('fs'),
    qr = require('querystring'),

    // handle the file uploading in a convenient way. See more on
    // https://github.com/felixge/node-formidable

    formidable = require('formidable'),
    root = __dirname,
    items = [],
    server;

// creating the server and designating response to some requests.

server = http.createServer(function (req, res) {

    // if the user requests what we are able to respond to:

    if ('/' === req.url) {
        // verify what was the method of the request
        switch (req.method) {
        case 'GET':
            // show the index to the user
            show(res);
            break;

        case 'POST':
            // add the todo to the list of todos that we have.
            add(req, res);
            break;

        default:
            badRequest(res);
        }
    } else if ('/upload/' === req.url) {
        switch (req.method) {
        case 'POST':
            upload(req, res);
            break;
        }
    } else {
        notFound(res);
    }
});


function badRequest (res) {
    res.statusCode = 400;
    res.end('Bad Request');
}

function notFound (res) {
    res.statusCode = 404;
    res.end('Not Found');
}

/**
 * Verifica se o tipo de conteudo está setado para multipart/form-data.
 * @return {Boolean}     True se está settado corremente, false caso
 * contrário.
 */
function isFormData (req) {
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}


function upload (req, res) {
    if (!isFormData(req)) {
        res.statusCode = 400;
        res.end('Bad Request: expecting multipart/form-data ');
        return;
    }

    var form = new formidable.IncomingForm();

    form.uploadDir = "/media";
    form.keepExtensions = true;

    // form.on('field', function (field, value) {
    //     console.log(field);
    //     console.log(value);
    // });

    // the file event is emitted when a file upload is complete.
    // form.on('file', function (name, file) {
    //     console.log(name);
    //     console.log(file);
    // });

    // form.on('end', function () {
    //     res.end('upload complete!');
    // });

    form.on('progress', function (bytesReceived, bytesExpected) {
        var percent = Math.floor(bytesReceived / bytesExpected * 100);
        console.log(percent);
    });


    form.parse(req, function (err, fields, files) {
        console.log(fields);
        console.log(files);
        res.end('upload complete!');
    });



}


function show (res) {

    // getting the abs path to the index file.
    var path = join(root, '/index.html'),
        stream;

    // analysing the file that we just got.

    fs.stat(path, function (err, stat) {

        // handle error

        if (err) {
            if ('ENOENT' === err.code) {
                res.statusCode = 404;
                res.end("Not Found");
            } else {
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        } else {

            // send the file as a response

            res.setHeader('Content-Length', stat.size);

            stream = fs.createReadStream(path);
            stream.pipe(res);

            // handling possible errors with the stream.

            stream.on('error', function (error) {
                res.statusCode = 500;
                res.end('Internal Server Error');
            });
        }
    });
}


function add (req, res) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        body += chunk
    });
    req.on('end', function () {
        // this way of parsing is not all that good. It may be a problem
        // to load all the request and just then perform this kind of
        // operation. A streaming parser would be a lot better.
        var obj = qss.parse(body);
        items.push(obj.item);
        show(res);
    });
}

// serving on port 3000 :)

server.listen(3000);