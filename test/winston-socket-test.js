// @ts-nocheck

require('chai').should();
const winston = require('winston');
const app = require("express");
const server = require("http").createServer(app);
const SocketIO = require("../dist/index");
const ioServer = require("socket.io").Server;
const io = new ioServer(server);

require('../dist/index');

let logger;

describe("standard winston socket test", function () {

  beforeEach(function (done) {

    logger = winston.createLogger({
      level: "info",
      transports: [
        new winston.transports.Console(),
        new SocketIO({
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