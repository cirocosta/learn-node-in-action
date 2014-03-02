'use strict';
// get the fileSystem module.
var fs = require('fs'),
    watchDir = './watch',
    processedDir = './done',
    // will give us the events.EventEmitter object to inherit from.
    events = require("events"),
    // will give us the util function to perform a clean prototypal
    // inheritance.
    util = require("util");

/**
 * Defines the constructor for the Watcher object.
 * @param {string} watchDir the directory to watch
 * @param {string} processedDir the directory of the built files.
 */
function Watcher (watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

// a clean way to inherit another objects behavior. It is similar to
// `Watcher.prototype = new event.EventEmitter()`.
util.inherits(Watcher, events.EventEmitter);

/**
 * function that tells our utility to watch all of the files in the
 * watchDir that we've set earlier.
 */
Watcher.prototype.watch = function() {
    var watcher = this;

    // reads the content of a given directory. The callback get the err
    // and files arguments, where file is an array of the names of the
    // files in the directory, excluding '.' and '..'.
    fs.readdir(this.watchDir, function (err, files) {
        if (err) {
            throw err;
        }
        // scans through all of our files and then emits the 'process'
        // event to execute something.
        for (var index in files) {
            watcher.emit('process', files[index]);
        }
    });
};

/**
 * Starts the directory monitoring.
 */
Watcher.prototype.start = function() {
    var watcher = this;
    // watch for changes on filename. The callback listener will be
    // called each time the file is accessed.
    fs.watchFile(this.watchDir, function () {
        // whenever a file in the watchDir changes, this function will
        // be called.
        watcher.watch();
    });
};


///////////////////////////////////
//////////////////////////////// //
// NOW ITS UP TO THE USER :)) // //
//////////////////////////////// //
///////////////////////////////////

// process is a global object and can be accessed from anywhere. It is
// also an instance of EventEmitter :)


if (!process.argv.length > 2) {
    console.log("Will watch the current dir :)");
    watchDir = __dirname;
} else {
    watchDir = __dirname + "/" + process.argv[2];
    console.log("Will watch the directory " + watchDir);
}

// instantiation of an watcher object for a particular directory.
var watcher = new Watcher(watchDir, processedDir);
//registering this watcher to an event: the 'process' event. When the
//event is caught, the callback is triggered with a file.
watcher.on('process', function (file) {
    var watchFile = this.watchDir + '/' + file;
    console.log(watchFile);
});

watcher.start();