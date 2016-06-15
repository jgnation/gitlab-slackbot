var SubscribeHandler = require('./subscribe-handler');
var UnsubscribeHandler = require('./unsubscribe-handler'); 
var ListHandler = require('./list-handler'); 
var HelpHandler = require('./help-handler');

module.exports = function handleRequest(req, res) {
    var arguments = req.body.text;
    var action;
    if (arguments) {
        var args_array = arguments.split(" ");
        action = args_array[0];
    }
    else {
        action = 'help';
    }
    
	switch (action) {
        case 'subscribe':
            var handler = new SubscribeHandler();
            handler.subscribe(req, res);
            break;
        case 'unsubscribe':
            var handler = new UnsubscribeHandler();
            handler.unsubscribe(req, res);
            break;
        case 'list':
            var handler = new ListHandler();
            handler.list(req, res);
            break;
        default:
            var handler = new HelpHandler();
            handler.help(req, res);
	}
};