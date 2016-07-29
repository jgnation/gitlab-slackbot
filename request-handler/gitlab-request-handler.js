var queue = require('../amqp/amqp') 

module.exports = function handleRequest(req, res) {
	var hook = req.body;

	if (hook.object_kind == 'push') {
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
	} else if (hook.object_king == 'merge_request') {
		console.log('!!!!!!!!!!!')
		var object_attributes = hook.object_attributes;
		var description = object_attributes.description;
		console.log('description = ' + description);
		var repository = hook.repository.name;
		console.log('repository = ' + repository);
	} else {
		//ignore this request;
		res.sendStatus(200);
		return;
	}
	res.sendStatus(200);
};
