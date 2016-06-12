/**
 * Created by pierre on 15/04/16.
 */

'use strict';

// Imports
const amqp = require('amqplib/callback_api');
const uuid = require('uuid');

module.exports = class Helper {

    constructor (host) {
        amqp.connect('amqp://' + host, (err, conn) => {
            this.rabbitMQConnection = conn;
            console.log("INFO = [Connection to RabbitMQ established]");
        });
    }


    // Shutdown the connection
    stop () {
        this.rabbitMQConnection.close();
    }


    login (message, exchange, routingKey, callback) {
        this.rabbitMQConnection.createChannel( (err, ch) => {
            ch.assertQueue('', {exclusive: true}, (err, q) => {
                var corr = uuid.v4();
                ch.assertExchange(exchange, 'direct', {durable: false});
                // Publish login in queue // Waiting for MS_Users response
                console.log("[LOG] [PUBLISHED MESSAGE TO MS_USERS] ", message);

                ch.publish(exchange, routingKey, new Buffer(message.toString()), {correlationId: corr, replyTo: q.queue});
                ch.consume(q.queue,  (msg) => {
                    if (msg.properties.correlationId == corr) {
                        console.log("[LOG] [RECEIVED MESSAGE FROM MS_USERS] ", message);
                        // Return a JSON with the id of the user if it exists.
                        return callback(null, msg.content.toString());
                    }
                }, {noAck: true});
            });
        });
    }


};
