'use strict';
/**
 * Constrói uma CLI para salvas tasks em um arquivo e dar retrieve nas
 * tasks ja salvas no arquivo.
 */


var fs = require('fs'),
    path = require('path'),
    args,
    command,
    taskDescription,
    file;

// com o Splice alteramos o conteudo da lista `process.argv` e colocamos
// em args toda a sublista do terceiro elemento em diante.
args = process.argv.splice(2);

// o comando representa o primeiro da sublista que obtivemos.
command = args.shift();

// a descricao da task é todo o restante da lista de argumentos unidos
// com o separador ' ' (espaço).
taskDescription = args.join(' ');

// anotamos então o caminho para o arquivo que contem as tasks.
file = path.join(process.cwd(), '/.tasks');

switch(command) {
    // se o comando for `list`, apenas mostramos o que foi guardado
    case 'list':
    listTasks(file);
    break;

    // para o comando `add`, adicionamos a lista
    case 'add':
    addTask(file, taskDescription);
    break;

    default:
    console.log("Ooops... you're doing it wrong.\n");
    console.log("Usage: " + process.argv[0] + ' list|add [taskDescription]');
}


/**
 * Adiciona uma nova task ao arquivo.
 * @param {string} file arquivo
 * @param {string} taskDescription   descricao para colocar na db.
 */
function addTask (file, taskDescription) {
    loadOrInitializeTaskArray(file, function (tasks) {
        tasks.push(taskDescription);
        storeTasks(file, tasks);
    });
}

/**
 * Adiciona uma task à lista (ao arquivo que contem o que salvamos).
 */
function listTasks (file) {
    loadOrInitializeTaskArray(file, function (tasks) {
        for (var i in tasks) {
            console.log(tasks[i]);
        }
    });
}

/**
 * Carrega ou inicializa o array de terefas.
 * @param  {String}   file caminho para o arquivo
 * @param  {Function} cb   callback a executar. Seu argumento é uma
 * lista que retorna as tarefas que já estão registradas ou um vazio.
 */
function loadOrInitializeTaskArray (file, cb) {

    // Verifica se existe ou não o caminho passado. Então chama o
    // callback que retorna true ou false como argumento.

    fs.exists(file, function (exists) {
        var tasks = [];
        if (exists) {
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) throw err;
                var data = data.toString(),
                    tasks = JSON.parse(data || '[]');
                    cb(tasks);
            });
        } else {
            cb([]);
        }
    });
}

/**
 * Armazena um array de tarefas em um arquivo passado. Caso o arquivo
 * não exista, será criado um. Caso exista, será reescrito com os dados
 * novos.
 * @param  {string} file  caminho para o arquivo
 * @param  {array} tasks lista com as tarefas
 */
function storeTasks (file, tasks) {

    // irá criar um arquivo novo com os dados ou então reescrever um que
    // já existe. Caso fosse a intenção não excluir, poderiamos utiliazr
    // appendFile, p.ex.

    fs.writeFile(file, JSON.stringify(tasks), 'utf8', function (err) {
        if (err) throw err;
        console.log('Saved :)');
    });
}