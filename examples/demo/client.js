"use strict";

require("setimmediate");

import io from "socket.io-client";

import * as winston from "winston";
import SocketIO from "../../lib/winston-socketio"
import BrowserConsole from 'winston-transport-browserconsole';

let logger = winston.createLogger({
  level: "info",
  transports: [
    new BrowserConsole({
      format: winston.format.simple(),
      level: "info"
    }),
    new winston.transports.SocketIO(
    {
      port: window.location.port,
      reconnect: true,
      namespace: "log",
      log_topic: "log"
    })
  ]
});
  
logger.error("hello winston log");
logger.warn("yo this is a warning");