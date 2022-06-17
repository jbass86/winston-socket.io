// @ts-nocheck

var winston = require("winston");
require("../lib/winston-socketio");

let logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new winston.transports.SocketIO(
      {
        host: "localhost",
        secure: false,
        reconnect: true,
        namespace: "log",
        log_topic: "log"
      }
    )
  ]
});

logger.log("info", "Yo Lets log to socket.io", {someBool: true});
logger.log("info", {message: "jsut a meta message", meta: "more info"});
logger.log("error", "Hey I logged an error");

logger.level = "debug";
logger.log("debug", "Some more logging....");
