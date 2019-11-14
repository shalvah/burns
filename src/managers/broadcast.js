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
         * @param {Object<string, ?>} options
         * @param {string=} options.exclude
         */
        async broadcast(event, payload = null, options = {}) {
            let { broadcastOn, broadcastIf } = eventsRepository.broadcastConfig(event);

            if (!broadcastOn) {
                // No channels specified
                return;
            }

            const shouldBroadcast = typeof broadcastIf === "function"
                ? await broadcastIf(payload) : broadcastIf;
            if (shouldBroadcast === false) {
                return;
            }

            const broadcastDriver = configRepository.get('broadcaster');
            if (broadcastDriver === null) {
                return;
            }

            const driverConfig = configRepository.get(broadcastDriver);
            let broadcaster = broadcastersRepository.createBroadcaster(broadcastDriver, driverConfig);
            if (typeof broadcastOn === 'function') {
                broadcastOn = broadcastOn(payload);
            }
            broadcaster.broadcast(broadcastOn, event, payload, options);
        }
    }
}
