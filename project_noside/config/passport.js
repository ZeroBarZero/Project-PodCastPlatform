<<<<<<< HEAD
var LocalStrategy   = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var config = require('./config/config.json');
var connection = mysql.createConnection(config.rdb);

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });
    passport.use(
        'local-register',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            emailField : 'email'
            passReqToCallback : true
        },
        function(req, username, password, done) {
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('registerMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var salt = bcrypt.genSaltSync(saltRounds);

                    var newUser = {
                        username: username,
                        password: bcrypt.hashSync(password, salt, null),
                        email: email,
                        salt: salt
                    };

                    var insertQuery = "INSERT INTO users ( username, password, email, salt ) values (?,?,?,?)";

                    connection.query(insertQuery,[newUser.username, newUser.password, newUser.email, newUser.salt],function(err, rows) {
                        newUser.id = rows.insertId;

                        return done(null, newUser);
                    });
                }
            });
        })
    );
    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};
=======

>>>>>>> 588a815aa4f32e7fed869ea8126b3c25987f0327
