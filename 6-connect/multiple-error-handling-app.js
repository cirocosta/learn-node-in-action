var connect = require('connect'),
    api = connect(),
    app = connect();

api
    .use(users)
    .use(pets)
    .use(errorHandler)
    .use(hello)
    .listen(3000);

var db = {
    users: [
        {name: 'tobi'},
        {name: 'loki'},
        {name: 'janet'}
    ]
};

function errorPage (err, req, res, next) {
    console.log("hauhau");
}

function hello (req, res, next) {

    // if we are requesting the /hello page, it will end HelloWorld!\n.
    // Otherwise, it will call the next middleware. Can't raise an error
    // here :P
    if (req.url.match(/^\/hello/)) {
        res.end('HelloWorld\n');
    } else {
        next();
    }
}

function users (req, res, next) {
    // will see if the url matches /user/_something_. If it does match,
    // it will then try to get the user that was typed in the
    // _something_ area. If it finds, will then retrieve a json with the
    // username. Otherwise, it will pass to the next() an error object
    // with the notFound property set to true.
    var match = req.url.match(/^\/user\/(.+)/)
    if (match) {
        var user = db.users[match[1]];
        if (user) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
        } else {
            var err = new Error('User not found');
            err.notFound = true;
            next(err);
        }
    } else {
        // the /user/_something_ pattern didn't match. just go to the
        // next middleware.
        next();
    }
}

function pets (req, res, next) {
    // here we implement an error to be raised. foo() function is not
    // defined :P

    if (req.url.match(/^\/pet\/(.*)/)) {
        foo();
    } else {
        next();
    }
}

function errorHandler (err, req, res, next) {
    console.log(err.stack);
    if (err.notFound) {
        res.statusCode = 404;
        res.end(JSON.stringify({error: err.message}));
    } else {
        res.statusCode = 500;
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

