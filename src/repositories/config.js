'use strict';

/**
 * @typedef {import("./events").EventHandler} EventHandler
 */

/**
 * @typedef {Object<string, ?>} Config
 * @property {EventHandler|null=} defaultHandler
 * @property {string=} broadcaster
 * @property {{appId: string, key: string, secret: string, cluster?: string}|{}=} pusher
 */

module.exports = {

    /**
     * @type {Config}
     */
    options: {
        defaultHandler: null,
        broadcaster: 'log',
        pusher: {},
    },

    /**
     *
     * @param {Config} options
     */
    set(options) {
        this.options = Object.assign(this.options, options);
    },

    /**
     *
     * @param {string} key
     * @returns {null|Config|?}
     */
    get(key) {
        let value = this.options;
        let segments = key.split('.');
        for (let segment of segments){
            if (!value[segment]) { return null; }
            value = value[segment];
        }
        return value;
    }
};
