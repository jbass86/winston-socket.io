let vows = require('vows');
let assert = require('assert');
let winston = require('winston');
let SocketIO = require('../lib/winston-socketio');


require("../lib/winston-socketio");

vows.describe("winston-socketio").addBatch({

        "Create Instance of the transport": {
            topic: function() {
                return SocketIO;
            },

            "is this an instance of the transport": function(topic) {
                let transport = new topic({});
                assert.instanceOf(transport, SocketIO);
            },

            "can you set hostname option": function(topic) {
                let transport = new topic({ host: "http://test" });
                assert.deepEqual(transport.host, "http://test");
            },

            "can you set port option": function(topic) {
                let transport = new topic({ port: 8085 });
                assert.deepEqual(transport.port, 8085);
            },

            "can you set secure": function(topic) {
                let transport = new topic({ secure: true });
                assert.deepEqual(transport.secure, true);
            },

            "can you set reconnect": function(topic) {
                let transport = new topic({ reconnect: true });
                assert.deepEqual(transport.reconnect, true);
            },

            "can you set namespace option": function(topic) {
                let transport = new topic({ namespace: "josh_nsp" });
                assert.deepEqual(transport.namespace, "josh_nsp");
            },

            "can you set logformat option": function(topic) {
                let format = function(level, msg, meta) {
                    return { level: level, msg: msg, meta: meta };
                };

                let transport = new topic({ log_format: format });
                assert.deepEqual(transport.log_format, format);
            },

            "can you set log topic option": function(topic) {
                let transport = new topic({ log_topic: "josh_topic" });
                assert.deepEqual(transport.log_topic, "josh_topic");
            },

            "can you set max queue size option": function(topic) {
                let transport = new topic({ max_queue_size: 550 });
                assert.deepEqual(transport.max_queue_size, 550);
            },

            "can you set encryption bool and secret": function (topic) {
                let transport = new topic({ encrypt: true, secret: "hello" });
                assert.deepEqual(transport.encrypt, true);
                assert.deepEqual(transport.secret, "hello");
            },
        }
    })
    .addBatch({

        "Create Winston and add SocketIO transport": {
            topic: function() {
                return SocketIO;
            },

            "Can we add the winston transport without any errors": function(topic) {
                assert.doesNotThrow(function() {
                    let logger = winston.createLogger({});
                    logger.add(new topic({host : "http://somehost", port : 8085}));
                }, Error);
            },
            "Can we add the winston transport and then remove it without any errors": function(topic) {
                assert.doesNotThrow(function() {
	                let logger = winston.createLogger({});
	                logger.add(new topic({host : "http://somehost", port : 8085}));
                    logger.remove(logger.transports.socketio);
                }, Error);
            },
            "Can we add the winston transport and log to it without any errors": function(topic) {
                assert.doesNotThrow(function() {
	                let logger = winston.createLogger({});
	                logger.add(new topic({host : "http://somehost", port : 8085}));
                    logger.log("info", "test log");
                    logger.remove(logger.transports.socketio);
                }, Error);
            },
            "Can we add the winston transport, encrypt it and log to it without any errors": function (topic) {
                assert.doesNotThrow(function () {
                    let logger = winston.createLogger({});
                    logger.add(new topic({ host: "http://somehost", port: 8085 , encrypt: true , secret: "secret"}));
                    logger.log("info", "test log");
                    logger.remove(logger.transports.socketio);
                }, Error);
            }
            // TODO : Add tests that actually validate what was logged over socket.io
        }
    }).export(module);