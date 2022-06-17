"use strict";

require("setimmediate");

import * as winston from "winston";
import SocketIO from "../../lib/winston-socketio"
import BrowserConsole from 'winston-transport-browserconsole';

const log = winston.createLogger({
  level: "info",
  transports: [
    new BrowserConsole({
      format: winston.format.simple(),
      level: "info"
    }),
    new SocketIO(
    {
      reconnect: true,
      namespace: "log",
    })
  ]
});

export default log;