**gitlab-slackbot**

gitlab-slackbot is a...wait for it...bot that integrates Slack and Gitlab.  Currently it allows the user to subscribe to notifications about pushes to Gitlab repositories.

Usage:
/{bot-name} subscribe {repo name}
/{bot-name} unsubscribe {repo name}
/{bot-name} list

gitlab-slackbot is built with Node.js and utilizes RabbitMQ and Redis.  It is easily deployable to Heroku.  Deployment to Heroku requires a Web Dyno and a Worker Dyno.

Installation:
Set the SLACK_PUSH_HOOK_URL variable.
Set the SLACK_OUTGOING_HOOK_TOKEN variable.
//TODO: set all the variables

