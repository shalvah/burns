module.exports = makeMockEvents;

function makeMockEvents(config = {}, specificEvent = null) {
    return {
        broadcastConfig(key) {
            config = Object.assign({}, { broadcastOn: null, broadcastWhen: null }, config);
            if (specificEvent) {
                return key === specificEvent ? config : { broadcastOn: null, broadcastWhen: null };
            }
            return config;
        }
    };
}
