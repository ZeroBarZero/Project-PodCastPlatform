var bCrypt = require('bcrypt-nodejs');
var config = require('./config.json');

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var NaverStrategy = require('passport-naver').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;


module.exports = (passport, user) => {

  var User = user;

  passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
    done(null, user.id); // 여기의 user.id가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser((id, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    User.findById(id).then((user) => {
      if(user){
        done(null,user.get());
      }
      else{
        done(user.errors, null);
      }
    }
    )
  });

  passport.use('local-signup', new LocalStrategy({ // local 전략을 세움
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, username, password, done) => {
    User.findOne({where:{username:username+"@local"}}).then(function(user){
      if (user) return done(null, false, {message: '존재하는 아이디입니다.'});
      else{
        var userPassword = bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        var userData = {
          username: username+"@local",
          password: userPassword
        };
        User.create(userData).then((newUser, created) => {
          if(!newUser) return done(null, false);
          else return done(null, newUser);
        })
      }
    })
  }));

  passport.use('local-login', new LocalStrategy({ // local 전략을 세움
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, username, password, done) => {
    User.findOne({where:{username:username+"@local", from:'local'}}).then((user) => {
      if (!user) return done(null, false, { message: '존재하지 않는 아이디입니다' });
      else{
        if(!bCrypt.compareSync(password,user.password)) return done(null, false,{message: '비밀번호가 틀립니다 :>'});
        else return done(null, user.get());
      }
    });
  }
));


  passport.use('kakao', new KakaoStrategy({
    clientID: config.auth.kakao.clientId,
    callbackURL: config.auth.kakao.callbackUrl
  },
  function (accessToken, refreshToken, profile, done) {
    var _profile = profile._json;
    var username = _profile.id + "@kakao"
    User.findOne({where:{username: username}}).then((user) => {
      if(!user){
        var userData = {
          username: username,
          password: "",
          from: "kakao"
        }
        User.create(userData).then((newUser, created) => {
          if(!newUser) return done(null, false);
          else return done(null, newUser);
        })
      }
      else{
        return done(null, user);
      }

    });
  }
  ));

  passport.use('naver', new NaverStrategy({
    clientID: config.auth.naver.clientId,
    clientSecret: config.auth.naver.clientSecret,
    callbackURL: config.auth.naver.callbackUrl
  },
  function (accessToken, refreshToken, profile, done) {
    var _profile = profile._json;
    var username = _profile.id + "@naver"
    User.findOne({where:{username: username}}).then((user) => {
      if(!user){
        var userData = {
          username: username,
          password: "",
          from: "naver"
        }
        User.create(userData).then((newUser, created) => {
          if(!newUser) return done(null, false);
          else return done(null, newUser);
        })
      }
      else{
        return done(null, user);
      }

    });
  }
  ));

  passport.use('google', new GoogleStrategy({
    clientID: config.auth.google.clientId,
    clientSecret: config.auth.google.clientSecret,
    callbackURL: config.auth.google.callbackUrl,
  },
  function (accessToken, refreshToken, profile, done) {
    var _profile = profile._json;
    console.log(_profile)
    var username = _profile.id + "@google"
    User.findOne({where:{username: username}}).then((user) => {
      if(!user){
        var userData = {
          username: username,
          password: "",
          from: "google"
        }
        User.create(userData).then((newUser, created) => {
          if(!newUser) return done(null, false);
          else return done(null, newUser);
        })
      }
      else{
        return done(null, user);
      }
    });
  }
  ));

}
