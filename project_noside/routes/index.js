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
router.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/login',
            failureRedirect: '/signup'
        }));


router.get('/login', isNotAuthenticated,function(req,res){
  res.render('./user/login');
});
router.post('/login',passport.authenticate('local-login', {
            successRedirect: '/userInfo',
            failureRedirect: '/404'
}));

router.get('/logout', function(req, res){
  req.session.destroy(function(err) {
    res.redirect('/');
  })
});


router.get('/userInfo',isAuthenticated,function(req,res){
  res.render('./user/userInfo', {
    username: req.user.username
  });
});

router.get('/404',function(req,res){
  res.render('./404');
});

// kakao 로그인
router.get('/login/kakao',
  passport.authenticate('kakao', {
    successRedirect: '/userInfo',
    failureRedirect: '/login'
  })
);
// kakao 로그인 연동 콜백
router.get('/login/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/userInfo',
    failureRedirect: '/login'
  })
);

module.exports = router;
