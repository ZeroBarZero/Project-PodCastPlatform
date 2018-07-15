var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var session = require('express-session');

var index = require('./routes/index')

var app = express();

app.use(expressLayouts);
app.use('/bootstrap', express.static(path.join(__dirname,'views','_assets','bootstrap')));
app.use('/fonts', express.static(path.join(__dirname,'views','_assets','fonts')));
app.use('/img', express.static(path.join(__dirname,'views','_assets','img')));


app.use('/', index);

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.set("layout extractScripts", true);

app.use(session({
  key: 'sid',
  secret: 's3cret@',
  resave: false,
  saveUninitialized: true
}));

app.listen(3000);
