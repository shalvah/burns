'use strict';

module.exports = makeLogBroadcaster;

function makeLogBroadcaster(config) {
    return {
        broadcast(channel, event, payload, options = {}) {
            console.log(`Broadcasting event ${event} on channel ${channel} with payload ${JSON.stringify(payload, null, 4)}`);
        }
    };
}
