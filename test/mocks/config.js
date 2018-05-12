module.exports = makeMockConfig;

function makeMockConfig(config) {
    return {
        get(key) {
            return config[key];
        }
    };
}
