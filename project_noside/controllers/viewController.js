var models = require('../models');
var PodCast = models.podCast;
var PodCastItem = models.podCastItem;

exports.indexView = function(req, res) {
  res.render('index', {
    isAuthenticated: req.isAuthenticated()
  });
};

exports.signupView = function(req, res) {
  res.render('./user/signup',{
    isAuthenticated: req.isAuthenticated()
  });
};

exports.loginView = function(req, res) {
  var message = req.flash('error');
  if (message == "Missing credentials") message="";
  res.render('./user/login', {
    isAuthenticated: req.isAuthenticated(),
    message: message
  });
};

exports.userInfoView = function(req, res) {
  var _username = req.user.username;
  _username = _username.split('@')[0];

  res.render('./user/userInfo', {
    username: _username,
    isAuthenticated: req.isAuthenticated(),
    message:req.flash('message')
  });
};

exports.pageNotFoundView = function(req, res) {
  res.render('./404',{
    isAuthenticated: req.isAuthenticated()
  });
};

exports.podListView = function(req, res) {
  PodCast.findAll().then((data) => {
    res.render('./podcastList',{
      isAuthenticated: req.isAuthenticated(),
      posts: data
    })
  });
};

exports.podItemView = function(req, res) {
  res.render('./podItem',{
    isAuthenticated: req.isAuthenticated()
  });
};

exports.modView = function(req, res) {
  res.render('./mod/mod',{
    isAuthenticated: req.isAuthenticated()
  })
};

exports.modPodListView = function(req, res) {
  PodCast.findAll().then((data) => {
    res.render("./mod/mod-podList",{
      posts: data,
      isAuthenticated: req.isAuthenticated()
    })
  });
};

exports.modPodItemView = function(req, res) {
  var id = req.params.id;
  PodCastItem.findAll({where:{id:id}}).then((data) => {
    res.render("./mod/mod-podItem",{
      posts: data,
      isAuthenticated: req.isAuthenticated()
    })
  });
};

exports.audiotestView = function(req, res) {
  res.render("./audiotest", {
    isAuthenticated: req.isAuthenticated()
  })
};
