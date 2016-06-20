var redis_client = require('../redis-client/redis-client');
var Promise = require('bluebird'); 

module.exports = SubscribeHandler;

function SubscribeHandler() {
}

SubscribeHandler.prototype.subscribe = function(req, res, action) {
	var arguments = req.body.text;
	var args_array = arguments.split(" ");

	if (args_array.length != 2) {
		res.json({ text: "Usage: " + action + " {repo name}" });
		return;
	}

	var recipient;
	var response_type;
	if (action == 'private-subscribe') {
		recipient = '@' + req.body.user_name;
		response_type = 'ephemeral';
	} else { //channel-subscribe
		recipient = '#' + req.body.channel_name;
		response_type = 'in_channel';
		if (recipient == '#directmessage') {
			res.json({ text: action + " must be executed from within a channel." });
			return;
		}
	}

	var user_id = req.body.user_id;	//TODO: store by user_id/channel_id instead of user_name/channel_name
	var repo = args_array[1];

	var promise1 = redis_client.saddAsync(recipient, repo);
	var promise2 = redis_client.saddAsync(repo, recipient);

	Promise.all([ promise1, promise2 ])
		.then(function (results) {
			var response_body = {
				text: '',
				response_type: response_type,
				attachments: 
				[
					{
			            fallback: recipient + " is subscribed to: " + repo,
			            color: "#36a64f",
			            pretext: recipient + " is subscribed to: ",
			            fields: [
			                {
			                    title: repo,
			                    short: false
			                }
			            ]
	        		}
				]
			};
			res.json(response_body);
		})
		.catch(function(error) {
			console.log(error); 
			res.json({ text: "An error has occurred." });
		});
};