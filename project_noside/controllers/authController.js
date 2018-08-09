var nodemailer = require('nodemailer');
var models = require("../models");
var randomstring = require("randomstring");
var smtpPool = require('nodemailer-smtp-pool');
var redisClient = require('../config/redis.js');


exports.emailVerification = function(req, res, next) {
    let email = req.body.email;
    let username = req.user.username;
    var User = models.user;
    if(email.length == 0){
      req.flash('message', '이메일이 입력되지 않았습니다.');
      next();
    }
    User.findOne({where:{email:email}}).then((user) => {
      if(user){
        req.flash('message', '이미 등록된 이메일입니다.');
        next();
      }
      else{
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

        token = randomstring.generate();

        let mailOptions = {
          from: 'noReply <ifmoon.io@gmail.com>',
          to:email,
          subject: "noSide 인증 이메일.",
          text: '링크를 클릭해주세요.',
          html: "<p>아래 링크를 클릭해주세요<br/></p>"+"<p>http://localhost:3000/auth/emailVerification/?email="+email+"&token="+token+"</p>"
        };
        smtpTransport.sendMail(mailOptions, function(error, info){
          if(error) console.log(error);
          else console.log('Email sent: ' + info.response);
        });

        redisClient.hmset('emailToken:'+req.user.username, {
          'email': email,
          'token': token
        });
        redisClient.expire('emailToken:'+username, 60);
        req.flash('message', '인증 이메일이 발송되었습니다.');
      }
      next();
    });
};

exports.emailTokenVerification = function(req, res, next) {
  var User = models.user;

  redisClient.hgetall('emailToken:'+req.user.username, function(err, ans){
    if (err) console.log(error);
    else{
      if((req.query.email==ans.email) && (req.query.token==ans.token)){
        User.update({email: req.query.email, isVerificated:true}, {where:{username:req.user.username}})
            .then(function(result){
              console.log(result);
            });
      }}
    });

  next();
}

exports.isAuthenticated = function(req, res, next) {
  if(req.isAuthenticated()) next();
  else res.redirect('/login');
}
exports.isNotAuthenticated = function(req, res, next) {
  if(!req.isAuthenticated()) next();
  else res.redirect('/');
}
