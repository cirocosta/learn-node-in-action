'use strict';
/**
 * Execute multiple taks in parallel but it controls the flow.
 */

// To do that the tasks will be in an array but the order doesn't
// matter. Each task should call a handler function that will increment
// the number of completed tasks. When all of them are complete, the
// handler function should then perform some subsequent logic.

var fs = require("fs"),
    completedTasks = 0,
    tasks = [],
    wordCounts = {},
    filesDir = './text';

/**
 * Verifies if all the tasks are completed. If this is true, then it
 * prints the word count.
 */
function checkIfComplete () {
    completedTasks += 1;
    if (completedTasks == tasks.length) {
        for (var index in wordCounts) {
            console.log(index + ": " + wordCounts[index]);
        }
    }
}

/**
 * Counts the words in each text that comes to it.
 */
function countWordsInText (text) {
    var words = text
        .toString()
        .toLowerCase()
        .split(/\W+/)
        .sort();

    for (var index in words) {
        var word = words[index];
        if (word) {
            wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
        }
    }
}

/**
 * Reads the directory where our text files lives. When it sees the
 * files that are contained there, it generated a function for reading
 * each file that it saw and then pushs it to the tasks array.
 */
fs.readdir(filesDir, function (err, files) {
    if (err) {
        throw err;
    }

    for (var index in files) {
        var task = (function(file) {
            return function () {
                fs.readFile(file, function (err, text) {
                    if (err) {
                        throw err;
                    }
                    countWordsInText(text);
                    checkIfComplete();
                });
            }
        })(filesDir + '/' + files[index]);
        tasks.push(task);
    }
    for (var task in tasks) {
        tasks[task]();
    }
});