var express = require('express');
var passport = require('passport');
var viewController = require('../controllers/viewController');
var authController = require('../controllers/authController');
var podController = require('../controllers/podController');
var randomstring = require('randomstring');
var models = require("../models");
var Favor = models.favor;
var multer = require("multer");
var multerS3 = require("multer-s3");
var PodCast = models.podCast;
var aws = require('aws-sdk');
var  jsrecommender = require('js-recommender');
var recommender = new jsrecommender.Recommender();


var s3 = new aws.S3({
  "accessKeyId": "",
  "secretAccessKey": "",
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
router.post('/getRecommend', function(req,res){
  value = req.body.value;
  value = parseInt(value)

  Favor.findOrCreate({where:{uid:req.user.id, pid:req.body.id}, defaults: {value:value}})
  .spread((favor, created) => {
    if (created) {
      console.log("new favor", favor.value)
    }
    else{
      Favor.update({value:value},{where:{uid:req.user.id, pid:req.body.id}})
      .then(r => {
      })
    }
  })
  .then(_ => {
    var table = new jsrecommender.Table();
    var userId = req.user.id;
    Favor.findAll()
    .then((data) => {
      
      for(let i=0; i<data.length;i++){
        table.setCell(String(data[i].dataValues.pid), 
                      String(data[i].dataValues.uid), 
                      String(data[i].dataValues.value));
      }
    })
    .then(_ => {
      r = [];
      var model = recommender.fit(table);
      predicted_table = recommender.transform(table);
      for (var i = 0; i < predicted_table.columnNames.length; ++i) {
          var user = predicted_table.columnNames[i];
          if (user == userId){
            console.log('For user: ' + user);
            for (var j = 0; j < predicted_table.rowNames.length; ++j) {
              var pod = predicted_table.rowNames[j];
              if(isNaN(table.getCell(pod, user))){
                r.push({'key':pod, 'value':Math.round(predicted_table.getCell(pod, user))})
              }
            }
          }        
        }
  
        r.sort(function (a, b) {
          if (a.value < b.value) {
            return 1;
          }
          if (a.value > b.value) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        
        return r;
      }
    )
    .then(r => {
      console.log(r)
      PodCast.findOne({where:{id:r[0].key}}).then(pod => {
        console.log(pod.title)
        res.send(pod.title)
      })
    })
  })

});



module.exports = router;
