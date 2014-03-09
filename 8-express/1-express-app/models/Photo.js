'use strict';
/**
 * Definition of the Photo model.
 *
 * Mongoose @see http://mongoosejs.com/ is the ODM that we'll be using
 * here. It provides straight-forward schema-based solution to modeling.
 * It will provide us all the CRUD methods: create, update, remove and
 * find.
 */

var mongoose = require('mongoose');

// openning a connection to the photo_app database. when doing this we
// have a pending connection to the test database running on localhost.

mongoose.connect('mongodb://localhost/photo_app');

// Each schema maps to a MongoDB collection and defines the shape of the
// documents within that collection.

var schema = new mongoose.Schema({
    name: String,
    path: String
});

// `mongoose.model(modelName, schema)` will then compile the schema into
// `a Model, which is a fancy constructor. Instances of these models
// `represents documents, which can be saved and retreived from our
// `database.

module.exports = mongoose.model('Photo', schema);