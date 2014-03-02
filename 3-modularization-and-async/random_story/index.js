'use strict';
/**
 * Serial flow!
 *
 * This will randomly select one of the feed in the feedList and then
 * get the link and the header of a story :P
 *
 *
 * http://stackoverflow.com/questions/1897993/difference-between-concurrent-programming-and-parallel-programming
 * http://book.mixu.net/node/ch7.html chap 3, page 63 - Node.js in
 * Action
 */

var fs = require("fs"),
    request = require("request"),
    htmlparser = require("htmlparser"),
    configFilename = './rss_feeds.txt',
    tasks = [
        checkForRssFile,
        readRssFile,
        downloadRssFeed,
        parseRssFeed
    ];

/**
 * Executes the next function in the tasks list. Raises an error if an
 * error is reported.
 * @param  {error}   err    An exception to be thrown
 * @param  {object}   result an object to be passed as parameter to the
 * next function to execute.
 */
function next (err, result) {
    if (err) {
        throw err;
    }

    // gets the first element of the array and also removes the first.
    var currentTask = tasks.shift();

    if (currentTask) {
        currentTask(result);
    }
}


/**
 * Verifies if there is a file rss_feeds.txt in the current directory.
 */
function checkForRssFile () {
    fs.exists(configFilename, function (exists) {
        if (!exists) {
            return next(new Error('missing rss file ' + configFilename));
        }

        next(null, configFilename);
    });
}

function readRssFile (configFilename) {
    fs.readFile(configFilename, function (err, feedList) {
        if (err) {
            return next(err);
        }

        feedList = feedList
                            .toString()
                            .replace(/^\s+|\s+$/g, '')
                            .split('\n');
        var random = Math.floor(Math.random() * feedList.length);
        next(null, feedList[random]);
    });
}

function downloadRssFeed (feedUrl) {
    request({uri: feedUrl}, function (err, res, body) {
        if (err) {
            return next(err);
        }

        if (res.statusCode != 200) {
            return next(new Error('Abnormal response statusCode'));
        }

        next(null, body);
    });
}

function parseRssFeed (rss) {
    var handler = new htmlparser.RssHandler(),
        parser = new htmlparser.Parser(handler);

    parser.parseComplete(rss);

    if (!handler.dom.items.length) {
        return next(new Error('No RSS items found'));
    };

    var item = handler.dom.items.shift();
    console.log(item.title);
    console.log(item.link);
}

next(); // starts the execution of the functions in the tasks array!

