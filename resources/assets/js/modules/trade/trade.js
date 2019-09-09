import { Card } from '../../components/card';
import { VUIEditable } from '../../components';
import { VUIChart } from '../chart/index';
export class Trade extends Card{
    constructor(u) {
        super('chart line');
        this.auth=window.user;
        this._uid='ctrade_'+u.id;
        this.draw=this.draw.bind(this);
        this.ohlc=this.ohlc.bind(this);
        this.chart=this.chart.bind(this);
        this.calculate=this.calculate.bind(this);
        this.reopen=this.reopen.bind(this);
        this.terminate=this.terminate.bind(this);
        this.setTuneSpeed=this.setTuneSpeed.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.trade = u;
        this.getTitle=this.getTitle.bind(this);
        this._chart = null;
        this.dataRange = null;
        this._corrida = null;
        this.tuned = false;
        this.draw();
    }
    compare(data){
        const {trade} = this;
        if(trade.status_id!=data.status_id) return false;
        return true;
    }
    fresh(d){
        console.debug('freshing trade fresh',d,this.trade);
        if(!this.compare(d)){
            this.trade = d;
            this.draw(true);
        }
    }
    handleChange(){
        const {trade,$container,auth} = this;
        $(`#riskb_${trade.id}`).removeClass('basic');
    }
    getTitle(){
        return `#${this.trade.id} ${this.trade.instrument.title}`;
    }
    reopen(){
        const { trade, auth } = this;
        const that = this;
        $.ajax({
            url:`/deal/${trade.id}`,
            type:'put',
            data:{
                _token: window.cfrf,
                status_id:10
            },
            success: (d,x,s) => {
                that.trade = d;
                that.draw();
            }
        });
    }
    terminate(price = false){
        let { trade, auth } = this;
        let that = this;
        console.debug('terminating trade',trade)
        let params = {
            deal_id: trade.id,
            current_price: trade.close_price
        }
        $.ajax({
            url:`/deal/delete`,
            data:params,
            success: (d,x,s) => {
                trade = d;
                that.trade = d;
                console.debug('terminating trade success',trade)
                that.draw();
            }
        });
    }
    calculate(price){
        const { trade } = this;
        var op = parseFloat(trade.open_price),
            da = parseFloat(trade.amount),
            df = parseFloat(trade.fee),
            dm = parseInt(trade.multiplier),
            dd = parseInt(trade.direction),
            p=((price/op)-1)*dd*dm*da;

        return {
            profit:p+da,
            percent:((da+p)/(da+df))
        }
    }
    ohlc(price){
        if(this._chart && this.trade.instrument_id == price.instrument_id){
            const newPrice = parseFloat(price.price);
            const time = new Date(price.time*1000);
            const { trade,$container } = this;
            const $f = $container.find( `.current#current_price_${trade.id}` );
            const $o = $container.find( `.profit#current_profit_${trade.id}` );
            const $p = $container.find( `.percent#current_percent_${trade.id}` );
            const lastPrice = parseFloat(trade.close_price);
            if( ( !this.tuned && price.tune==undefined ) || ( price.tune!=undefined && price.user && price.user.id == this.trade.user_id) ){
                const calc = this.calculate( newPrice );
                const pd = (newPrice > lastPrice ) ? 'green' : 'red';
                if(!this.tuned || ( this.tuned && price.tune!=undefined && price.user && price.user.id == this.trade.user_id ) ){
                    $p.removeClass( 'green red changed').addClass(((calc.profit > 0) ? 'green' : 'red') + ' changed' );
                    $p.html(calc.percent.percent());
                    $o.html(calc.profit.dollars());
                    $f.removeClass('green red changed').addClass(pd + ' changed').html(newPrice.digit(5));
                    this.trade.close_price=newPrice;
                }
            }
            if(price.tune!=undefined && price.user && price.user.id == this.trade.user_id){
                this._chart.set( time, newPrice, 1 );
            }
            else if(price.tune==undefined)  this._chart.set( time, newPrice, 0 );
        }

    }
    chart($c,d){
        var data = [],
            labels = [];
        d = d.reverse();
        let level = 0;
        let range = 0;
        let minLevel = false;
        let maxLevel = false;
        let pairId = null;
        const that = this;
        const trade = this.trade;
        d.map( (row,i) => {
            const dt = new Date(row.time * 1000);
            level = parseFloat(row.close);
            pairId = row.instrument_id
            labels.push(dt);
            data.push({ x: dt, y: level });
            let newr = Math.abs(parseFloat(row.high)-parseFloat(row.low));
            if(i!=0) range = range+newr/(i+1); else range = newr;
            minLevel = (minLevel==false || minLevel>parseFloat(row.low))?parseFloat(row.low):minLevel;
            maxLevel = (maxLevel==false || maxLevel<parseFloat(row.high))?parseFloat(row.high):maxLevel;
        })
        this.dataRange = (maxLevel-minLevel)/level;
        console.debug('abg range ohlc/level',this.dataRange);
        this.ohlc({ // set current price
            instrument_id: pairId,
            price: level
        });
        data = data.reverse();
        this._chart = new VUIChart(pairId, {
                ctx: $c.find('.chart:first'),
                data: {
                    label: __('crm.instruments.prices'),
                    keys: labels,
                    values: data
                },
                onUpdate: function(p) {
                    var n = parseFloat(p.y),
                        trade = $c.parents('.ui.modal').find( '#trade_data').length ? JSON.parse($c.parents( '.ui.modal').find('#trade_data').text()) : undefined,
                        $f = $c.parents('.ui.modal').find( '.current'),
                        $o = $c.parents('.ui.modal').find('.profit'),
                        $p = $c.parents('.ui.modal').find( '.percent'),
                        last = parseFloat($f.text().replace( /[\s,]/g, '')),
                        pd = (n > last) ? 'green' : 'red';
                    if( !trade ) return;
                    $c.parents('.ui.active.loader').removeClass( 'active loader' );
                    // console.debug('chart updated',n,trade);
                    var calc = crm.deal.calculate(trade, n);
                    // console.debug(calc);
                    $p.parents('td').removeClass( 'green red changed').addClass(((calc.profit > 0) ? 'green' : 'red') + ' changed' );
                    $p.html(calc.percent.currency('') + '%');
                    $o.html(calc.profit.currency( ''));
                    $f.removeClass('green red changed').addClass(pd + ' changed').html(n.currency('',5));
                }
            });
            // this.smchart.setSupport(level,level*.5);
        this._corrida = new Corrida(this._chart,this);
        this._corrida.read( (t) => {
            that.tuned = t;
            console.log(`trade #${that.trade.id} is ${t?'tunned':'normal'}`);
        });
    }
    setTuneSpeed(s){
        const {trade} = this;
        $(`#riskb_${trade.id}`).removeClass('basic');
        $(`#corrida_smoothing_${trade.id}_buttons.tunespeed button`).removeClass('active');
        $(`#corrida_smoothing_${trade.id}_buttons.tunespeed .${s}`).addClass('active');
        const $val = $(`#corrida_smoothing_${trade.id}`);
        const ss = crm.deal.TUNE_SPEED[s];
        $val.val(ss);

        return ss;
    }
    draw(isUpdate=false){
        const that = this;
        const {trade,$container,auth} = this;
        const isForex = (trade.type==='forex');
        const profit = parseFloat(trade.profit) + parseFloat(isForex?0:trade.amount);
        const profitPercent = profit/parseFloat(trade.invested);


        // if(!isUpdate)
        $container.html('');
        // let $content = isUpdate?$container.find('.content:first'):$(`<div class="ui content scrolling"></div>`).appendTo($container);
        // let $header = isUpdate?$container.find('.header:first'):$(`<div class="header"></div>`).appendTo($content);
        let $content = $(`<div class="ui content scrolling"></div>`).appendTo($container);
        let $header = $(`<div class="header"></div>`).appendTo($content);
        $header.html(`<i class="ui hcart line icon"></i><code>#${trade.id}</code> ${trade.instrument.title}`);
        let tradeAction = `<div class="ui negotive fluid message">${__('crm.trades.not_reopen')} (${trade.profit.dollars()})</div>`;
        if(["10","30",10,30].indexOf(trade.status_id)>-1) tradeAction = `<button class="ui icon red button right floated" id="terminate_trade_${trade.id}"><i class="close icon"></i>${__('crm.trades.terminate')}</button>`;
        else if (trade.status_id==100 || (trade.status_id==20 && trade.profit<=0)) tradeAction = `<button class="ui icon olive button right floated" id="reopen_trade_${trade.id}"><i class="refresh icon"></i>${__('crm.trades.reopen')}</button>`;
        let $follow = '';

        if( trade.user.meta ){
            const m = getMeta(trade.user.meta,'can_follow');
            if(m!==false){
                const f = JSON.parse(m.meta_value);
                console.log('trade follow',m,f);
                $follow = `<tr>
                    <td><i class="large user middle aligned icon"></i></td>
                    <td>${__('crm.partner.following')}</td>
                    <td class="ui right aligned"><a href="javascript:crm.user.card(${f.partner})">${__('crm.partner.guru')}</a></td>
                </tr>`;
            }

        }
        $content = $(`<div class="ui stackable grid"></div>`).appendTo($content);
        let $left = $(`<div class="column four wide left-column">
        <div class="ui items">
            <div class="ui item">
                <div class="ui tiny image">
                    ${(trade.type=='forex')?'<img src="/crm.3.0/images/forex.gif" style="width:40px"/>':'<img src="/crm.3.0/images/xcryptex.webp" style="width:40px"/>'}
                </div>
                <div class="content right aligned">
                    <div class="header">${trade.type}</div>
                    <div class="description">${tradeAction}</div>
                </div>
            </div>
        </div>
        <table class="ui relaxed table">
            <tr>
                <td><i class="large user middle aligned icon"></i></td>
                <td>${__('crm.customers.name')}</td>
                <td class="ui right aligned"><a href="javascript:crm.user.card(${trade.user.id})">${trade.user.title || ''}</a></td>
            </tr>
            ${$follow}
            <tr>
                <td><i class="large industry middle aligned icon"></i></td>
                <td>${ __('crm.instruments.title') }<br /><small>${ __('crm.trades.fee') } ${trade.instrument.commission.percent()}</small></td>
                <td class="right aligned">
                    <div class="ui item">
                        <a class="header" onclick="crm.instrument.edit(${trade.instrument.id})"><code>#${trade.instrument_id}</code> ${trade.instrument.title}</a>
                        <div class="meta">${trade.instrument.source.name} <strong>${trade.instrument.symbol}</strong></div>
                        <div class="content">${(trade.direction>0)?`<i class="large arrow up middle aligned icon green"></i> ${__('crm.trades.buy')}`:`<i class="large arrow down middle aligned icon red"></i> ${__('crm.trades.sell')}`}</div>
                    </div>
                </td>
            </tr>
            <tr>
                <td><i class="large leaf middle aligned icon"></i></td>
                <td><a class="header"></a><div class="description">${ __('crm.accounts.type') }</div></td>
                <td class="right aligned">${(trade.account.type=='real')?__('crm.accounts.real'):__('crm.accounts.demo')}</td>
            </tr>
            <tr>
                <td><i class="large calendar middle aligned icon"></i></td>
                <td><a class="header"></a><div class="description">${__('crm.trades.created_at')}</div></td>
                <td class="right aligned"><div class="header">${trade.created_at.datetime({style:'simple'})}</div></td>
            </tr>
            ${(trade.status_id==20)?`<tr>
                <td><i class="large calendar middle aligned icon"></i></td>
                <td><a class="header"></a><div class="description">${__('crm.trades.closed_at')}</div></td>
                <td class="right aligned"><div class="header">${trade.updated_at.datetime({style:'simple'})}</div></td>
            </tr>`:''}
            ${ isForex
                ?`<tr>
                    <td><i class="large dollar middle aligned icon"></i></td>
                    <td><a class="header"></a><div class="description">${ __('crm.trades.contract') }</div></td>
                    <td class="right aligned">
                        <div class="header">${trade.invested.dollars()} <sup>x</sup><small class="multiplier"></small></div>
                        volume: ${trade.volume || '0' }
                    </td>
                </tr>`
                :`<tr>
                    <td><i class="large dollar middle aligned icon"></i></td>
                    <td><a class="header"></a><div class="description">${ __('crm.trades.invested') }</div></td>
                    <td class="right aligned">
                        <div class="header">${trade.invested.dollars()} <sup>x</sup><small class="multiplier"></small></div>
                        fee: ${trade.fee.dollars() || '0' }
                    </td>
                </tr>`
            }
            <tr>
                <td><i class="large circle middle aligned icon"></i></td>
                <td>${ __('crm.trades.status') }</td>
                <td class="right aligned">${trade.status.name}</td>
            </tr>
            <tr>
                <td><i class="large circle middle aligned icon"></i></td>
                <td>${(trade.status_id==30)?__('crm.trades.atp'):__('crm.trades.open_price') }</td>
                <td class="right aligned open-price"></td>
            </tr>
            <tr>
                <td><i class="large circle middle aligned icon"></i></td>
                <td>${ (trade.status_id==20)?__('crm.trades.close_price'):__('crm.trades.current_price') }</td>
                <td class="right aligned ${ (trade.status_id==20)?'':'current' }" id="current_price_${trade.id}" number="${trade.close_price || '0' }">${trade.close_price || '0' }</td>
            </tr>
            <tr>
                <td><i class="large circle middle aligned icon"></i></td>
                <td>${__('crm.trades.tp')}</td>
                <td class="right aligned stop-high"></td>
            </tr>
            <tr>
                <td><i class="large circle middle aligned icon"></i></td>
                <td>${__('crm.trades.sl')}</td>
                <td class="right aligned stop-low"></td>
            </tr>
            <tr>
                <td><i class="large dollar middle aligned icon"></i></td>
                <td><div class="description">${ __('crm.trades.profit') }</div></td>
                <td class="right aligned"><div class="ui item">
                    <div class="header ${ (trade.status_id==10)?'profit':''}" id="current_profit_${trade.id}">${profit.dollars()}</div>
                    <div class="description ${ (trade.status_id==10)?'percent':''}" id="current_percent_${trade.id}">${profitPercent.percent()}</div>
                </div></td>
            </tr>
        </table>
        <div class="ui horizontal divider">${__('crm.trades.day_swap')}</div>
        </div>`).appendTo($content);
        $left.find('.stop-low').append(  auth.can.retention ? new VUIEditable('/deal/'+trade.id,'stop_low',trade.stop_low):(trade.stop_low || '0') );
        $left.find('.stop-high').append( auth.can.retention ? new VUIEditable('/deal/'+trade.id,'stop_high',trade.stop_high):(trade.stop_high || '0') );
        $left.find('.open-price').append( auth.can.retention ? new VUIEditable('/deal/'+trade.id,'open_price',trade.open_price):(trade.open_price || '0') );
        $left.find('.multiplier').append( auth.can.retention ? new VUIEditable('/deal/'+trade.id,'multiplier',trade.multiplier):(trade.multiplier || '1') );
        console.debug('assign buttons ',$left.find(`#terminate_trade_${trade.id}`),$left.find(`#reopen_trade_${trade.id}`));
        $left.find(`#terminate_trade_${trade.id}`).on('click',this.terminate);
        $left.find(`#reopen_trade_${trade.id}`).on('click',this.reopen);

        let $dayswap = $(`<table class="ui relaxed table"></table`).appendTo($left);
        trade.user.meta.map( (meta,i) => {
            const re = new RegExp(`trade#${trade.id}_swap_(\\d+)`);
            const ms = re.exec(meta.meta_name);
            if(ms && ms.length) $(`<tr><td><i class="calendar icon"></i>${ms[1].datetime({style:'simple'})}</td><td>${meta.meta_value.dollars()}</td></tr>`).appendTo($dayswap)
        })
        let $right = $(`<div class="column ${(trade.status_id==20 || trade.multiplier <50)?'twelve':'nine'} wide right-column"></div>`).appendTo($content);
        $(`<div class="ui header">${ __('crm.dealchart') }</div>`).appendTo($right);

        window[`trade_chart_${trade.id}`] = this.chart;

        $(`<div class="loadering" data-action="/data/histominute/1?instrument_id=${trade.instrument.id}&user_id=${auth.id}&limit=16" data-autostart="true" data-need-loader="true" data-function="trade_chart_${trade.id}"><canvas id="chart_${trade.id}_instrument_price" class="chart" width="640" height="360"></canvas></div>`).appendTo($right);
        if(auth.can.tune && trade.status_id!=20  && trade.multiplier >=50){
            $right = $(`<div class="column three wide"></div>`).appendTo($content);
            const $tune = $(`<div class="ui header">${ __('crm.trades.tune') }</div>
            <div class="ui horizontal divider">${ __('crm.deal.tune_corrida') }</div>
            <div class="ui form corrida">
                <div class="field">
                    <div class="ui checkbox slider" id="riskon_${trade.id}">
                        <input type="checkbox" data-name="riskon" value=""/>
                        <label>${ __('crm.trades.tuneon') }</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui checkbox" id="onclose_${trade.id}">
                        <input type="checkbox" data-name="onclose" value="" disabled="disabled"/>
                        <label>${ __('crm.deal.onclose') }</label>
                    </div>
                </div>
                <div class="fields">
                    <div class="field">
                        <label>${ __('crm.trades.tunespeed') }</label>
                        <input type="hidden" data-name="smoothing" id='corrida_smoothing_${trade.id}' value="0.000025"/>
                        <div class="ui basic buttons tunespeed" id="corrida_smoothing_${trade.id}_buttons">
                            <button data-value="slow" class="ui slow button active">${ __('crm.trades.tunespeed_slow') }</button>
                            <button data-value="normal" class="ui normal button">${ __('crm.trades.tunespeed_normal') }</button>
                            <button data-value="fast" class="ui fast button">${ __('crm.trades.tunespeed_fast') }</button>
                        </div>
                    </div>
                </div>

                <input type="hidden" data-name="high" id='risk_high_${trade.id}' value=""/>
                <input type="hidden" data-name="low" id="risk_low_${trade.id}" step="1" min=1 max="10" value="1"/>
            </div>
            <div class="ui horizontal divider">Approximate values</div>
            <table class="ui table relaxed predictions" id="predictions_${this.trade.id}">
                <tbody>
                    <tr><td>Reach instrument price</td><td class="right aligned"><strong></strong></td></tr>
                    <tr><td>Profit</td><td class="right aligned"><strong></strong><br /><small></small></td></tr>
                    <tr><td>Duration</td><td class="right aligned"></td></tr>
                </tbody>
            </table>
            <div class="field right floated">
                <button class="ui button basic primary corida-set-button" id="riskb_${this.trade.id}">Set</button>
            </div>`).appendTo($right);
            $tune.find('.tunespeed button').on('click',function(){
                const s = $(this).data('value');
                that.setTuneSpeed(s);
            });
            $tune.find(`#onclose_${trade.id} input, #riskon_${trade.id}`).on('change',function(){
                that.handleChange();
            });
        }
        skymechanics.reload();
    }
}

