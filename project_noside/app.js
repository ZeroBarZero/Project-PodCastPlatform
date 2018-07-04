/* router */
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var app = express();

app.use(expressLayouts);
app.use('/css',express.static(path.join(__dirname,'views','_assets','css')));
app.use('/fonts',express.static(path.join(__dirname,'views','_assets','fonts')));
app.use('/img',express.static(path.join(__dirname,'views','_assets','img')));

app.set('views', path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.set('layout', 'layout');
app.set("layout extractScripts", true);

app.get(['/','/:page'],(req, res) => {
  var page = req.params.page;
  if(page){
    if (page === 'login' || page === 'register' || page === 'userInfo'){
          res.render(path.join('user',page));
    }
    else{ // page not found
      res.render('404')
    }
  }
  else{ //root
    res.render('index');
  }
});


app.listen(3000);
console.log('conect 3000 port :)');
