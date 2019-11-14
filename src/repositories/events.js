'use strict';

/**
 * @typedef {(payload: ?) => false|void} EventHandler
 */
/**
 *
 * @typedef {{broadcastOn?: string|((payload: ?) => string|null), broadcastWhen?: boolean|((payload: ?) => boolean)|null}} BroadcastConfig
 * @typedef {{handlers: EventHandler[]} & BroadcastConfig} EventConfig
 */

module.exports = {

    /**
     * @property {Object<string,EventConfig>}
     */
    events: {},

    /**
     * Get the handlers registered for an event.
     * @param {string} event
     * @returns {EventHandler[]}
     */
    handlers(event) {
        let eventConfig = this.events[event];
        if (eventConfig && Array.isArray(eventConfig.handlers)) {
            return eventConfig.handlers;
        }
        return [];
    },

    /**
     * Get the broadcasting configuration specified fr an event.
     *
     * @param {string} event
     * @returns {BroadcastConfig}
     */
    broadcastConfig(event) {
        let defaultConfig = { broadcastOn: null, broadcastWhen: null};
        let eventConfig = this.events[event];
        if (eventConfig) {
            const {broadcastOn, broadcastWhen} = eventConfig;
            return {
                broadcastOn: broadcastOn === undefined ? null : broadcastOn,
                broadcastWhen: broadcastWhen === undefined ? null : broadcastWhen,
            };
        }
        return defaultConfig;
    },

    /**
     * @param {Object<string, EventHandler|EventHandler[]|EventConfig>} events
     */
    add(events) {
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

    /**
     * @param {string} eventName
     * @param {EventHandler[]} handlers
     */
    addEventHandlers(eventName, ...handlers) {
        if (this.events[eventName] && this.events[eventName].handlers) {
            handlers = [...this.events[eventName].handlers, ...handlers];
        }
        this.updateEventConfig(eventName, { handlers });
    },

    /**
     * @param {string} eventName
     * @param {EventConfig} config
     */
    updateEventConfig(eventName, config) {
        this.events[eventName] = config;
    },
};
