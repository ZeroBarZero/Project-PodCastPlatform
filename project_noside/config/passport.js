var bCrypt = require('bcrypt-nodejs');

  module.exports = function(passport,user){

    var User = user;
    var LocalStrategy = require('passport-local').Strategy;


    passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
          if(user){
            done(null, user.get());
          }
          else{
            done(user.errors,null);
          }
        });
    });


    passport.use('local-signup', new LocalStrategy(

      {
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
      },

      function(req, email, password, done){
        User.findOne({where: {username:email}})
        .then(function(user){
          if(user){
            return done(null, false, {message : 'That email is already taken'} );
          }
          else{
            var userPassword = bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            var data =
            {
              username:email,
              password:userPassword
            };


            User.create(data).then(function(newUser,created){
              if(!newUser){
                return done(null, false);
              }
              else{
                return done(null, newUser);
              }
              });
            }
          });
        }
    ));

  //LOCAL SIGNIN
  passport.use('local-login', new LocalStrategy(

  {

  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
  },

  function(req, email, password, done) {

    var User = user;

    User.findOne({ where : { username: email}}).then(function (user) {

      if (!user) {
        return done(null, false, { message: 'Email does not exist' });
      }

      if (!bCrypt.compareSync(user.password,password)) {

        return done(null, false, { message: 'Incorrect password.' });

      }

      var userinfo = user.get();

      return done(null,userinfo);

    }).catch(function(err){
      console.log("Error:",err);
      return done(null, false, { message: 'Something went wrong with your Signin' });
    });

  }
  ));

  }
