var queue = require('../amqp/amqp') 

module.exports = function handleRequest(req, res) {
	var hook = req.body;

	//TODO: get rid of if/switch statements
	if (hook.object_kind == 'push') {
		var commits = hook.commits;
		var commit_messages = commits.map( commit => commit.message );

		var ref = hook.ref;
		var ref_components = ref.split("/");
		var branch = ref_components[ref_components.length - 1];

		var message = {
			type: 'push',
			repo: hook.repository.name,
			commit_messages: commit_messages,
			user_name: hook.user_name,
			branch: branch
		}

		queue.publishMessage(message); //TODO: handle error
	} else if (hook.object_kind == 'merge_request') {
		var message = {
			type: 'merge_request',
			repo: hook.repository.name,
			title: hook.object_attributes.title,
			description: hook.object_attributes.description,
			user: hook.user.username,
			assignee: hook.assignee.username,
			url: hook.object_attributes.url,
			state: hook.object_attributes.state
		};
		queue.publishMessage(message); //TODO: handle error
	} else {
		//ignore this request;
		res.sendStatus(200);
		return;
	}
	res.sendStatus(200);
};
