'use strict';

var amqp = require('amqp'),
    amqpUrl = process.env.CLOUDAMQP_URL,
    conn = amqp.createConnection({url: amqpUrl}); // create the connection

//set these variables on 'ready' callback
var exchange = '';      
var queueName = '';     

conn.on('ready', function () {
    exchange = conn.exchange(''); // get the default exchange
    queueName = process.env.MESSAGE_QUEUE_NAME;

});

function publishMessage(data) {
    exchange.publish(queueName, {body: data});
}

module.exports.publishMessage = publishMessage;