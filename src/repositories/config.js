'use strict';

module.exports = {

    options: {
        defaultHandler: null,
        broadcaster: 'log',
        pusher: {},
    },

    set(options) {
        this.options = Object.assign(this.options, options);
    },

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
