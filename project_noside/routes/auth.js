var express = require('express');
var passport = require('passport');
var authController = require('../controllers/authController');
var viewController = require('../controllers/viewController');
var router = express.Router();

router.get('/signup', authController.isNotAuthenticated, viewController.signupView);
router.get('/login', authController.isNotAuthenticated, viewController.loginView);
router.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/login',
            failureRedirect: '/login',
            failureFlash : true
          })
);

router.post('/login', passport.authenticate('local-login', {
            successRedirect: '/podList',
            failureRedirect: '/login',
            failureFlash : true
          })
);

router.get('/logout', function(req, res){
  req.session.destroy(function(err) {
    res.redirect('/');
  })
});

router.get('/login/kakao/',
  passport.authenticate('kakao', {
    successRedirect: '/podcastList',
    failureRedirect: '/login'
  })
);

router.get('/login/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/podcastList',
    failureRedirect: '/login'
  })
);

router.get('/login/naver/',
  passport.authenticate('naver', {
    successRedirect: '/podcastList',
    failureRedirect: '/login'
  })
);

router.get('/login/naver/callback',
  passport.authenticate('naver', {
    successRedirect: '/podcastList',
    failureRedirect: '/login'
  })
);

router.get('/login/google/',
  passport.authenticate('google', {
    successRedirect: '/podcastList',
    failureRedirect: '/login',
    scope:'https://www.googleapis.com/auth/plus.login'
  })
);

router.get('/login/google/callback',
  passport.authenticate('google', {
    successRedirect: '/podcastList',
    failureRedirect: '/login'
  })
);


router.post('/auth/emailVerification',  authController.isAuthenticated, authController.emailVerification, viewController.userInfoView);
router.get('/auth/emailVerification/', authController.isAuthenticated, authController.emailTokenVerification, viewController.indexView);


module.exports = router;
