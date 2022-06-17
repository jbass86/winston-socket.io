// @ts-nocheck

const mocha = require('mocha');
const assert = require('assert');
const winston = require('winston');
const SocketIO = require('../lib/winston-socketio');


describe("Basic Tests", () => {

  it("Is this an instance of the transport", () => {
    const transport = new SocketIO({ host: "test" });
    assert.deepEqual(transport.host, "http://test");
  });

  it("Can you set hostname option", () => {
    const transport = new SocketIO({ host: "test" });
    assert.deepEqual(transport.host, "http://test");
  });

  it("Can you set port option", () => {
    const transport = new SocketIO({ port: 8085 });
    assert.deepEqual(transport.port, 8085);
  });

  it("Can you set secure", () => {
    const transport = new SocketIO({ secure: true });
    assert.deepEqual(transport.secure, true);
  });

  it("Can you set reconnect", () => {
    const transport = new SocketIO({ reconnect: true });
    assert.deepEqual(transport.reconnect, true);
  });

  it("Can you set namespace option", () => {
    const transport = new SocketIO({ namespace: "josh_nsp" });
    assert.deepEqual(transport.namespace, "josh_nsp");
  });

  it("Can you set logformat option", () => {
    const format = function(level, msg, meta) {
      return { level: level, msg: msg, meta: meta };
    };

    const transport = new SocketIO({ log_format: format });
    assert.deepEqual(transport.log_format, format);
  });

  it("Can you set log topic option", () => {
    const transport = new SocketIO({ log_topic: "josh_topic" });
    assert.deepEqual(transport.log_topic, "josh_topic");
  });

  it("can you set max queue size option", () => {
    const transport = new SocketIO({ max_queue_size: 550 });
    assert.deepEqual(transport.max_queue_size, 550);
  });

  it("can you set encryption bool and secret", () => {
    const transport = new SocketIO({ encrypt: true, secret: "hello" });
    assert.deepEqual(transport.encrypt, true);
    assert.deepEqual(transport.secret, "hello");
  });
});

describe("Winston Integration Tests", () => {

  it("Can we add the winston transport without any errors", () => {
    assert.doesNotThrow(function() {
      const logger = winston.createLogger({});
      logger.add(new SocketIO({host : "somehost", port : 8085}));
      logger.close();
    }, Error);
  });

  it("Can we add the winston transport and then remove it without any errors", () => {
    assert.doesNotThrow(function() {
      const logger = winston.createLogger({});
      logger.add(new SocketIO({host : "somehost", port : 8085}));
        logger.remove(logger.transports.socketio);
        logger.close();
    }, Error);
  });

  it("Can we add the winston transport and log to it without any errors", () => {
    assert.doesNotThrow(function() {
      const logger = winston.createLogger({});
      logger.add(new SocketIO({host : "somehost", port : 8085}));
        logger.log("info", "test log");
        logger.remove(logger.transports.socketio);
        logger.close();
    }, Error);
  });
 
  it("Can we add the winston transport, encrypt it and log to it without any errors", () => {
    assert.doesNotThrow(function () {
      const logger = winston.createLogger({});
      logger.add(new SocketIO({host: "somehost", port: 8085 , encrypt: true , secret: "secret"}));
      logger.log("info", "test log");
      logger.remove(logger.transports.socketio);
      logger.close();
    }, Error);
  });
});
