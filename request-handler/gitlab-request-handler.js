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
	} else if (hook.object_kind == 'merge_request') {
		console.log('!!!!!!!!!!!')
		var object_attributes = hook.object_attributes;
		var title = object_attributes.title;
		var description = object_attributes.description;
		var state = object_attributes.state;
		console.log('title = ' + title);
		console.log('description = ' + description);
		console.log('state = ' + state);
		var user = hook.user.username;
		console.log('user = ' + user);
		var assignee = hook.assignee.username;
		console.log('assignee = ' + assignee);
		var repository = hook.repository.name;		
		console.log('repository = ' + repository);
	} else {
		//ignore this request;
		res.sendStatus(200);
		return;
	}
	res.sendStatus(200);
};
