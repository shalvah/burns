export = makePusherBroadcaster;
/**
 * @param {?=} config
 * @returns {import('../repositories/broadcasters').Broadcaster}
 */
declare function makePusherBroadcaster(config?: any): {
    broadcast: (arg0: string, arg1: string, arg2: any, arg3: any) => any;
};
