
export class Dashboard{
    constructor(){
        this.__currentPeriod = '7d';
        this.options = {
            chart:{
                backgroundColors: ['rgba(33,187,149,.8)','rgba(33,133,208,.8)','rgba(204, 104, 104,.8)','rgba( 104, 204,104,.8)','rgba(104, 104, 104,.8)','rgba(104, 104, 204,.8)'],
                borderColors: ['rgba(33,187,149,1)','rgba(33,133,208,1)','rgba(204, 104, 104,1)','rgba( 104, 204,104,1)','rgba(104, 104, 104,1)','rgba(104, 104, 204,1)']
            }
        }
        this.byperiod = this.byperiod.bind(this);
        this.trades = this.trades.bind(this);
    }
    byperiod(that,p){
        $('.byperiod .active').removeClass('active');
        $('.date').fadeOut(function(){
            $('.date.'+p).fadeIn();
        });
        $(that).addClass('active');
        this.__currentPeriod = p;
        $('#page__dashboard .loadering').each(function(){
            var loadering = $(this).attr('data-name');
            if(loadering)skymechanics.touch(loadering);
        });
    }
    trades($c,d){
        const limitSymbols = 12;
        let raw={},
            profits = {total:0,today:0,previous:0,volation:0},
            invested = {total:0,today:0,previous:0,volation:0},
            today = new Date(),
            $t = $('#deal_total');
        today = new Date(today - (today.getTime()%(24*60*60*1000)));
        today = today.getTime();
        // console.debug('dashboard trades',d);
        for(let i in d){
            var r = d[i];
            const cntTotal = parseInt(r.total)
            raw[r.pair]=(raw[r.pair])?raw[r.pair]:0;
            raw[r.pair]+= cntTotal;

            profits.total+=parseFloat(r.profit);
            if(r.date*1000 == today){
                profits.today=parseFloat(r.profit);
                profits.volation=(profits.previous==0)?100:100*((parseFloat(r.profit)/profits.previous)-1);
            }
            profits.previous=parseFloat(r.profit);
            invested.total+=parseFloat(r.amount);
            if(r.date*1000 == today){
                invested.today=parseFloat(r.amount);
                invested.volation=(invested.previous==0)?100:100*((parseFloat(r.amount)/invested.previous)-1);
            }
            invested.previous=parseFloat(r.amount);
            // if(i>limitSymbols)break;
        }
        $t.find('tbody tr:eq(0) td:eq(1)').html(invested.total.currency('$',2));
        $t.find('tbody tr:eq(0) td:eq(2)').html(invested.today.currency('$')+'<br/><small><i class="ui icon arrow '+((invested.volation>=0)?'up':'down')+'"></i>'+invested.volation.toFixed(2)+'%</small>').addClass(((invested.volation>=0)?'green':'red'));
        $t.find('tbody tr:eq(1) td:eq(1)').html(profits.total.currency('$',2));
        $t.find('tbody tr:eq(1) td:eq(2)').html(profits.today.currency('$')+'<br/><small><i class="ui icon arrow '+((profits.volation>=0)?'up':'down')+'"></i>'+profits.volation.toFixed(2)+'%</small>').addClass(((profits.volation>=0)?'green':'red'));
        var splited = splitObjectKeys(raw);
        const ctx = document.getElementById('chart__deals').getContext('2d');
        if(crm.charts['trades_report']) crm.charts['trades_report'].destroy();
        crm.charts['trades_report'] = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: splited.keys,
                datasets: [
                    {
                        label: __('crm.trades.title')+": ",
                        backgroundColor: this.options.chart.backgroundColors,
                        borderColor:  this.options.chart.borderColors,
                        data: splited.values
                    }
                ]
            },
            options: {}
        });
    }
}
/*
function customers($c,d){
    var //ctx = document.getElementById('chart__lead_client').getContext('2d'),
        labels = [],cals=[];
        data={
            clients:[],
            leads:[]
        },td=new Date(),
        today = new Date(td - (td%(24*60*60*1000))),
        totals={previous:0,total:0,today:0,volation:0},
        leads={previous:0,total:0,today:0,volation:0},
        $t = $('#lead_total');
    for(var i in d){
        var r = d[i], dtd = new Date(r.date*1000),dt = system.months[dtd.getMonth()]+' '+dtd.getDate() ;
        labels[dt]=(labels[dt])?labels[dt]:{};
        labels[dt]["clients"] = r.newcustomers;
        labels[dt]["leads"] = r.newlead;
        labels[dt]["total"] = r.total;
        leads.total+=parseInt(r.newlead);
        leads.today=parseInt(r.newlead);
        leads.volation=(leads.previous==0)?0:leads.today/leads.previous;
        leads.previous=parseInt(r.newcustomers);

        totals.total+=parseInt(r.newcustomers);
        totals.today=parseInt(r.newcustomers);
        totals.volation=(totals.previous==0)?0:totals.today/totals.previous;
        totals.previous=parseInt(r.newcustomers);
    }

    let tt = {newlead:0,newcustomers:0}
    d.map( (item) => {
        tt.newlead+=parseFloat(item.newlead);
        tt.newcustomers+=parseFloat(item.newcustomers);
    });
    $c.html('');
    $c.append(`<div class="statistic">
            <div class="value"><i class="outline user icon"></i> ${tt.newlead.digit(0)}</div>
            <div class="label">${__('crm.dashboard.new_leads')}</div>
        </div>`)
    $c.append(`<div class="statistic">
            <div class="value"><i class="user icon"></i> ${tt.newcustomers.digit(0)}</div>
            <div class="label">${__('crm.dashboard.new_customers')}</div>
        </div>`)
    $t.html('');
    $t.append(`<thead><tr><th class="four wide">&nbsp;</th><th class="right aligned">${__('crm.dashboard.totals')}</th><th class="right aligned">${__('crm.dashboard.today')}</th></tr></thead>`);
    $t.append(`<tr><th class=" six wide ui right aligned">${__('crm.dashboard.new_customers')}</th><td class="ui header right aligned">${totals.total}</td><td class="ui header color right aligned ${((totals.volation<0)?"red":"green")}">${totals.today}<br><small>${totals.volation.toFixed(2)}%</small></td></tr>`);
    $t.append(`<tr><th class="right aligned">${__('crm.dashboard.new_leads')}</th>'+'<td class="ui header right aligned">${leads.total}</td><td class="ui header color right aligned ${((leads.volation<0)?"red":"green")}">${leads.today}<br><small>${leads.volation.toFixed(2)}%</small></td></tr>`);
    // for(var i=0;i<7;++i){
    //     var c = new Date();
    //     c.setDate(td.getDate()-i);
    //     c = system.months[c.getMonth()]+' '+c.getDate();
    //     cals.push(c);
    //     data.clients.push((labels[c])?labels[c].clients:0);
    //     data.leads.push((labels[c])?labels[c].leads:0);
    // }
    // var chart = new Chart(ctx, {
    //     // The type of chart we want to create
    //     type: 'line',
    //     // The data for our dataset
    //     data: {
    //         labels: cals.reverse(),//["January", "February", "March", "April", "May", "June", "July"],
    //         datasets: [
    //             {
    //                 label: "New customers",
    //                 backgroundColor: 'rgb(33,133,208)',
    //                 borderColor: 'rgb(33,133,208)',
    //                 data: data.clients.reverse()
    //             },
    //             {
    //                 label: "New leads",
    //                 backgroundColor: 'rgb(255, 10, 10)',
    //                 borderColor: 'rgb(255, 10, 10)',
    //                 data: data.leads.reverse()
    //             },
    //         ]
    //     },
    //     // Configuration options go here
    //     options: {}
    // });
},
function money($c,d,x,s){
    var //ctx = document.getElementById('chart__money_report').getContext('2d'),
        labels = [],cals=[];
        data={
            deposits:[],
            withdrawals:[]
        },td=new Date(),
        today = new Date(td - (td%(24*60*60*1000))),
        totals={previous:0,total:0,today:0,volation:0},
        $t = $('#withdrawal_total');
    for(var i in d){
        var r = d[i], dtd = new Date(r.date*1000),dt = system.months[dtd.getMonth()]+' '+dtd.getDate() ;
        labels[dt]=(labels[dt])?labels[dt]:{};
        labels[dt]["deposits"] = 0;
        labels[dt]["withdrawals"] = 0;
        if(r.type=='deposit')labels[dt].deposits=r.amount;
        else if(r.type=='withdraw'){
            labels[dt].withdrawals=r.amount;
            totals.total++;
            totals.previous+=parseFloat(r.amount);
            totals.today+=(today==dtd)?parseFloat(r.amount):0;
            totals.volation=(totals.previous==0)?0:100*((totals.today/totals.previous)-1);
            // console.debug(totals);
        }
    }
    let dd = { deposit: 0, withdraw: 0};
    d.map( (item) => {
        dd[item.type]+= parseFloat(item.amount)
    })
    $c.html('');
    if(dd.withdraw>0) $c.append(`<div class="statistic">
            <div class="value"><i class="dollar icon"></i> ${dd.withdraw.digit()}</div>
            <div class="label">${__('crm.dashboard.withdrawals')}</div>
        </div>`);
    if(dd.deposit>0) $c.append(`<div class="statistic">
            <div class="value"><i class="dollar icon"></i> ${dd.deposit.digit()}</div>
            <div class="label">${__('crm.dashboard.deposits')}</div>
        </div>`);

    $t.html('');
    $t.append(`<thead><tr><th>&nbsp;</th><th class="right aligned">${__('crm.dashboard.totals')}</th><th class="right aligned">${__('crm.dashboard.today')}</th></tr></thead>`);
    $t.append('<tbody><tr><th>Withdrawal</th>'
        +'<th class="ui header right aligned">'+totals.total+'</td>'
        +'<td class="ui color right aligned '+((totals.volation>0)?"red":"green")+'">'+totals.today+'<br><small>'+totals.volation.toFixed(2)+'%</small></td>'
        +'</tr></tbody>');
    for(var i=0;i<7;++i){
        var c = new Date();
        c.setDate(td.getDate()-i);
        c = system.months[c.getMonth()]+' '+c.getDate();
        cals.push(c);
        data.deposits.push((labels[c])?labels[c].deposits:0);
        data.withdrawals.push((labels[c])?labels[c].withdrawals:0);
    }
    // var chart = new Chart(ctx, {
    //     // The type of chart we want to create
    //     type: 'bar',
    //     // The data for our dataset
    //     data: {
    //         labels: cals.reverse(),//["January", "February", "March", "April", "May", "June", "July"],
    //         datasets: [
    //             {
    //                 label: __('crm.dashboard.deposits'),
    //                 backgroundColor: 'rgb(33,133,208)',
    //                 borderColor: 'rgb(33,133,208)',
    //                 data: data.deposits.reverse()
    //             },
    //             {
    //                 label: __('crm.dashboard.totals'),
    //                 backgroundColor: 'rgb(255, 10, 10)',
    //                 borderColor: 'rgb(255, 10, 10)',
    //                 data: data.withdrawals.reverse()
    //             },
    //         ]
    //     },
    //     // Configuration options go here
    //     options: {}
    // });

},
function deposits($c,d){
    var //ctx = document.getElementById('chart__deposit_report').getContext('2d'),
        labels=[],data=[],
        raw={},
        totals = {
            total:0,
            today:0,
            previous:0,
            volation:0
        },
        today = new Date(),today = new Date(today - (today%(24*60*60*1000))),
        $t = $('#deposit_total');

    for(var i in d){
        var r = d[i],merchant = r.title;
        raw[merchant]=(raw[merchant])?raw[merchant]:0;
        raw[merchant]+=parseFloat(r.amount);
        totals.total+=parseInt(r.total);
        totals.volation=(totals.previous==0)?100:100*((parseFloat(r.amount)/(parseFloat(r.amount)+totals.previous))-1);
        totals.previous+=parseFloat(r.amount);
        if(r.trunc_date == today)total.today=parseFloat(r.total);
        totals[merchant]=(totals[merchant])?totals[merchant]:{previous:0,volation:0,total:0};
        totals[merchant].total+=parseInt(r.total);
        totals[merchant].volation=(totals[merchant].previous==0)?100:100*((parseFloat(r.amount)/(parseFloat(r.amount)+totals[merchant].previous))-1);
        totals[merchant].previous+=parseFloat(r.amount);
        totals[merchant].today=(r.trunc_date == today)?r.total:0;
    }
    $c.html('');
    Object.keys(raw).map( (merchant) => {
        const item = raw[merchant];
        $c.append(`<div class="statistic">
            <div class="value"><i class="dollar icon"></i> ${item.digit()}</div>
            <div class="label">${merchant}</div>
        </div>`)
    })
    $t.html('');
    $t.append(`<thead><tr><th>&nbsp;</th><th class="right aligned">${__('crm.dashboard.totals')}</th><th class="right aligned">${__('crm.dashboard.today')}</th></tr></thead>`);

    $t.append('<tbody><tr>'
        +`<td><b>${__('crm.dashboard.deposits')}</b></td>`
        +'<td class="right aligned"><b>'+totals.total+'</b></td>'
        +'<td class="color right aligned '+((totals.volation>0)?"green":"red")+'"><b>'+totals.today+'</b><br><small>'+totals.volation.toFixed(2)+'%</small></td>'
    +'</tr></tbody>');
    for(var i in totals){
        if($.inArray(i,['total','volation','previous','today'])<0){
            $t.append('<tr>'
                +`<td>${i}</td>`
                +`<td class="right aligned">${totals[i].total}</td>`
                +`<td class="right aligned color ${((totals[i].volation>0)?"green":"red")}">${totals[i].today}<br><small>${totals[i].volation.digit(2)}%</small></td>`
            +'</tr>');
        }
    }
}
*/
