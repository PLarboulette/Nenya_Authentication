/**
 * Created by pierre on 15/04/16.
 */

// Imports
var amqp = require('amqplib/callback_api');

// Exports
exports.start = _start;
exports.Stop = _stop;
exports.login = _login;

// Private
var rabbitMQConnection;

// Launch connection to RabbitMQ
function _start (host) {
    amqp.connect('amqp://'+host, function(err, conn) {
        rabbitMQConnection  = conn;
        console.log("INFO = [Connection to RabbitMQ established]");
        _login('users','create_user');
    });
}

// Shutdown the connection
function _stop () {
    rabbitMQConnection.close();
}

// Login
function _login (exchange, routingKey) {
    rabbitMQConnection.createChannel(function(err, ch) {
        ch.assertExchange(exchange, 'direct', {durable: false});
        ch.assertQueue('', {exclusive: true}, function(err, q) {
            ch.bindQueue(q.queue, exchange, routingKey);
            ch.consume(q.queue, function(msg) {
                var n = msg.content.toString();

                console.log( n);
                // _redirectLogin(msg.properties.replyTo, )
                ch.sendToQueue(msg.properties.replyTo,
                    new Buffer(n),
                    {correlationId: msg.properties.correlationId});
                }, {noAck: true});
            });
        });
}

function _redirectLogin (replyTo, message, corrID) {

}


