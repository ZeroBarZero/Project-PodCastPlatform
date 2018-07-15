module.exports = function(app, passport) {

    app.get('/signup', function(req, res){
      res.render('./user/signup');
    });

    app.get('/login', function(req, res){
      res.render('./user/login');
    });

    app.get('/userInfo', isLoggedIn, function(req, res){
      res.render('./user/userInfo');
    });

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/login',
            failureRedirect: '/signup'
        }
    ));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/userInfo',
        failureRedirect: '/login'
    }
  ));
  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();
      res.redirect('/login');
  }
}
