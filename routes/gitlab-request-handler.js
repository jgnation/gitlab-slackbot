var queue = require('./amqp') 

module.exports = function handleRequest(req, res) {
	var hook = req.body;
	if (hook.object_kind != 'push') {
		//ignore this request;
		res.sendStatus(200);
		return;
	}

	console.log(hook);

	var ref = hook.ref;
	var ref_components = ref.split("/");
	var branch = ref_components[ref_components.length - 1];

	var message = {
		repo: hook.repository.name,
		num_commits: hook.total_commits_count,
		user_name: hook.user_name,
		branch: branch
	}

	queue.publishMessage(message); //TODO: handle error

	res.sendStatus(200);
};
