import Transport from 'winston-transport';
import { Socket } from 'socket.io-client';

export interface SocketIOOptions extends Transport.TransportStreamOptions {
    secure?: boolean;
    host?: string;
    port?: number;
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
    default_format: Function;
    name: string;
    secure: boolean;
    host: string;
    port: number;
    reconnect: boolean;
    namespace: string | null;
    log_topic: string;
    log_format: Function;
    max_queue_size: number;
    socket: typeof Socket;
    _state: string;
    _queue: Array<any>;
    _flush_task: number;
    constructor(options: SocketIOOptions);
    log(options: any, callback: Function): void;
    open(callback: Function): void;
    close(): void;
    _enqueue(data: any): void;
    _flushQueue(): void;
}
export default SocketIO;
