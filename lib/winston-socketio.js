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
    this.batch = options.batch;
    this.batch_interval = Number.isFinite(options.batch_interval) ? options.batch_interval : 1000;
    this.batch_count = Number.isFinite(options.batch_count) ? options.batch_count : 10;
    this.max_buffer = options.max_buffer || 1000;
    this.encrypt = options.encrypt || false;
    this.secret = this.encrypt ? options.secret : null;
    this.socket_options = options.socket_options;

    this._state = "uninitialized";
    this._queue = [];
    this._flush_task = null;
  }

  /*
  * log - log a message to the server.  If the connection isn't open yet then the messages will be buffered.
  */
  //log(level, msg, meta, callback) {
  log(options, callback) {

    const data = { ...options };
    this._enqueue(this.log_format(data));

    if (this._state === "uninitialized") {
      this.open();
    } else if (this._state === "open") {
      if (this.batch) {
        if (this._queue.length > this.batch_count) {
          this._flushQueue();
        } else if (!this._flush_task) {
          this._flush_task = setTimeout(() => this._flushQueue(), this.batch_interval);
        }
      } else {
        this._flushQueue();
      }
    }

    callback();
  }

  /*
  * open - Open the socket.io connection, buffer up log statements until they can be sent over the wire.
  */
  open() {

    this.socket = io(`${this.host}:${this.port}${this.namespace ? "/" + this.namespace : ""}`, { secure: this.secure, reconnect: this.reconnect, ...this.socket_options });
    if (this.encrypt) {
      encrypt(this.secret)(this.socket);
    }

    this._state = "pending";

    this.socket.on("connect", () => {
      this._state = "open";
      this._flushQueue();
    });

    this.socket.on("disconnect", () => {
      this._state = "disconnected";
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
    clearTimeout(this._flush_task);
    this._flush_task = null;
    if (this._state === "open" && this._queue.length > 0) {
      this.socket.emit(this.log_topic, this._queue);
      this._queue = [];
    }
  }
}
winston.transports.SocketIO = SocketIO;
module.exports = SocketIO;