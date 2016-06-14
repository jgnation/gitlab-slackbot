
module.exports = HelpHandler;

function HelpHandler() {

}

HelpHandler.prototype.help = function(req, res) {
	var responseBody = 
	{
		text: '', //the text property is required in the response
	    "attachments": [
	        {
	            "fallback": "The following commands are available: subscribe {repo name}, unsubscribe {repo name}, list.",
	            "color": "#36a64f",
	            "pretext": "The following commands are available:",
	            "fields": [
	                {
	                    "title": "subscribe {repo name}",
	                    "value": "subscribe to notifiations about pushes to the provided repo name",
	                    "short": false
	                },
					{
	                    "title": "unsubscribe {repo name}",
	                    "value": "unsubscribe from push notifications",
	                    "short": false
	                },
					{
	                    "title": "list",
	                    "value": "list the repos that you are subscribed to",
	                    "short": false
	                },
					{
	                    "title": "help",
	                    "value": "You are looking at it!",
	                    "short": false
	                }
	            ]
	        }
	    ]
	};
	res.json(responseBody);
};