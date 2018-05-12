'use strict';

const config = require('./managers/config');
const eventsManager = require('./managers/events');

class Burns {

    constructor() {
        this.queuedHandlers = {};
    }

    configure({ defaultHandler, broadcaster, pusher } = {}) {
        config.set({ defaultHandler, broadcaster, pusher });
        return this;
    }

    registerEvents(events) {
        eventsManager.addEvents(events);
        return this;
    }

    dispatch(eventName, eventData = {}) {
        this.queueHandlers(eventName, eventData);
    }

    queueHandlers(eventName, eventData) {
        let handlers = eventsManager.handlers(eventName);

        if (handlers.length <= 0) {
            if (!config.get('defaultHandler')) return;
            handlers = [config.get('defaultHandler')];
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
    }

    dequeueHandlers(eventName) {
        for (let handlerRef of this.queuedHandlers[eventName]) {
            clearTimeout(handlerRef);
        }
    }

}

module.exports = new Burns();



