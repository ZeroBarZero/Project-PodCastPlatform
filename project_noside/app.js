// set up ==========================================
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');

var passport   = require('passport');
var session    = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var app = express();

require('./config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(expressLayouts);
app.use('/css',express.static(path.join(__dirname,'views','_assets','css')));
app.use('/fonts',express.static(path.join(__dirname,'views','_assets','fonts')));
app.use('/img',express.static(path.join(__dirname,'views','_assets','img')));

app.use(session({ secret: 'rellikgubhcs',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.set('views', path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.set('layout', 'layout');
app.set("layout extractScripts", true);


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
app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/404', // redirect to the secure profile section
    		failureRedirect : '/register', // redirect back to the signup page if there is an error
    		failureFlash : true // allow flash messages
    }));



app.listen(3000);
console.log('conect 3000 port :)');
