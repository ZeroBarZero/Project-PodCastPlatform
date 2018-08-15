var express = require('express');
var passport = require('passport');
var viewController = require('../controllers/viewController');
var authController = require('../controllers/authController');
var podController = require('../controllers/podController');
var randomstring = require('randomstring');

var multer = require("multer");
var multerS3 = require("multer-s3");
var aws = require('aws-sdk');

var s3 = new aws.S3({
  "accessKeyId": "AKIAJ63W5B3VP5R7XKWQ",
  "secretAccessKey": "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",
  "region": "ap-northeast-2"});

var storage = multerS3({
  s3: s3,
  bucket: 'noside-project-cdn',
  key: function (req, file, cb) {
    var prefix = req.body.podCast +"_"+ req.body.part+"_";
    cb(null, prefix+randomstring.generate(8)+".mp3");
  },
  acl: 'public-read'
});
var upload = multer({storage: storage});

var router = express.Router();


router.get('/', viewController.indexView);
router.get('/404', viewController.pageNotFoundView);


router.get('/userInfo', authController.isAuthenticated,viewController.userInfoView);
router.get('/podItem', authController.isAuthenticated,viewController.podItemView);

router.get('/podList', viewController.podListView);
router.get('/podItem/:id', viewController.podItemView);


router.get('/mod', authController.isAuthenticated, viewController.modView);
router.get('/mod/podList', viewController.modPodListView);
router.get('/mod/podItem/:id', viewController.modPodItemView);
router.post('/mod/addPodcast', podController.addPodcast);
router.post('/mod/addPodItem', upload.single('userfile'), podController.addPodItem);

router.get('/audiotest', viewController.audiotestView);

module.exports = router;
