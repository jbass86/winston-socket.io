#winston-socket.io

![Build Status](https://travis-ci.org/jbass86/winston-socket.io.svg?branch=master) [![Dependency Status](https://david-dm.org/jbass86/winston-socket.io.svg)](https://david-dm.org/jbass86/winston-socket.io)


A socket.io transport for winstonjs.  Gives you the ability to log directly to a socket.io server. 

##Options

* __host__: The hostname of the socket.io server __(default: http://localhost)__.
* __port__: The port of the socket.io server __(default: 3000)__.
* __secure__: Use https for the socket.io server connection __(default: false)__.
* __reconnect__: Reconnect to socket.io server connection __(default: false)__.
* __namespace__: The socket.io namespace to use for the logs __(default: "log")__.
* __log_topic__: The topic to send the log messages on __(default: "log")__.
* __encrypt__: Choose to encrypt winston socket logs or not __(default: false)__
* __secret__: the passphrase to encrypt logs with [needs __encrypt__ to be __true__ to allow changing it ] __(default: null)__ 
* __log_format__: The format in which to log the information.
* __max_queue_size__: The maximum number of messages to queue up for publishing if the client isnt connected to the server __(default: 1000)__.

##How to use it

``` js
  const winston = require('winston');
  require('winston-socket.io');

  let logger = winston.createLogger({
    level: "info",
    transports: [
      new winston.transports.Console(),
      new winston.transports.SocketIO(
        {
          host: "http://myhost",
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
```

Can also be added to Winston as a transport in this method 

``` js

  const winston = require('winston');
  require('winston-socket.io');

  winston.add(new winston.transports.SocketIO({
    host: "http://myhost",
    port: 8080
    secure: true,
    reconnect: true,
    namespace: "log",
    log_topic: "log"
  }));
