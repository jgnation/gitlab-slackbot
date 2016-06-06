# gitlab-slackbot

gitlab-slackbot is a...wait for it...bot that integrates Slack and Gitlab.  Currently it allows the user to subscribe to notifications about pushes to Gitlab repositories.

**Usage**
```
/{bot-name} subscribe {repo name}
/{bot-name} unsubscribe {repo name}
/{bot-name} list
```

gitlab-slackbot is built with Node.js and utilizes RabbitMQ and Redis.  It is easy to deploy the bot locally or on Heroku.  Deployment to Heroku requires a Web Dyno and a Worker Dyno.

**Running Locally**

Run ```npm install```

Set the following environment variables in a .env file (.env is included in .gitignore):
* REDIS_URL - URL of your Redis instance
* CLOUDAMQP_URL - URL of your RabbitMQ instance
* MESSAGE_QUEUE_NAME - the name of the message queue where GitLab push notifications will be published
* SLACK_PUSH_HOOK_URL - URL of the Incoming Hook for Slack
* SLACK_OUTGOING_HOOK_TOKEN - token that will be used to validate requests from Slack to the bot API
* GITLAB_WEBHOOK_TOKEN - token that will be used to validate requests from GitLab to the bot API

Now run:
```npm start```

**Running on Heroku**

The REDIS_URL and CLOUDAMQP_URL should be added to your Heroku app's environment config after you add the corresponding add-ons to your app.  Add the remainder of the environment variables listed above. From the Heroku dashboard, navigate to {app-name} > Settings > Reveal config vars

Run ```git push heroku master --force``` to deploy the app.

