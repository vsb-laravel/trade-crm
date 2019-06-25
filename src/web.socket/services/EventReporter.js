
const Redis = require('ioredis');

class EventReporter {
    constructor(options) {
        this._CBS_ON_PMESSAGE = [];
        const redis = new Redis(options);
        redis.psubscribe('*', (err, count) => console.log(err));
        redis.on('pmessage', (pattern, channel, message) => this._onPMessage(pattern, channel, message));
    }

    _onPMessage(pattern, channel, message) {
        let data;
        try {
            data = JSON.parse(message);
        } catch (e) {
            console.error('Unable to parse obtained message from redis', e);
            return;
        }
        this._emitOnPMessage(pattern, channel, data);
    }

    _emitOnPMessage(pattern, channel, message) {
        this._CBS_ON_PMESSAGE.forEach((cb) => cb(pattern, channel, message));
    }

    onPMessage(cb) {
        this._CBS_ON_PMESSAGE.push(cb);
    }
}

module.exports = EventReporter;
