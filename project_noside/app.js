var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');

var config = require('./config/config.json');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(expressLayouts);
app.use('/vendor', express.static(path.join(__dirname,'views','_assets','vendor')));
app.use('/css', express.static(path.join(__dirname,'views','_assets','css')));
app.use('/js', express.static(path.join(__dirname,'views','_assets','js')));
app.use('/img', express.static(path.join(__dirname,'views','_assets','img')));
app.use('/public', express.static(path.join(__dirname,'public','podcast')));

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.set("layout extractScripts", true);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var redis = require('./config/redis.js');
var redisStore = require('connect-redis')(session);

app.use(session({
  store: new redisStore({
        client: redis,
        host: config.redis.host,
        port: config.redis.port,
        prefix : "session:",
        db : 0
    }),
    saveUninitialized: false,
    resave: false,
    secret: '#s3c*rEt!',
    cookie: { maxAge: 1000 * 60 * 60 }
}));
require('./config/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
app.use('/', indexRouter);
app.use('/', authRouter);
app.listen(3000);
