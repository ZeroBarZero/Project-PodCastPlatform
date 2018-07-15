var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
<<<<<<< HEAD
var config = require('./config/config.json')

var redis = require('redis');
var redisStore = require('connect-redis')(session);
var client = redis.createClient();

var passport   = require('passport');
var session    = require('express-session');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var app = express();

require('./config/passport')(passport);
=======
var session = require('express-session');

var index = require('./routes/index')
var signup = require('./routes/signup')
var login  = require('./routes/login')
>>>>>>> 588a815aa4f32e7fed869ea8126b3c25987f0327

var app = express();

app.use(expressLayouts);
app.use('/css', express.static(path.join(__dirname,'views','_assets','css')));
app.use('/fonts', express.static(path.join(__dirname,'views','_assets','fonts')));
app.use('/img', express.static(path.join(__dirname,'views','_assets','img')));

<<<<<<< HEAD
app.use(session({
  store: new RedisStore({ host: config.redis.host, port: config.redis.port, client: client }),
  key: config.session.key,
  secret: config.session.secret,
  cookie: {
    maxAge: 1000 * 60 * 60
  },
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
=======
app.use('/', index);
app.use('/signup', signup);
app.use('login', login);
>>>>>>> 588a815aa4f32e7fed869ea8126b3c25987f0327

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.set("layout extractScripts", true);

<<<<<<< HEAD

app.get(['/','/:page'],(req, res) => {
  var page = req.params.page;
  if(page){
    if (page === 'login' || page === 'register' || page === 'userInfo'){
          res.render(path.join('user',page),{ message: req.flash(page+'Message')});
    }
    else{ // page not found
      res.render('404')
    }
  }
  else{ //root
    res.render('index');
  }
});

app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });
app.post('/register', passport.authenticate('local-register', {
        successRedirect : '/login', // redirect to the secure profile section
    		failureRedirect : '/register', // redirect back to the signup page if there is an error
    		failureFlash : true // allow flash messages
    }));


=======
app.use(session({
  key: 'sid',
  secret: 's3cret@',
  resave: false,
  saveUninitialized: true
}));
>>>>>>> 588a815aa4f32e7fed869ea8126b3c25987f0327

app.listen(3000);
