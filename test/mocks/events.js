module.exports = makeMockEvents;

function makeMockEvents(config = {}, specificEvent = null) {
    return {
        broadcastConfig(key) {
            config = Object.assign({}, { broadcastOn: null, broadcastIf: null }, config);
            if (specificEvent) {
                return key === specificEvent ? config : { broadcastOn: null, broadcastIf: null };
            }
            return config;
        }
    };
}
