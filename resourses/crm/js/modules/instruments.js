const isPairInList=function(pair,pairs){
    for(let i in pairs)if(pairs[i].id == pair.id)return true;
    return false;
};
export class Groups{
    constructor(){
        this.current = null;
        this.data = null;
        this.$c = null;
        this.list = this.list.bind(this);
        this.render = this.render.bind(this);
        this.add = this.add.bind(this);
        this.added = this.added.bind(this);
        this.edit = this.edit.bind(this);
        this.edited = this.edited.bind(this);
        this.link = this.link.bind(this);
        this.delete = this.delete.bind(this);
    }
    list($c,d){
        this.data = d;
        this.$c = $c;
        this.render();
    }
    render(){
        crm.instrument.groups.$c.html('');
        crm.instrument.groups.data.data.map((group,i) => {
            let $tr = $('<tr></tr>').appendTo(crm.instrument.groups.$c);
            $tr.append(`<td>${group.id}</td>`);
            $(`<td><a>${group.name}</a></td>`).appendTo($tr).on('click',function(){
                crm.instrument.groups.edit(group);
            });
            $tr.append(`<td class="right aligned">Trade fee: <strong>${group.commission.currency('%',2)}</strong><br/>Daily swap: <strong>${group.dayswap.currency('%',2)}</strong></td>`);
            $tr.append(`<td class="right aligned">Buy: <strong>${group.spread_buy.currency('%',2)}</strong><br/>Sell: <strong>${group.spread_sell.currency('%',2)}</strong></td>`);
            $tr.append(`<td class="right aligned">Lot: <strong>${group.lot.currency('',0)}</strong><br/>Pips: <strong>${group.pips.currency('',2)}</td>`);
            $tr.append(`<td>${group.pairs.length}</td>`);
            if(group.name.toLowerCase()!='default')$tr.append(`<td><button class="ui icon red button delete" onclick="crm.instrument.groups.delete(this,${group.id})"><i class="trash icon"></i> Delete group</button></td>`);
            // $tr.on('hover',function(){$(this).find('.delete').fadeIn();},function(){$(this).find('.delete').fadeOut();});
        })
        $('#groups_count').html(crm.instrument.groups.data.total);
        page.paginate(crm.instrument.groups.data, 'instrument-group-list', crm.instrument.groups.$c);
    }
    add(){
        let $c = $('<div class="ui modal submiter" data-action="/pairgroup" data-method="post" data-callback="crm.instrument.groups.added" id="pairgroup_add"></div>').appendTo('#modals');
        $c.append(`<i class="close icon" onclick="$('.ui.modal').show('close')"></i>`);
        $c.append('<div class="header"><i class="icon industry"></i></div>');
        let $b = $('<div class="content ui form"></div>').appendTo($c);
        $(`<input type="hidden" data-name="_token" value="${Laravel.csrfToken}"/>`).appendTo($b);
        $(`<div class="field"><label>Group name</label><div class="ui input"><input type="text" data-name="name"/></div></div>`).appendTo($b);
        $(`<div class="two fields">
            <div class="field"><label>Commission</label><div class="ui labeled input"><div class="ui basic label">%</div><input type="number" data-name="commission"/></div></div>
            <div class="field"><label>Daily swap</label><div class="ui labeled input"><div class="ui basic label">%</div><input type="number" data-name="dayswap"/></div></div>
        </div>
        <div class="ui horizontal divider">Spreads</div>
        <div class="two fields">
            <div class="field"><label>Buy</label><div class="ui labeled input"><div class="ui basic label">%</div><input type="number" data-name="spread_buy"/></div></div>
            <div class="field"><label>Sell</label><div class="ui labeled input"><div class="ui basic label">%</div><input type="number" data-name="spread_sell"/></div></div>
        </div>
        <div class="ui horizontal divider">Type of trading</div>
        <div class="field">
            <label>Type</label>
            <div class="ui selection search dropdown">
                <input type="hidden" data-name="type" value="sm" onchange="{if($(this).val()=='forex')$('.forex-like').slideDown();else if($(this).val()!='forex')$('.forex-like').slideUp();}"/>
                <div class="default text">Gibrid</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="sm">Gibrid</div>
                    <div class="item" data-value="forex">Forex</div>
                </div>
            </div>
        </div>
        <div class="ui horizontal divider forex-like" style="display:none;">For forex like trading</div>
        <div class="two fields forex-like" style="display:none;">
            <div class="field"><label>Lot volume</label><div class="ui input"><input type="number" data-name="lot" value="1"/></div></div>
            <div class="field"><label>Minimal pips</label><div class="ui input"><input type="number" data-name="pips" value="1"/></div></div>
        </div>`).appendTo($b);
        let $f = $('<div class="actions"></div>').appendTo($c);
        $('<div class="ui black deny button">Close</div>').appendTo($f);
        $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
        $('#pairgroup_add .ui.dropdown:not(.dropdown-assigned)').addClass('dropdown-assigned').dropdown();
        page.modal('#pairgroup_add');
    }
    edit(ig){
        crm.instrument.groups.current = ig;
        let $c = $(`<div class="ui modal submiter" data-action="/pairgroup/${ig.id}" data-method="put" data-callback="crm.instrument.groups.edited" id="pairgroup_add"></div>`).appendTo('#modals');
        $c.append(`<i class="close icon" onclick="$('.ui.modal').show('close')"></i>`);
        $c.append(`<div class="header"><i class="icon industry"></i>${ig.name}</div>`);
        let $b = $('<div class="content ui form"></div>').appendTo($c);
        $(`<input type="hidden" data-name="_token" value="${Laravel.csrfToken}"/>`).appendTo($b);
        $(`<div class="field"><label>Group name</label><div class="ui input"><input type="text" data-name="name" value="${ig.name}"/></div></div>`).appendTo($b);
        $(`<div class="two fields">
            <div class="field"><label>Commission</label><div class="ui labeled input"><div class="ui basic label">%</div><input type="number" data-name="commission" value="${ig.commission}"/></div></div>
            <div class="field"><label>Daily swap</label><div class="ui labeled input"><div class="ui basic label">%</div><input type="number" data-name="dayswap" value="${ig.dayswap}"/></div></div>
        </div>
        <div class="ui horizontal divider">Spreads</div>
        <div class="two fields">
            <div class="field"><label>Buy</label><div class="ui labeled input"><div class="ui basic label">%</div><input type="number" data-name="spread_buy" value="${ig.spread_buy}"/></div></div>
            <div class="field"><label>Sell</label><div class="ui labeled input"><div class="ui basic label">%</div><input type="number" data-name="spread_sell" value="${ig.spread_sell}"/></div></div>
        </div>
        <div class="ui horizontal divider">Type of trading</div>
        <div class="field">
            <label>Type</label>
            <div class="ui selection dropdown">
                <input type="hidden" data-name="type" value="${ig.type}" onchange="{if($(this).val()=='forex')$('.forex-like').slideDown();else if($(this).val()!='forex')$('.forex-like').slideUp();}"/>
                <div class="default text">Gibrid</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="sm">Gibrid</div>
                    <div class="item" data-value="forex">Forex</div>
                </div>
            </div>
        </div>
        <div class="ui horizontal divider forex-like" style="display:none;">For forex like trading</div>
        <div class="two fields forex-like" style="display:none;">
            <div class="field"><label>Lot volume</label><div class="ui input"><input type="number" data-name="lot" value="1"/></div></div>
            <div class="field"><label>Minimal pips</label><div class="ui input"><input type="number" data-name="pips" value="1"/></div></div>
        </div>`).appendTo($b);
        $('#pairgroup_add .ui.dropdown:not(.dropdown-assigned)').addClass('dropdown-assigned').dropdown().dropdown('set selected',ig.type);
        $c.append(`<div class="ui horizontal divider">Pairs</div>`);
        let $g = $(`<div class="ui container grid"></div>`).appendTo($c),
            $na = $(`<div class="eight wide column"></div>`).appendTo($g),
            $aa = $(`<div class="eight wide column"></div>`).appendTo($g),
            $f = $('<div class="actions"></div>').appendTo($c);
        $aa.append(`<div class="ui header">Already in group&nbsp;<span class="allready">${ig.pairs.length}</span></div>`);
        $na.append('<div class="ui header">Availiable&nbsp;<span class="avaliable"></span></div>');
        $aa = $(`<div class="ui divided items aa"></div>`).appendTo($aa);
        $na = $(`<div class="ui divided items na"></div>`).appendTo($na);
        $('<div class="ui black deny button">Close</div>').appendTo($f);
        $(`<div class="ui positive right labeled icon button submit" onclick="$(this).closest('.ui.modal').find('.close').click();">Ok <i class="checkmark icon"></i></div>`).appendTo($f);
        let allpairs = [];
        for(let i in crm.instrument.data){
            let pair = crm.instrument.data[i];
            if(parseInt(pair.enabled)!==1)continue;
            if(!isPairInList(pair,ig.pairs) && $.inArray(parseInt(pair.id),allpairs)==-1){
                allpairs.push(parseInt(pair.id));
                const price = pair.price?parseFloat(pair.price):0;
                $(`<div class="item" data-id="${pair.id}" data-action="add" onclick="crm.instrument.groups.link(this)">
                    <div class="image" style="position:relative;">
                        <i class="ic ic_${pair.from.code.toLowerCase()}"></i>
                        <i class="ic ic_${pair.to.code.toLowerCase()}"></i>
                    </div>
                    <div class="content">
                        <div class="header">${pair.title}</div>
                        <div class="description">${pair.symbol}</div>
                        <div class="meta">
                            <span class="stay">${pair.source.name}</span>
                            ${crm.instrument.prices.element(price,pair.id)}
                        </div>
                    </div>
                </div>`).appendTo($na).css('cursor','pointer');
            }
        };
        $('.avaliable').text(allpairs.length);
        $('.allready').text(ig.pairs.length);
        ig.pairs.map((pair,i)=>{
            const price = pair.price?parseFloat(pair.price):0;
            $(`<div class="item" data-id="${pair.id}"  data-action="del" onclick="crm.instrument.groups.link(this)">
                <div class="image" style="position:relative;">
                    <i class="ic ic_${pair.from.code.toLowerCase()}"></i>
                    <i class="ic ic_${pair.to.code.toLowerCase()}"></i>
                </div>
                <div class="content">
                    <div class="header">${pair.title}</div>
                    <div class="description">${pair.symbol}</div>
                    <div class="meta">
                        <span class="stay">${pair.source.name}</span>
                        ${crm.instrument.prices.element(price,pair.id)}
                    </div>
                </div>
            </div>`).appendTo($aa).css('cursor','pointer');
        });
        page.modal('#pairgroup_add');
    }
    link(that){
        let pairs = [],
            ig =crm.instrument.groups.current,
            $that = $(that).clone(),
            act =$(that).attr('data-action'),
            $cols = $(that).closest('.grid').find('.column:eq('+((act=='del')?'0':'1')+') .items');
        const already = ig.pairs.map(pair=>{return pair.id});
        $that.attr('data-action',(act=='del')?'add':'del');
        $cols.append($that);
        $('.items.aa .item').each(function(){
            const np = $(this).attr('data-id');
            if($.inArray(np,already)==-1 && $.inArray(np,pairs)==-1)
                pairs.push(np);
        })



        $.ajax({
            url:`/pairgroup/${ig.id}`,
            type:"put",
            data:{
                _token:Laravel.csrfToken,
                pairs:pairs
            },
            success(d,x,s){
                ig = d;
                let avaliable = 0;
                for(let i in crm.instrument.data){
                    if(!isPairInList(crm.instrument.data[i],ig.pairs))avaliable++;
                };
                $('.avaliable').text(avaliable);
                $('.allready').text(pairs.length);
                $(that).remove();
                skymechanics.touch('instrument-group-list');
            }
        });
    }
    delete(that,id){
        $.ajax({
            url:`/pairgroup/${id}`,
            type:"delete",
            data:{
                _token:Laravel.csrfToken
            },
            success(d,x,s){
                $(that).closest('tr').remove();
            }
        });
    }
    added(d,$c){
        skymechanics.touch('instrument-group-list');
        $c.find('.close').click();
        crm.instrument.groups.edit(d);
    }
    edited(d,$c){
        skymechanics.touch('instrument-group-list');
    }
}
Groups.prototype.data = {};
Groups.prototype.$c = $('body');
export class Pair{
    constructor(id){
        this.id = id;
        this.getted = false;
        this.get = this.get.bind(this);
        this.render = this.render.bind(this);
        this.get().then( ()=>{
            this.render();
        })
    }
    get(){
        return new Promise( (resolve,reject) => {
            let that = this;
            $.ajax({
                url: `/instrument/${that.id}`,
                success: function(d, x, s) {
                    console.debug('got pair data',d);
                    that = $.extend(that,d);
                    that.getted = true;
                    resolve();
                },
                error: (x,s)=>{reject();}
            });
        });
    }
    render(){
        if(!this.getted) return;
        console.log('rendering',this);
        let $c = $(`<div class="ui modal submiter" data-action="/instrument/${this.id}" data-method="put" data-callback="crm.instrument.edited" id="pair_${this.id}_edit"></div>`).appendTo('#modals');
        $c.append(`<i class="close icon" onclick="$('.ui.modal').show('close')"></i>`);
        $c.append(`<div class="header"><i class="icon industry"></i>${this.symbol}</div>`);
        let $b = $('<div class="content ui form"></div>').appendTo($c);
        $(`<input type="hidden" data-name="_token" value="${Laravel.csrfToken}"/>`).appendTo($b);
        let $g = $(`<div class="ui container grid"></div>`).appendTo($c);
        let $na = $(`<div class="six wide column"></div>`).appendTo($g);
        let $aa = $(`<div class="ten wide column"></div>`).appendTo($g);
        let $f = $('<div class="actions"></div>').appendTo($c);
        $('<div class="ui black deny button">Close</div>').appendTo($f);
        $(`<div class="ui positive right labeled icon button submit" onclick="$(this).closest('.ui.modal').find('.close').click();">Ok <i class="checkmark icon"></i></div>`).appendTo($f);
        page.modal(`#pair_${this.id}_edit`);
    }
}
export class Pairs {
    constructor() {
        this.data = {};
        this.chartObj = null;
        this.groups = new Groups;
        this.prices = new Prices;
        this.current = null;
        this.currency = {
            update: function(d, $c) {
                $c.parent().find('img').attr('src', d.image);
            }
        }
        this.edit = this.edit.bind(this);
    }

