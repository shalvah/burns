'use strict';

module.exports = makeLogBroadcaster;

/**
 * @param {?=} config
 * @returns {import('../repositories/broadcasters').Broadcaster}
 */
function makeLogBroadcaster(config) {
    return {
        broadcast(channel, event, payload, options = {}) {
            console.log(`Broadcasting event ${event} on channel(s) ${channel} with payload ${JSON.stringify(payload, null, 4)}`);
        }
    };
}
