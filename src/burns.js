'use strict';

class Burns {

    constructor() {
        this.options = {};
        this.events = {};
        this.queuedHandlers = {};
    }

    configure(options) {
        this.options = Object.assign(this.options, options);
        return this;
    }

    registerEvents(events) {
        Object.entries(events).forEach(([eventName, eventConfig]) => {
            let handlers = Array.isArray(eventConfig) ? eventConfig : [eventConfig];
            if (this.events[eventName]) {
                this.events[eventName] = [...this.events[eventName], ...handlers];
            } else {
                this.events[eventName] = handlers;
            }
        });
        return this;
    }

    dispatch(eventName, eventData = {}) {
        this.queueHandlers(eventName, eventData);
    }

    queueHandlers(eventName, eventData) {
        let handlers = this.events[eventName];

        // fallback to default handler
        if (!handlers || handlers.length === 0) {
            if (!(handlers = this.options.defaultHandler)) {
                return;
            }
        }

        handlers = Array.isArray(handlers) ? handlers : [handlers];
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



