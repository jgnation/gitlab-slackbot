var amqp = require('amqp');
var request = require('request');
var redis_client = require('./redis-client/redis-client');


//setup amqp
var amqpUrl = process.env.CLOUDAMQP_URL;
var connection = amqp.createConnection({url: amqpUrl});

console.log("!!! Message Processor is starting... !!!");

// add this for better debuging
connection.on('error', function(e) {
    console.log("Error from amqp: ", e);
});

// Wait for connection to become established.
connection.on('ready', function () {
    // Use the default 'amq.topic' exchange
    console.log('Connected to AMQP.');

    connection.queue(process.env.MESSAGE_QUEUE_NAME, function (q) {
        console.log('Connected to queue.');
        // Catch all messages
        q.bind('#');

        // Receive messages
        q.subscribe(function (message) {
            var type = message.body.type;

            //TOOD: get rid of these if/switch statements
            if (type == 'push') {
                var repo = message.body.repo;
                var commit_messages = message.body.commit_messages;
                var num_commits = commit_messages.length;
                var user_name = message.body.user_name;
                var branch = message.body.branch;

                redis_client.smembersAsync(repo)
                    .then(function (results) {
                        var fields = [];
                        var fallback_msg = user_name + " pushed " + num_commits + " commits to repo: " + repo + ", branch: " + branch;
                        for (var j = 0; j < commit_messages.length; j++) {
                            fallback_msg += "\n- " + commit_messages[j];
                            var field = {
                                title: '',
                                value: "`" + commit_messages[j].trim() + "`", //trim is required to remove the /n character.  I'm not sure why that character is present.
                                short: false
                            }

                            fields.push(field)
                        }

                        for (var i = 0; i < results.length; i++) {
                            var requestBody = {
                                channel: results[i],
                                text: '',
                                attachments: [
                                    {
                                        fallback: fallback_msg,
                                        color: "#36a64f",
                                        pretext: "*" + user_name + "* pushed " + num_commits + " commits to repo: *" + repo + "*, branch: *" + branch + "*",
                                        mrkdwn_in: [ "fields", "pretext" ],
                                        fields: fields
                                    }
                                ]
                            };

                            var requestObject = {
                                    url: process.env.SLACK_PUSH_HOOK_URL,
                                    method: 'POST',
                                    json: requestBody
                            };

                            request(requestObject, function(error, response, body) {
                                if(error) {
                                    console.log("Error while POSTing to slack: " + error);
                                }
                            });
                        }
                    })
                    .catch(function(error) {
                        console.log("Error while retrieving data from redis: " + error); 
                    });
            }

            if (type == 'merge_request') {
                console.log('sheeeeiiiitttt');
                var repo = message.body.repo;
                var title = message.body.title;
                var description = message.body.description;
                var user = message.body.user;
                var assignee = message.body.assignee;
                var url = message.body.url;
                var state = message.body.state;

                redis_client.smembersAsync(repo)
                    .then(function (results) {
                        for (var i = 0; i < results.length; i++) {

                            var fields = [];

                            var message = "*Repo:* " + repo + "\n";
                            message += "*State:* " + state + "\n";
                            message += "*User:* " + user + "\n";
                            if (assignee) message += "*Assigned to:* " + assignee + "\n";
                            message += "*Title:* " + title + "\n";
                            if (description) message += "*Description:* " + description + "\n";

                            fields.push({
                                title: '',
                                value: message,
                                short: false
                            });

                            var requestBody = {
                                channel: results[i],
                                text: '',
                                attachments: [
                                    {
                                        title: 'Merge Request Notification',
                                        fallback: 'New merge request: ' + url,
                                        mrkdwn_in: [ "fields"],
                                        fields: fields,
                                        footer: url
                                    }
                                ]                             
                            };

                            var requestObject = {
                                    url: process.env.SLACK_PUSH_HOOK_URL,
                                    method: 'POST',
                                    json: requestBody
                            };

                            request(requestObject, function(error, response, body) {
                                if(error) {
                                    console.log("Error while POSTing to slack: " + error);
                                }
                            });
                        }
                    })
                    .catch(function(error) {
                        console.log("Error while retrieving data from redis: " + error); 
                    });

            }
            
        });
    });
});