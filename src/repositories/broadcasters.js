'use strict';

/**
 * @typedef {{broadcast: ((channels: string|string[], eventName: string, eventData: ?, options: {exclude?: string}) => ?)}} Broadcaster
 */

module.exports = {

    /**
     * @param {string} driver
     * @param {?} config
     * @returns {Broadcaster}
     */
    createBroadcaster(driver, config) {
        return require(`../broadcasters/${driver}`)(config);
    }
};
