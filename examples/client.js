
var winston = require("winston");
require("../lib/winston-socketio");

winston.add(winston.transports.SocketIO, {
  host: "http://localhost",
  port: 3000,
  reconnect: true,
  namespace: "log",
  log_topic: "log"
});

winston.log("info", "Yo Lets log to socket.io");
winston.log("error", "Hey I logged an error");

winston.level = "debug";

winston.log("debug", "Some more logging....");
