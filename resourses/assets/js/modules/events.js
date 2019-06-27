export class Events {
    constructor(){

        this.container = $('#dashboard_events');
        // const $counter = this.container.find('.count');
        // $counter.prop('number',parseInt($counter.text()));
        this.render=this.render.bind(this);
        this.dashboard=this.dashboard.bind(this);
        this.touch=this.touch.bind(this);
        this.close=this.close.bind(this);
        this.closeAll=this.closeAll.bind(this);
        this.view=this.view.bind(this);
        this.init=this.init.bind(this);
        this.flushEvent=this.flushEvent.bind(this);
        // $('.events').popup({
        //     inline      : true,
        //     hoverable   : true,
        //     position    : 'bottom right',
        //     preserve    : true,
        //     context     : $('.top.fixed.menu'),
        //     delay       : {
        //         show: 300,
        //         hide: 800
        //     }
        // });
    }
    init(d){
        this.data=d;
        this.render();
    }
    indexOf(id,res = undefined){
        res = undefined;
        for(let i=0;i<this.data.length;++i){
            const item = this.data[i];
            res = item;
            if(item.id==id)return i;
        }
        return -1;
    }
    append(e){
        this.container.removeClass('yellow changed');
        this.data.push(e);
        this.render().then(()=>{this.container.addClass('yellow changed');});
    }
    touch() {
        cf.touch('dashboard-events');
    }
    close(id,status="closed") {
        const that = this;
        const $counter = this.container.find('.count');
        let count = parseInt($counter.text());
        count = isNaN(count)?'99+':count;
        $.ajax({
            url: `/user/event/${id}/update`,
            data: {status: `${status}`},
            success: function(d) {
                $(`#event-${id}`).fadeOut();
                $counter.text(--count);//
                that.flushEvent(id);
                if(that.data && that.data.length==0){
                    that.container.find('.count').fadeOut()
                    that.container.find('.menu').fadeOut().html('')
                }
            }
        })
    }
    closeAll() {
        const that = this;
        this.data.map( (item) => { that.close(item.id); });
        this.data = [];
    }
    view(id) {
        this.close(id,"watched");
    }
    flushEvent(id){
        let i =0;
        let found = false;
        for(i=0;i<this.data.length;++i){
            const item = this.data[i];
            if(item.id==id) {found=true;break;}
        }
        if(found)this.data.slice(i,1);
    }
    render(){
        return new Promise( (resolve,reject) => {
            try{
                if(!this.data.length) return;
                let $c = this.container.find('.menu');
                let eventLength = 0;
                const that = this;
                $c.html('');
                $('<a class="icon item"><i class="ui close icon"></i>Close all</a>').appendTo($c).on('click',this.closeAll);
                $c = $('<div class="ui divided items"></div>').appendTo($c);
                let needTouches = {
                    deal:0,
                    user:0,
                    merchant:0,
                    finance:0,
                };
                const ctime = (new Date()).getTime();
                this.data.map((row,i)=>{
                    if(user.rights_id>=8 || user.childs.indexOf(row.user.parent_user_id)>-1 || user.childs.indexOf(row.user.affilate_id)>-1){
                        eventLength++;
                        const $itm = $(`<a class="item event" id="event-${row.id}"></a>`).appendTo($c);
                        let color = '';
                        let icon = 'blank';
                        let text='new';
                        let what = row.object_type+' '+row.type;
                        let func = ()=>{};
                        switch (row.object_type) {
                            case 'deal':
                                const pair = system.pairs.get(row.object.instrument_id);
                                what = `Trade #${row.object_id}`;
                                switch (row.type) {
                                    case 'close': what+=' closed';break;
                                    case 'new': what+=' opened';break;
                                    default:break;
                                }
                                let pairIcons = '';
                                if(currency.byId(pair.from_currency_id))pairIcons+=`<i class="ic ic_${currency.byId(pair.from_currency_id).code.toLowerCase()}"></i>`;
                                if(currency.byId(pair.to_currency_id))pairIcons+=`<i class=" ic ic_${currency.byId(pair.to_currency_id).code.toLowerCase()}"></i>`;
                                text = `${pairIcons}&nbsp;<strong>${pair.title}</strong> ${row.object.invested.dollars()} <sup>x${row.object.multiplier.integer()}</sup> `;
                                icon = 'industry';
                                func = () => {crm.deal.info(row.object_id); };
                                needTouches.deal=ctime;
                                // console.debug('trade changed need card touch',row,cardContainer,cardContainer.cards[`ctrade_${row.object_id}`]);
                                if(cardContainer && cardContainer.cards[`ctrade_${row.object_id}`]) {
                                    cardContainer.cards[`ctrade_${row.object_id}`].fresh(row.object);
                                    cardContainer.touch(`ctrade_${row.object_id}`);
                                }
                                // crm.deal.touch();
                                break;
                            case 'user':
                                what = `Customer #${row.object_id}`;
                                text = `${row.object.title}`
                                icon = 'user';
                                func = () => { crm.user.card(row.object_id); };
                                needTouches.user=ctime;
                                break;
                            case 'transaction':
                                what = 'Deposit request';
                                text = row.object.amount.dollars();
                                icon = 'dollar';
                                func = () => {page.show(this,'finance','transactions');};
                                needTouches.merchant=ctime;
                                break;
                            case 'invoice':
                                what = 'Deposit';
                                text = row.object.amount.dollars();
                                icon = 'dollar';
                                func = () => {page.show(this,'finance','transactions');};
                                // crm.merchant.touch();
                                needTouches.merchant=ctime;
                                break;
                            case 'withdrawal':
                                what = 'Withdrawal';
                                icon = 'money bill alternate';
                                text = row.object.amount.dollars();
                                func = () => {page.show(this,'finance','withdrawals');};
                                // crm.merchant.touch();
                                needTouches.merchant=ctime;
                                needTouches.finance=ctime;
                                break;
                        }
                        switch (row.type) {
                            case 'message':
                                what = __(`crm.new_message`);
                                text = `${(row.object&&row.object.message)?row.object.message:''}`
                                icon = 'letter';
                                func = () => {crm.user.card(row.user_id); };
                                break;
                            case 'kyc':
                                text = 'New document scan uploaded';
                                needTouches.user=ctime;
                                func = () => {crm.user.card(row.user_id); };
                                if(cardContainer && cardContainer.cards[`cuser_${row.object_id}`]) {
                                    cardContainer.cards[`cuser_${row.object_id}`].fresh(row.object);
                                    cardContainer.touch(`cuser_${row.object_id}`);
                                }
                                break;
                            case 'tuned':
                                text = 'tune reached level';
                                $itm.addClass('alarm');
                                break;
                        }
                        // $(`<div class="image"><i class="ui ${icon} huge icon"></i></div>`).appendTo($itm);
                        const $cnt = $(`<div class="middle aligned content"></div>`).appendTo($itm);
                        $(`<div class="header"><i class="ui ${icon} icon"></i>${what}</div>`).appendTo($cnt)
                        $(`<div class="description"><p>${text}</p><p><a href="javascript:crm.user.card(${row.user_id})">${row.user.title}</a></p></div>`).appendTo($cnt);
                        const $action = $(`<div class="extra"></div>`).appendTo($cnt);
                        $(`<button class="ui icon basic button"><i class="ui eye icon"></i>Hide</button>`).appendTo($action).on('click',()=>{that.view(row.id);});
                        $(`<button class="ui primary basic button">View</button>`).appendTo($action).on('click',()=>{that.view(row.id);func();});
                    }
                });
                if(eventLength){
                    $c.fadeIn();
                    this.container.fadeIn();
                    if(eventLength>=100)eventLength='99+';
                    this.container.find('.count').fadeIn();
                    this.container.find('.count').html(eventLength);//animateNumber({number:(this.data.length),numberStep:function(now,tween){$(tween.elem).html(now);}}).prop('number',this.data.length);
                }
                else $c.fadeOut();
                Object.keys(needTouches).map( (k,i) => {
                    // if(crm[k] && crm[k].touch)crm[k].touch();
                })
                resolve();
            }
            catch(e){
                reject(e);
            }
        });
    }
    dashboard($cont, d) {
        var counts = 0,
            errors = 0,
            $c = $cont.find('.menu');
        crm.events.data = d;
        console.debug(d);
        $c.html('');
        $c.append('<a class="item" onclick="crm.events.closeAll(this)">Close all</a>');
        for (var i in d) {
            let row = d[i],
                type = row.type,
                what = row.object_type;
            if (row.user_id == system.user.id) continue;
            counts++;
            let $card = $(`<div class="ui card" data-id="${row.id}"></div>`).appendTo($c);
            let $data = $('<div class="content ui link"></div>').appendTo($card);
            let $actions = $('<div class="extra content"></div>').appendTo($card);
            switch (row.object_type) {
                case 'deal':
                    what = 'Trade';
                    break;
                case 'user':
                    what = 'Customer';
                    break;
                case 'invoice':
                    what = 'Deposit';
                    break;
                case 'withdrawal':
                    what = 'Withdrawal';
                    break;
            }
            switch (row.type) {
                case 'kyc':
                    type = 'New document scan uploaded';
                    break;
                case 'tuned':
                    type = 'tune reached level';
                    break;
            }
            $actions = $('<div class="meta right aligned"></div>').appendTo($actions);
            var $viewBtn = $('<button class="ui small basic button" onclick="crm.events.view(this,' +row.id + ')"><i class="icon eye"></i>View</button>').appendTo($actions);
            $actions.append('<button class="ui black small button" onclick="crm.events.close(this,' +row.id + ')">Close</button>');
            $data.append('<div class="right floated right aligned">' +dateFormat(row.created_at, true, 'simple') + '</div>');
            $data.append('<div class="header">' + what + ' <small>' + type +'</small></div>')
            $data.append('<div class="meta"><i class="icon user"></i>' +row.user.name + ' ' + row.user.surname + '</div>');
            if (row.object_type == 'deal' && row.object) {
                var pair = system.pairs.get(row.object.instrument_id),
                    object_id = row.object_id,
                    pnl = (((parseFloat(row.object.profit) + parseFloat(row.object.amount)) / parseFloat(row.object.invested)) -1) * 100;
                $data.append('<div class="meta ' + ((pnl > 0) ? 'red' :'green') + ' color">' + '#<small>' + row.object.id + '</small><i class="ic ic_' +pair.from.code.toLowerCase() +'"></i><i style="margin-left:-10px;" class="ic ic_' +pair.to.code.toLowerCase() + '"></i><strong>' + pair.title +
                    '</strong>' +
                    '<br/><br/><span class="">Profit: <b>' + (row.object
                        .profit + row.object.amount).currency('T') +
                    '</b> P&L: ' + pnl.toFixed(2) + '%</span>'+ '</div>');
                $viewBtn.on('click', function() {
                    crm.deal.info(object_id)
                });
            } else if (row.object_type == 'user') {
                $viewBtn.on('click', function() {
                    crm.user.card(row.object_id)
                });
            } else if (row.object_type == 'error') {
                $viewBtn.hide();
                $card.addClass('red negotive');
                $data.addClass('red negotive');
                $actions.addClass('red negotive');
                errors++;
            } else if (row.object_type == 'invoice') {
                $data.append('<div class="meta">' + '#<small>' + row.object
                    .id + '</small>' + '<br/><br/>Amount: <strong>' +
                    row.object.amount.currency('T') + '</strong>' +
                    '</div>');
                $viewBtn.on('click', function() {
                    crm.user.card(row.object_id, 'finance')
                });
            } else if (row.object_type == 'withdrawal') {
                $data.append('<div class="meta">' + '#<small>' + row.object
                    .id + '</small>' + '<br/><br/>Amount: <strong>' +
                    row.object.amount.currency('T') + '</strong>' +
                    '</div>');
                $viewBtn.on('click', function() {
                    crm.user.card(row.object_id, 'finance')
                });
            }


            // else $data.on('click',function(){crm.user.card(row.user.id,'trades')});
        }
        $cont.find('div:eq(0)').html((counts > 100) ? '99+' : counts).removeClass(
            "red olive").addClass((errors) ? 'red' : 'olive');
        if (counts) {
            $cont.fadeIn();
        } else {
            $cont.fadeOut();
            $cont.find('.menu').html('');
        }
    }
    dashboardPopup($c, d) {
        let counts = 0;
        let errors = 0;
        let $cont = $('#dashboard_events');
        crm.events.data = d;
        $c.html('');
        let $containter = $('<div class="ui container five column relaxed divided grid"></div>').appendTo($c);

        let $customers = $('<div class="column"></div>').appendTo($containter);
        let $deposits = $('<div class="column"></div>').appendTo($containter);
        let $withdrawals = $('<div class="column"></div>').appendTo($containter);
        let $trades = $('<div class="column"></div>').appendTo($containter);
        let $errors = $('<div class="column"></div>').appendTo($containter);

        let $customersHead = $('<h4 class="ui header"><i class="ui user icon"></i>Customers</h4>').appendTo($customers);
        let $depositsHead = $('<h4 class="ui header"><i class="ui dollar icon"></i>Deposits</h4>').appendTo($deposits);

        $customers = $('<div class="ui divided items"></div>').appendTo($customers);



        // $c.append('<a class="item" onclick="crm.events.closeAll(this)">Close all</a>');
        crm.events.data.map( (row,i) => {
            const type = row.type;
            const what = row.object_type;
            // if (row.user_id == system.user.id) continue;
            counts++;
            let $item = $('<div class="ui tiny item"></item>');
            if(what == 'user'){
                $item.appendTo($customers);
                $item.append(`<div class="content">
                        <div class="image"></div>
                        <div class="small header">${type} Customer</div>
                        <div class="ui description"><i class="ui user icon"></i>${row.user.title}</div>
                    </div>`);
                $item.on('click',function(){ crm.user.card(row.object_id) });
            }
            // let $card = $('<div class="ui card" data-id="' + row.id +'"></div>').appendTo($c),
            //     $data = $('<div class="content ui link"></div>').appendTo($card),
            //     $actions = $('<div class="extra content"></div>').appendTo($card);
            // switch (row.object_type) {
            //     case 'deal':
            //         what = 'Trade';
            //         break;
            //     case 'user':
            //         what = 'Customer';
            //         break;
            //     case 'invoice':
            //         what = 'Deposit';
            //         break;
            //     case 'withdrawal':
            //         what = 'Withdrawal';
            //         break;
            // }
            // switch (row.type) {
            //     case 'kyc':
            //         type = 'New document scan uploaded';
            //         break;
            //     case 'tuned':
            //         type = 'tune reached level';
            //         break;
            // }
            // $actions = $('<div class="meta right aligned"></div>').appendTo($actions);
            // var $viewBtn = $('<button class="ui small basic button" onclick="crm.events.view(this,' +row.id + ')"><i class="icon eye"></i>View</button>').appendTo($actions);
            // $actions.append('<button class="ui black small button" onclick="crm.events.close(this,' +row.id + ')">Close</button>');
            // $data.append('<div class="right floated right aligned">' +dateFormat(row.created_at, true, 'simple') + '</div>');
            // $data.append('<div class="header">' + what + ' <small>' + type +'</small></div>')
            // $data.append('<div class="meta"><i class="icon user"></i>' +row.user.name + ' ' + row.user.surname + '</div>');
            // if (row.object_type == 'deal' && row.object) {
            //     var pair = system.pairs.get(row.object.instrument_id),
            //         object_id = row.object_id,
            //         pnl = (((parseFloat(row.object.profit) + parseFloat(row.object.amount)) / parseFloat(row.object.invested)) -1) * 100;
            //     $data.append('<div class="meta ' + ((pnl > 0) ? 'red' :'green') + ' color">' + '#<small>' + row.object.id + '</small><i class="ic ic_' +pair.from.code.toLowerCase() +'"></i><i style="margin-left:-10px;" class="ic ic_' +pair.to.code.toLowerCase() + '"></i><strong>' + pair.title +
            //         '</strong>' +
            //         '<br/><br/><span class="">Profit: <b>' + (row.object
            //             .profit + row.object.amount).currency('T') +
            //         '</b> P&L: ' + pnl.toFixed(2) + '%</span>'
            //
            //         + '</div>');
            //     $viewBtn.on('click', function() {
            //         crm.deal.info(object_id)
            //     });
            // } else if (row.object_type == 'user') {
            //     $viewBtn.on('click', function() {crm.user.card(row.object_id)});
            // } else if (row.object_type == 'error') {
            //     $viewBtn.hide();
            //     $card.addClass('red negotive');
            //     $data.addClass('red negotive');
            //     $actions.addClass('red negotive');
            //     errors++;
            // } else if (row.object_type == 'invoice') {
            //     $data.append('<div class="meta">' + '#<small>' + row.object.id + '</small>' + '<br/><br/>Amount: <strong>' +row.object.amount.currency('T') + '</strong>' +'</div>');
            //     $viewBtn.on('click', function() {crm.user.card(row.object_id, 'finance')});
            // } else if (row.object_type == 'withdrawal') {
            //     $data.append('<div class="meta">' + '#<small>' + row.object.id + '</small>' + '<br/><br/>Amount: <strong>' +row.object.amount.currency('T') + '</strong>' +'</div>');
            //     $viewBtn.on('click', function() {crm.user.card(row.object_id, 'finance') });
            // }
            // else $data.on('click',function(){crm.user.card(row.user.id,'trades')});
        });

        $cont.find('div:eq(0)').html((counts > 100) ? '99+' : counts).removeClass("red olive").addClass((errors) ? 'red' : 'olive');
        if (counts) {
            $cont.fadeIn();
        }
        else {
            $cont.fadeOut();
        }
    }
};
Events.prototype.data = [];
