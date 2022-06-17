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

const default_format = (data) => {return data;};

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
		
		const hostname = options.host || (window ? window.location.hostname : "localhost");	
		this.host = this.secure ? `https://${hostname}` : `http://${hostname}`;
		this.port = options.port || (window ? window.location.port : 3000);
		
		this.reconnect = options.reconnect || false;
		this.namespace = options.namespace || null;
		this.log_topic = options.log_topic || "log";
		this.log_format = options.log_format || default_format;
		this.max_queue_size = options.max_queue_size || 1000;

		this.encrypt = options.encrypt || false;
		this.secret = this.encrypt ? options.secret : null;
		
		this._state = "uninitialized";
		this._queue = [];
	}

	/*
	* log - log a message to the server.  If the connection isn't open yet then the messages will be buffered.
	*/
	//log(level, msg, meta, callback) {
	log(options, callback) {

		const data = {...options};

		const do_log = () => {
			if (this.encrypt) {
				encrypt(this.secret)(this.socket);
				if (this._state === "open") {
					this.socket.emit(this.log_topic, this.log_format(data));
					callback();
				}
			} else {
				if (this._state === "open") {
					this.socket.emit(this.log_topic, this.log_format(data));
					callback();
				}
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

		this.socket = io(`${this.host}:${this.port}${this.namespace ? "/" + this.namespace : ""}`, {secure: this.secure, reconnect: this.reconnect});

		this._state = "pending";
		this._enqueue(callback);

		this.socket.on("connect", () => {
			this._state = "open";
			this._flushQueue();
		});

		this.socket.on("reconnect", () => {
			this._state = "open";
			this._flushQueue();
		});

		this.socket.on("connect_error", () => {
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
		if (this._queue.length > this.max_queue_size) {
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