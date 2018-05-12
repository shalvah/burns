'use strict';

const config = require('./managers/config');
const eventsManager = require('./managers/events');
const eventDispatcher = require('./managers/dispatch')(config, eventsManager);

class Burns {

    configure({ defaultHandler, broadcaster, pusher } = {}) {
        config.set({ defaultHandler, broadcaster, pusher });
        return this;
    }

    registerEvents(events) {
        eventsManager.addEvents(events);
        return this;
    }

    dispatch(eventName, eventData = {}) {
        eventDispatcher.dispatch(eventName, eventData);
        return this;
    }

}

module.exports = new Burns();



