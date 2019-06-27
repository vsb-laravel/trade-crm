// import {imap} from './crm.imap.js';
import {Messages, Comments, Mails} from './modules/messages';
import {Finance} from './modules/finance';
import {Deals} from './modules/deals';
import {Affilate} from './modules/affilate';
import {Brands} from './modules/brands';
import {Events} from './modules/events';
import {Pairs} from './modules/instruments';
import {Users} from './modules/user';
import {Lead} from './modules/lead';
import {Newsfeed} from './modules/newsfeed';
import {Partner} from './modules/partner';
import {Telephony} from './modules/telephony';
import {Merchant} from './modules/merchant';
import { OnlineUsers } from './modules/online';
import { Clock } from './modules/clock';
import { VUIChart } from './modules/chart/index';
import { Container } from './components/container';
import { Dashboard } from './modules/dashboard';
import { Private } from './modules/options/private';

const version = '3.1';
window.cardContainer = new Container();
window.SUBSCRIBE_PRICE = false;
window.tradehost = window.document.location.hostname;//.replace(/crm\./ig,"trade.");
window.crm={
    charts:[],
    affilate: new Affilate(),
    brands: new Brands,
    deal:new Deals(),
    comments: new Comments(),
    events: new Events,
    finance: new Finance(),
    import: function(m,version="3.0"){
        let src = document.createElement('script');
        src.setAttribute('src',`/crm.${version}/js/crm.${m}.js`);
        document.body.appendChild(src);
    },
    instrument: new Pairs,
    json2html:function(j){
        let r = '';
        if( typeof(j) != 'object' ) {
            try{ j = JSON.parse(j); }
            catch(e){
                console.warn(e);
                return r;
            }

        }
        Object.keys(j).map( (k,i) => {
            const v = j[k];
            r+= `<code>${k}</code>: <strong>${v}</strong>&nbsp;&nbsp;`
        });
        return r;
    },
    lead:new Lead,
    merchant:new Merchant,
    messages: new Messages(),
    mail:new Mails(),
    newsfeed:new Newsfeed,
    partner:new Partner,
    telephony:new Telephony,
    user: new Users()
};
let acceptedUrlAction = false;
const re = /^.+#(\S+)=(\d+)$/ig,urlAction = re.exec(document.location.href);
if(urlAction && !acceptedUrlAction){
    const act = crm;
    const module = urlAction[1];
    const id = urlAction[2];
    try{
        act[module].info(id);
        document.title = `#${id} CRM ${system.app}`
    }catch(e){console.error(e)}
    acceptedUrlAction = true;
}
window.socket = window.location.hostname.match(/\.bs$/ig)?new io(`${window.document.location.hostname}:${window.wsport}`,{
        'reconnect': true,
        'reconnection delay': 3200,
        'max reconnection attempts': 5
        ,'secure': true
    })
    :new io();
