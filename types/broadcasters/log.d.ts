export = makeLogBroadcaster;
/**
 * @param {?=} config
 * @returns {import('../repositories/broadcasters').Broadcaster}
 */
declare function makeLogBroadcaster(config?: any): {
    broadcast: (channels: string | string[], eventName: string, eventData: any, options: {
        exclude?: string;
    }) => any;
};
