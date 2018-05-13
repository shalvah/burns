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
        get(key) {
            return broadcasters[key];
        }
    };
}
