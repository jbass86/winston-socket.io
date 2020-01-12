var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();
const winston = require('winston');
var encrypt = require("socket.io-encrypt");
require('../lib/winston-socketio');
var app = require("express");
var server = require("http").createServer(app);
var SocketIO = require('socket.io');
const io = SocketIO(server);


describe("standard winston socket test", function () {


    beforeEach(function (done) {

        const logger = winston.createLogger({
            level: "info",
            transports: [
                new winston.transports.Console(),
                new winston.transports.SocketIO(
                    {
                        host: "http://localhost",
                        port: 3002,
                        secure: false,
                        reconnect: true,
                        log_topic: "log"
                    }
                )
            ]
        });

        logger.log("info", "I'm logging to the socket.io server!!!");
        done();
    });

    it("recieves logs from winston through socket", function (done) {
        server.listen(3002, "localhost");
        io.on("connection", function (socket) {
            socket.on("log", function (data) {
                JSON.stringify(data).should.equal("{\"level\":\"info\",\"message\":\"I'm logging to the socket.io server!!!\"}");
                done();
            });

        });
    });

    after(async () => {
        var clients = {}
        await io.on('connection', function (socket) {
            clients[socket.id] = socket;

            socket.on('disconnect', function () {
                delete clients[socket.id];
            });
        });
        await server.close();
        await io.close();
    });


});
describe("encrypted winston socket test", function () {


    beforeEach(function (done) {
        logger = winston.createLogger({
            level: "info",
            transports: [
                new winston.transports.Console(),
                new winston.transports.SocketIO(
                    {
                        host: "http://localhost",
                        port: 3001,
                        secure: false,
                        encrypt: true,
                        secret: "secret",
                        reconnect: true,
                        log_topic: "log_encrypted"
                    }
                )
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
                // console.log(JSON.stringify(data));
                JSON.stringify(data).should.equal("{\"level\":\"info\",\"message\":\"I'm logging encrypted message to the socket.io server!!!\"}");
                done();
            });

        });

    });
    after(async () => {
        var clients = {}
        await io.on('connection', function (socket) {
            clients[socket.id] = socket;

            socket.on('disconnect', function () {
                delete clients[socket.id];
            });
        });
        await server.close();
        await io.close();
    });

});