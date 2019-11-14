'use strict';

const config = require('./repositories/config');
const events = require('./repositories/events');
const broadcasters = require('./repositories/broadcasters');
const eventDispatcher = require('./managers/dispatch')(config, events);
const broadcastManager = require('./managers/broadcast')(config, events, broadcasters);

/**
 * @typedef {import("./repositories/config").Config} Burns.Config
 * @typedef {import("./repositories/events").EventHandler} Burns.EventHandler
 * @typedef {import("./repositories/events").EventConfig} Burns.EventConfig
 */


class Burns {

    /**
     * @param {Burns.Config} config
     * @returns {Burns}
     */
    configure({ defaultHandler, broadcaster, pusher } = {}) {
        config.set({ defaultHandler, broadcaster, pusher });
        return this;
    }

    /**
     *
     * @param {Object<string, Burns.EventHandler|Burns.EventHandler[]|Burns.EventConfig>} newEvents
     * @returns {Burns}
     */
    registerEvents(newEvents) {
        events.add(newEvents);
        return this;
    }

    dispatch(eventName, eventData = {}, { exclude = null } = {}) {
        eventDispatcher.dispatch(eventName, eventData);
        broadcastManager.broadcast(eventName, eventData, { exclude });
        return this;
    }

}

/**
 * @type {Burns}
 */
module.exports = new Burns();



