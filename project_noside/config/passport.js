var bCrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;


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
    done(null, user); // 여기의 user가 req.user가 됨
  });
  passport.use('local-signup', new LocalStrategy({ // local 전략을 세움
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, email, password, done) => {
    User.findOne({where:{username:email}}).then(function(user){
      if (user) return done(null, false, {message: '존재하는 이메일입니다.'});
      else{
        var userPassword = bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        var userData = {
          username: email,
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
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, email, password, done) => {
    User.findOne({where:{username:email}}).then((user) => {
      if (!user) return done(null, false, { message: '존재하지 않는 아이디입니다' });
      else{
        if(!bCrypt.compareSync(password,user.password)) return done(null, false,{message: '비밀번호가 틀립니다 :>'});
        else return done(null, user.get());
      }
    });
  }));
};
