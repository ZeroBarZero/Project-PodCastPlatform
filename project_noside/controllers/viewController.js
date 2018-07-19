exports.indexView = function(req, res) {
  res.render('index');
};

exports.signupView = function(req, res) {
  res.render('./user/signup');
};

exports.loginView = function(req, res) {
  res.render('./user/login');
};

exports.userInfoView = function(req, res) {
  res.render('./user/userInfo', {
    username: req.user.username
  });
};

exports.pageNotFoundView = function(req, res) {
  res.render('./404');
};
