'use strict';

module.exports = makeEventsDispatcher;

/**
 * Returns an event dispatcher.
 * @param configRepository An object that provides a `get` method for getting config values with dot notation'`
 * @param eventsRepository
 * @returns {{queuedHandlers: {}, dispatch: (function(*=, *=)), queueHandlers: (function(*=, *=)), dequeueHandlers: (function(*))}}
 */
function makeEventsDispatcher(configRepository, eventsRepository) {
    return {
        broadcast(event, payload, options) {
            const broadcastChannel = eventsRepository.broadcastConfig(event).broadcastOn;
            if (!broadcastChannel) {
                return;
            }

            const broadcastDriver = configRepository.get('broadcaster');
            if (broadcastDriver === null) {
                return;
            }

            const broadcastingConfig = configRepository.get(broadcastDriver);
            let broadcaster = require(`../broadcasters/${broadcastDriver}`)(broadcastingConfig);
            broadcaster.broadcast(broadcastChannel, event, payload, options);
        }
    }
};
