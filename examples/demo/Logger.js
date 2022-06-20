"use strict";

require("setimmediate");

import * as winston from "winston";
import SocketIO from "../../lib/index"
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
      batch: true,
      batch_interval: 1000,
      batch_count: 25
    })
  ]
});

export default log;