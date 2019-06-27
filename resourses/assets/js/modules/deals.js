import {SMChart, SUPPORT_LINE_RANGE} from './chart';
import { Trade } from './trade/trade';
export class Corrida{
    constructor(chart,trade){
        this.chart = chart;
        this.trade = trade;
        this.render = this.render.bind(this);
        this.read = this.read.bind(this);
        this.send = this.send.bind(this);
        this.set = this.set.bind(this);
        this.data = this.data.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getTuneData = this.getTuneData.bind(this);
        $(`#riskb_${this.trade.id}`).on('click', this.handleClick);
        $(`#riskon_${this.trade.id}`).on('change', this.handleChange);

    }
    handleClick(){
        this.data()
    }
    handleChange(){
        console.debug('riskon changed');
        // $(`.corida-set-button_${this.trade.id}`).removeClass('basic');
        if($(`#riskon_${this.trade.id}`).checkbox('is checked')){
            $(`#smoothing_${this.trade.id},#risk_high_${this.trade.id},#risk_low_${this.trade.id}`).closest('.ui.input').removeClass('disabled');
            $(`#risk_high_${this.trade.id}:not(.initialized)`).val(parseFloat(this.trade.open_price)).addClass('initialized');
            const rr = crm.deal.dataRange?crm.deal.dataRange:SUPPORT_LINE_RANGE;
            this.chart.setSupport(this.trade.open_price,rr,this.render);

            this.getTuneData().then( (values) => {
                socket.emit('subscribe', {subscriptId: this.trade.user_id});
                const tuneData = {
                    label: "tuning",
                    data: values,
                    borderColor: 'rgba(30,37,41,.8)',
                };
                this.chart.addDataset(tuneData);
            }).catch((x)=>{console.warn('getTuneData:',x)});
        }
        else{
            $(`#smoothing_${this.trade.id},#risk_high_${this.trade.id},#risk_low_${this.trade.id}`).closest('.ui.input').addClass('disabled');
            socket.emit('unsubscribe', {subscriptId: this.trade.user_id});
            this.chart.removeSupports();
            this.chart.removeDataset(1);

        }
    }
    render(level,r){
        var oldlevel = $(`#risk_high_${this.trade.id}`).val();
        if(oldlevel!=level)$(`riskb_${this.trade.id}`).removeClass('basic');
        $(`#risk_high_${this.trade.id}`).val(level);
        $(`#risk_low_${this.trade.id}`).val(r);

        const open = parseFloat(this.trade.close_price)
        const $aprox = $(`#predictions_${this.trade.id}.predictions tbody`);

        if( isNaN(open) )return;
        const res = crm.deal.calculate(this.trade,level);
        const duration = parseInt(Math.abs(1 - open/level)/0.0001);

        $aprox.find('tr:eq(0) td:eq(1) strong').html(level.toFixed(5));
        $aprox.find('tr:eq(1) td:eq(1) strong').html(res.profit.currency('T'));
        $aprox.find('tr:eq(1) td:eq(1) small').html(res.percent.toFixed(2)+'%');
        $aprox.find('tr:eq(2) td:eq(1)').prop('value',duration);
        skymechanics.countdown($aprox.find('tr:eq(2) td:eq(1)'));
    }
    read() {
        const that = this;
        $.ajax({
            url: '/json/user/meta',
            dataType: "json",
            data: {
                meta_name: 'user_tune_corida_#' + that.trade.instrument_id,
                user_id: that.trade.user_id
            }
            ,success(d, x, s) {
                if (typeof(d.meta_value) != "undefined"){
                    that.set(JSON.parse(d.meta_value));
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
        const that = this;
        $.ajax({
            url: '/json/user/meta',
            dataType: "json",
            data: {
                meta_name: 'user_tune_corida_#' + that.trade.instrument_id,
                meta_value: JSON.stringify(dd),
                user_id: that.trade.user_id
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
        var gp = (c.high + "").split("."),
            precision = (gp[1] != undefined) ? gp[1].length : 1;
        precision = (precision > 5) ? 5 : precision;
        $(`#risk_high_${this.trade.id}`).val(c.high);
        $(`#risk_low_${this.trade.id}`).val(c.low);
        if(c.smoothing && setTuneSpeed){
            setTuneSpeed(parseFloat(c.smoothing));
        }
        if (c.riskon == '1') {
            $(`#risk_high_${this.trade.id}`).addClass('initialized');
            $(`#smoothing,#risk_high,#risk_low_${this.trade.id}`).closest('.ui.input').removeClass('disabled');
            if(c.onclose && c.onclose === 1 ){
                $(`#onclose_${this.trade.id}`).checkbox('set checked');
            }
            var range = parseFloat(c.low),level = parseFloat(c.high);
            range = level*range/100;
            this.chart.setSupport(level,range,this.render);
            this.render(level,range);
            $(`#riskon_${this.trade.id}`).checkbox('set checked');
            $(`riskb_${this.trade.id}`).addClass('basic');
        } else {
            this.chart.removeSupports();
            $(`#smoothing,#risk_high,#risk_low_${this.trade.id}`).closest('.ui.input').addClass('disabled')
            $(`#riskon_${this.trade.id}`).checkbox('set unchecked');
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
        var max =parseFloat( $(`#risk_high_${this.trade.id}`).val()),
            min = parseFloat($(`#risk_low_${this.trade.id}`).val()),
            ro = $(`#riskon_${this.trade.id}`).checkbox('is checked')?1:0;
        // console.debug(ro,max,min);
        const rr = crm.deal.dataRange?crm.deal.dataRange:SUPPORT_LINE_RANGE;
        $('[data-name=onclose]').prop('disabled',false);
        $(`riskb_${this.trade.id}`).addClass('basic');
        this.send({
            riskon: ro,
            high: max,
            low: rr,
            onclose:$(`#onclose_${this.trade.id}`).checkbox('is checked')?1:0,
            deal_id:this.trade.id
        });
    }
    getTuneData(){
        const time = (new Date()).getTime()-360000
        const endpoint = `/data/histominute/1?instrument_id=${this.trade.instrument_id}&user_id=${this.trade.user_id}&date_from=${time}&limit=16`;
        return new Promise( (resolve,reject) => {
            $.ajax({
                url: endpoint,
                success: (d) => {
                    let data = [];
                    d.reverse().map( (row,i) => {
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
export class Deals{
    constructor(){
        this.current=undefined
        this._current=undefined
        this.corrida = null;
        this.tune = new Tune();
        this.smchart = null;
        this.container = null;
        this.dataRange=SUPPORT_LINE_RANGE;
        this.TUNE_SPEED = {
            slow:   0.0001,
            normal: 0.0005,
            fast:   0.0012
        };
        this._data={};
        this.onPrice = this.onPrice.bind(this);
        this.chart = this.chart.bind(this);
        this.list = this.list.bind(this);
        this.info = this.info.bind(this);
    }
    touch(){
        skymechanics.touch('deal-list');
    }
    onClose(){
        skymechanics.touch('deal-list');
        $('.ui.modal').modal('hide');
    }
    showList(){
        $('.popup.deals').fadeIn(animationTime?animationTime:256);
        $('body').addClass('active');
    }
    terminate(id, price = false){
        let params = {
            deal_id:id
        }
        if(price!==false)params['current_price'] = price;
        $.ajax({
            url:`/deal/delete`,
            data:params,
            success: (d,x,s) => {
                crm.deal.onClose();
            }
        });
    }
    list (container,d,x,s){
        // console.debug('deals list '+d.data.length);
        container.html('');
        for(var i in d.data){
            let row=d.data[i],s = '<tr data-class="deal" data-id="'+row.id+'" class="'+((row.account && row.account.type=='real')?'positive':'')+'">',
                tradeBalance = parseFloat(row.profit)+((row.type=='forex')?0:parseFloat(row.amount)),
                type = (row.type=='forex')?'fx':'sm';
            this._data[row.id]=row;
            s+='<td class="center aligned">'+dateFormat(row.created_at)+'</td>';
            s+='<td><a href="javascript:crm.deal.info('+row.id+')">#'+row.id+'&nbsp;'+row.instrument.symbol+'</a><br><small>'+row.status.name+'</small><br/><small><strong>'+type+'</strong></small></td>';
            s+='<td>#'+row.user.id
                +' <a onclick="crm.user.card('+row.user.id+')">'+row.user.name+' '+row.user.surname+'</a>'
                +'<br><small><i class="icon mail"></i>'+row.user.email+'</small>'
                +'<br><small><i class="icon phone"></i>'+row.user.phone+'</small>'
                +'<br><small><i class="icon world"></i>'+crm.user.getMeta(row.user.meta,'country')+'</small>'
                +'</td>';

            s+=(row.user.manager)?'<td><a onclick="crm.user.card('+row.user.manager.id+')" data-class="manager" data-id="'+row.user.manager.id+'">'+row.user.manager.name+' '+row.user.manager.surname+'</a></td>':'<td></td>';
            s+='<td>'
                +'<a href="javascript:crm.instrument.edit('+row.instrument_id+')" data-class="instrument" data-id="'+row.instrument_id+'">'+row.instrument.title+'<br><small>'+row.instrument.source.name+'</small></a>'
                +'<br><small><strong>'+((row.account && row.account.type=='real')?'Live account':'Demo account')+'</strong></small>'
                +'</td>';

            s+='<td class="right aligned">'
                +'<i class="big arrow circle outline color '+((row.direction==-1)?'down red':'up green')+' icon"></i>'
                +parseFloat(row.invested).currency('T')+'<span class="description">x'+row.multiplier+'</span></div>'
                +'<br/><small>fee: '+parseFloat(row.fee).currency('T')+'</small>'
                +'<br><small>SL:'+row.stop_low+'<br>TP:'+row.stop_high+'</small>'
                +'</td>';
            s+='<td class="right aligned"><strong>'+tradeBalance.currency('T')+'</strong><br/><small>O:'+row.open_price+'</small><br/><small>C:'+crm.instrument.prices.element(row.close_price)+'</small></td>';
            let dealAction = (user.rights_id>7 && row.status_id<100)
                ?`<button class="ui red icon button" onclick="crm.deal.terminate(${row.id})"><i class="ui close icon"></i></button>`:'';

            s+='<td>'+((row.status_id != 20 && row.is_tune=='Y')?'<i class="checkmark icon">':'&nbsp;')+dealAction+'</td>';

            // s+='<td><a href="#" onclick="crm.deal.edit('+row.id+')" id="edit_deal">{{ trans('messages.edit') }}</a><a href="#" onclick="crm.deal.info('+row.id+')" class="edit">{{ trans('messages.info') }}</a></td>';
            // s+='<td><a href="#" onclick="crm.deal.info('+row.id+')" class="edit">{{ trans('messages.info') }}</a></td>';
            s+='</tr>'
            container.append(s);
        }
        page.paginate(d,'deal-list',container);
        $('.ui.table.sortable:not(.assigned)').addClass('assigned').tablesort();
        $('[data-name=search]:visible').each(function(){
            const $that=$(this),keyword=$that.val();
            $("table:visible tbody tr td").unmark({
                done() {
                    $("table:visible tbody tr td").mark(keyword, {});
                }
            });
        })
    }
    info(id){
        if(!arguments.length)return;
        var id = arguments[0];
        const that = this;
        this._current = id;
        if(that._data[id]){cardContainer.append(new Trade(that._data[id]));return;}
        else{
            $.ajax({
                url:"/json/deal/"+id+'/info',
                dataType: "json",
                success(d,x,s){
                    that._data[id]=d.data[0];
                    cardContainer.append(new Trade(that._data[id]));
                }
            });
            return;
        }
        if(id==undefined)return;
        const $dash = page.modalPreloaderStart(`deal_${id}_dashboard`);
        $.ajax({
            url:"/html/deal/"+id+'/info',
            dataType: "html",
            success(d,x,s){
                page.modalPreloaderEnd($dash,d,true);
                window.SUBSCRIBE_PRICE = true;
            }
        });
    }
    calculate(trade,price){
        var op = parseFloat(trade.open_price),
            da = parseFloat(trade.amount),
            df = parseFloat(trade.fee),
            dm = parseInt(trade.multiplier),
            dd = parseInt(trade.direction),
            p=((price/op)-1)*dd*dm*da;

        return {
            profit:p+da,
            percent:100*((p-df)/(da+df))
        }
    }
    onPrice(price){
        if(this.smchart && this.current && this.current.instrument_id == price.instrument_id){
            const time = new Date(price.time*1000);
            const n = parseFloat(price.price);
            const trade = this.current;
            const $f = this.container.parents('.ui.modal').find( '.current');
            const $o = this.container.parents('.ui.modal').find('.profit');
            const $p = this.container.parents('.ui.modal').find( '.percent');
            const last = parseFloat($f.text().replace( /[\s,]/g, ''));
            const pd = (n > last) ? 'green' : 'red';
            this.container.parents('.ui.active.loader').removeClass( 'active loader' );
            // console.debug('chart updated',n,trade);
            const calc = crm.deal.calculate(trade, n);
            $p.parents('td').removeClass( 'green red changed').addClass(((calc.profit > 0) ? 'green' : 'red') + ' changed' );
            $p.html(calc.percent.currency('')+'%');
            $o.html(calc.profit.currency(''));
            $f.removeClass('green red changed').addClass(pd + ' changed').html(n.currency( '', 5));
            this.smchart.set( time, n,price.tune?1:0 );
        }
    }
    chart($c, d) {
        var data = [],
            labels = [];
        d = d.reverse();
        let level = 0;
        let range = 0;
        let minLevel = false;
        let maxLevel = false;
        let pairId = null;
        this.container = $c;
        const trade = this._data[this._current];
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
        this.dataRange = this.dataRange/10;
        console.debug('abg range ohlc/level',this.dataRange);
        this.onPrice({ // set current price
            instrument_id: pairId,
            price: level
        });
        this.smchart = new SMChart(pairId, {
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
        this.corrida = new Corrida(this.smchart,trade);
        this.corrida.read();
    }
}
class Tune {
    constructor(){
        this.raw= {}
    }

    read() {
        $.ajax({
            url: '/json/user/meta',
            dataType: "json",
            data: {
                meta_name: 'user_tune_#' + deal.instrument.id,
                user_id: deal.user.id
            }
            ,success(d, x, s) {
                if (typeof(d.meta_value) != "undefined")
                    deal.tune.setData(JSON.parse(d.meta_value));
            }
        });
    }
    send() {
        $.ajax({
            url: '/json/user/meta',
            dataType: "json",
            data: {
                meta_name: 'user_tune_#' + deal.instrument.id,
                meta_value: deal.tune.makeData(),
                user_id: deal.user.id
            }
        });
    }
    real() {
        var currentProfit = parseFloat($('#deal_{{$deal->id}}_profit').text());
        deal.tune.setData({
            profit: 0, //parseFloat($('#deal_{{$deal->id}}_profit').text()),
            flying: $("#tune_{{$deal->id}} #flying").val()
        });
        // deal.tune.send();
    }
    change() {
        deal.tune.send();
    }
}

export default Deals;
