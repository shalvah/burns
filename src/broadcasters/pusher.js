'use strict';

let Pusher = require('pusher');

module.exports = makePusherBroadcaster;

function makePusherBroadcaster(config) {
    const pusher = new Pusher(config);

    return {
        broadcast(channel, event, payload, options = {}) {
            pusher.trigger(channel, event, payload, options.exclude);
        }
    };
}
