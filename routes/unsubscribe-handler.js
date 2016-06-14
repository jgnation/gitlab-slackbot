
module.exports = UnsubscribeHandler;

function UnsubscribeHandler(client) {
	this.client = client
}

UnsubscribeHandler.prototype.unsubscribe = function(req, res) {
    var arguments = req.body.text;
	var args_array = arguments.split(" ");

	if (args_array.length != 2) {
		res.json({ text: "Usage: unsubscribe {repo name}" });
		return;
	}

	var repo = args_array[1];
	var user_name = req.body.user_name;
	var user_id = req.body.user_id;

	var promise1 = this.client.sremAsync(user_name, repo)
	var promise2 = this.client.sremAsync(repo, user_name)

	//TODO: fully test this to make sure no data is left behind
	Promise.all([ promise1, promise2 ])
		.then(function (results) {
			var response_body = {
				text: '',
				attachments: 
				[
					{
			            fallback: "You have unsubscribed from: " + repo,
			            color: "#36a64f",
			            pretext: "You have unsubscribed from:",
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