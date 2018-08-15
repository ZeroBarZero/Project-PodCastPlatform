var models = require("../models");
var aws = require('aws-sdk');
var PodCastItem = models.podCastItem;
var PodCast = models.podCast;

exports.addPodcast = function(req, res, next) {
  var podcastData = {
    title:req.body.title,
    author:req.body.author,
    description:req.body.desc
  };

  PodCast.create(podcastData).then((newPodcast, created) => {
    if(!newPodcast) console.log("생성되지 않았습니다.");
    else console.log('생성됨');
  })
  res.redirect('/mod');
};

exports.addPodItem = function(req, res, next) {
  PodCast.findOne({where:{title:req.body.podCast}}).then((podCast)=>{
    if(podCast){
      var itemData ={
        id : podCast.id,
        part: req.body.part,
        title: req.body.title,
        description: req.body.desc,
        url: req.file.key
      }
      PodCastItem.create(itemData).then((newItem, created) => {
        if(!newItem) console.log("생성되지 않았습니다.");
        else{
          PodCast.update({updatedAt:newItem.updatedAt},{where:{id:newItem.id}}).then((result) => {

          });
        }
      })
    }
  });

  res.redirect('/mod');
};
