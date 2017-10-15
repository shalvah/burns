'use strict';


class Burns {

    constructor() {
        this.options = {};
        this.events = {};
        this.queuedListeners = {};
    }

    configure(options) {
        this.options = Object.assign(this.options, options);
        return this;
    }

    register(events) {
        this.events = events;
        return this;
    }

    event(eventName, eventData = {}) {
        this.queueListeners(eventName, eventData);
    }

    queueListeners(eventName, eventData) {
        let listeners = this.events[eventName];

        // fallback to default listener
        if (!listeners) {
            if (!(listeners = this.options.defaultListener)) {
                return;
            }
        }

        listeners = Array.isArray(listeners) ? listeners : [listeners];
        this.queuedListeners[eventName] = [];

        for (let listener of listeners) {
            let handlerClass = new listener();
            let methodName = 'on' + this.uppercaseWords(eventName);
            let handlerMethod = (typeof handlerClass[methodName] === 'function')
                ? methodName : 'handle';
            let listenerRef = setTimeout(() => {
                let continuePropagation = handlerClass[handlerMethod](eventData);
                // stop the next listeners if this one says so
                if (continuePropagation === false) {
                    this.dequeueListeners(eventName);
                }
            }, 0);
            this.queuedListeners[eventName].push(listenerRef);
        }
    }

    dequeueListeners(eventName) {
        for (let listenerRef of this.queuedListeners[eventName]) {
            clearTimeout(listenerRef);
        }
    }

    uppercaseWords(string) {
        return string.split(/[^a-zA-Z0-9]+/)
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join('');
    }

}

module.exports = new Burns();



