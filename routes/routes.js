var express = require('express'); 
var bluebird = require('bluebird'); 
var redis = require('redis');
var url = require('url');
var slackHandler = require('./slack-request-handler');
var gitlabHandler = require('./gitlab-request-handler');

//setup redis
bluebird.promisifyAll(redis.RedisClient.prototype);
var redisURL = url.parse(process.env.REDIS_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

var router = express.Router();

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.post('/slack-message', function(req, res) {
	//TODO: validate the request

	if(req.body.token) {
		if (req.body.token == process.env.SLACK_OUTGOING_HOOK_TOKEN) {
			slackHandler(req, res, client);
			return;
		}
	}
	res.sendStatus(401);	
});

router.post('/gitlab-hook', function(req, res) {
	//TODO validate the request

	var token = req.get('x-gitlab-token');

	if(token) {
		if (token == process.env.GITLAB_WEBHOOK_TOKEN) {
			gitlabHandler(req, res);
			return;
		}
	}
	res.sendStatus(401);
});

module.exports = router;