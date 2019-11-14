export = makePusherBroadcaster;
/**
 * @param {Pusher.Options} config
 * @returns {import('../repositories/broadcasters').Broadcaster}
 */
declare function makePusherBroadcaster(config: import("pusher").Options): {
    broadcast: (channels: string | string[], eventName: string, eventData: any, options: {
        exclude?: string;
    }) => any;
};
