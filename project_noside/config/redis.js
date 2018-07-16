var redis = require('redis');
var config = require('./config.json')
var redisClient = redis.createClient(config.redis.port,config.redis.host);
redisClient.on('error', function(err) {
    console.log('Redis error: ' + err);
});

module.exports = redisClient;
