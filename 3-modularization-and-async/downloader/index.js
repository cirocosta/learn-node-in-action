'use strict';
/**
 * Downloads some files
 */

// http://udgwebdev.com/node-js-para-leigos-child-process/
// Chama-se child_process pois o processo pai é sempre o Node. Os
// processos filhos irão compartilhar memória com o processo pai. Aqui
// utilizaremos o .exec, cujo callback retorna error, stdout e stderr.

// é melhor que não seja chamado o exec diretamente, mas sim o spawn que
// oferece mais robustez : http://nodejs.org/api/child_process.html#chil
// d_process_child_process_spawn_command_args_options

var async = require("async"),
    // child_proccess will be used here to execute some unix cmds.
    exec = require("child_process").exec;

function downloadNodeVersion (version, destination, callback) {
    var url = 'http://nodejs.org/dist/node-v' + version + '.tar.gz',
        filePath = destination + '/' + version + '.tgz';
    exec('curl ' + url + ' >' + filePath, callback);
}

// https://github.com/caolan/async

//////////////////
// ASYNC.SERIES //
//////////////////

// Run an array of functions in series, each one running once the
// previous function has completed. If any functions in the series pass
// an error to its callback, no more functions are run and the callback
// for the series is immediately called with the value of the error.
// Once the tasks have completed, the results are passed to the final
// callback as an array.

////////////////////
// ASYNC.PARALLEL //
////////////////////

// Run an array of functions in parallel, without waiting until the
// previous function has completed. If any of the functions pass an
// error to its callback, the main callback is immediately called with
// the value of the error. Once the tasks have completed, the results
// are passed to the final callback as an array.

async.series([
    function (callback) {
        async.parallel([
            function (callback) {
                console.log('Downloading Node v0.4.6...');
                downloadNodeVersion('0.4.6', '/tmp', callback);
            },
            function (callback) {
                console.log('Downloading Node v0.4.7...');
                downloadNodeVersion('0.4.7', '/tmp', callback);
            }
        ], callback);
    },
    function(callback) {
        console.log('Creating archive of downloaded files...');
        exec(
            'tar cvf node_distros.tar /tmp/0.4.6.tgz /tmp/0.4.7.tgz',
            function(error, stdout, stderr) {
                console.log('All done!');
                callback();
            });
    }
]);