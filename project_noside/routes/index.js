var express = require('express');
var router = express.Router();

router.route('/')
      .get(function(req, res){
        res.render('index')
      })
      .post(function(req, res){
        res.render('404')
      });

router.route('/login')
      .get(function(req, res){
        res.render('user/login')
      })
      .post(function(req, res){
        res.render('404')
      });

router.route('/signup')
      .get(function(req, res){
        res.render('user/register')
      })
      .post(function(req, res){
        res.render('404')
      });


module.exports = router;
