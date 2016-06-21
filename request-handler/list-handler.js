var redis_client = require('../redis-client/redis-client');

module.exports = ListHandler;

function ListHandler() {
}

ListHandler.prototype.list = function(req, res, action) {
    var user_name = req.body.user_name;
	var user_id = req.body.user_id;

	var recipient;
	var response_type;
	if (action == 'private-list') {
		recipient = '@' + req.body.user_name;
		response_type = 'ephemeral';
	} else { //channel-list
		recipient = '#' + req.body.channel_name;
		response_type = 'in_channel';
		if (recipient == '#directmessage') {
			res.json({ text: action + " must be executed from within a channel." });
			return;
		}
	}
	
	redis_client.smembersAsync(recipient)
		.then(function (results) {
        	if (results.length == 0) {
				var response_msg = recipient + " has no subscriptions.";
				res.json({ text: response_msg });
        	} else {
        		var fields = [];
        		var fallback_msg = recipient + " is subscribed to the following repos: ";
				for (var i = 0; i < results.length; i++) {
					var field = {
						title: results[i],
						short: false
					}
					fields.push(field);
				    fallback_msg += results[i];
				    if (i != results.length -1) {
				    	fallback_msg += ", ";
				    }
				}

        		var response_body = {
					text: '',
					response_type: response_type,
					attachments: 
					[
						{
				            fallback: fallback_msg,
				            color: "#36a64f",
				            pretext: recipient + " is subscribed to the following repos:",
				            fields: fields
		        		}
					]
				};
				res.json(response_body);       		
        	}
		})
		.catch(function(error) {
			console.log(error); 
			res.json({ text: "An error has occurred." });
		});
};