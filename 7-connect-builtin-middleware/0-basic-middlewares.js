'use strict';
/**
 * Creates a server that utilizes some of the connect's module
 * middlewares.
 */




var connect = require('connect'),
    app = connect();

    // parse the cookie requests
app.use(connect.cookieParser('tobi is a cool ferret'))
    // limit the body handling based on a limit of the size
    .use(typeLimiting(
         'application/x-www-form-urlencoded', connect.limit('64kb')))
    .use(typeLimiting(
         'application/json', connect.limit('32kb')))
    .use(typeLimiting(
         'image', connect.limit('2mb')))
    // parse GET requests
    .use(connect.query())
    // parse POST bodys
    .use(connect.bodyParser())
    .use(function (req, res, next) {
        if (req.body.username) {
            console.log("User " + req.body.username +
                        " came to the party :DD");
            next();
        } else {
            next(new Error('lol'));
        }
    })
    .use(function (req, res) {
        // logging the cookies that were parsed earlier.
        console.log(req.cookies);
        console.log(req.signedCookies);
        res.end(JSON.stringify(req.query) + '\nhello\n');
    });

/**
 * Applies a differente connect.limit depending on the content-type of
 * the request.
 * @param  {[string]}   type content-type of the request
 * @param  {Function} fn   a connect.limit instance
 */
function typeLimiting (type, fn) {
    return function (req, res, next) {
        var ct = req.headers['content-type'] || '';
        if (0 != ct.indexOf(type)) {
            return next();
        }
        fn(req, res, next);
    }
}


app.listen(3000);