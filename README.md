#winston-socket.io

Based on https://github.com/jbass86's winston-socket.io build.  Forked from https://github.com/jbass86/winston-socket.io

A socket.io transport for winstonjs.  Gives you the ability to log directly to a socket.io server. 

##Options

* __host__: The hostname of the socket.io server __(default: http://localhost)__.
* __port__: The port of the socket.io server __(default: 3000)__.
* __secure__: Use https for the socket.io server connection __(default: false)__.
* __reconnect__: Reconnect to socket.io server connection __(default: false)__.
* __path__: The socket.io path to use for the logs.  Added after the port like a path. __null__.
* __channel__: The channel to send the log messages on __(default: "log")__.
* __log_format__: The format in which to log the information.
* __max_queue_size__: The maximum number of messages to queue up for publishing if the client isnt connected to the server __(default: 1000)__.

##How to use it

``` js
  var winston = require('winston');
  require('winston-socket.io');

  winston.add(winston.transports.SocketIO, {
    host: "https://myhost",
    port: 8080,
    secure: true,
    reconnect: true,
    channel: "josh_logs"
  });
  
  

  winston.log("info", "I'm logging to the socket.io server!!!");
```

Can also be added to Winston as a transport in this method 

``` js

  var winston = require('winston');
  require('winston-socket.io');

  //set up logging
  var logger = new(winston.Logger)({
      level: config.logging.logLevel,
      transports: [
          new(winston.transports.Console)(),
          new(winston.transports.SocketIO)({host: "https://myhost" , port: portNumber, channel:"gms", secure: true, reconnect: true})
      ]
  });
