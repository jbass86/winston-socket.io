/*
 * A winston transport for emitting logs to a socket.io server
 *
 * Author: Josh Bass
 */
import { default as io, Socket } from "socket.io-client";
import Transport, { TransportStreamOptions } from "winston-transport";
import encrypt from "socket.io-encrypt";

const default_format = (data: any) => { return data; };

interface Options extends TransportStreamOptions{
  name: string;
  secure: boolean;
  host: string;
  port: number;
  reconnect: boolean;
  namespace: string;
  log_topic: string;
  log_format: any;
  encrypt: boolean;
  max_buffer: number;
  batch: boolean;
  batch_count: number;
  batch_interval: number;
  secret: string;
  socket_options: any;
}

interface LogData {
  level: string;
  message: string;
  meta: any;
}

//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
class SocketIO extends Transport {

  name: string;
  secure: boolean;
  host: string;
  port: number;
  reconnect: boolean;
  namespace: string | null;
  logTopic: string;
  logFormat: any;
  batch: boolean;
  batchInterval: number;
  batchCount: number;
  maxBuffer: number;
  encrypt: boolean;
  secret: string | null;
  socketOptions: any;
  socketState: string;
  queue: Array<any>;
  flushTask: NodeJS.Timeout | null;
  socket: Socket;

  constructor(options: Options) {

    super(options);

    this.name = 'socketio';
    this.secure = options.secure || false;

    const hostname: string = options.host || (typeof window === "undefined" ? "localhost" : window.location.hostname);
    this.host = this.secure ? `https://${hostname}` : `http://${hostname}`;
    this.port = options.port || (typeof window === "undefined" ? 3000 : parseInt(window.location.port));

    this.reconnect = options.reconnect || false;
    this.namespace = options.namespace || null;
    this.logTopic = options.log_topic || "log";
    this.logFormat = options.log_format || default_format;
    this.batch = options.batch;
    this.batchInterval = Number.isFinite(options.batch_interval) ? options.batch_interval : 1000;
    this.batchCount = Number.isFinite(options.batch_count) ? options.batch_count : 10;
    this.maxBuffer = options.max_buffer || 1000;
    this.encrypt = options.encrypt || false;
    this.secret = this.encrypt ? options.secret : null;
    this.socketOptions = options.socket_options;

    this.socketState = "uninitialized";
    this.queue = [];
    this.flushTask = null;
  }

  /*
  * log - log a message to the server.  If the connection isn't open yet then the messages will be buffered.
  */
  public log(data: LogData, callback: () => void) : void {

    this.enqueue(this.logFormat({...data}));

    if (this.socketState === "uninitialized") {
      this.open();
    } else if (this.socketState === "open") {
      if (this.batch) {
        if (this.queue.length > this.batchCount) {
          this.flushQueue();
        } else if (!this.flushTask) {
          this.flushTask = setTimeout(() => this.flushQueue(), this.batchInterval);
        }
      } else {
        this.flushQueue();
      }
    }

    callback();
  }

  /*
  * open - Open the socket.io connection, buffer up log statements until they can be sent over the wire.
  */
  public open() : void {

    this.socket = io(`${this.host}:${this.port}${this.namespace ? "/" + this.namespace : ""}`, { secure: this.secure, reconnect: this.reconnect, ...this.socketOptions });
    if (this.encrypt) {
      encrypt(this.secret)(this.socket);
    }

    this.socketState = "pending";

    this.socket.on("connect", () => {
      this.socketState = "open";
      this.flushQueue();
    });

    this.socket.on("disconnect", () => {
      this.socketState = "disconnected";
    });

    this.socket.io.on("reconnect", () => {
      this.socketState = "open";
      this.flushQueue();
    });

    this.socket.io.on("error", () => {
      this.socketState = "error";
    });

    this.socket.on("connect_timeout", () => {
      this.socketState = "error";
    });
  }

  /*
   * close - close socket when the transport is removed.
   */
  public close() : void {
    if (this.socket) {
      this.socket.close();
      this.emit("closed");
    }
  }

  /*
   * enqueue - add a log messge to the queue.  remove one if max log size has been reached.
   */
  private enqueue(data: LogData) : void {
    this.queue.push(data);
    if (this.queue.length > this.maxBuffer) {
      this.queue.splice(0, 1);
    }
  }

  /*
   * flushQueue - emit each of the log statemets to the server since we believe we
   *              are now connected.
   */
  private flushQueue() : void {
    if (this.flushTask !== null) {
      clearTimeout(this.flushTask);
    }
    this.flushTask = null;
    if (this.socketState === "open" && this.queue.length > 0) {
      this.socket.emit(this.logTopic, this.queue);
      this.queue = [];
    }
  }
}

module.exports = SocketIO;