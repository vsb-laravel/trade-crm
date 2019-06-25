const io = require('socket.io-client');
const getToken = require('./token');
const EventEmitter = require('events');

function intToFloat(value, digits) {
    return parseFloat(value + "e-" + digits);
}

function Client(host, login, password, company, userAgent, callback) {
    getToken(host, login, password, company, userAgent, (error, cookie) => {
        if (error || !cookie) {
            console.error(error);
            return callback(error);
        }

        const emitter = new EventEmitter();

        let symbols = {};

        const socket = io(host, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 60,
            transports: [
                'websocket',
                'polling'
            ],
            forceNew: true,
            extraHeaders: {
                'user-agent': userAgent,
                'Cookie': cookie
            }
        });

        socket.on('connect', () => {
            console.log('connect');
        });

        socket.on('error', (data) => {
            console.log('error', data)
        });

        socket.on('logout', () => {
            console.log('logout', arguments);
            socket.disconnect();
        });

        socket.on('disconnect', () => {
            console.log('disconnect');
            process.exit();
        });

        socket.on('connect_failed', () => {
            console.log('connect_failed')
        });

        function onQuote(quotes) {
            quotes.forEach(([symbolId, time, ask, bid]) => {
                const symbol = symbols[symbolId];

                emitter.emit('quote', {
                    Symbol: symbol.Name,
                    Time: time,
                    Ask: intToFloat(ask, symbol.FractionalDigits),
                    Bid: intToFloat(bid, symbol.FractionalDigits),
                });
            });
        }

        socket.on('NotifyQuote', onQuote);

        socket.on('init', (data) => {
            symbols = data.Symbols;
            console.log('init');

            socket.emit('Subscribe', 'Quote', Object.keys(symbols).map(symbolId => +symbolId));

            callback(error, emitter);
        });
    });
}


module.exports = Client;
