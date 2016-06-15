var redis = require('redis');
var bluebird = require('bluebird'); 
var url = require('url');

bluebird.promisifyAll(redis.RedisClient.prototype);
var redisURL = url.parse(process.env.REDIS_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

module.exports = client;