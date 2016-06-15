var redis_client = require('../redis-client/redis-client');
var Promise = require('bluebird'); 

module.exports = SubscribeHandler;

function SubscribeHandler() {
}

SubscribeHandler.prototype.subscribe = function(req, res) {
	var arguments = req.body.text;
	var args_array = arguments.split(" ");

	if (args_array.length != 2) {
		res.json({ text: "Usage: subscribe {repo name}" });
		return;
	}

	var user_name = req.body.user_name;
	var user_id = req.body.user_id;	//TODO: store by user_id instead of user_name
	var repo = args_array[1];

	var promise1 = redis_client.saddAsync(user_name, repo);
	var promise2 = redis_client.saddAsync(repo, user_name);

	Promise.all([ promise1, promise2 ])
		.then(function (results) {
			var response_body = {
				text: '',
				attachments: 
				[
					{
			            fallback: "You have subscribed to: " + repo,
			            color: "#36a64f",
			            pretext: "You have subscribed to:",
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