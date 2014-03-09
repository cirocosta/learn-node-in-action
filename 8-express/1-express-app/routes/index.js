/*
 * GET home page.
 */

// express provides two ways to render views: at the application level
// (with app.render()) and at the request/response with res.render(),
// which will use app.render() internaly.

// app.render(view, [options], callback) renders a view with a
// callback responding with the rendered string.

// it's interesting to notice that the lookup takes a similar discovery
// as require. It first searches with an absolute path. If it don't
// finds it, then search a file relative to the 'views' setting
// directory. If it don't maches anything, it will try an index file.
// Otherwise, error.

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

// supposing we have:
// views/index.ejs
// views/layout.ejs
// views/photos
// views/photos/index.ejs
// views/photos/upload.ejs
//
// if we call res.render(layout.ejs), the views/layout.ejs would be
// rendered. If we call, although, res.render(photos), which is a dir,
// it would render the views/photos/index.ejs. Now, calling
// res.render(photos/upload), then views/photos/upload.ejs would be
// rendered.
