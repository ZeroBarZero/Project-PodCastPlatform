var express = require('express');
var passport = require('passport');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

var isNotAuthenticated = function (req, res, next) {
  if (!req.isAuthenticated())
    return next();
  res.redirect('/');
};

router.get('/',function(req,res){
  res.render('index');
});

router.get('/signup', isNotAuthenticated,function(req,res){
  res.render('./user/signup');
});

router.get('/login', isNotAuthenticated,function(req,res){
  res.render('./user/login');
});


router.get('/logout', function(req, res){
  req.session.destroy(function(err) {
    res.redirect('/');
  })
});

router.get('/userInfo',isAuthenticated,function(req,res){
  res.render('./user/userInfo',{user: req.user});
});



router.get('/404',function(req,res){
  res.render('./404');
});



router.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/login',
            failureRedirect: '/signup'
        }));

router.post('/login',passport.authenticate('local-login', {
            successRedirect: '/userInfo',
            failureRedirect: '/404'
}));

module.exports = router;
