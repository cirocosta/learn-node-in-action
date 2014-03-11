var redis = require('redis');
var bcrypts = require('bcrypt');

// creating a long-running redis connection
var db = redis.createClient();

// exporting the User function
module.exports = User;

// defining the User function
function User (obj) {
    // margin values passed.
    for (var key in obj) {
        this[key] = obj[key];
    }
}

User.prototype.save = function(fn) {
    if (this.id) {
        this.update(fn);
    } else {
        var user = this;
        db.incre('user:ids', function (err, id) {
            if (err) return fn(err);
            user.id = id;
            user.hashPAssword(function (err) {
                if (err) return fn(err);
                user.update(fn);
            });
        });
    }
};

User.prototype.update = function(fn) {
    var user = this;
    var id = user.id;
    db.set('user:id:' + user.name, id, function (err) {
        if (err) return fn(err);
        db.hmset('user:' + id, user, function (err) {
            fn(err);
        });
    });
};

User.prototype.hashPassword = function(fn) {
    var user = this;
    bcrypt.genSalt(12, function (err, salt) {
        if (err) return fn(err);
        user.salt = salt;
        bcrypt.hash(user.pass, salt, function (err, hash) {
            if (err) return fn(err);

            user.pass = hash;
            fn();
        });
    });
};