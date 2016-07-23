
var winston = require("winston");


require("../lib/winston-socketio");

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


winston.add(winston.transports.SocketIO);

setTimeout(function(){
  winston.log("info", "Yo Lets log to socket.io");
  winston.log("error", "Hey I logged an error");
}, 1000);
