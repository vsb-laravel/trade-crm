require('dotenv').config();
const config = require('./config/index');
const WebSocketClient = require('./services/WebSocketClient');
const LaravelJob = require('./services/LaravelJob');
const TickQueue = require('./services/tickQueue');
const getSource = require('./services/getSource');
const Socket = require('./services/Socket');
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
const proxy = new Socket(7012);

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
    // console.log(tick.pair.symbol,' - ', tick.ask, ' :',tick.time);
    lj.add(t)
}
wsc.open(config.url);
wsc.onopen = function(e){
    console.log('onOpen');
    this.send(JSON.stringify({
        cmd: 'symbols',
    }));

    this.send(JSON.stringify({
        cmd: 'subscribe',
        symbols: config.symbols,
    }));
};
wsc.onmessage = function(data) {
    if(source.id == undefined) return;
    const message = JSON.parse(data);
    if (message.event === 'symbols') {
        console.log('symbols: ', message.symbols.length);
    }
    if (message.event === 'tick') {

        if( !symbols.check(message) ) return false;
        
        proxy.sendMessage(message);
        return false;

        if(typeof listSymbol[message.symbol] == "undefined"){
            connection.query('SELECT * FROM instruments where instruments.symbol = "' + message.symbol + '"  and instruments.enabled = 1 and instruments.source_id = ' + source.id , function(error, result, fields) {
            // connection.query('SELECT instruments.id as id_instrument FROM instruments'
            //                + ' join currencies fr on fr.id = instruments.from_currency_id'
            //                + ' join currencies tt on tt.id = instruments.to_currency_id'
            //                + ' join sources on  sources.id = instruments.source_id'
            //                + ' where instruments.symbol = "' + message.symbol + '"  and instruments.enabled = 1 and sources.name = "' + trade_center + '"', function(error, result, fields) {
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
    }
};
setInterval(symbols.statistic, 30000);
