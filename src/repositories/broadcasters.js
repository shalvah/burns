'use strict';

module.exports = {

    get(driver, config) {
        return require(`../broadcasters/${driver}`)(config);
    }
};
