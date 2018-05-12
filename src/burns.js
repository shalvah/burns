'use strict';

const config = require('./repositories/config');
const events = require('./repositories/events');
const eventDispatcher = require('./managers/dispatch')(config, events);
const broadcastManager = require('./managers/broadcast')(config, events);

class Burns {

    configure({ defaultHandler, broadcaster, pusher } = {}) {
        config.set({ defaultHandler, broadcaster, pusher });
        return this;
    }

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

module.exports = new Burns();



