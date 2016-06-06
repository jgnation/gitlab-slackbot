
module.exports = ListHandler;

function ListHandler(client) {
	this.client = client
}

ListHandler.prototype.list = function(req, res) {
    var user_name = req.body.user_name;
	var user_id = req.body.user_id;
	
	this.client.smembersAsync(user_name)
		.then(function (results) {
			var response_msg = '';
        	
        	if (results.length == 0) {
				response_msg = "You have no subscriptions.";
        	} else {
        		response_msg = "You are subscribed to the following repos: ";
				for (var i = 0; i < results.length; i++) {
				    response_msg += results[i];
				    if (i != results.length -1) {
				    	response_msg += ", ";
				    }
				}
        	}

			res.json({ text: response_msg });
		})
		.catch(function(error) {
			console.log(error); 
			res.json({ text: "An error has occurred." });
		});
};