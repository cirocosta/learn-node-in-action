/**
 * Redis stands for Remote Dictionary Service and it is a NoSql
 * key-value data store (a data-structure server). Although MongoDb
 * could be understood just like that as well, there's a big difference
 * considering persistance - mongo is more disk-based document store,
 * while redis is much more like a membached one with built-in
 * persistence (snapshotting or journaling - keeps a log of all the ops
 * in the sys before comitting) + some cool datatypes.
 *
 * It is very fast as the entire dataset, like memcache, is stored
 * in-memory.
 *
 * Here at thsi file we are instantiating a redis client, which inherits
 * from EventEmitter. Knowing this, we are then able to listen for the
 * 'error' event and apply our on logic.
 *
 * Redis is a fantastic choice if you want a highly scalable data store
 * shared by multiple processes, multiple applications, or multiple
 * servers. As just an inter-process communication mechanism it is tough
 * to beat. The fact that you can communicate cross-platform,
 * cross-server, or cross-application just as easily makes it a pretty
 * great choice for many many use cases. Its speed also makes it great
 * as a caching layer.
 *
 * @see [Intro to Redis] http://redis.io/topics/introduction
 * @see [What is Redis and What do i use for?] http://bit.ly/1ioIoKg
 * @see [Configuring Redis w/ Socket.IO](http://bit.ly/1nuA1vo)
 *
 * External programs talk to redis using a TCP socket and a Redis
 * specific protocol.
 */

///////////////
//////////// //
//  TODO  // // -- implement oAuth2 service w/ redis as db
//////////// // -- @see http://redis.io/commands/expire
///////////////


var redis = require('redis'),
    client = redis.createClient(6379, '127.0.0.1');

client.on('error', function (err) {
    console.log("Error " + err);
});

client.set('color', 'red', redis.print);
client.get('color', function (err, value) {
    if (err) throw err;
    console.log("Got: " + value);
});
