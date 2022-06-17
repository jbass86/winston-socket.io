// @ts-nocheck
/*
 * winston-socketio.js: A winston transport for emitting logs to a socket.io server
 *
 * Author: Josh Bass
 */
"use strict";
const winston = require('winston');
const Transport = require('winston-transport');
const io = require("socket.io-client");
const encrypt = require('socket.io-encrypt');

const default_format = (data) => { return data; };

//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
class SocketIO extends Transport {

  constructor(options) {

    options = options || {};
    super(options);

    this.name = 'socketio';
    this.secure = options.secure || false;

    const hostname = options.host || (typeof window === "undefined" ? "localhost" : window.location.hostname);
    this.host = this.secure ? `https://${hostname}` : `http://${hostname}`;
    this.port = options.port || (typeof window === "undefined" ? 3000 : window.location.port);

    this.reconnect = options.reconnect || false;
    this.namespace = options.namespace || null;
    this.log_topic = options.log_topic || "log";
    this.log_format = options.log_format || default_format;
    this.buffer_time = 0;
    this.max_buffer = options.max_buffer || 1000;
    this.encrypt = options.encrypt || false;
    this.secret = this.encrypt ? options.secret : null;
    this.socket_options = options.socket_options;

    this._state = "uninitialized";
    this._queue = [];
  }

  /*
  * log - log a message to the server.  If the connection isn't open yet then the messages will be buffered.
  */
  //log(level, msg, meta, callback) {
  log(options, callback) {

    const data = { ...options };

    const do_log = () => {
      if (this._state === "open") {
        this.socket.emit(this.log_topic, this.log_format(data));
        callback();
      } 
    };

    if (this._state === "uninitialized") {
      this.open(do_log);
    } else if (this._state === "open") {
      do_log();
    } else {
      this._enqueue(do_log);
    }
  }

  /*
  * open - Open the socket.io connection, buffer up log statements until they can be sent over the wire.
  */
  open(callback) {

    this.socket = io(`${this.host}:${this.port}${this.namespace ? "/" + this.namespace : ""}`, { secure: this.secure, reconnect: this.reconnect, ...this.socket_options });
    if (this.encrypt) {
      encrypt(this.secret)(this.socket);
    }

    this._state = "pending";
    this._enqueue(callback);

    this.socket.on("connect", () => {
      this._state = "open";
      this._flushQueue();
    });

    this.socket.io.on("reconnect", () => {
      this._state = "open";
      this._flushQueue();
    });

    this.socket.io.on("error", () => {
      this._state = "error";
    });

    this.socket.on("connect_timeout", () => {
      this._state = "error";
    });
  }

  /*
   * close - close socket when the transport is removed.
   */
  close() {
    if (this.socket) {
      this.socket.close();
      this.emit("closed");
    }
  }

  /*
   * enqueue - add a log messge to the queue.  remove one if max log size has been reached.
   */
  _enqueue(data) {
    this._queue.push(data);
    if (this._queue.length > this.max_buffer) {
      this._queue.splice(0, 1);
    }
  }

  /*
   * flushQueue - emit each of the log statemets to the server since we believe we
   *              are now connected.
   */
  _flushQueue() {
    if (this._state === "open" && this._queue.length > 0) {
      while (this._queue.length > 0) {
        let cb = this._queue.splice(0, 1);
        cb[0]();
      }
    }
  }
}
winston.transports.SocketIO = SocketIO;
module.exports = SocketIO;