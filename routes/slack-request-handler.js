var SubscribeHandler = require('./subscribe-handler');
var UnsubscribeHandler = require('./unsubscribe-handler'); 
var ListHandler = require('./list-handler'); 
var HelpHandler = require('./help-handler');

module.exports = function handleRequest(req, res, client) {
    var arguments = req.body.text;
    var action;
    if (arguments) {
        var args_array = arguments.split(" ");
        action = args_array[0];
    }
    else {
        action = "unknown";
    }
    
	switch (action) {
        case 'subscribe':
            var handler = new SubscribeHandler(client);
            handler.subscribe(req, res);
            break;
        case 'unsubscribe':
            var handler = new UnsubscribeHandler(client);
            handler.unsubscribe(req, res);
            break;
        case 'list':
            var handler = new ListHandler(client);
            handler.list(req, res);
            break;
        default:
            var handler = new HelpHandler(client);
            handler.help(req, res);
	}
};