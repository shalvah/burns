export type Broadcaster = {
    broadcast: (channels: string | string[], eventName: string, eventData: any, options: {
        exclude?: string;
    }) => any;
};
/**
 * @param {string} driver
 * @param {?} config
 * @returns {Broadcaster}
 */
export declare function createBroadcaster(driver: string, config: any): {
    broadcast: (channels: string | string[], eventName: string, eventData: any, options: {
        exclude?: string;
    }) => any;
};
