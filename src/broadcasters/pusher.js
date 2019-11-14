'use strict';

let Pusher = require('pusher');

module.exports = makePusherBroadcaster;

/**
 * @param {?=} config
 * @returns {import('../repositories/broadcasters').Broadcaster}
 */
function makePusherBroadcaster(config) {
    const pusher = new Pusher(config);

    return {
        /**
         * @param {{exclude?: string}} options
         */
        broadcast(channel, event, payload = null, options = {}) {
            pusher.trigger(channel, event, payload, options.exclude);
        }
    };
}
