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

<<<<<<< HEAD
=======
	console.log('publishing message' + message);
>>>>>>> 209f4cc0549787b6d3e444b72141c9809eb7088e
	queue.publishMessage(message);

	res.sendStatus(200);
};
