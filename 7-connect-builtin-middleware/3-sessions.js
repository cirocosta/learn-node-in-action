/**
 * Now this is break as i'm trying to use connect 3.0
 * here we'll use redis for working with key/value store.
 *
 */

var connect = require('connect');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var redis = require('redis').createClient();
var RedisStore = require('connect-redis')(session);

var hour = 3600000;
var app = connect()
    .use(favicon())
    // cookiePArser parses the Cookie header and populates `req.cookies`
    // with an object keyed by the cookie names. By passing a string to
    // the cookie parser we are enabling signed cookie support, which
    // assings req.secret so it may be used by other middleware. Notice
    // that the cookie will still be visible but it will have a
    // signature, which will let us detect if the client modified the
    // cookie.
    .use(cookieParser('keyboard cat'))
    // session data is not saved in the cookie itself, however cookies
    // are used, so we must use cookieParser middleware BEFORE this.
    .use(session({store: new RedisStore({client: redis}), secret:'keyboard cat'}))
    .use(function (req, res, next) {
        var sess = req.session;
        if (sess.views) {

            // PS: it seems like there's an error here when using
            // connect-redis :((

            //////////
            // TODO //
            //////////

            // FIX IT.

            res.setHeader('Content-Type', 'text/html');
            res.write('<p>views: ' + sess.views + ' </p>');
            res.write('<p>expires in: ' + (sess.cookie.maxAge/1000) + 's</p>');
            res.write('<p>path: ' + sess.cookie.path + '</p>');
            res.end();

            // any properties assigned to req.session object are saved
            // when the request is complete, then they are loaded on
            // subsequent requests from the same user(browser). E.g, we
            // could want to save a shopping cart info, whatever.
            // (remember that req.session object gets serialized to
            // JSON, so there are some restrictions).

            sess.views++;

            console.log(sess.views);
        } else {
            sess.views = 1;
            res.end('Welcome to the session demo. Refresh!');
        }
    });

app.listen(3000);