var express = require('express'); 
var slackHandler = require('../request-handler/slack-request-handler');
var gitlabHandler = require('../request-handler/gitlab-request-handler');

var router = express.Router();

router.post('/slack-message', function(req, res) {
	//TODO: validate the request

	if(req.body.token) {
		if (req.body.token == process.env.SLACK_OUTGOING_HOOK_TOKEN) {
			slackHandler(req, res);
			return;
		}
	}
	res.sendStatus(401);	
});

router.post('/gitlab-hook', function(req, res) {
	//TODO validate the request

	var header_token = req.get('x-gitlab-token');
	var query_token = req.query.token;

	if(header_token) {
		if (header_token == process.env.GITLAB_WEBHOOK_TOKEN) {
			gitlabHandler(req, res);
			return;
		}
	} else if (query_token) {
		if (query_token == process.env.GITLAB_WEBHOOK_TOKEN) {
			gitlabHandler(req, res);
			return;
		}
	}
	res.sendStatus(401);
		
});

module.exports = router;