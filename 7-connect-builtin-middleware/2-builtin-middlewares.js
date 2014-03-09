/**
 * An example usage of the favicon, cookieParser, logger, methodOverride
 * and vhost connect's builtin middlewares.
 */

//////////
// TODO //
//////////
/// Create some description for the middlewares and also illustrate the
/// usage of some of them which i didn't use here.


var connect = require('connect'),
    fs = require('fs'),
    url = require('url'),
    app = connect();

app
    .use(connect.favicon(__dirname + '/images/favicon.ico'))
    // .use(connect.logger(':method :url :query-string :response-time ms'))
    // .use(connect.logger('dev'))
    // .use(connect.logger({format: ':method :url', stream: log}))
    .use(connect.logger({formar: 'dev', immediate: true}))
    .use(function (req, res) {
        res.end('lol');
    });

app.listen(3000);

// defining a custom token for the logger middleware.
connect.logger.token('query-string', function (req, res) {
    return url.parse(req.url).query;
});


var log = fs.createWriteStream('app.log', {flags: 'a'});


