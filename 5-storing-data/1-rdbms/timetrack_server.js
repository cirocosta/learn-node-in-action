var http = require('http'),
    work = require('./lib/timetrack'),
    mysql = require('mysql'),
    server,
    db;

/**
 * Para saber settar inicialmente o usuario e o banco de dados
 * corretamente, verifique o gist:
 * https://gist.github.com/cirocosta/9316904
 */

db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'myuser',
    password: 'mypassword',
    database: 'timetrack'
});

server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'POST':
        switch(req.url) {
            case '/':
            work.add(db, req, res);
            break;

            case '/archive':
            work.archive(db, req, res);
            break;

            case '/delete':
            work.delete(db, req, res);
            break;
        }
        break;

        case 'GET':
        switch(req.url) {
            case '/':
            work.show(db, res);
            break;

            case '/archived':
            work.showArchived(db, res);
        }
        break;
    }
});

server.listen(3000);

//////////////////////////////////
// finalize some other day ...  //
//////////////////////////////////

console.log("Listening to 3000");

