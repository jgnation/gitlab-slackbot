'use strict';

var amqp = require('amqp'),
    amqpUrl = process.env.CLOUDAMQP_URL,
    conn = amqp.createConnection({url: amqpUrl}); // create the connection

var exchange = '';      //set on conn 'ready' callback
var queueName = '';     //set on conn 'ready' callback

conn.on('ready', function () {
    exchange = conn.exchange(''); // get the default exchange
    queueName = process.env.MESSAGE_QUEUE_NAME;

    // var queue = conn.queue(queueName, {}, function () { // create a queue
    //     queue.subscribe(function (msg) { // subscribe to that queue
    //         //console.log(msg.body); // print new messages to the console
    //     });
    // });
});

function publishMessage(data) {
    exchange.publish(queueName, {body: data});
}

module.exports.amqlurl = amqpUrl;
module.exports.publishMessage = publishMessage;