// window.socket =new io(`${window.wshost}:${window.wsport}`,{
//         'reconnect': true,
//         'reconnection delay': 3200,
//         'max reconnection attempts': 5
//         ,'secure': true
//     });
window.onlineUsers = new OnlineUsers;
socket.on('connect', () => {
    socket.emit('user_info', {userId: window.user.id});
    $('#reenable_connection').slideUp();
})
socket.on('disconnect', ()=> {
    console.warn('socket connection lost');
    // $('#reenable_connection').slideDown();
});
// socket.on('disconnect', (reason) => {
//     console.warn('disconnected from socket');
//     if (reason === 'io server disconnect') {
//         socket.connect();
//     }
// });
socket.on('all_user', function (data) {
    onlineUsers.handle(data.users);
});
if(window.user.can.trades){
    socket.on('ohlc', function (e) {
        const tick = {
            instrument_id: e.data.pair.id,
            price: e.data.close,
            time: e.data.time,
            volation: e.data.volation,
            pair: e.data.pair,
            tune: e.data.tune,
            user: e.data.user?e.data.user:undefined
        }
        crm.instrument.prices.render($('#prices'),tick)
        // if(SUBSCRIBE_PRICE)
        // crm.deal.onPrice(tick)
        for(let i in cardContainer.cards){
            const card = cardContainer.cards[i];
            if(card.ohlc)card.ohlc(tick);
        }
        // if(e.data.tune)console.debug('ohlc event tune',tick,e.data);
    });
}
window.sockettime = {
    event:0,
    user: 0,
    ohlc: 0,
    userstate: 0
};
socket.on('event', function (e) {
    const tt = (new Date()).getTime();
    crm.events.append(e.data);
    window.sockettime.event = (window.sockettime.event==0) ? ( (new Date()).getTime()-tt ) : ((window.sockettime.event + (new Date()).getTime()-tt )/2);
});
socket.on('user', function (e) {
    const tt = (new Date()).getTime();
    if(cardContainer.cards[`cuser_${e.data.id}`]) {
        cardContainer.cards[`cuser_${e.data.id}`].fresh(e.data);
        cardContainer.touch(`cuser_${e.data.id}`);
    }
    // console.debug('user event',e.data)
    if(window.onlineUsers.list[e.data.id]) {
        window.onlineUsers.list[e.data.id] = e.data;
        window.onlineUsers.render(e.data);
    }
    if(e.data.id == window.user.id ){
        console.debug('myself change',e.data);
        //myself
        if(e.data.rights_id != window.user.rights_id){
            //logout
            document.getElementById('logout-form').submit();
        }
    }
    window.sockettime.user = (window.sockettime.user==0) ? ( (new Date()).getTime()-tt ) : ((window.sockettime.user + (new Date()).getTime()-tt )/2);
    if(window.sockettime.userstate==0)console.log(e)
    window.sockettime.userstate = (window.sockettime.userstate==0) ? e.data.loaded: ((window.sockettime.userstate +  e.data.loaded)/2);
});
window.timeStart = new Date();
window.ohlcCounter = {
    total:0,
    minute: timeStart.getTime()-timeStart.getTime()%60000
}
window.lastOhlcCounter = false;
window.lastOhlc = null;
socket.on('ohlc', function (e) {
    const tt = (new Date()).getTime();
    const ohlc = e.data;
    const pr = {
        instrument_id: ohlc.instrument_id,
        time: ohlc.time,
        price: ohlc.close,
        pair: ohlc.pair,
        source: ohlc.source,
        source_id: ohlc.source_id,
        volation: ohlc.volation,
        tune: ohlc.tune?true:false
    };
    if(!pr.tune) crm.instrument.prices.render($('#prices'),pr)
    crm.deal.onPrice(pr);
    new Promise( (resolve,reject) => {
        const time = (new Date()).getTime();
        const minute = time-time%60000;
        if(window.ohlcCounter.minute < minute){
            window.lastOhlcCounter = window.lastOhlcCounter?window.lastOhlcCounter:{...window.ohlcCounter,count:1};
            window.lastOhlcCounter.total += window.ohlcCounter.total;
            window.lastOhlcCounter.count++;
            window.lastOhlcCounter.avg = Math.floor(window.lastOhlcCounter.total/window.lastOhlcCounter.count);
            window.ohlcCounter ={
                total:0,
                minute: minute
            }
        }
        window.ohlcCounter[ohlc.pair.symbol]=window.ohlcCounter[ohlc.pair.symbol]?window.ohlcCounter[ohlc.pair.symbol]:{
            minute: parseInt(ohlc.time)-parseInt(ohlc.time)%60000,
            total: 0
        }
        window.ohlcCounter.total++;
        window.ohlcCounter[ohlc.pair.symbol].total++
    });
    window.lastOhlc = pr;
    window.sockettime.ohlc = (window.sockettime.ohlc==0) ? ( (new Date()).getTime()-tt ) : ((window.sockettime.ohlc + (new Date()).getTime()-tt )/2);
});


$('#body_event_trigger').on('crm.user::loaded', () => {
    // const modules = ['clock','events','affilate','lead','instruments','merchant','scheduler','chat','imap','brands'];
    // modules.map( (module,i) => {crm.import(module);});
    $('body').trigger('crm.loaded',crm);
});
let clock = new Clock('#clock')
clock.render();
setInterval(clock.render,1000);

// dashboardds
const dashboardObject = new Dashboard();
window.dashboard_trades = dashboardObject.trades;

window.register2fasecret = (d,c,a)=>{
    const prv = new Private(d,c,a);
}
window.confirm2fasecret = (d,c,a)=>{
    console.debug('need confirm');
    const prv = new Private(d,c,a);
}
