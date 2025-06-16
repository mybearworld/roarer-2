type anything = string | number | {
    [key: string]: any;
} | any[];
export type CloudlinkClientOptions = {
    url: string | URL;
    log: boolean;
};
export type CloudlinkPacket = {
    cmd: string;
    name?: string | number;
    val?: any;
    id?: anything;
    rooms?: anything | anything[];
    listener?: string | number;
    code?: string;
    code_id?: number;
};
export declare class CloudlinkClient {
    private _websocket;
    motd?: string;
    ulist?: (string | {
        [key: string]: any;
    })[];
    server_ver: string;
    options: CloudlinkClientOptions;
    listeners: {
        event: string;
        callback: Function;
    }[];
    constructor(options: CloudlinkClientOptions);
    get status(): number;
    send(packet: CloudlinkPacket): void;
    emit(event: string, data?: any): void;
    on(event: string, callback: Function): void;
    messageHandle(data: CloudlinkPacket): void;
    connect(options?: CloudlinkClientOptions): void;
    disconnect(): void;
    private _setup;
}
export default CloudlinkClient;
