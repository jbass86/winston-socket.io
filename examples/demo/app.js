"use strict";

const path = require("path");

const express = require("express");
const socketio = require("socket.io");

const httpServer = require("http").Server;

const { json, text, raw, urlencoded } = require("body-parser");

const expressApp = express();
const server = httpServer(expressApp);

expressApp.use(express.static(__dirname + "/dist"));

expressApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});

const ioServer = socketio(server);
console.log("Started socket.io server...");

ioServer.of("/log").on("connection", function(socket){
  console.log("got a new log connection");
  socket.on("log", function(data){
    console.log("got log data");
    console.log(data);
  });
});

server.listen(8080);
console.log("server listening on 8080");