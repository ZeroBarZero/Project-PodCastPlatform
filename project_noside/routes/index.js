var express = require('express');
var passport = require('passport');
var viewController = require('../controllers/viewController');
var authController = require('../controllers/authController');
var podController = require('../controllers/podController');

var router = express.Router();


router.get('/', viewController.indexView);


router.get('/signup', authController.isNotAuthenticated, viewController.signupView);

router.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/login',
            failureRedirect: '/signup'
        }));


router.get('/login', authController.isNotAuthenticated, viewController.loginView);

router.post('/login',passport.authenticate('local-login', {
            successRedirect: '/podcastList',
            failureRedirect: '/login'
}));

router.get('/logout', function(req, res){
  req.session.destroy(function(err) {
    res.redirect('/');
  })
});

router.get('/userInfo', authController.isAuthenticated,viewController.userInfoView);
router.get('/podcastItem', authController.isAuthenticated,viewController.podcastItemView);


router.get('/emailVerification',  authController.isAuthenticated, function(req, res){
  res.render('emailVerification');
});
router.post('/emailVerification',  authController.isAuthenticated, authController.emailVerification);

router.get('/auth/emailVerification/', authController.isAuthenticated, authController.emailTokenVerification);
router.get('/admin', authController.isAuthenticated, viewController.adminView);
router.get('/404', viewController.pageNotFoundView);


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

router.get('/podcastList', viewController.podcastListView);
router.get('/admin/podList', viewController.adminPodListView);
router.get('/admin/podCastItem/:id', viewController.adminPodItemView);
router.get('/podcast/:id', viewController.podcastItemView)
router.get('/audiotest', viewController.audiotestView);
module.exports = router;
