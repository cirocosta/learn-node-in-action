var connect = require('connect'),
    app = connect();


app
    .use(logger)
    // when passing a string as the first arg, the middleware will only
    // take effect when the prefix URL matches.
    .use('/admin', restrict)
    .use('/admin', admin)
    .use(hello)
    .listen(3000);

function logger (req, res, next) {
    console.log("%s %s", req.method, req.url);
    next();
}

function hello (req, res) {
    // here we don't need to specify the next callback function as it
    // will be the last one of our row of callbacks. When a component
    // doesn't calls next() no remaining middleware in the chain of
    // command will be invoked.
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
}

// this is a generic authentication component, not specifically tied to
// the /admin req.url. We are able to mount it anywhere we want. In the
// case of this application we mounted only in /admin, but it has to be
// stated that this is up to the dev decision. We want to create
// reusable things, lazyness rules!
function restrict (req, res, next) {
    var authorization = req.headers.authorization;

    // if there's no authorization header, inform dispatcher that an
    // error occurred.
    if (!authorization) return next(new Error('Unauthorized'));

    var parts = authorization.split('');
    var scheme = parts[0];
    var auth = new Buffer(parts[1], 'base64').toString().split(":");
    var user = auth[0];
    var password = auth[1];

    // check the credentials against the Database
    authenticateWithDatabase(user, password, function (err) {
        if (err) return next(err);
        // call the next callback if everything went ok.
        next();
    });

    // notice that we are passing to `next()` an argument in some cases.
    // When doing this, we notify Connect that there's an application
    // error and then Connect has to only execute error-handling
    // middleware for the remainder of this request.
}

function authenticateWithDatabase (user, pass, fn) {
    // here should come some logic for checking if user and pass
    // matches.
    fn();
}

function admin (req, res, next) {

    // We'll just switch over the req.url and then present something to
    // the user. Notice that Connect removes what it matched when
    // calling the middleware, i.e, '/admin/' is removed from req.url
    // and then we just need to deal with the rest of the url. It does
    // this to allow us to not have to worry about what doesn't matter
    // for the functionalitty of the middleware so that we are able to
    // reuse it in more places.

    switch(req.url) {
        case '/':
        res.end('try /users');
        break;

        case '/users':
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(['tobi', 'loki', 'jane']));
        break;
    }
}
