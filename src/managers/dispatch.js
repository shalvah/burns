'use strict';

module.exports = makeEventsDispatcher;

/**
 * Returns an event dispatcher.
 * @param configRepository An object that provides a `get` method to get the 'defaultHandler'`
 * @param eventsRepository An object that provides a `handlers` method to retrieve all handlrs registered for an event
 * @returns {{queuedHandlers: {}, dispatch: (function(*=, *=)), queueHandlers: (function(*=, *=)), dequeueHandlers: (function(*))}}
 */
function makeEventsDispatcher(configRepository, eventsRepository) {
    return {
        queuedHandlers: {},

        dispatch(eventName, payload) {
            this.queueHandlers(eventName, payload);
        },

        queueHandlers(eventName, eventData) {
            let handlers = eventsRepository.handlers(eventName);

            if (handlers.length <= 0) {
                if (!configRepository.get('defaultHandler')) return;
                handlers = [configRepository.get('defaultHandler')];
            }

            this.queuedHandlers[eventName] = [];

            for (let handlerMethod of handlers) {
                let handlerRef = setTimeout(() => {
                    let continuePropagation = handlerMethod(eventData);
                    // stop the next handlers if this one says so
                    if (continuePropagation === false) {
                        this.dequeueHandlers(eventName);
                    }
                }, 0);
                this.queuedHandlers[eventName].push(handlerRef);
            }
        },

        dequeueHandlers(eventName) {
            for (let handlerRef of this.queuedHandlers[eventName]) {
                clearTimeout(handlerRef);
            }
        },
    }
}
