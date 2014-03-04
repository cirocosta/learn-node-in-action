
// instantiating a redis client, which inherits from EventEmitter.
// Knowing this, we are then able to listen for the 'error' event and
// apply our on logic.
var redis = require('redis'),
    client = redis.createClient(6379, '127.0.0.1');

client.on('error', function (err) {
    console.log("Error " + err);
});

////////////////
// FINALIZAR. //
////////////////

client.set('color', 'red', redis.print);
client.get('color', function (err, value) {
    if (err) throw err;
    console.log("Got: " + value);
});
