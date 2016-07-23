
var winston = require("winston");
require("../lib/winston-socketio");

winston.add(winston.transports.SocketIO);

winston.log("info", "Yo Lets log to socket.io");
winston.log("error", "Hey I logged an error");

winston.level = "debug";

winston.log("debug", "Some more logging....");
