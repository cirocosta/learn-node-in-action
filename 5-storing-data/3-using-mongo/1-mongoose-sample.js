'use strict';
/**
 * Here is a slightly different version of the quick start provided by
 * mongoose's creators. See it on http://mongoosejs.com/docs/index.html
 */


var mongoose = require('mongoose');
var db;

// openning a connection to the test database on our locally running
// instance of mongodb. Now we have a pending connection to it.
mongoose.connect('mongodb://localhost/test');

db = mongoose.connection;
db.on('error', onDbError);
db.on('open', onDbConnected);


function onDbError (err) {
    console.log("Mongoose raised an error while trying to connect:\n");
    console.log(err);
}

function onDbConnected () {
    console.log("Connected!");

    // Modelling a schema for our documents. Each schema maps to a
    // MongoDB collection and then defines the shape of the documents
    // within that collection.
    var kittySchema = mongoose.Schema({
        name: String
    });

    // Defining a method for the model. All these methods will be
    // compiled to those who instantiate from this.
    kittySchema.methods.speak = function () {
        var greeting =  this.name
                        ? "Meow name is " + this.name
                        : "I don't have a name :(";
        console.log(greeting);
    }



    // create a class with which we'll construct documents.
    var Kitten = mongoose.model('Kitten', kittySchema);
    // creating a document
    var silence = new Kitten({name: 'silence'});
    silence.speak();

    // the callback will receive three parameters: err, obj,
    // numberAffected. The callback function is optional and, if not
    // specified, the error will be emitted to the database connect
    // ('error' event) will handle it. Ps.: for a more local error
    // handling we can also add an error listener to the model and then
    // handle these specific errors: MyModel.on('error', errorHandler);
    silence.save(function (err, obj) {
        if (err) return console.error(err);

        console.log(obj.name + " was saved in the Db with id " + obj._id);

        console.log("\n Now we have these in the collection: ");
        showCollection(Kitten);
    });


    setTimeout(function () {
        console.log("\n\ndisconnected");
        db.close();
    }, 2000);
}

function showCollection (model) {

    // Model.find(conditions, [fields], [options], [callback])
    // finds documents that a Model maps to.

    // if we specify a callback, it will be executed immediately.
    // Otherwise, it will create a promise, which we can then execute
    // the query by calling the `.exec()` function. @see
    // http://mongoosejs.com/docs/api.html#model_Model.find

    model.find(function (err, documents) {
        if (err) return console.log(err);

        console.log(documents);

    });
}
