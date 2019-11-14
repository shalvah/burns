'use strict';

let Pusher = require('pusher');

module.exports = makePusherBroadcaster;

/**
 * @param {Pusher.Options} config
 * @returns {import('../repositories/broadcasters').Broadcaster}
 */
function makePusherBroadcaster(config) {
    const pusher = new Pusher(config);

    return {
        broadcast(channel, event, payload = null, options = {}) {
            pusher.trigger(channel, event, payload, options.exclude);
        }
    };
}
