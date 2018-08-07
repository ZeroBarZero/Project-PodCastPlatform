var express = require('express');
var passport = require('passport');
var viewController = require('../controllers/viewController');
var authController = require('../controllers/authController');
var podController = require('../controllers/podController');
var randomstring = require('randomstring');

var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/podcast/')
  },
  filename: function (req, file, cb) {
    var prefix = req.body.podCast +"_"+ req.body.part+"_";
    cb(null, prefix+randomstring.generate(8)+".mp3");
  }
})
var upload = multer({storage: storage});

var router = express.Router();


router.get('/', viewController.indexView);
router.get('/404', viewController.pageNotFoundView);


router.get('/userInfo', authController.isAuthenticated,viewController.userInfoView);
router.get('/podItem', authController.isAuthenticated,viewController.podItemView);

router.get('/podList', viewController.podListView);
router.get('/podcast/:id', viewController.podItemView);


router.get('/mod', authController.isAuthenticated, viewController.modView);
router.get('/mod/podList', viewController.modPodListView);
router.get('/mod/podItem/:id', viewController.modPodItemView);
router.post('/mod/addPodcast', podController.addPodcast);
router.post('/mod/addPodItem', upload.single('userfile'), podController.addPodItem);

router.get('/audiotest', viewController.audiotestView);

module.exports = router;
