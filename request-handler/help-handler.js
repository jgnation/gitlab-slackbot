
module.exports = HelpHandler;

function HelpHandler() {

}

HelpHandler.prototype.help = function(req, res) {
	var responseBody = 
	{
		text: '', //the text property is required in the response
	    attachments: [
	        {
	            fallback: "The following commands are available: subscribe {repo name}, unsubscribe {repo name}, list.",
	            color: "#36a64f",
	            pretext: "The following commands are available:",
	            fields: [
	                {
	                    title: "private-subscribe {repo name}",
	                    value: "Subscribe yourself to private notifiations about pushes to the provided repo name.",
	                    short: false
	                },
					{
	                    title: "private-unsubscribe {repo name}",
	                    value: "Unsubscribe yourself from private push notifications.",
	                    short: false
	                },
					{
	                    title: "private-list",
	                    value: "List the repos to which you have private subscriptions.",
	                    short: false
	                },
	                {
	                    title: "channel-subscribe {repo name}",
	                    value: "Subscribe the current channel to notifiations about pushes to the provided repo name. Must be executed from within a channel.",
	                    short: false
	                },
					{
	                    title: "channel-unsubscribe {repo name}",
	                    value: "Unsubscribe the current channel from push notifications. Must be executed from within a channel.",
	                    short: false
	                },
					{
	                    title: "channel-list",
	                    value: "List the repos to which the current channel is subscribed to. Must be executed from within a channel.",
	                    short: false
	                },
					{
	                    title: "help",
	                    value: "You are looking at it!",
	                    short: false
	                }
	            ],
	            footer: process.env.HELP_FOOTER
	        }
	    ]
	};
	res.json(responseBody);
};