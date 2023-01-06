// @ts-nocheck

const mocha = require('mocha');
const assert = require('assert');
const winston = require('winston');
const SocketIO = require('../dist/index');


describe("Basic Tests", () => {

  it("Can you set url option", () => {
    const transport = new SocketIO({ url: "http://test:8080/josh", host: "test" });
    assert.ok(transport.url === "http://test:8080/josh");
  });

  it("Can you set hostname option", () => {
    const transport = new SocketIO({ host: "test" });
    assert.ok(transport.url.includes("http://test"));
  });

  it("Can you set port option", () => {
    const transport = new SocketIO({ host: "test", port: 8085 });
    assert.ok(transport.url.includes("8085"));
  });

  it("Can you set secure", () => {
    const transport = new SocketIO({ secure: true });
    assert.deepEqual(transport.secure, true);
  });

  it("Can you set namespace option", () => {
    const transport = new SocketIO({ namespace: "josh_nsp" });
    assert.ok(transport.url.includes("josh_nsp"));
  });

  it("Can you set logformat option", () => {
    const format = function(level, msg, meta) {
      return { level: level, msg: msg, meta: meta };
    };

    const transport = new SocketIO({ log_format: format });
    assert.deepEqual(transport.logFormat, format);
  });

  it("Can you set log topic option", () => {
    const transport = new SocketIO({ log_topic: "josh_topic" });
    assert.deepEqual(transport.logTopic, "josh_topic");
  });

  it("can you set max queue size option", () => {
    const transport = new SocketIO({ max_buffer: 550 });
    assert.deepEqual(transport.maxBuffer, 550);
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
 
});
