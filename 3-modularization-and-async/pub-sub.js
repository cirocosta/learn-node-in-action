var events = require("events"),
    net = require("net"),
    channel = new events.EventEmitter();

channel.clients = {};
channel.subscriptions = {};

/**
 * Adding a listener to the 'join' event that stores a user's client
 * object, allowing the application to send data back to the user.
 */
channel.on('join', function (id, client) {
    this.clients[id] = client;
    this.subscriptions[id] = function (senderId, message) {
        if (id != senderId) {
            this.clients[id].write(message);
        }
    };
    this.on('broadcast', this.subscriptions[id]);
});

var server = net.createServer(function (client) {
    var id = client.remoteAddress + ":" + client.remotePort;
    client.on('connect', function () {
        channel.emit('join', id, client);
    });

    client.on('data', function (data) {
        data = data.toString();
        channel.emit('broadcast', id, data);
    });
});

server.listen(8888);