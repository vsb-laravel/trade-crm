class TickQueue{
    constructor(delay = 1000){
        this.delay = delay;
        this.syms = {};
        this.check = this.check.bind(this);
        this.statistic = this.statistic.bind(this);
    }
    check(tick){
        let { syms, delay } = this;
        const price = tick.ask || tick.Ask;
        const symbol = tick.symbol || tick.Symbol;
        const time = (new Date()).getTime();

        if( syms[symbol] && time-syms[symbol].time<delay){
            let hist = syms[symbol];
            hist.ticks++;
            if(price > hist.max){
                hist.max = price;
                syms[symbol].unique++;
                return true;
            }
            else if(price<hist.min){
                hist.min = price;
                syms[symbol].unique++;
                return true;
            }
        }
        else{
            if(syms[symbol] == undefined) syms[symbol]={
                max: price,
                min:price,
                time: time,
                ticks:0,
                unique:0
            };
            syms[symbol].time= time;
            syms[symbol].min= price;
            syms[symbol].max= price;
            syms[symbol].ticks++;
            syms[symbol].unique++;
            return true;
        }
        return false;
    }
    get list(){
        return this.syms;
    }
    statistic(){
        let str = '';
        let u = 0;
        let t = 0;
        let percent = 0;
        for(let i in this.syms){
            if(this.syms[i].unique!=this.syms[i].ticks) str+=`\n\t${i}:\tT:${this.syms[i].ticks} U:${this.syms[i].unique}`;
            u+=this.syms[i].unique;
            t+=this.syms[i].ticks;
        }
        percent = (t>0)?(100*u/t):0
        console.log(`UNIQUE/TOTAL: ${percent.toFixed(2)}% (${u}/${t})${str}`);
    }
}
module.exports = TickQueue;
