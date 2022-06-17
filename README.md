# winston-socket.io

![Build Status](https://travis-ci.org/jbass86/winston-socket.io.svg?branch=master)

A socket.io transport for winstonjs.  Gives you the ability to log directly to a socket.io server.

See the examples folder for more usage details.

## Options

* __host__: The hostname of the socket.io server __(default: localhost)__.
* __port__: The port of the socket.io server __(default: 3000)__.
* __secure__: Use https for the socket.io server connection __(default: false)__.
* __reconnect__: Reconnect to socket.io server connection __(default: false)__.
* __namespace__: The socket.io namespace to use for the logs __(default: "log")__.
* __log_topic__: The topic to send the log messages on __(default: "log")__.
* __encrypt__: Choose to encrypt winston socket logs or not __(default: false)__
* __secret__: the passphrase to encrypt logs with [needs __encrypt__ to be __true__ to allow changing it ] __(default: null)__
* __log_format__: The format in which to log the information.
* __batch__: whether or not to batch log messages and send them out in groups instead of immediately when logging __(default: false)__
* __batch_interval__: amount of time in ms to wait after logging to flush log queue and send over the socket __(default: 1000)__
* __batch_count__: maximum number of log messages to queue before sending over the socket __(default: 10)__
* __max_buffer__: The maximum number of messages to queue up for publishing if the client isnt connected to the server or if batching __(default: 1000)__.

## How to use it

``` js
  const winston = require('winston');
  require('winston-socket.io');

  let logger = winston.createLogger({
    level: "info",
    transports: [
      new winston.transports.Console(),
      new winston.transports.SocketIO(
        {
          host: "myhost",
          port: 8080
          secure: true,
          reconnect: true,
          namespace: "log",
          log_topic: "log"
        }
      )
    ]
  });  

  logger.log("info", "I'm logging to the socket.io server!!!");
  logger.log("info", "I'm logging something else", {meta: "some additional info"});
```

Can also be added to Winston as a transport in this method

``` js

  const winston = require('winston');
  require('winston-socket.io');

  winston.add(new winston.transports.SocketIO({
    host: "myhost",
    port: 8080
    secure: true,
    reconnect: true,
    namespace: "log",
    log_topic: "log"
  }));
```

## Browser Demo

In the example folder is a demo of winston being used on the client side with both the browser console extension and
winston socket.io logging back to the webserver.

If you want to try it out (Assuming you have nodejs installed):

``` bash
  git clone https://github/jbass86/winston-socket.io
  cd winston-socket.io
  npm install
  npx gulp build-demo
  node examples/demo/app.js
```

Then open your browser up and navigate to "localhost:8080"
