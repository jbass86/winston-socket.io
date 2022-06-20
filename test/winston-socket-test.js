// @ts-nocheck

require('chai').should();
// const mocha = require('mocha');
const winston = require('winston');
const encrypt = require("socket.io-encrypt");
const app = require("express");
const server = require("http").createServer(app);
const SocketIO = require('socket.io');
const io = SocketIO(server);

require('../dist/index');

let logger;

describe("standard winston socket test", function () {

  beforeEach(function (done) {

    logger = winston.createLogger({
      level: "info",
      transports: [
        new winston.transports.Console(),
        new winston.transports.SocketIO({
          host: "localhost",
          port: 3002,
          secure: false,
          reconnect: true,
          log_topic: "log"
        })
      ]
    });

    logger.log("info", "I'm logging to the socket.io server!!!", {meta: "some additional data"});
    done();
  });

  it("recieves logs from winston through socket", (done) => {
    server.listen(3002, "localhost");
    io.on("connection", function (socket) {
      socket.on("log", function (data) {
        JSON.stringify(data).should.equal("[{\"meta\":\"some additional data\",\"level\":\"info\",\"message\":\"I'm logging to the socket.io server!!!\"}]");
        done();
      });
    });
  });

  after(async () => {
    const clients = {}
    await io.on('connection', function (socket) {
      clients[socket.id] = socket;

      socket.on('disconnect', function () {
        delete clients[socket.id];
      });
    });
    await server.close();
    await io.close();
    await logger.close();
  });
});

describe("encrypted winston socket test", function () {

  beforeEach(function (done) {
    logger = winston.createLogger({
    level: "info",
    transports: [
      new winston.transports.Console(),
      new winston.transports.SocketIO({
        host: "localhost",
        port: 3001,
        secure: false,
        encrypt: true,
        secret: "secret",
        reconnect: true,
        log_topic: "log_encrypted"
      })
    ]
    });
    logger.log("info", "I'm logging encrypted message to the socket.io server!!!");
    done();
  });

  it("recieves encrypted logs from winston and decrypts them", function (done) {
    server.listen(3001, "localhost");
    io.use(encrypt("secret"));
    io.on("connection", function (socket) {
    socket.on("log_encrypted", function (data) {
    JSON.stringify(data).should.equal("[{\"level\":\"info\",\"message\":\"I'm logging encrypted message to the socket.io server!!!\"}]");
      done();
    });

    });

  });

  after(async () => {
    const clients = {}
    await io.on('connection', function (socket) {
      clients[socket.id] = socket;

      socket.on('disconnect', function () {
        delete clients[socket.id];
      });
    });
    await server.close();
    await io.close();
    await logger.close();
  });

});