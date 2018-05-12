'use strict';

const config = require('./managers/config');

class Burns {

    constructor() {
        this.events = {};
        this.queuedHandlers = {};
    }

    configure({ defaultHandler, broadcaster, pusher } = {}) {
        config.set({ defaultHandler, broadcaster, pusher });
        return this;
    }

    registerEvents(events) {
        Object.entries(events).forEach(([eventName, eventConfig]) => {
            if (Array.isArray(eventConfig)) {
                // we're dealing with a list of handlers
                this.addEventHandlers(eventName, ...eventConfig);
            } else if (typeof eventConfig === 'function') {
                //a single event handler
                this.addEventHandlers(eventName, eventConfig);
            } else {
                // configuration options for the event
                this.updateEventConfig(eventName, eventConfig);
            }
        });
        return this;
    }

    addEventHandlers(eventName, ...handlers) {
        if (this.events[eventName] && this.events[eventName].handlers) {
            handlers = [...this.events[eventName].handlers, ...handlers];
        }
        this.updateEventConfig(eventName, { handlers });
    }

    updateEventConfig(eventName, config) {
        this.events[eventName] = config;
    }

    dispatch(eventName, eventData = {}) {
        this.queueHandlers(eventName, eventData);
    }

    queueHandlers(eventName, eventData) {
        let eventConfig = this.events[eventName];

        let handlers;
        if (eventConfig && eventConfig.handlers && eventConfig.handlers.length > 0) {
            handlers = eventConfig.handlers;
        } else {
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



