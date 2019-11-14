declare const _exports: {
    /**
     * @type {Config}
     */
    options: Config;
    /**
     *
     * @param {Config} options
     */
    set(options: Config): void;
    /**
     *
     * @param {string} key
     * @returns {null|Config|?}
     */
    createBroadcaster(key: string): any;
};
export = _exports;
export type EventHandler = (payload: any) => false | void;
export type Config = {
    defaultHandler?: (payload: any) => false | void;
    broadcaster?: string;
    pusher?: {} | import("pusher").ClusterOptions | import("pusher").HostOptions;
};
