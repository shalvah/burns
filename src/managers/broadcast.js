'use strict';

module.exports = makeBroadcastManager;

/**
 * @param {typeof import("../repositories/config")} configRepository
 * @param {typeof import("../repositories/events")} eventsRepository
 * @param {typeof import("../repositories/broadcasters")} broadcastersRepository
 */
function makeBroadcastManager(configRepository, eventsRepository, broadcastersRepository) {
    return {
        /**
         * Broadcast an event.
         *
         * @param {string} event
         * @param {?} payload
         * @param {?} options
         */
        broadcast(event, payload = null, options = {}) {
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
