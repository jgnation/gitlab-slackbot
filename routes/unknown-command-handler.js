
module.exports = UnknownCommandHandler;

function UnknownCommandHandler(client) {
	this.client = client
}

UnknownCommandHandler.prototype.handle = function(req, res) {
    console.log(req.body);
    var command = req.body.command;
    res.json({ text: "Unknown command." });
};