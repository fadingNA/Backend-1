var mongoose = require("mongoose");
const bcrypt = require("bcrypt") // generate salt;
var Schema = mongoose.Schema;
var userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        dateTime: Date,
        userAgent: String
    }]
    ,
    "country": String
});
let User;
// to be defined on new connection (see initialize)

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://nplodthong:aom77non75@senecaweb.p3gloqw.mongodb.net/?retryWrites=true&w=majority");
        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {
        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        } else {
            let newUser = new User(userData);
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(userData.password, salt, function (err, hash) {
                    if (err) {
                        reject("There was an error encrypting the password");
                    } else {
                        newUser.password = hash;
                        newUser.save().then(() => {
                            resolve();
                        }).catch((err) => {
                            if (err.code == 11000) {
                                reject("User Name already taken");
                            } else {
                                reject("There was an error creating the user: err" + err);
                            }
                        });
                    }
                });
            });

        }
    });
}

module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {
        User.find({userName: userData.userName}).exec().then((users) => {
            bcrypt.compare(userData.password, users[0].password)
                .then((res) => {
                    users[0].loginHistory.push({
                        dateTime:
                            (new Date()).toString(),
                        userAgent: userData.userAgent
                    });
                    User.update({
                            userName: users[0].userName
                        },
                        {
                            $set: {
                                loginHistory: users[0].loginHistory
                            }
                        }, {multi: false})
                        .exec().then(() => {
                        resolve(users[0]);
                    }).catch((err) => {
                        reject("Error Dude try again please");
                    });
                }).catch((err) => {
                reject("Wrong password dude: " + userData.userName);
            })
        }).catch((err) => {
            reject("Cannot find user dude: " + userData.userName);
        });
    });
}



