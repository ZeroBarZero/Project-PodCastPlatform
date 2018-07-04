/* router */
var express = require('express');
var expressLayouts = require('express-ejs-layouts');

var app = express();
app.use(expressLayouts);

app.set('views', __dirname+'/views');
app.set('view engine','ejs');
app.set('layout', 'layout');
app.set("layout extractScripts", true);



app.get(['/','/:page'],(req, res) => {
  var page = req.params.page;
  console.log(page);
  if(page){
    if (page === 'login' ||
        page === 'register' ||
        page === 'userInfo'){
          res.render('user/'+page);
        }

  }
  else{
    res.render('index');
  }

});



app.listen(3000);
console.log('conect 3000 port');
