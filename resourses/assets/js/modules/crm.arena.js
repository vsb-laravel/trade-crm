class Arena {
    constructor() {
        this.__charts = {};
    };
    kpi($c,d){
        const dateFrom = new Date(d.period[0]);
        const dateTo = new Date(d.period[1]);
        console.debug(dateFrom,dateTo);
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

        let reservation={active:makeDateArray(dateFrom,dateTo),reversed:makeDateArray(dateFrom,dateTo)};
        let sos=makeDateArray(dateFrom,dateTo);
        let chat=makeDateArray(dateFrom,dateTo);
        let comp=makeDateArray(dateFrom,dateTo);
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
        // console.debug(charts,d,reservation);
        d.reservation.map( (r,i) => {
            let rd = grabTime( new Date(r.r_date_start.toString().replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/,"$1-$2-$3 $4:$5:00")) );

            if(typeof(reservation.reversed[rd]) !="undefined") reservation.reversed[rd]+=(r.status==2)?1:0;
            if(typeof(reservation.active[rd])  !="undefined") reservation.active[rd]+=(r.status==1)?1:0;
        });
        d.sos.map( (r,i) => {
            let rd = grabTime( new Date(r.s_date.toString().replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/,"$1-$2-$3 $4:$5:00")) );
            console.debug(rd,sos[rd],sos);
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
        // crm.room.charts.map( (chart) => { delete chart });
        console.debug('data',sos,d.sos);
        $c.html('');
        $c.append('<div class="ui header">График</div>');
        // $(`<div class="ui calendar"><input data-name="date_from" value="${dateFrom}"/></div>`).appendTo($c);
        // $(`<div class="ui calendar"><input data-name="date_to" value="${dateTo}"/></div>`).appendTo($c);
        let $btns = $('<div class="ui basic buttons right floated"></div>').appendTo($c)



        let $byhour = $('<button class="ui button helper" data-content="Разбивка по часам">Ч</button>').appendTo($btns);
        let $byday = $('<button class="ui button helper" data-content="Разбивка по дням">Д</button>').appendTo($btns);
        let $refresh = $('<button class="ui icon button helper" data-content="Обновить даныне"><i class="refresh icon"></i></button>').appendTo($btns);
        $refresh.on('click',()=>{ skymechanics.touch('arena-graph'); });
        $byday.on('click',()=>{ crm.room.chartType='d'; skymechanics.touch('arena-graph');});
        $byhour.on('click',()=>{ crm.room.chartType='h'; skymechanics.touch('arena-graph'); });
        const $ctx = $('<canvas class="chart"></canvas>').appendTo($c);

        reservation = {
            active: splitObjectKeys(reservation.active),
            reversed: splitObjectKeys(reservation.reversed)
        };
        sos = splitObjectKeys(sos)
        chat = splitObjectKeys(chat)
        comp = splitObjectKeys(comp)

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
                        backgroundColor: page.dashboard.options.chart.backgroundColors[3],
                        borderColor: page.dashboard.options.chart.borderColors[4],
                        data: chat.values
                    },
                    {
                        type: 'line',
                        label: "Кол-во работающих компов",
                        backgroundColor: page.dashboard.options.chart.backgroundColors[5],
                        borderColor: page.dashboard.options.chart.borderColors[5],
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
        crm.room.common();
    }
}

if (!crm || crm == undefined || crm == null) crm = {};
crm['arena'] = new Arena;
// export crm.brands;
