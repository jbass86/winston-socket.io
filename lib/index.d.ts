
import { Socket } from 'socket.io-client';
import Transport, { TransportStreamOptions } from "winston-transport";

export interface SocketIOOptions extends TransportStreamOptions {
    secure?: boolean;
    host?: string;
    port?: number;
    url?: string;
    socket_options?: any;
    reconnect?: boolean;
    namespace?: string;
    log_topic?: string;
    log_format?: any;
    max_buffer?: number;
    batch?: boolean;
    batch_interval?: number;
    batch_count?: number;
}

export declare class SocketIO extends Transport {
    default_format: any;
    name: string;
    secure: boolean;
    host: string;
    port: number;
    reconnect: boolean;
    namespace: string | null;
    log_topic: string;
    max_buffer?: number;
    batch?: boolean;
    batch_interval?: number;
    batch_count?: number;
    socket: typeof Socket;
    log_format: any;
    _state: string;
    _queue: Array<any>;
    _flush_task: number;
    constructor(options: SocketIOOptions);
    log(options: any, callback: any): void;
    open(callback: any): void;
    close(): void;
    _enqueue(data: any): void;
    _flushQueue(): void;
}

export default SocketIO;
