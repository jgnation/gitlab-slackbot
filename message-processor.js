var amqp = require('amqp');
var bluebird = require('bluebird'); 
var redis = require('redis');
var url = require('url');
var request = require('request');

//setup redis
bluebird.promisifyAll(redis.RedisClient.prototype);
var redisURL = url.parse(process.env.REDIS_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

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

            var repo = message.body.repo;
            var commit_messages = message.body.commit_messages;
            var num_commits = commit_messages.length;
            var user_name = message.body.user_name;
            var branch = message.body.branch;

            client.smembersAsync(repo)
                .then(function (results) {
                    var message = user_name + " pushed " + num_commits + " commits to repo: " + repo + ", branch: " + branch;
                    for (var j = 0; j < commit_messages.length; j++) {
                        message += "\n- " + commit_messages[j];
                    }
                    
                    for (var i = 0; i < results.length; i++) {
                        var requestBody = {
                            "channel": "@" + results[i],
                            "text": message
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
        });
    });
});