'use strict';

module.exports = makeBroadcastManager;

/**
 * Returns a broadcast manager
 *
 * @param configRepository An object that provides a `get` method for getting config values with dot notation'`
 * @param eventsRepository
 * @param broadcastersRepository
 * @returns {{broadcast: (function(*=, *=, *=))}}
 */
function makeBroadcastManager(configRepository, eventsRepository, broadcastersRepository) {
    return {
        broadcast(event, payload, options = {}) {
            let broadcastChannel = eventsRepository.broadcastConfig(event).broadcastOn;
            if (!broadcastChannel) {
                return;
            }

            const broadcastDriver = configRepository.get('broadcaster');
            if (broadcastDriver === null) {
                return;
            }

            const broadcastingConfig = configRepository.get(broadcastDriver);
            let broadcaster = broadcastersRepository.get(broadcastDriver, broadcastingConfig);
            if (typeof broadcastChannel === 'function') {
                broadcastChannel = broadcastChannel(payload);
            }
            broadcaster.broadcast(broadcastChannel, event, payload, options);
        }
    }
}
