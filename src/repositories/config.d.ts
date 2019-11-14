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
    get(key: string): any;
};
export = _exports;
export type EventHandler = (arg0: any) => false | void;
export type Config = {
    defaultHandler?: (arg0: any) => false | void;
    broadcaster?: string;
    pusher?: {} | {
        appId: string;
        key: string;
        secret: string;
        cluster?: string;
    };
};
