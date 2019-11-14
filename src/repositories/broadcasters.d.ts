declare const _exports: {
    /**
     * @param {string} driver
     * @param {?} config
     * @returns {Broadcaster}
     */
    get(driver: string, config: any): {
        broadcast: (arg0: string, arg1: string, arg2: any, arg3: any) => any;
    };
};
export = _exports;
export type Broadcaster = {
    broadcast: (arg0: string, arg1: string, arg2: any, arg3: any) => any;
};
