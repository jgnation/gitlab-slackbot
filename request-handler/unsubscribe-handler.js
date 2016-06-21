var redis_client = require('../redis-client/redis-client');

module.exports = UnsubscribeHandler;

function UnsubscribeHandler() {

}

UnsubscribeHandler.prototype.unsubscribe = function(req, res, action) {
    var arguments = req.body.text;
	var args_array = arguments.split(" ");

	if (args_array.length != 2) {
		res.json({ text: "Usage: " + action + " {repo name}" });
		return;
	}

	var recipient;
	var response_type;
	if (action == 'private-unsubscribe') {
		recipient = '@' + req.body.user_name;
		response_type = 'ephemeral';
	} else { //channel-unsubscribe
		recipient = '#' + req.body.channel_name;
		response_type = 'in_channel';
		if (recipient == '#directmessage') {
			res.json({ text: action + " must be executed from within a channel." });
			return;
		}
	}

	var repo = args_array[1];

	var promise1 = redis_client.sremAsync(recipient, repo)
	var promise2 = redis_client.sremAsync(repo, recipient)

	//TODO: fully test this to make sure no data is left behind
	Promise.all([ promise1, promise2 ])
		.then(function (results) {
			var response_body = {
				text: '',
				response_type: response_type,
				attachments: 
				[
					{
			            fallback: recipient + " is unsubscribed from: " + repo,
			            color: "#36a64f",
			            pretext: recipient + " is unsubscribed from:",
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