var models = require("../models");
var PodCastItem = models.podCastItem;
var PodCast = models.podCast;

exports.addPodCast = function(req, res, next) {
  var podcastData = {
    title:req.body.title,
    author:req.body.author,
    description:req.body.desc,
  };

  PodCast.create(podcastData).then((newPodcast, created) => {
    if(!newPodcast) console.log("생성되지 않았습니다.");
    else console.log('생성됨');
  })
  res.redirect('./admin');
};

exports.addPodCastItem = function(req, res, next) {

  PodCast.findOne({where:{title:req.body.podCast}}).then((podCast)=>{
    if(podCast){
      var itemData ={
        id : podCast.id,
        part: req.body.part,
        title: req.body.title,
        description: req.body.desc,
        url: req.body.url
      }
      PodCastItem.create(itemData).then((newItem, created) => {
        if(!newItem) console.log("생성되지 않았습니다.");
        else console.log("생성됨");
      })
    }
    else return false;
  });

  res.redirect('./admin');
};
