var express = require('express');
var router = express.Router();

router.route('/')
      .get(function(req, res){
        res.render('index')
      })
      .post(function(req, res){
        res.render('404')
      });


module.exports = router;