export class Corrida{
    constructor(chart,trade){
        this.tuned = false;
        this.chart = chart;
        this.trade = trade;
        this.corrida = null

        this.render = this.render.bind(this);
        this.read = this.read.bind(this);
        this.send = this.send.bind(this);
        this.sendRaw = this.sendRaw.bind(this);
        this.set = this.set.bind(this);
        this.data = this.data.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getTuneData = this.getTuneData.bind(this);
        $(`#riskb_${this.trade.trade.id}`).on('click', this.handleClick);
        $(`#riskon_${this.trade.trade.id}`).on('change', this.handleChange);
        this.TUNE_SPEED = {
            slow:   0.0001,
            normal: 0.0005,
            fast:   0.0012
        };
        this.smoothing = this.TUNE_SPEED.normal;
    }
    handleClick(){
        this.data()
    }
    handleChange(){
        const trade = this.trade.trade;
        console.debug('riskon changed');
        // $(`.corida-set-button_${trade.id}`).removeClass('basic');
        if($(`#riskon_${trade.id}`).checkbox('is checked')){
            $(`#smoothing_${trade.id},#risk_high_${trade.id},#risk_low_${trade.id}`).closest('.ui.input').removeClass('disabled');
            $(`#risk_high_${trade.id}:not(.initialized)`).val(parseFloat(trade.open_price)).addClass('initialized');
            const rr = crm.deal.dataRange?crm.deal.dataRange:SUPPORT_LINE_RANGE;
            this.chart.setSupport(trade.open_price,rr,this.render);
            socket.emit('subscribe', {subscriptId: this.trade.user_id});
            // this.getTuneData().then( (values) => {
            //     const tuneData = {
            //         label: __("crm.trade.tuning"),
            //         data: values,
            //         borderColor: 'rgba(30,37,41,.8)',
            //     };
            //     // if(tuneData.length) {
            //         console.debug('tuned data',tuneData);
            //         socket.emit('subscribe', {subscriptId: this.trade.user_id});
            //         this.chart.addDataset(tuneData);
            //     // }
            // }).catch((x)=>{console.warn('getTuneData:',x)});
        }
        else{
            $(`#smoothing_${trade.id},#risk_high_${trade.id},#risk_low_${trade.id}`).closest('.ui.input').addClass('disabled');
            // socket.emit('unsubscribe', {subscriptId: this.trade.user_id});
            this.chart.removeSupports();
            // this.chart.removeDataset(1);

        }
    }
    render(level,r){
        const trade = this.trade.trade;
        var oldlevel = $(`#risk_high_${trade.id}`).val();
        if(oldlevel!=level)$(`#riskb_${trade.id}`).removeClass('basic');
        $(`#risk_high_${trade.id}`).val(level);
        $(`#risk_low_${trade.id}`).val(r);

        const open = parseFloat(trade.close_price)
        const $aprox = $(`#predictions_${trade.id}.predictions tbody`);

        // console.debug('render',$aprox.find('tr:eq(0) td:eq(1) strong'),open);
        if( isNaN(open) )return;
        const res = this.trade.calculate(level);

        const speedy = parseFloat( $(`#corrida_smoothing_${trade.id}`).val());
        const duration = parseInt(10*Math.abs(1 - open/level)/speedy);

        console.debug(duration)

        $aprox.find('tr:eq(0) td:eq(1) strong').html(level.toFixed(5));
        $aprox.find('tr:eq(1) td:eq(1) strong').html(res.profit.digit(2));
        $aprox.find('tr:eq(1) td:eq(1) small').html(res.percent.percent());
        $aprox.find('tr:eq(2) td:eq(1)').prop('value',duration);
        skymechanics.countdown($aprox.find('tr:eq(2) td:eq(1)'));
    }
    read(tuned=null) {
        const trade = this.trade.trade;
        const that = this;
        this.getTuneData().then( (values) => {
            const tuneData = {
                label: __("crm.trade.tuning"),
                data: values,
                borderColor: 'rgba(30,37,41,.8)',
            };
            console.debug('tuned data',tuneData);
            if(values.length) {
                socket.emit('subscribe', {subscriptId: this.trade.user_id});
                this.chart.addDataset(tuneData);
            }
        }).catch((x)=>{console.warn('getTuneData:',x)});
        $.ajax({
            url: '/json/user/meta',
            dataType: "json",
            data: {
                meta_name: 'user_tune_corida_#' + trade.instrument_id,
                user_id: trade.user_id
            }
            ,success(d, x, s) {
                if (typeof(d.meta_value) != "undefined"){
                    that.set(JSON.parse(d.meta_value));
                    if(tuned && typeof(tuned) == 'function' )tuned(that.tuned);
                }
                else {
                    that.set({
                        riskon: 0
                    });
                }
            }
        });
    }
    send(dd) {
        const trade = this.trade.trade;
        const that = this;
        $.ajax({
            url: '/json/user/meta',
            dataType: "json",
            data: {
                meta_name: 'user_tune_corida_#' + trade.instrument_id,
                user_id: trade.user_id
            }
            ,success(d, x, s) {
                if (typeof(d.meta_value) != "undefined"){
                    const corr = JSON.parse(d.meta_value);
                    dd.gone = corr.gone?corr.gone:0;
                    dd.deal_id = (corr.deal_id)?corr.deal_id:trade.id;
                    console.debug('update corrida',corr,dd);
                    that.sendRaw(dd);
                }
                else {
                    dd.gone = 0;
                    dd.deal_id = trade.id;
                    console.debug('set corrida',dd);
                    that.sendRaw(dd);
                }
            }
        });
    }
    sendRaw(dd) {
        const trade = this.trade.trade;
        const that = this;

        $.ajax({
            url: '/json/user/meta',
            dataType: "json",
            data: {
                meta_name: 'user_tune_corida_#' + trade.instrument_id,
                meta_value: JSON.stringify(dd),
                user_id: trade.user_id
            }
            ,success(d, x, s) {
                if (typeof(d.meta_value) != "undefined")
                    that.set(JSON.parse(d.meta_value));
                else {
                    that.set({
                        riskon: 0
                    });
                }
            }
        });
    }
    set(c) {
        const trade = this.trade.trade;
        var gp = (c.high + "").split("."),
            precision = (gp[1] != undefined) ? gp[1].length : 1;
        precision = (precision > 5) ? 5 : precision;
        $(`#risk_high_${trade.id}`).val(c.high);
        $(`#risk_low_${trade.id}`).val(c.low);
        if(c.smoothing && this.trade){
            this.trade.setTuneSpeed(parseFloat(c.smoothing));
        }
        if(c.low && this.trade){
            const val = parseFloat(c.low);
            let speedName = 'normal';
            console.debug('button speed tune settings',this.TUNE_SPEED,val);
            for(let i in this.TUNE_SPEED){
                console.debug('button speed',this.TUNE_SPEED,val,i)
                if(this.TUNE_SPEED[i] == val) {
                    speedName = i;
                    break;
                }
            }
            this.trade.setTuneSpeed(speedName);
        }
        if (c.riskon == '1') {
            this.tuned = true;
            $(`#risk_high_${trade.id}`).addClass('initialized');
            $(`#smoothing,#risk_high,#risk_low_${trade.id}`).closest('.ui.input').removeClass('disabled');
            if(c.onclose && c.onclose === 1 ){
                $(`#onclose_${trade.id}`).checkbox('set checked');
            }
            const range = parseFloat(c.low);
            const level = parseFloat(c.high);
            // range = level*range/100;
            // crm.deal.TUNE_SPEED[s]
            const rr = crm.deal.dataRange?crm.deal.dataRange:SUPPORT_LINE_RANGE;
            this.chart.setSupport(level,rr,this.render);
            this.render(level,rr);
            $(`#riskon_${trade.id}`).checkbox('set checked');
            $(`#riskb_${trade.id}`).addClass('basic');
        } else {
            this.chart.removeSupports();
            $(`#smoothing,#risk_high,#risk_low_${trade.id}`).closest('.ui.input').addClass('disabled')
            $(`#riskon_${trade.id}`).checkbox('set unchecked');
        }
        crm.deal.touch();
    }
    change(max, min) {
        // $('#risk_high').val(max);
        // $('#risk_low').val(min);
        //
        // if (parseInt($('#riskon').val()) == 1) {
        //     this.send({
        //         riskon: 1,
        //         high: max,
        //         low: 0.5,
        //         onclose:$('#onclose').is('checked')?1:0
        //     });
        // }
    }
    data() {
        const trade = this.trade.trade;
        var max =parseFloat( $(`#risk_high_${trade.id}`).val()),
            min = parseFloat($(`#risk_low_${trade.id}`).val()),
            ro = $(`#riskon_${trade.id}`).checkbox('is checked')?1:0;

        $('[data-name=onclose]').prop('disabled',false);
        $(`#riskb_${trade.id}`).addClass('basic');
        this.trade.tuned = (ro==1);

        // const rr = crm.deal.dataRange?crm.deal.dataRange:SUPPORT_LINE_RANGE;
        const rr= $(`#corrida_smoothing_${trade.id}`).val();
        const cd = {
            riskon: ro,
            high: max,
            low: rr,
            onclose:$(`#onclose_${trade.id}`).checkbox('is checked')?1:0,
            deal_id:this.trade.id
        };
        console.debug('new corrida val',cd);
        this.send(cd);
    }
    getTuneData(){
        const trade = this.trade.trade;
        const time = (new Date()).getTime()-360000
        const endpoint = `/data/histominute/1?instrument_id=${trade.instrument_id}&user_id=${trade.user_id}&date_from=${time}&limit=16`;
        return new Promise( (resolve,reject) => {
            $.ajax({
                url: endpoint,
                success: (d) => {
                    let data = [];
                    d.map( (row,i) => {
                        const dt = new Date(row.time * 1000);
                        const level = parseFloat(row.close);
                        data.push({ x: dt, y: level });
                    })
                    resolve(data);
                },
                error: (x) => {
                    reject(x);
                }
            })
        });
    }
}
