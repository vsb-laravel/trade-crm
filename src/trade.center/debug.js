require('dotenv').config();
const config = require('./config/debug');
const WebSocketClient = require('./services/WebSocketClient');
const io = require('socket.io-client');
const LaravelJob = require('./services/LaravelJob');
const TickQueue = require('./services/tickQueue');
const getSource = require('./services/getSource');

const wsc = new WebSocketClient();
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
});
let listSymbol = [];
// const source = getSource(connection,'trade_center');
const source = {
    id: "6",
    name: "trade_center"
}
const lj = new LaravelJob();
const symbols = new TickQueue();
const injectQueue = (tick) => {
    const time = Math.floor(tick.time/1000);
    const t = {
        price: `${tick.ask}`,
        volation: tick.volation,
        time: time,
        instrument_id: tick.pair.id,
        source_id: source.id
    };
    console.log(tick.pair.symbol,' - ', tick.ask, ' :',tick.time);
    lj.add(t)
}
const url = config.url.replace(/ws:\/\//,'http://');
console.log('connecting to '+url+' ...');
socket = io(url,{
    'reconnect': true,
    'reconnection delay': 3200,
    'max reconnection attempts': 5
        // 'path':'/'
    });

socket.on('connect', () => {
    console.log('connected')
    socket.emit('subscribe', {});
})
socket.on('tick', (data) => {

    const message = data;
    console.log('tick',message.symbol);
    if(typeof listSymbol[message.symbol] == "undefined"){
        connection.query('SELECT * FROM instruments where instruments.symbol = "' + message.symbol + '"  and instruments.enabled = 1', function(error, result, fields) {
            json_instrument_axiox = null;
            try{
                json_instrument_axiox =  JSON.parse(JSON.stringify(result));
                if(json_instrument_axiox[0]){
                    const pair = json_instrument_axiox[0];
                    let tick = {...message};
                    tick.pair = pair;
                    tick.volation = 0;

                    injectQueue(tick);
                    listSymbol[message.symbol] = tick;
                    json_instrument_axiox[0] = '';
                }
            }
            catch(e){
                console.error('SQL error in ',result);
                console.error(e);
            }
        });
    }
    else {
        // if( listSymbol[message.symbol].ask === message.ask ){
        //     return false;
        // }
        // else if( message.time - listSymbol[message.symbol].time < 128 ){
        //     return false;
        // }
        if( !symbols.check(message) ) return false;
        else {
            let tick = listSymbol[message.symbol]
            tick.time = message.time;
            tick.volation = (tick.ask > message.ask)?1:-1;
            tick.ask = message.ask;
            injectQueue(tick);
            listSymbol[message.symbol] = tick;
        }
    }
})
socket.on('disconnect', () => {
    console.log('disconnected')
})

setInterval(symbols.statistic, 30000);
