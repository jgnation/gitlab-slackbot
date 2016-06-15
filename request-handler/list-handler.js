var redis_client = require('../redis-client/redis-client');

module.exports = ListHandler;

function ListHandler() {
}

ListHandler.prototype.list = function(req, res) {
    var user_name = req.body.user_name;
	var user_id = req.body.user_id;
	
	redis_client.smembersAsync(user_name)
		.then(function (results) {
        	if (results.length == 0) {
				var response_msg = "You have no subscriptions.";
				res.json({ text: response_msg });
        	} else {
        		var fields = [];
        		var fallback_msg = "You are subscribed to the following repos: ";
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
					attachments: 
					[
						{
				            fallback: fallback_msg,
				            color: "#36a64f",
				            pretext: "You are subscribed to the following repos:",
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