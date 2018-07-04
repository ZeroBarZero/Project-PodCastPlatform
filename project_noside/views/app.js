/* router */
var express = require('express');
var expressLayouts = require('express-ejs-layouts');

var app = express();
app.use(expressLayouts);
app.set('view engine','ejs');

app.set('layout', 'layout');
app.set("layout extractScripts", true);

app.get('/',(req, res) =>{
  res.render('test');
});

app.listen(3000);
console.log('conect 3000 port');
