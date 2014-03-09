
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');


var routes = require('./routes');
var user = require('./routes/user');
var photos = require('./routes/photos');

var app = express();


// express has five methods driven by the NODE_ENV environment variable.
// app.configure, app.set, app.get, app.enable, app.disable.

// 1 -  app.configure([env], callback) takes a string, indicating the
// what we get by doing app.get('env'), i.e, process.env.NODE_ENV. It is
// just a `if` statement. Not necessary (use just like it is here,
// without it :P)

// 2 -  app.set(name, value) assigns setting `name` to `value`

// 3 -  app.get(name) getts the setting `name` value.

// 4 -  app.enable(name) sets the setting `name` to true, so that if we
// do `app.get(name)` it will return true.

// 5 -  app.disable(name) sets the setting `name` to false.

// there are some 'express-specific' settings that it are important:
// @see http://expressjs.com/3x/api.html#app-settings

// one important setting that is enabled by default (only in production)
// is 'view cache'. It is not enabled by default in dev as it requires
// restarting the server to edit the template files.

// all environments
app.set('port', process.env.PORT || 3000);
// specifying the directory that express will use during view lookup.
app.set('views', path.join(__dirname, 'views'));
// here we are telling that the view engine is ejs and then the views
// that we reference when rendering then will all be sufixed with the
// .ejs extension. This is necessary because express lets us to use
// multiple template engines if we want. It is basically a settings for
// the default engine extension to use when omitted.
app.set('view engine', 'ejs');
app.set('photos', __dirname + '/public/photos');


// app.use([path], function) uses the given middleware `function` with
// an optional mount `path` (which defaults to '/'). This is essentially
// the `connect` that we used previously.

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// this app.get is not the same as the above as it includes a callback.
// This is actually `app.VERB()`. It provides the routing functionalitty
// in express.

// app.get('/', routes.index);
// app.get('/users', user.list);
app.get('/', photos.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
