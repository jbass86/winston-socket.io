#winston-socketio

A socket.io transport for winstonjs.  Gives you the ability to log directly to a socket.io server.

##Options

* __host__: The hostname of the socket.io server (default: http://localhost).
* __port__: The port of the socket.io server (default: 3000).
* __namespace__: The socket.io namespace to use for the logs (default: "log").
* __log_topic__: The topic to send the log messages on (default: "log").
* __log_format__: The format in which to log the information.
* __max_queue_size__: The maximum number of messages to queue up for publishing if the client isnt connected to the server (default: 1000).
