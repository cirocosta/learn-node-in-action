/**
 * MongoDB is a open-source document database that provides
 * high-performance, high availability and automatic scaling.
 *
 * Each record that composes the database is called Document, which is a
 * data structure composed of fields and values pairs, with the values
 * of the fields being able to anso include other documents, arrays and
 * arrays of documents. Documents are then grouped into Collections,
 * which is the equivalent of an RDBMS table. A collection exists within
 * a single DB and do not enfore a schema, i.e, the documents within a
 * collection can have differente fields; tipically the documents of a
 * collection just share a similar or related purpose and one or more
 * indexes.
 */

var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;


MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
    if (err) throw err;
    console.log("We'v got da powa of mongo!!!");

    // collection object is a pointer to a specific collection in the
    // database. If we want to insert new records or query existing ones
    // then we need to have a valid collection object.

    var collection = db.collection('test_insert');

    // MongoDb has async insert/update/remove operations. When we issue
    // an insert operation we are just providing a fire and forget
    // operation where the database does not reply with the status of
    // the insert operation.

    collection.insert({a:2}, function (err, docs) {

        // after the insert op goes, then we perform some other ops.

        // retrieving the number of items in the collection.
        collection.count(function (err, count) {
            console.log(format("count = %s", count));
        });

    // getting the items of the collection and transforming into an
    // array. It's async as well.

        collection.find().toArray(function (err, results) {
            console.dir(results);
            db.close();
        });

    });

});