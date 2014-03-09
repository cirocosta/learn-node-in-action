var http = require('http'),
    req = http.request({
        method: 'POST',
        port: 3000,
        headers: {
            'Content-Type': 'applicaton/json'
        }
    });

req.write('[');
var n = 300000;
while (n--) {
    req.write('"foo",');
}

req.write('"bar"]');
req.end();