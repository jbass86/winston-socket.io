// @ts-nocheck


var app = require("express");
var server = require("http").createServer(app);
var io = require('socket.io')(server);

server.listen(3000, "localhost");

io.of("/log").on("connection", function(socket){
  console.log("got a new log connection");
  socket.on("log", function(data){
    console.log("got log data");
    console.log(data);
  });
});
