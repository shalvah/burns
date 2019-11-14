module.exports = makeMockBroadcasters;

function makeMockBroadcasters(broadcasters = null) {
    if (!broadcasters) {
        broadcasters = {
            log: {
                broadcast() {
                }
            }
        }
    }
    return {
        createBroadcaster(key) {
            return broadcasters[key];
        }
    };
}
