var connect = require('connect'),
    app = connect(),
    parse = require('url').parse,
    routes = {
        GET: {
            '/users': function (req, res) {
                res.end('tobi, loki, ferret');
            },

            '/users/:id': function (req, res, id) {
                res.end('user ' + id);
            }
        },

        DELETE: {
            '/user/:id' : function (req, res, id) {
                res.end('deleted user ' + id);
            }
        }
    };


// middlewares
app.use(setup(':method :url'));
app.use(route(routes));
app.use(hello);
app.use(errorHandler());

// listenning to port
app.listen(3000);


///////////////////////
// error middlewares //
///////////////////////

// follows the same rules as the regular ones but accepts an error
// object along with the request and response objs. They must be defined
// to accept err, req, res and next.

function errorHandler () {

    // connect toggles NODE_ENV environment variable to say if we are or
    // not in an production environment.
    var env = process.env.NODE_ENV || 'development';
    return function (err, req, res, next) {
        res.statusCode = 500;
        switch (env) {
            case 'development':
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(err));
            break;

            default:
            res.end('Server error');
        }
    }
}

/////////////////
// middlewares //
/////////////////

// Here we'll add the implementation of some middlewares that are
// configurable. They are just like any other but now you can pass
// additional arguments to they so that it alters its behavior.


function route (obj) {
    return function (req, res, next) {

        // verifies if there's a http method defined for any route.
        if (!obj[req.method]) {
            next();
            return;
        }

        // get objects pertinent to the http method
        var routes = obj[req.method],
            url = parse(req.url),
            // get a list of the paths
            paths = Object.keys(routes);

        // iterate over the paths list
        for (var i = 0; i < paths.length; i++) {
            // get the path and the function associated with it.
            var path = paths[i],
                fn = routes[path];

            // verify if the path matches the request that came. If it
            // matches, apply the function associated with it.

            path = path.replace(/\//g, '\\/')
                        .replace(/:(\w+)/g, '([^\\/]+)');
            var re = new RegExp('^' + path + '$');
            var captures = url.pathname.match(re);
            if (captures) {
                var args = [req, res].concat(captures.slice(1));
                fn.apply(null, args);
                return;
            }
        }
        next();
    };
}


function setup (format) {

    // this function is able to be called multiple times with different
    // configurations.

    var regexp = /:(\w+)/g;

    // here comes the actual logger function, which has access to the
    // regexp expression.

    return function logger (req, res, next) {

        // with the regexp wi'll format the log entries for the request.

        var str = format.replace(regexp, function (match, property) {
            return req[property];
        });

        console.log(str);

        // call the next function in the flow
        next();
    }

    // this implementation works well as app.use() requires just a
    // function, not defining how this function should come. Knowing
    // that, we are fully able to create a function in any way.
}



function hello (req, res) {
    // here we don't need to specify the next callback function as it
    // will be the last one of our row of callbacks. When a component
    // doesn't calls next() no remaining middleware in the chain of
    // command will be invoked.
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
}

////////////////
// CONVENTION //
////////////////

// Here comes the convention for configurable middlewares. This is the
// most accepted way of implementing regardless the purpose of the
// middleware. The way that configurable middlewares are meant to be
// build is:

// function setup(options) {
//      -- setup logic
//
//      return function (req, res, next) {
//          -- middleware logic
//      }
// }
//
// app.use(setup({some: 'options'}));

