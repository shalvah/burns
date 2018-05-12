'use strict';

module.exports = {

    events: {},

    handlers (event) {
        let eventConfig = this.events[event];
        if (eventConfig && Array.isArray(eventConfig.handlers)) {
            return eventConfig.handlers;
        }

        return [];
    },

    addEvents(events) {
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
    },

    addEventHandlers(eventName, ...handlers) {
        if (this.events[eventName] && this.events[eventName].handlers) {
            handlers = [...this.events[eventName].handlers, ...handlers];
        }
        this.updateEventConfig(eventName, { handlers });
    },

    updateEventConfig(eventName, config) {
        this.events[eventName] = config;
    },
};
