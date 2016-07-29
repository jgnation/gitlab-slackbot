var queue = require('../amqp/amqp') 

module.exports = function handleRequest(req, res) {
	var hook = req.body;
	console.log(req.body);
	if (hook.object_kind != 'push') {
		//ignore this request;
		res.sendStatus(200);
		return;
	}

	var commits = hook.commits;
	var commit_messages = commits.map( commit => commit.message );

	var ref = hook.ref;
	var ref_components = ref.split("/");
	var branch = ref_components[ref_components.length - 1];

	var message = {
		repo: hook.repository.name,
		commit_messages: commit_messages,
		user_name: hook.user_name,
		branch: branch
	}

	queue.publishMessage(message); //TODO: handle error

	res.sendStatus(200);
};
