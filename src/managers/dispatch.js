'use strict';

module.exports = makeEventsDispatcher;

/**
 * @param {typeof import("../repositories/config")} configRepository
 * @param {typeof import("../repositories/events")} eventsRepository
 */
function makeEventsDispatcher(configRepository, eventsRepository) {
    return {
        queuedHandlers: {},

        /**
         * Dispatch an event.
         *
         * @param {string} eventName
         * @param {?} payload
         */
        dispatch(eventName, payload = null) {
            this.queueHandlers(eventName, payload);
        },

        /**
         * Queue handlers to be called.
         * @param {string} eventName
         * @param {?} eventData
         */
        queueHandlers(eventName, eventData = null) {
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

        /**
         * Cancel queued handlers so they are no longer called.
         * @param {string} eventName
         */
        dequeueHandlers(eventName) {
            for (let handlerRef of this.queuedHandlers[eventName]) {
                clearTimeout(handlerRef);
            }
        },
    }
}
