// defining a dummy database of photos :P  See that here we are defining
// the data and we'll expose it within the res.render data parameter. We
// could, although, expose it for the whole app with `app.local` or for
// the specific request with res.locals. It's  also important to say
// that we always have something that app.locals exposes. It is the
// `settings` object, which contains everything that we have defined
// with the app.set at app.js.

var join = require('path').join;
var fs = require('fs');
var Photo = require('../models/Photo');

var photos = [];

photos.push({
    name: 'Node.js Logo',
    path: 'http://nodejs.org/images/logos/nodejs-green.png'
});

photos.push({
    name: 'Ryan Speaking',
    path: 'http://nodejs.org/images/ryan-speaker.jpg'
});

// Route functions, identical to regular Connect middleware functions,
// accepts request and response objects, as well as the next() callback
// function (not used here).
exports.list = function (req, res) {
    // it will render the view 'photos' (remember that it can be a
    // directory and, if it is, it will search for the index.html within
    // it) passing the data object that contains title and the photos
    // list.
    res.render('photos', {
        title: 'Photos',
        photos: photos
    });
};

// The variable lookup acts like: The variable can be found in `render`?
// if true, just return the value, otherwise, go look to `res.locals`.
// Is it there? if yes, return :P, otherwise, go search at `app.locals`.
// Not find? fuck. Error! //ps.: We could also expose helper functions
// to the template! One great way to do this thinking in a modularized
// way would be: app.locals(require('./helpers'));

// Notice that, in the modularized example above, we are calling the
// app.locals. That's because `app.locals`is also a function, which when
// invoked with an object will merge properties into itself, providing a
// simple way to expose existing objects as local variables.
//
// @see http://expressjs.com/3x/api.html#app.locals

exports.form = function (req, res) {
    res.render('photos/upload', {
        title: 'Photo upload'
    });
};

exports.submit = function (dir) {

    return function (req, res, next) {

        // req.files and also req.body are provided by the bodyParser
        // middleware.

        var img = req.files.photo.image;
        var name = req.body.photo.name || img.name;
        var path = join(dir, img.name);

        // asynchronous function to rename. takes oldPath, newPath and
        // callback.
        fs.rename(img.path, path, function (err) {
            if (err) return next(err);

            // creating an instance of Photo and then inserting it to
            // the database. The callback will return with an err if an
            // error occurred while inserting and also the full document
            // inserted.

            Photo.create({
                name: name,
                path: img.name
            }, function (err, photo) {
                if (err) return next(err);

                // performing http redirect to the index page.

                res.redirect('/');
            });
        });

    };
};