var nodemailer = require('nodemailer');
var models = require("../models");
var randomstring = require("randomstring");
var smtpPool=require('nodemailer-smtp-pool');
var redisClient = require('../config/redis.js')

exports.emailVerification = function(req, res, next) {
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

    res.redirect('/');
};

exports.emailTokenVerification = function(req, res, next) {
  var User = models.user;

  redisClient.hgetall('emailToken:'+req.user.username, function(err, ans){
    if (err) console.log(error);
    else{
      if((req.query.email==ans.email) && (req.query.token==ans.token)){
        User.update({email: req.query.email, isVerificated:true}, {where:{username:req.query.username}})
            .then(function(result){
              console.log(result);
            });
      }}
    });

  res.redirect('/');
}
