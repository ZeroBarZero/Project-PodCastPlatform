var express = require('express');
var passport = require('passport');
var nodemailer = require('nodemailer');
var models = require("../models");
var smtpPool=require('nodemailer-smtp-pool');

var viewController = require('../controllers/viewController');

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

router.get('/', viewController.indexView);


router.get('/signup', isNotAuthenticated,viewController.signupView);
router.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/login',
            failureRedirect: '/signup'
        }));


router.get('/login', isNotAuthenticated, viewController.loginView);
router.post('/login',passport.authenticate('local-login', {
            successRedirect: '/userInfo',
            failureRedirect: '/404'
}));

router.get('/logout', function(req, res){
  req.session.destroy(function(err) {
    res.redirect('/');
  })
});

router.get('/userInfo',isAuthenticated,viewController.userInfoView);
router.get('/emailVerification', isAuthenticated,function(req, res){
  res.render('emailVerification');
});
router.post('/emailVerification', isAuthenticated, function(req, res, next) {
  let email = req.body.email;
  let username = req.user.username;

  let smtpTransport=nodemailer.createTransport(smtpPool( {
      service:'Gmail',
      host:'localhost',
      port:'465',
      tls:{
          rejectUnauthorize:false
      },
      auth:{
          user:'',
          pass:''
      },
      maxConnections:5,
      maxMessages:10
  }) );
  let mailOptions = {
    from: 'noReply <ifmoon.io@gmail.com>',
    to:email,
    subject: "noSide 인증 이메일.",
    text: '링크를 클릭해주세요.',
    html: "<p>아래 링크를 클릭해주세요</p>"+"<p>http://localhost:3000/auth/emailVerification/?username="+username+"&email="+email+"&token=zxcv</p>"
  };
  smtpTransport.sendMail(mailOptions, function(error, info){
    if(error) console.log(error);
    else console.log('Email sent: ' + info.response);
  });

  res.redirect('/');
});

router.get('/auth/emailVerification/', isAuthenticated, function(req,res,next){
  var User = models.user;
  if ((req.user.username == req.query.username) && (req.query.token='zxcv')){
    User.update({email: req.query.email, isVerificated:true}, {where:{username:req.query.username}}).then(function(result){
      console.log(result);
    });
  }
  res.redirect('/');
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

router.get('/login/naver',
  passport.authenticate('naver', {
    successRedirect: '/userInfo',
    failureRedirect: '/login'
  })
);

router.get('/login/naver/callback',
  passport.authenticate('naver', {
    successRedirect: '/userInfo',
    failureRedirect: '/login'
  })
);

router.get('/login/google',
  passport.authenticate('google', {
    successRedirect: '/userInfo',
    failureRedirect: '/login',
    scope:'https://www.googleapis.com/auth/plus.login'
  })
);

router.get('/login/google/callback',
  passport.authenticate('google', {
    successRedirect: '/userInfo',
    failureRedirect: '/login'
  })
);

module.exports = router;
