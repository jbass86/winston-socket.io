
#winston-socketio

A socket.io transport for winstonjs.  Gives you the ability to log directly to a socket.io server.

##Options

* host: The hostname of the socket.io server (default: http://localhost).
* port: The port of the socket.io server (default: 3000).
* namespace: The socket.io namespace to use for the logs (default: "log").
* log_topic: The topic to send the log messages on (default: "log").
* log_format: The format in which to log the information.
* max_queue_size: The maximum number of messages to queue up for publishing if the client isnt connected to the server (default: 1000).
