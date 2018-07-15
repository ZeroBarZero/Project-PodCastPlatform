var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');

var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser')

var app = express();

app.use(expressLayouts);
app.use('/bootstrap', express.static(path.join(__dirname,'views','_assets','bootstrap')));
app.use('/fonts', express.static(path.join(__dirname,'views','_assets','fonts')));
app.use('/img', express.static(path.join(__dirname,'views','_assets','img')));

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.set("layout extractScripts", true);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 's3cret@',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


var models = require('./models/index');

var index = require('./routes/index')(app, passport);
require('./config/passport.js')(passport, models.user);

app.listen(3000);