    touch(d, $c) {
        skymechanics.touch('instrument-list');
    }
    price($c, d) {
        var data = [],
            labels = [];
        d = d.reverse();
        for (var i in d) {
            var row = d[i],
                dt = new Date(row.time * 1000);
            labels.push(dt);
            data.push({
                x: dt,
                y: parseFloat(row.price)
            });
        }
        new skymechanics.chart('pair_chart', {
            ctx: $c.find('.chart:first'),
            data: {
                label: 'Prices',
                keys: labels,
                values: data
            },
            onUpdate: function(p) {
                var n = parseFloat(p.y),
                    trade = $c.parents('.ui.modal').find(
                        '#trade_data').length ? JSON.parse($c.parents(
                        '.ui.modal').find('#trade_data').text()) :
                    undefined,
                    $f = $c.parents('.ui.modal').find(
                        '.current'),
                    $o = $c.parents('.ui.modal').find('.profit'),
                    $p = $c.parents('.ui.modal').find(
                        '.percent'),
                    last = parseFloat($f.text().replace(
                        /[\s,]/g, '')),
                    pd = (n > last) ? 'green' : 'red';
                if (!trade) return;
                $c.parents('.ui.active.loader').removeClass(
                    'active loader');
                // console.debug('chart updated',n,trade);
                var calc = crm.deal.calculate(trade, n);
                // console.debug(calc);
                $p.parents('td').removeClass(
                    'green red changed').addClass(((calc.profit >
                    0) ? 'green' : 'red') + ' changed');
                $p.animateNumber({
                    number: calc.percent,
                    numberStep: function(now, tween) {
                        $(tween.elem).html(now.currency(
                            '') + '%');
                    }
                }).prop('number', calc.percent);
                $o.animateNumber({
                    number: calc.profit,
                    numberStep: function(now, tween) {
                        $(tween.elem).html(now.currency(
                            ''));
                    }
                }).prop('number', calc.profit);
                $f.removeClass('green red changed').addClass(pd +
                    ' changed').animateNumber({
                    number: n,
                    numberStep: function(now, tween) {
                        $(tween.elem).html(now.currency(
                            '', 5));
                    }
                }).prop('number', n);
            }
        });
    }
    list(container, d, x, s) {
        console.debug('pairs.list render',d);
        container.html('');
        // crm.instrument.data = d.data;
        // let allpairs = [];
        d.data.map( (row,i) => {
            // if($.inArray(parseInt(row.id),allpairs)!=-1)return;
            // allpairs.push(parseInt(row.id));
            // const price = (row.histo && row.histo.close)?parseFloat(row.histo.close):0;
            const price = row.price?parseFloat(row.price):0;
            let $tr = $('<tr data-class="instrument" data-id="' + row.id +'"></tr>').appendTo(container);
            window.crm.instrument.data[row.id] = row;
            $tr.append('<td>' + row.id + '</td>');
            $tr.append('<td><div class="ui slider checkbox submiter" data-action="/json/instrument/' +row.id +'/update" data-name="pair-enabled" data-callback="crm.instrument.touch">' +'<input class="pair enabled switcher" type="checkbox" data-name="enabled" ' +((row.enabled == '1') ? 'checked' : '') +'><label></label>' +'<input type="hidden" class="submit"/></div></td>');
            $tr.append(`<td class="">
                <div class="image" style="position:relative;">
                    <i class="ic ic_${row.from.code.toLowerCase()}" style="display:inline-block;"></i>
                    <i class="ic ic_${row.to.code.toLowerCase()}" style="display:inline-block;"></i>
                </div>`);
            $tr.append(`<td class="ui header">
                    <a href="javascript:0;" onclick="crm.instrument.edit(${row.id})">${row.title}</a><br/>
                    <code>${row.symbol}</code><br/>
                    ${row.type} <small>group</small><br/>
                    <small>${row.source.name}</small>&nbsp;&nbsp;<small>${crm.instrument.prices.element(price,row.id)}</small>
            </td>`);
            $tr.append(`<td class="">
                <strong>Lot</strong>&nbsp;&nbsp;<small><code>${row.lot}</code></small>
                    <strong>Pips</strong>&nbsp;&nbsp;<small><code>${row.pips?row.pips:''}</code></small>
                    <strong>Fee</strong>&nbsp;&nbsp;<small><code>${(row.commission).percent()}</code></small>
                    <strong>Swap</strong>&nbsp;&nbsp;<small><code>${(row.dayswap/100).percent()}</code></small>
            </td>`);
        });
        $('.pair.enabled.switcher').on('change', function() {$(this).parent().find('.submit').click();});
        page.paginate(d, 'instrument-list', container);
        console.debug('pairs.list rendered');
        cf.reload();
        // crm.instrument.addFormCheck(1);
    }
    enable(id, v) {
        $.ajax({
            url: '/json/instrument/' + id + '/update',
            dataType: 'json',
            beforeSend: function() {
                if (v) $('#pair-id-' + id + '-enable i.fa').toggleClass(
                    'fa-square-o', false, 256).toggleClass(
                    'fa-check-square-o', true, 256);
                else $('#pair-id-' + id + '-enable i.fa').toggleClass(
                    'fa-check-square-o', false, 256).toggleClass(
                    'fa-square-o', true, 256);

            },
            data: {
                enabled: (v ? '1' : '0')
            },
            success: function() {
                if (cf._loaders['instrument-list']) cf._loaders[
                    'instrument-list'].execute();
            }
        });
    }
    add() {
        var $c = $('<div class="ui modal submiter" data-action="/json/instrument/add" data-callback="crm.instrument.added" id="pair_add"></div>').appendTo('body');//.appendTo('#modals');
        let firstCurrency = {id:0,name:''}, lastCurrency = {id:0,name:''}, itr = 0;
        for(let i in currency.data){
            if(itr==0){
                firstCurrency = {
                    id: currency.data[i].id,
                    name: currency.data[i].name,
                    code: i
                }
            }
            else if(itr==1){
                lastCurrency = {
                    id: currency.data[i].id,
                    name: currency.data[i].name,
                    code: i
                }
            }else break;
            ++itr;
        }
        $c.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
        $c.append('<div class="header"><i class="icon industry"></i></div>');
        var $b = $('<div class="content  ui form"></div>').appendTo($c);
        $(`<div class="two fields"><div class="field required">
            <label>From</label>
            <div class="ui search selection dropdown fromcurrencyid">
                <input type="hidden" data-name="from_currency_id" name="from_currency_id"/>
                <div class="default text"></div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    ${currency.toOptionListDiv()}
                </div>
            </div>
        </div>
        <div class="field required">
            <label>To</label>
                <div class="ui search selection dropdown tocurrencyid">
                    <input type="hidden" data-name="to_currency_id" name="to_currency_id"/>
                    <div class="default text"></div>
                    <i class="dropdown icon"></i>
                    <div class="menu">
                        ${currency.toOptionListDiv()}
                    </div>
                </div>
            </div>
        </div>`).appendTo($b);
        // $('<div class="field"><label>From</label><select class="ui search dropdown" data-name="from_currency_id">' +currency.toOptionList() + '</select></div>').appendTo($b);
        // $('<div class="field"><label>To</label><select class="ui search dropdown" data-name="to_currency_id">' +currency.toOptionList() + '</select></div>').appendTo($b);
        $('<div class="field required"><label>Symbol</label><input class="ui input" data-name="symbol"/></div>').appendTo($b);
        $(`<div class="field required"><label>Source</label><div class="ui search selection dropdown pair_source_id"><input type="hidden" data-name="source_id" name="source_id" value="6"/><div class="default text"></div><i class="dropdown icon"></i><div class="menu">${system.sources.toOptionListDiv()}</div></div></div>`).appendTo($b);
        $(`<div class="field required"><label>Type</label><div class="ui search selection dropdown pair_type">
            <input type="hidden" data-name="type" name="type" onchange=""/>
            <div class="default text"></div>
            <i class="dropdown icon"></i>
            <div class="menu">
                <div class="ui item" data-value="fiat">Fiat</div>
                <div class="ui item" data-value="crypto">Crypto</div>
                <div class="ui item" data-value="equities">Equities</div>
                <div class="ui item" data-value="commodities">Commodities</div>
                <div class="ui item" data-value="indices">Indices</div>
            </div>
        </div></div>`).appendTo($b);
        $('<input type="hidden" data-name="enabled" value="1" />').appendTo($b);
        var $f = $('<div class="actions"></div>').appendTo($c);
        $('<div class="ui black deny button">Close</div>').appendTo($f);
        $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
        page.modal('#pair_add');
        // cf.reload();
        // crm.instrument.addFormCheck(1);
        //
        const $fc = $(".dropdown.fromcurrencyid");
        const $tc = $(".dropdown.tocurrencyid");
        $fc.addClass('dropdown-assigned').dropdown({
            // values: currency.toValues(),
            // value: lastCurrency.id,
            onChange:(value,text,$choice)=>{
                console.debug('checking from');
                crm.instrument.addFormCheck(1)
            }
        });
        $tc.addClass('dropdown-assigned').dropdown({
            // values: currency.toValues(),
            // value: firstCurrency.id,
            onChange:(value,text,$choice)=>{
                console.debug('checking to');
                crm.instrument.addFormCheck(2)
            }
        });
        // $fc.dropdown("set value",lastCurrency.id);
        // $tc.dropdown("set value",firstCurrency.id);
        $(".dropdown.pair_source_id").addClass('dropdown-assigned').dropdown("set value",6);
        $(".dropdown.pair_type").addClass('dropdown-assigned').dropdown("set value","crypto");
    }
    addFormCheck(j=1){
        const $symb = $('[data-name=symbol]');
        const $fc = $('.dropdown.fromcurrencyid');
        const $tc = $('.dropdown.tocurrencyid');
        const fc = parseInt($fc.dropdown('get value'));
        const tc = parseInt($tc.dropdown('get value'));
        console.debug('check for pair dublicates',fc,tc);
        let exclude=[(j==1)?fc:tc];
        for(let i in crm.instrument.data){
            const pair =crm.instrument.data[i];
            if(j==1 && pair.from_currency_id == fc ){exclude.push(parseInt(pair.to_currency_id));}
            else if(j==2 && pair.to_currency_id == tc ){exclude.push(parseInt(pair.from_currency_id));}
        }
        const newList = currency.toValues(exclude);
        console.debug('currency new list for('+j+')',newList,exclude);
        if(j==1){
            $tc.dropdown("setup menu",{values:newList});
            $tc.dropdown('set value',($.inArray(tc,exclude)==-1)?tc:newList[0].value);
        }
        else if(j==2){
            $fc.dropdown("setup menu",{values:newList});
            $fc.dropdown('set value',($.inArray(fc,exclude)==-1)?fc:newList[0].value);
        }
        const fcur = currency.byId($fc.dropdown('get value'));
        const tcur = currency.byId($tc.dropdown('get value'));
        $symb.val(`${(fcur)?fcur.code.toUpperCase():''}${(tcur)?tcur.code.toUpperCase():''}`);
    }
    added(d,$c) {
        let $msg = $c.find('.message');
        if(!$msg.length)$msg = $('<div class="ui top attached message"></div>').prependTo($c.find('.content'));
        $msg.removeClass('positive')
        $msg.removeClass('negative');
        if(d.id){
            $msg.addClass('positive');
            $msg.html(`Pair ${d.title} added`)
            cf.touch('instrument-list');
            // $c.modal('hide');
        }else {
            $msg.addClass('negotive');
            // $msg.html(JSON.stringify(d))
            $msg.html(d.message)
        }

    }
    edit(id) {
        // this.current = new Pair(id);
        const $dash = page.modalPreloaderStart(`pair_${id}_dashboard`);
        $.ajax({
            url: `/html/instrument/${id}`,
            success: function(d, x, s) {
                page.modalPreloaderEnd($dash,d,true);
            }
        });
    }
    history(container, d, x, s) {
        var int2OnOff = function(i) {
            return (parseInt(i) == 1) ? 'On' : 'Off';
        };
        container.html('');
        for (var i in d) {
            var s = '<tr data-class="instrument-history" data-id="' + d[i].id +
                '">',
                row = d[i];
            s += '<td>' + new Date(row.created_at * 1000) + '</td>';
            s += '<td>' + int2OnOff(row.old_enabled) + ' / ' + int2OnOff(
                row.new_enabled) + '</td>';
            s += '<td>' + parseFloat(row.old_commission) * 100 + '% / ' +
                parseFloat(row.new_commission) * 100 + '%</td>';
            s += '</tr>'
            container.append(s);
        }
        var pp = cf.pagination(d),
            $pp = container.parent().closest(".pagination");
        if (!$pp.length) $pp = $('<div class="pagination"></div>').insertAfter(
            container.parent());
        $pp.html(pp);
    }

};
export class Prices {
    constructor(){
        $('.prices-form input:not(#count)').on('change',()=>{$('#prices').html('')})
    }
    element(price,pair){
        price = parseFloat(price);
        return `<span class="price pair-price-${pair}" number="${price}"><i class="ui caret down red icon" style="margin-right:0;"></i>${price.digit()}</span>`;
    }
    setPrice2All(price,pair){
        price = parseFloat(price);
        const oldPrice = parseFloat($(`.price.pair-price-${pair}`).prop('number'));
        const icon =  (oldPrice>price)?'<i class="ui caret down red icon" style="margin-right:0;"></i>':'<i class="ui caret up green icon" style="margin-right:0;"></i>'
        $(`:hover > .price.pair-price-${pair}`).html(icon + price.digit(5));//animateNumber({ number: price,numberStep: (now, tween) => { $(tween.elem).html(icon+now.digit());} }).prop('number', price);
        // $(`.price.pair-price-${pair}`).html(icon+price.digit());//animateNumber({ number: price,numberStep: (now, tween) => { $(tween.elem).html(icon+now.digit());} }).prop('number', price);
    }
    render($c,d){
        if(window.ohlcCounter){
            $('#tick_counter').html(`${__('crm.ticks.current_count')} ${window.ohlcCounter.total}  <strong>${__('crm.ticks.avg')} ${window.lastOhlcCounter.avg?window.lastOhlcCounter.avg+'/'+__('crm.ticks.per_minute'):'-'} </strong>`)
        }
        if(d.tune!=undefined)return;
        const price = parseFloat(d.price);
        if($c.length){
            const filters = {
                search: $('#search').val(),
                pairs: $('#pair').val(),
                source: $('#source').val(),
                type: $('#type').val(),
                count: parseInt($('#count').val())
            };
            let check=true;
            const se = new RegExp((filters.search && filters.search.length)?`${filters.search}`:'.*','ig');
            if(filters.search && filters.search.length) {
                check= se.test(d.pair.symbol)
                if( !check ) return;
            }
            if(filters.type && filters.type.length) {
                check = ($.inArray(d.pair.type,filters.type.split(/,/g)) >-1)
                if( !check ) return;
            }
            if(filters.pairs && filters.pairs.length){
                check = ($.inArray(`${d.instrument_id}`,filters.pairs.split(/,/g))>-1);
                if( !check ) return;
            }
            if(filters.source && filters.source.length){
                check = ($.inArray(`${d.source_id}`,filters.source.split(/,/g)) > -1);
                if( !check ) return;
            }
            if($c.find('.item').length>filters.count) $c.find('.item:last').remove();
            const icon =  (d.volation==-1)?'<i class="ui caret down red icon" style="margin-right:0;"></i>':'<i class="ui caret up green icon" style="margin-right:0;"></i>'
            let $i = $('<div class="ui price image item"></div>');
            let $img = $(`<div class="ui image" style="min-width:8.5em;"><i class="ic ic_${d.pair.from.code.toLowerCase()}"></i><i class="ic ic_${d.pair.to.code.toLowerCase()}"></i></div>`).appendTo($i);
            let $cnt = $(`<div class="ui content">
                    <div class="ui header"><small><code>#${d.pair.id}</code></small>${d.pair.title}</div>
                    <div class="ui meta"><code>${d.time.timestamp()}</code> <b>${d.pair.symbol}</b> ${icon}${price.digit()}</div>
                </div>`).appendTo($i);
            $c.prepend($i);
        }
        crm.instrument.prices.setPrice2All(price,d.instrument_id);
        // to all other interface
    }

}

export default Pairs;
