'use strict';


class Burns {

    constructor() {
        this.options = {};
        this.events = {};
        this.listeners = {};
    }

    configure(options = {}) {
        this.options = Object.assign(this.options, options);
        return this;
    }

    unqueueListeners(eventName) {
        for (let listenerId of this.listeners[eventName]) {
            clearTimeout(listenerId);
        }
    }

    event(eventName, eventData = {}) {
        this.callListeners(eventName, eventData);
    };

    uppercaseWords(string) {
        return string.split(/[^a-zA-Z0-9]+/)
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join('');
    }

    callListeners(eventName, eventData) {
        let listeners = this.events[eventName];

        // fallback to default listener
        if (!listeners) {
            if (!(listeners = this.options.defaultListener)) {
                return;
            }
        }
        listeners = Array.isArray(listeners) ? listeners : [listeners];
        this.listeners[eventName] = [];
        // queue the first listener
        let i = 0;
        while (i < listeners.length) {
            let handlerClass = new listeners[i]();
            let methodName = 'on' + this.uppercaseWords(eventName);
            let handlerMethod = (typeof handlerClass[methodName] === 'function')
                ? methodName : 'handle';
            let listenerId = setTimeout(() => {
                let continuePropagation = handlerClass[handlerMethod](eventData);
                // stop the next listeners if this one says so
                if (continuePropagation === false) {
                    this.unqueueListeners(eventName);
                }
            }, 0);
            this.listeners[eventName].push(listenerId);
            i++;
        }
    }

    register(events) {
        this.events = events;
        return this;
    }
}

module.exports = new Burns();



