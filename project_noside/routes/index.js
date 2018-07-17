var express = require('express');
var passport = require('passport');
var nodemailer = require('nodemailer');
var models = require("../models");
var smtpPool=require('nodemailer-smtp-pool');
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

module.exports = router;
