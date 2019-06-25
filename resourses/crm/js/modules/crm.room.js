class Room {
    constructor(){
        this.charts = [];
        this.chartType = 'd';
    }
    common(){
        $('.helper:not(.helper-asigned)').addClass('helper-asigned').popup({hoverable:true});
        $('.input.calendar:not(.calendar-assigned)').calendar({
            firstDayOfWeek: 1,
            monthFirst:false,
            ampm:false,
            formatter:{
                datetime:function(date,settings){
                    if(!date)return;
                    return date.getFullYear()+'-'+(1+date.getMonth()).leftPad()+'-'+date.getDate().leftPad()+' '+date.getHours().leftPad()+':'+date.getMinutes().leftPad()+":"+date.getSeconds().leftPad();
                }
            },
            onChange:function(d,t,m){
                $(this).find('.requester').val(t).change();
            }
        }).addClass('calendar-assigned');
    }
    render($c,d){
        d.data.map( (pc,i) =>{
            const $pc = $(`#pc_${pc.id}`);
            const $pc_text = $(`#pc_${pc.id}_text`);
            let vip = 'Standart';
            switch(pc.vip){
                case 1: vip='VIP';break;
                case 2: vip='VR';break;
                case 3: vip='PlayStation';break;
            }
            let color = 'rgba(100,100,100,.3)';
            let cursor = 'pointer';
            if(pc.active==1)color = 'rgba(33,186,69,.5)';
            else cursor = 'default';
            if(pc.status) {
                console.debug('used comp',pc);
                color = 'rgba(220,80,100,.5)';
            }
            $pc.css({fill: color,cursor: cursor});
            $pc.html(`<title>#pc_${pc.id} ${vip}</title><text>#pc_${pc.id} ${vip} ${pc.mac}</text>`);
            $pc.on('click',(e)=>{
                console.debug('svg rect click', e,pc);
                if(pc.name)$('#map_info_box').html(`MAC: <b>${pc.mac}</b><br/>Тип: <b>${vip}</b><br/>Пользователь: <b><a href="#" onclick="crm.user.info(${pc.user_id})">${pc.name}</a></b>`);
                else $('#map_info_box').html(`MAC: <b>${pc.mac}</b><br/>Тип: <b>${vip}</b><br/>Компьютер не занят.`);
            });
            $pc.prev().html(`${pc.comp}`);
        });
    }
    panel($c,d){
        $c.css({
            top:"18%",
            left: "26%"
        });
        $c.html('');
        let $s = $c;
        // let $s = $('<div class="ui small statistics"></div>').appendTo($c);
        $s.append(`<div class="ui green statistic helper" data-content="Сейчас мест, готовых к работе">
                <div class="value">${d.free}</div>
                <div class="label">Готовых к работе</div>
            </div>`);
        $s.append(`<br><div class="ui statistic helper" data-content="Cейчас участников в игре">
                <div class="value">${d.users}</div>
                <div class="label">Участников</div>
            </div>`);
        $s.append(`<div class="ui statistic helper" data-content="Сегодня игроков всего">
                <div class="value"><i class="user futbol icon"></i>${d.gamers}</div>
                <div class="label">Игроков</div>
            </div>`);
        $s.append(`<br><div class="ui statistic helper" data-content="Количество резерваций">
                <div class="value">${d.reservations}</div>
                <div class="label">Резерваций</div>
            </div>`);
        $s.append(`<div class="ui statistic helper" data-content="Должно быть по плану">
                <div class="value"><i class="heart circle icon"></i>${d.plan}</div>
                <div class="label">По плану</div>
            </div>`);
        $s.append(`<br><div class="ui statistic helper" data-content="Сегодня поступлений в кассу">
                <div class="value">${d.invoices.currency('W',0)}</div>
                <div class="label">Поступлений</div>
            </div>`);
        $s.append(`<div class="ui red statistic helper" data-content="Сегодня SOS обращений от участников">
                <div class="value"><i class="wheelchair icon"></i>${d.sos}</div>
                <div class="label">SOS обращений</div>
            </div>`);
        crm.room.common();
    }
    graph($c,d){
        const dateFrom = new Date(d.period[0]);
        const dateTo = new Date(d.period[1]);
        let {charts,chartType} = crm.room;
        const makeDateArray = ( df, de ) => {
            let s = df;
            let e = df.getTime();
            let obj = [];
            const divider = (crm.room.chartType=='h')?(60*60*1000):(24*60*60*1000);
            s = s.getTime() - s.getTime()%divider;
            while(e<=de.getTime()){
                obj[new Date(e)]=0;
                e +=divider;
            }
            return obj;
        };
        const grabTime = (rd) => {
            rd.getTime();
            const plusHours = rd.getHours()-rd.getUTCHours();
            switch(crm.room.chartType){
                case "d": rd -= rd%(24*60*60*1000); break;
                case "h": rd -= rd%(60*60*1000);break;
            }
            rd-=plusHours*60*60*1000;
            return new Date(rd);
        };

        let reservation={active:makeDateArray(dateFrom,dateTo),reversed:makeDateArray(dateFrom,dateTo)};
        let sos=makeDateArray(dateFrom,dateTo);
        let chat=makeDateArray(dateFrom,dateTo);
        let comp=makeDateArray(dateFrom,dateTo);
        let rep={
            standart:makeDateArray(dateFrom,dateTo),
            vip:makeDateArray(dateFrom,dateTo),
            vr:makeDateArray(dateFrom,dateTo),
            playstation:makeDateArray(dateFrom,dateTo)
        };
        let money=makeDateArray(dateFrom,dateTo);
        let moneyopt=makeDateArray(dateFrom,dateTo);
        d.reservation.map( (r,i) => {
            let rd = grabTime( new Date(r.r_date_start.toString().replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/,"$1-$2-$3 $4:$5:00")) );

            if(typeof(reservation.reversed[rd]) !="undefined") reservation.reversed[rd]+=(r.status==2)?1:0;
            if(typeof(reservation.active[rd])  !="undefined") reservation.active[rd]+=(r.status==1)?1:0;
        });
        d.sos.map( (r,i) => {
            let rd = grabTime( new Date(r.s_date.toString().replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/,"$1-$2-$3 $4:$5:00")) );
            if(typeof(sos[rd]) !="undefined")sos[rd]+=1;
        });
        d.chat.map( (r,i) => {
            let rd = grabTime( new Date(r.created_at) );
            if(typeof(chat[rd]) !="undefined")chat[rd]+=1;
        });
        d.comp.map( (r,i) => {
            let rd = grabTime( new Date(r.created_at) );
            if(typeof(comp[rd]) !="undefined")comp[rd]+= (r.c_status==1)?1:0;
        });
        d.money.map( (r,i) => {
            let rd = grabTime( new Date(r.date) );
            if(typeof(money[rd]) !="undefined") {
                money[rd]+=parseFloat(r.amount);
                moneyopt[rd]+=1;
            }
        });

        const delta = (crm.room.chartType=='h')?(60*60*1000):(24*60*60*1000);
        // console.debug(delta,rep)
        for(let i in rep.standart){
            const p = new Date(i);
            const categories = ['standart','vip','vr','playstation']
            d.report.map( (r,i) => {
                // if((r.date2 != null)){
                    // let rd1 = grabTime( new Date(r.date1) );
                    // let rd2 = grabTime( (r.date2 == null)?new Date():new Date(r.date2) );
                    let rd1 = new Date(r.date1) ;
                    let rd2 = (r.date2 == null)?new Date():new Date(r.date2) ;
                    let diff = 0;
                    let incase = 0;
                    let categor = 'standart';
                    // inside of period
                    if( p.getTime()<= rd1.getTime()  && rd2.getTime()<= (p.getTime()+delta) ){
                        diff = Math.floor((rd2.getTime() - rd1.getTime())/(1000*60));
                        incase =1;
                    }
                    // more than period
                    else if( p.getTime()<= rd1.getTime()  && rd1.getTime()<=(p.getTime()+delta) && rd2.getTime()>=(p.getTime()+delta) ){
                        diff = Math.floor(((p.getTime()+delta) - rd1.getTime())/(1000*60));
                        incase =2;
                    }
                    // from last period
                    else if( p.getTime()> rd1.getTime()  && rd2.getTime() <= (p.getTime()+delta) ){
                        diff = Math.floor( (p.getTime() - rd2.getTime() )/(1000*60));
                        incase =3;
                    }
                    // from last period to next period
                    else if( p.getTime()> rd1.getTime()  && rd2.getTime()> (p.getTime()+delta) ){
                        diff = 24*60;
                        incase =4;
                    }
                    // console.debug(r.id_categor,categories[r.id_categor],incase,diff)
                    rep[categories[r.id_categor]][p]+= Math.abs(diff);
                    // if(diff!=0)console.debug(p,new Date(p.getTime()+delta),r,incase,diff);
                //}
            });
            for(let categor in d.comps){
                const cat = d.comps[categor]
                if(cat.cnt==0)continue;
                // console.debug(cat.categor,cat.cnt,categories[cat.categor],rep[categories[cat.categor]][p])
                rep[categories[cat.categor]][p] = ((crm.room.chartType=='d')?24:1)*60*1000*rep[categories[cat.categor]][p]/( cat.cnt*delta - ((crm.room.chartType=='d')?60*60*1000:0) );
                rep[categories[cat.categor]][p] = parseInt(rep[categories[cat.categor]][p]*100)/100;
            }

        };
        for(let i in money){
            const idx = new Date(i);
            money[idx]=parseInt((money[idx])/moneyopt[idx])/100;
            // money[idx]=parseInt((100*money[idx]))/100;
        }
        // crm.room.charts.map( (chart) => { delete chart });

        $c.html('');
        let $col = $('<div class="ui column sixteen wide"></div>').appendTo($c);
        $col.append('<div class="ui horizontal divider">Статистика</div>');
        let $frm = $('<div class="ui form"></div>').appendTo($col);
        $frm = $('<div class="ui three fields"></div>').appendTo($frm);
        let $df = $(`<div class="ui left icon calendar input"><i class="ui calendar icon"></i><input data-name="date_from" class="requester" data-target="arena-graph" data-trigger="change" value="${dateFrom}"/></div>`).appendTo($('<div class="ui field"></div>').appendTo($frm));
        let $dt = $(`<div class="ui left icon calendar input"><i class="ui calendar right icon"></i><input data-name="date_to" data-target="arena-graph" data-trigger="change" value="${dateTo}"/></div>`).appendTo($('<div class="ui field"></div>').appendTo($frm));
        let $btns = $('<div class="ui basic right floated buttons"></div>').appendTo($('<div class="ui field right aligned"></div>').appendTo($frm))
        let $byhour = $(`<button class="ui button helper ${(crm.room.chartType=="h")?"active":""}" data-content="Разбивка по часам">Ч</button>`).appendTo($btns);
        let $byday = $('<button class="ui button helper ${(crm.room.chartType=="d")?"active":""}"" data-content="Разбивка по дням">Д</button>').appendTo($btns);
        let $refresh = $('<button class="ui icon button helper" data-content="Обновить даныне"><i class="refresh icon"></i></button>').appendTo($btns);
        $refresh.on('click',()=>{ skymechanics.touch('arena-graph'); });
        $df.find('input').on('change',function(){
            const val = $(this).val();
            let toucher = skymechanics._loaders['arena-graph'];
            toucher.opts.data['date_from']=val;
            skymechanics.touch('arena-graph');
        });
        $dt.find('input').on('change',function(){
            const val = $(this).val();
            let toucher = skymechanics._loaders['arena-graph'];
            toucher.opts.data['date_to']=val;
            skymechanics.touch('arena-graph');
        });
        $byday.on('click',()=>{ crm.room.chartType='d'; skymechanics.touch('arena-graph');});
        $byhour.on('click',()=>{ crm.room.chartType='h'; skymechanics.touch('arena-graph'); });

        $col = $('<div class="ui sixteen wide column"></div>').appendTo($c);
        $col.append('<div class="ui header">График</div>');
        const $ctx = $('<canvas class="chart"></canvas>').appendTo($col);
        $col = $('<div class="ui eight wide column"></div>').appendTo($c);
        $col.append('<div class="ui header">KPI</sub></div>');
        const $rep = $('<canvas class="chart"></canvas>').appendTo($col);
        $col = $('<div class="ui eight wide column"></div>').appendTo($c);
        $col.append('<div class="ui header">Средний чек</div>');
        const $mon = $('<canvas class="chart"></canvas>').appendTo($col);

        reservation = {
            active: splitObjectKeys(reservation.active),
            reversed: splitObjectKeys(reservation.reversed)
        };
        sos = splitObjectKeys(sos)
        chat = splitObjectKeys(chat)
        comp = splitObjectKeys(comp)
        const reps = {
            standart:splitObjectKeys(rep.standart),
            vip:splitObjectKeys(rep.vip),
            vr:splitObjectKeys(rep.vr),
            playstation:splitObjectKeys(rep.playstation)
        };
        const moneys = splitObjectKeys(money);
        const moneysCnt = splitObjectKeys(moneyopt);

        charts.push(new Chart($ctx.get(0).getContext('2d'), {
            type: 'bar',
            data: {
                labels: reservation.reversed.keys,
                datasets: [
                    {
                        type: 'line',
                        label: "Резервации отменные",
                        backgroundColor: page.dashboard.options.chart.backgroundColors[0],
                        borderColor: page.dashboard.options.chart.borderColors[0],
                        data: reservation.reversed.values
                    },
                    {
                        label: "Резервации",
                        backgroundColor: page.dashboard.options.chart.backgroundColors[1],
                        borderColor: page.dashboard.options.chart.borderColors[1],
                        data: reservation.active.values
                    },
                    {
                        label: "SOS обращения",
                        backgroundColor: page.dashboard.options.chart.backgroundColors[2],
                        borderColor: page.dashboard.options.chart.borderColors[2],
                        data: sos.values
                    },
                    {
                        label: "Кол-во участников",
                        backgroundColor: page.dashboard.options.chart.backgroundColors[5],
                        borderColor: page.dashboard.options.chart.borderColors[5],
                        data: chat.values
                    },
                    {
                        type: 'line',
                        label: "Кол-во работающих компов",
                        backgroundColor: page.dashboard.options.chart.backgroundColors[4],
                        borderColor: page.dashboard.options.chart.borderColors[4],
                        data: comp.values
                    },
                ]
            },
            options:  {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: ((crm.room.chartType=='h')?'hour':'day'),
                            displayFormats: {
                                quarter: 'hh:mm:ss'

                            }
                        }
                    }]
                }
                // ,zoom: {
                //     enabled: true,
                //     mode: 'y'
                // }
            }
        }));
        charts.push(new Chart($rep.get(0).getContext('2d'), {
            type: 'bar',
            data: {
                labels: reps.standart.keys,
                datasets: [
                    {
                        label: `KPI стандарт (${d.comps[0].cnt})`,
                        backgroundColor: page.dashboard.options.chart.backgroundColors[1],
                        borderColor: page.dashboard.options.chart.borderColors[1],
                        data: reps.standart.values
                    },
                    {
                        label: `KPI VIP (${d.comps[1].cnt})`,
                        backgroundColor: page.dashboard.options.chart.backgroundColors[2],
                        borderColor: page.dashboard.options.chart.borderColors[2],
                        data: reps.vip.values
                    },
                    {
                        label: `KPI VR (${d.comps[2].cnt})`,
                        backgroundColor: page.dashboard.options.chart.backgroundColors[3],
                        borderColor: page.dashboard.options.chart.borderColors[3],
                        data: reps.vr.values
                    },
                    {
                        label: `KPI Playstation (${d.comps[3].cnt})`,
                        backgroundColor: page.dashboard.options.chart.backgroundColors[4],
                        borderColor: page.dashboard.options.chart.borderColors[4],
                        data: reps.playstation.values
                    }
                ]
            },
            options:  {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: ((crm.room.chartType=='h')?'hour':'day'),
                            displayFormats: {
                                quarter: 'hh:mm:ss'

                            }
                        }
                    }]
                }
                // ,zoom: {
                //     enabled: true,
                //     mode: 'y'
                // }
            }
        }));
        charts.push(new Chart($mon.get(0).getContext('2d'), {
            type: 'line',
            data: {
                labels: moneys.keys,
                datasets: [
                    {
                        label: "Средний чек",
                        backgroundColor: page.dashboard.options.chart.backgroundColors[4],
                        borderColor: page.dashboard.options.chart.borderColors[4],
                        data: moneys.values
                    },
                    {
                        type: 'bar',
                        label: "Кол-во операций в период",
                        backgroundColor: page.dashboard.options.chart.backgroundColors[6],
                        borderColor: page.dashboard.options.chart.borderColors[6],
                        data: moneysCnt.values
                    }
                ]
            },
            options:  {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: ((crm.room.chartType=='h')?'hour':'day'),
                            displayFormats: {
                                quarter: 'hh:mm:ss'

                            }
                        }
                    }]
                }
                // ,zoom: {
                //     enabled: true,
                //     mode: 'y'
                // }
            }
        }));
        crm.room.common();
    }
    mount(){
        $.ajax({
            url: 'https://web.windigoarena.gg/php/crm_brana.php?print_karta_crm=5',
            context: document.getElementById('bets_room'),
            // crossDomain: true,
            // contentType: 'plain/text',
            // dataType: 'text',
            beforeSend: (x,s) => {
                // delete $.ajaxSetup.headers["X-CSRF-TOKEN"];
            },
            dataFilter: (d,t) => {
                // console.debug(d,t);
            },
            processData: false,
            success:(d,s,x) =>{
                const colors={
                    std:'rgba(100,100,100,.5)',
                    res:"rgba(33,186,69,.5)",
                    vip:'rgba(33,133,208,.5)'
                }
                const map = JSON.parse(x.responseText);
                Object.keys(map).map( (pc) => {
                    const m = map[pc];
                    const $pc = $(`rect#${pc}`);
                    $pc.css({fill: colors[m.type]});
                    $pc.html(`<title>#${pc}</title>`)

                });
                setTimeout(crm.room.mount,45000);
            },
            complete: (x,s)=>{
                x.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            }
        });
    }
};
if(!crm || crm == undefined || crm == null ) crm = {};
crm['room'] = new Room();

/*
"pc_20":{"coord":{"x":104,"y":379},"type":"vip"},
"pc_1":{"coord":{"x":266,"y":31}, "reserved":{"r_from":201808160729,"r_to":201808162329,"r_name":"testtttt testttovvvv"}},"type":"res"}

*/
const makeDateArray2 = ( days) => {
    let s = new Date();
    let obj = [];
    const hourseconds = 60*60*1000;
    const dayseconds = 24*60*60*1000;
    s = s.getTime() - s.getTime()%dayseconds;
    s -= days*dayseconds;
    for(let i =1;i<(1+days);++i){
        obj[new Date(s+i*dayseconds)]=0;
    }
    return obj;
};
