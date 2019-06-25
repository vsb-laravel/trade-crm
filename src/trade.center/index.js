
require('dotenv').config();

const got = require('got');
const http = require('http');
const Client = require('./lib/client');
const LaravelJob = require('./services/LaravelJob');
const TickQueue = require('./services/tickQueue');
const getSource = require('./services/getSource');

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36';
const host = 'http://terminal.skyliq.com/';
const company = 'skyliq';
const login = 'arthur@sky-mechanics.com';
const password = 'nn123456';
const trade_center = 'trade_center';
const axios = require('axios');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : process.env.DB_HOST_READ,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
});
let listSymbol = [];
let amountRequest = 0;
let amountResponse = 0;
let avgTime = 0;
// const source = getSource(connection,'trade_center');
const lj = new LaravelJob();
const symbols = new TickQueue();
const source = {
    id: "6",
    name: "trade_center"
}
const injectQueue = (tick) => {
    // console.log('new tick',tick.Symbol,tick.Ask);
    const time = Math.floor(tick.time/1000);
    const t = {
        price: `${tick.Ask}`,
        volation: tick.volation,
        time: time,
        instrument_id: tick.pair.id,
        source_id: source.id
    };
    lj.add(t)
}
Client(host, login, password, company, userAgent, (error, client) => {
    if (error) throw new Error(error);

    function onQuote(quote) {
        quote.Ask = quote.Ask.toFixed(5);
        if(typeof listSymbol[quote.Symbol] == "undefined"){
            connection.query('SELECT * FROM instruments where instruments.symbol = "' + quote.Symbol + '"  and instruments.enabled = 1 and instruments.source_id = "' + source.id + '"', function(error, result, fields) {
                json_instrument_axiox =  JSON.parse(JSON.stringify(result));
                if(json_instrument_axiox[0]){
                    const pair = json_instrument_axiox[0];
                    let tick = {...quote};
                    tick.pair = pair;
                    tick.volation = 0;
                    tick.time = (new Date).getTime();
                    listSymbol[quote.Symbol] = tick;
                    injectQueue(tick);
                    // sendData2FPM(quote);
                    json_instrument_axiox[0] = '';
                }
            });
        }
        else {
            let tick = listSymbol[quote.Symbol];
            // if( tick.Ask === quote.Ask ){
            if( !symbols.check(quote) ) return false;
            else {
                tick.Ask = quote.Ask;
                tick.time = (new Date).getTime();
                tick.volation = (tick.Ask > quote.Ask)?1:-1;
                injectQueue(tick);
                listSymbol[quote.Symbol] = tick;
            }
        }
    }

    function statisticRequest (){
        console.log('Server datetime ' + new Date().toLocaleString() + ' Amount request/response to server (1 minute) avg proc('+(avgTime/amountRequest)+') ' + (amountRequest + '/' + amountResponse));
        amountRequest = 0;
        amountResponse = 0;
        avgTime = 0;
    }

    setInterval(symbols.statistic, 8000);

    client.on('quote', onQuote);
});
