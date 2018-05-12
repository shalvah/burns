'use strict';

module.exports = makeEventsDispatcher;

/**
 * Returns an event dispatcher.
 * @param configManager An object that provides a `get` method to get the 'defaultHandler'`
 * @param eventsManager An object that provides a `handlers` method to retrieve all handlrs registered for an event
 * @returns {{queuedHandlers: {}, dispatch: (function(*=, *=)), queueHandlers: (function(*=, *=)), dequeueHandlers: (function(*))}}
 */
function makeEventsDispatcher(configManager, eventsManager) {
    return {
        queuedHandlers: {},

        dispatch(eventName, payload) {
            this.queueHandlers(eventName, payload);
        },

        queueHandlers(eventName, eventData) {
            let handlers = eventsManager.handlers(eventName);

            if (handlers.length <= 0) {
                if (!configManager.get('defaultHandler')) return;
                handlers = [configManager.get('defaultHandler')];
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
};
