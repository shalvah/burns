'use strict';

/**
 * @typedef {{broadcast: function(string, string, ?, ?): ? }} Broadcaster
 */

module.exports = {

    /**
     * @param {string} driver
     * @param {?} config
     * @returns {Broadcaster}
     */
    get(driver, config) {
        return require(`../broadcasters/${driver}`)(config);
    }
};
