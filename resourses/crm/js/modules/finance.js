import { VUIMessage } from '../components/index';
export class Finance{
    constructor(){
        this.__currentPeriod='7d'
        this.charts = {}
    }
    touch(){
        cf.touch('user-withdrawals');
        cf.touch('user-transactions');
    }
    byperiod(that,p){
        $('.byperiod .active').removeClass('active');
        $('.date').fadeOut(function(){
            $('.date.'+p).fadeIn();
        });
        $(that).addClass('active');
        crm.finance.__currentPeriod = p;
        cf.touch('finance-report-r');
        cf.touch('finance-report-d');
        cf.touch('finance-report-w');
    }
    withdrawals($c,d){
        var cbd = {
                ctx:$c.find('.chart:first').get(0),
                data:{},
                raw:{}
            },cbm = {
                ctx:$c.find('.chart:last').get(0),
                data:{},
                raw:{},
            },cbo={}
            ,$t=$c.find('.table tbody');
        for(var i in d){
            var row=d[i],dt = new Date(row.date*1000),
                date = leftZeroPad(dt.getDate())+' '+system.months[dt.getMonth()],
                amount=parseFloat(row.amount),
                office=row.office,//(row.user && row.user.manager)?crm.user.getMeta(row.user.manager.meta,'office'):'notset',
                status = row.status;
            cbd.raw[date]=(cbd.raw[date])?cbd.raw[date]:0;
            cbd.raw[date]+=amount;
            cbm.raw[status]=(cbm.raw[status])?cbm.raw[status]:0;
            cbm.raw[status]+=amount;
            cbo[office]=(cbo[office])?cbo[office]:{amount:0,total:0};
            cbo[office].amount+=amount;
            cbo[office].total++;
        }
        cbd.data = splitObjectKeys(cbd.raw);
        cbm.data = splitObjectKeys(cbm.raw);
        if(cbd.ctx)var chart = new Chart(cbd.ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: cbd.data.keys,
                datasets: [
                    {
                        label: "Withdrawals",
                        borderColor: page.dashboard.options.chart.borderColors[0],
                        data: cbd.data.values
                    }
                ]
            },
            options: {}
        });
        if(cbm.ctx)var chart = new Chart(cbm.ctx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: cbm.data.keys,
                datasets: [
                    {
                        label: "Withdrawals",
                        backgroundColor: page.dashboard.options.chart.backgroundColors,
                        borderColor: page.dashboard.options.chart.borderColors,
                        data: cbm.data.values
                    }
                ]
            },
            options: {}
        });
        $t.html('');
        for(var i in cbo){
            $t.append('<tr><td>'+i+'</td><td class="right aligned">'+cbo[i].total+'</td><td class="ui header right aligned">'+cbo[i].amount.currency('T')+'</td></tr>')
        }
    }
    withdrawal($c,d){
        $c.html('');
        let totals = {
            request:0,
            approved:0,
            declined:0,
            total:0
        };
        let totalAproved = 0;
        for(var i in d.data){
            var row = d.data[i],$tr = $("<tr></tr>"),manager = (row.manager)?row.manager:undefined;
            totals.total+=parseFloat(row.amount);
            switch(row.status){
                case 'approved':totals.approved+=parseFloat(row.amount);break;
                case 'declined':totals.declined+=parseFloat(row.amount);break;
                case 'request':totals.request+=parseFloat(row.request);break;
            }
            if(row.status == 'approved') $tr.addClass('positive');
            if(row.status == 'declined') $tr.addClass('negative');
            $('<td class="center aligned">'+dateFormat(row.created_at)+'</td>').appendTo($tr);
            // $('<td>'+((row.merchant)?row.merchant.title:'')+'</td>').appendTo($tr);
            $( `<td>${row.account?crm.user.showCustomer(row.account.user):''}</td>`).appendTo($tr);
            // $('<td><a onclick="crm.user.card('+row.account.user.id+')" data-class="user" data-id="'+row.account.user.id+'">'+row.account.user.name+' '+row.account.user.surname+'</a>'
            //     +'<br/><small><i class="icon mail"></i>'+row.account.user.email+'</small>'
            //     +'<br/><small><i class="icon phone"></i>'+row.account.user.phone+'</small>'
            //     +'</td>').appendTo($tr);
            // $((manager)?'<td class="ui center middle aligned"><a href="#"  onclick="crm.user.card('+manager.id+')" data-class="manager" data-id="'+manager.id+'">'+manager.name+' '+manager.surname+'</a></td>':'<td></td>').appendTo($tr);
            $('<td class="center aligned"><h3>'+row.status+'</h3>'
                +((row.status!='request')?dateFormat(row.created_at):'')+'</td>').appendTo($tr);
            $('<td>'+parseFloat(row.amount).currency('T ')+'</td>').appendTo($tr);
            if(row.status=='request' && system.user.rights_id>=8){
                $('<td>'
                    +'<div class="submiter" data-action="/json/finance/withdrawal/'+row.id+'/approved" data-callback="crm.finance.withdrawalCallback" style="display:inline-block"><button class="ui secondary button submit">Approve</button></div>'
                    // +'<div class="submiter" data-action="/json/finance/withdrawal/'+row.id+'/declined" data-callback="crm.finance.withdrawalCallback" style="display:inline-block"><div class="ui buttons">'
                        +'<button class="ui button submit" onclick="crm.finance.withdrawalDecline('+row.id+')">Decline</button>'
                        // +'<div class="ui floating dropdown icon button submit" data-trigger="change"><input type="hidden" name="comment" data-name="comment"/>'
                        //     +'<div class="default text">Decline</div>'
                        //     +'&nbsp;<i class="dropdown icon"></i>'
                        //     +'<div class="menu">'
                        //         +'<div class="item" data-value="Not enough balance">Not enough balance</div>'
                        //         +'<div class="item" data-value="Can\'t withdraw bonus">Can\'t withdraw bonus</div>'
                        //         +'<div class="item" data-value="Need verification docs">Need verification docs</div>'
                        //     +'</div>'
                        // +'</div></div>'
                    // +'</div>'
                +'</td>').appendTo($tr);
            }
            else {
                const comment = (row.comments && row.comments.length)?'<strong>Comment:</strong><br/>'+row.comments[0].comment:'';
                $(`<td>${comment}</td>`).appendTo($tr);
            }
            $tr.appendTo($c)
        }

        page.paginate(d,'user-withdrawals',$c,`<span class="ui grey large label">
                Requested: &nbsp;&nbsp;<span class="ui detail totalRequested" number="${totals.request}">${totals.request.dollars()}</span>
            </span>
            <span class="ui green large label">
                Approved: &nbsp;&nbsp;<span class="ui detail totalApproved" number="${totals.approved}">${totals.approved.dollars()}</span>
            </span>
            <span class="ui red large label">
                Declined: &nbsp;&nbsp;<span class="ui detail totalDeclined" number="${totals.declined}">${totals.declined.dollars()}</span>
            </span>

        `);
        $('.list-totals .totalRequested').animateNumber({number: totals.request,numberStep: function(now, tween) {$(tween.elem).html(now.dollars());}}).prop('number', totals.request);
        $('.list-totals .totalApproved').animateNumber({number: totals.approved,numberStep: function(now, tween) {$(tween.elem).html(now.dollars());}}).prop('number', totals.approved);
        $('.list-totals .totalDeclined').animateNumber({number: totals.declined,numberStep: function(now, tween) {$(tween.elem).html(now.dollars());}}).prop('number', totals.declined);
        $('[data-name=search]:visible').each(function(){
            const $that=$(this),keyword=$that.val();
            // console.debug('search field need mark',keyword,$("table:visible tbody tr td").length);
            $("table:visible tbody tr td").unmark({
                done: function() {
                    $("table:visible tbody tr td").mark(keyword, {});
                }
            });
        })
        cf.reload();
    }
    withdrawalDecline(id){
        let $prompt = $('<div class="ui modal submiter" data-action="/json/finance/withdrawal/'+id+'/declined" data-callback="crm.finance.withdrawalCallback"></div>').appendTo('body'),
            $header = $('<div class="header"></div>').appendTo($prompt),
            $content = $('<div class="content"></div>').appendTo($prompt),
            $actions = $('<div class="actions"></div>').appendTo($prompt);
        $prompt.append('<i class="close icon"></i>');
        $header.html('Specify reason of decline');
        $content = $('<div class="ui form"></div>').appendTo($content);
        // $content.append('<input data-name="comment" type="hidden"/>');
        let $field = $('<div class="field"></div>').appendTo($content);
        $('<div class="ui search"><div class="ui icon input"><input class="prompt" type="text" data-name="comment" placeholder="Decline comment..."><i class="search icon"></i></div><div class="results"></div></div>').appendTo($field).search({
            apiSettings: {
                url: '/used/comments?search={query}&type=withdrawal',
                onResponse(result){
                    var response = {results : []};

                    for(var i in result){
                        var u = result[i];
                        console.debug('search comment result',u);
                        response.results.push({
                            title:u.comment
                        });
                    }
                    console.debug(response);
                    return response;
                }
            },
            // onSelect(result, response){
            //     $modal.find('[data-name=comment]').val(result.comment);
            // }
            minCharacters : 3
        });
        $('<div class="ui black deny button">Cancel</div>').appendTo($actions).on('click',function(){$prompt.find('.close').click();});
        $('<div class="ui positive right labeled icon button submit">Ok<i class="checkmark icon"></i></div>').appendTo($actions).on('click',function(){$prompt.find('.close').click();});
        page.modal($prompt);
        skymechanics.reload();
    }
    withdrawalCallback($c,d){
        console.debug('withdrawal touch');
        // cf._loaders['user-list'].execute();
        skymechanics.touch('user-withdrawals');
        // if(cf._loaders['user-withdrawals'])cf._loaders['user-withdrawals'].execute();
        // if(cf._loaders['user-list'])cf._loaders['user-list'].execute();
    }
    touch(){

    }
    transaction($c,d){
        $c.html('');
        let total = 0;
        d.data.map( (row,i) =>{
            let $tr = $("<tr></tr>")
            const raw = row.raw;
            const manager = (row.user.manager)?row.user.manager:undefined;
            if(row.error == 0 && row.transaction && row.transaction.type == 'deposit') $tr.addClass('positive');
            if(row.error > 0 && row.transaction.code!='0') $tr.addClass('negative');
            $('<td class="center aligned">'+dateFormat(row.created_at)+'</td>').appendTo($tr);
            $(`<td>${row.merchant.title}`+
                ((raw.method)?`<br/><small>${raw.method}</small>`:'')+
            '</td>').appendTo($tr);
            $(`<td>${crm.user.showCustomer(row.user)}</td>`).appendTo($tr);
            $('<td>'
                +crm.user.showManager(row.user.manager,'Manager')
                + '<br/>'+ crm.user.showManager(row.user.affilate,'Affilate')
                + (row.user.lead?`<br/><small>Source: ${row.user.lead.source}</small>`:'')
            +'</td>').appendTo($tr);
            $('<td>'+((row.transaction&&$.inArray(row.transaction.type,['debit','deposit'])==-1)?'-':'')+parseFloat(row.amount).currency('T ')+'</td>').appendTo($tr);
            // $('<td>'+parseFloat(row.amount).currency('T ')+'</td>').appendTo($tr);
            const f_success = `transaction_add_${user.id}`;
            const f_error = f_success+'_error';
            window[f_success]=(response,container,request)=>{
                new VUIMessage({
                    title:__('crm.success'),
                    message:`<b>${__('crm.transactions.'+response.type)}</b> <i>${response.merchant.name}</i><h3>${response.transaction.amount.dollars()}</h3>`
                });
                skymechanics.touch('user-transactions')
            }
            window[f_error]=(response,container,request)=>{
                new VUIMessage({
                    title:__('crm.error'),
                    message:`${response.message}`,
                    error:true
                });
            }
            $('<td>'
                +(row.error=='0'?`Success<br/>`:((row.transaction.code=='0')?`Request<br/>`:`Failed<br/>`))
                +(
                    (row.transaction.code=='0' && window.user.can.chief)
                    ?(`<div class="" data-action="/pay/${row.merchant.name}/${row.transaction_id}/approve" data-google2fa="true" data-method="PUT"  data-callback="${f_success}" data-callback-error="${f_error}" data-autostart="true" onclick="skymechanics.submiterHandler(this)">
                        <input type="hidden" data-prompt="true" data-title="${__('crm.finance.correct_amount')}" data-name="amount" value="${row.amount}"/>
                        <button class="ui green small icon button submit">
                            <i class="ui checkmark icon"></i>
                            ${__('crm.approve')}
                        </button>
                    <div><br/>`):''
                )
                +((row.transaction&&row.transaction.type)?`<small>${row.transaction.type}</small><br/>`:'')
                +'<i class="first order icon"></i><small>Order ID: '+row.order_id+'</small><br/>'
                +'<i class="sun icon"></i><small>Trx ID:'+row.transaction_id+'</small><br/>'
                +(row.message?'<i class="info icon"></i><small>Error: '+row.message+'</small>':'')
                +`<small>${raw?crm.json2html(raw):'-'}</small>`
                +'</td>').appendTo($tr);


            $tr.appendTo($c)
            total+=(row.error == 0)?parseFloat(row.amount):0;
        });
        page.paginate(d,'user-transactions',$c,`Amount: &nbsp;&nbsp;<span class="ui header totalAmount" number="${total}">${total.dollars()}</span>`);
        $('.list-totals .totalAmount').animateNumber({number: total,numberStep: function(now, tween) {$(tween.elem).html(now.dollars());}}).prop('number', total);;
        $('[data-name=search]:visible').each(function(){
            const $that=$(this),keyword=$that.val();
            // console.debug('search field need mark',keyword,$("table:visible tbody tr td").length);
            $("table:visible tbody tr td").unmark({
                done: function() {
                    $("table:visible tbody tr td").mark(keyword, {});
                }
            });
        })
    }
    deposits($c,d){
        var $t=$c.find('.table tbody'),bm = {
            ctx:$c.find('.chart').get(0),
            datap:{},
            datad:{},
            dataa:{}
        };
        $t.html('');
        for(var i in d){
            var row=d[i],$tr=$('<tr></tr>').appendTo($t), manager= row.manager_name+' '+row.manager_surname,office=row.office;
            $('<td><a href="javascript:0;" onclick="crm.user.card('+row.manager_id+')">'+manager+'</a<</td>').appendTo($tr);
            $('<td>'+row.office+'</td>').appendTo($tr);
            // $('<td class="right aligned">'+parseFloat(row.process).currency('T')+'</td>').appendTo($tr);
            $('<td class="right aligned">'+parseFloat(row.declined).currency('T')+'</td>').appendTo($tr);
            $('<td class="header right aligned">'+parseFloat(row.approved).currency('T')+'</td>').appendTo($tr);
            bm.datap[office]=(bm.datap[office])?bm.datap[office]:0;
            bm.datad[office]=(bm.datad[office])?bm.datad[office]:0;
            bm.dataa[office]=(bm.dataa[office])?bm.dataa[office]:0;
            bm.datap[office]+=parseFloat(row.process);
            bm.datad[office]+=parseFloat(row.declined);
            bm.dataa[office]+=parseFloat(row.approved);
        }
        bm.datap = splitObjectKeys(bm.datap);
        bm.datad = splitObjectKeys(bm.datad);
        bm.dataa = splitObjectKeys(bm.dataa);
        if(bm.ctx){
            if(crm.finance.charts['finance_kpi']) crm.finance.charts['finance_kpi'].destroy();
            crm.finance.charts['finance_kpi'] = new Chart(bm.ctx.getContext('2d'), {
                type: 'horizontalBar',
                data: {
                    labels: bm.dataa.keys,
                    datasets: [
                        // {
                        //     label: "Process",
                        //     backgroundColor: page.dashboard.options.chart.backgroundColors[5],
                        //     borderColor: page.dashboard.options.chart.borderColors[5],
                        //     data: bm.datap.values
                        // }
                        {
                            label: __('crm.finances.declined'),
                            backgroundColor: page.dashboard.options.chart.backgroundColors[2],
                            borderColor: page.dashboard.options.chart.borderColors[2],
                            data: bm.datad.values
                        },
                        {
                            label: __('crm.finances.approved'),
                            backgroundColor: page.dashboard.options.chart.backgroundColors[0],
                            borderColor: page.dashboard.options.chart.borderColors[0],
                            data: bm.dataa.values
                        }
                    ]
                },
                options: {
                    scales: {
                        xAxes: [{
                            stacked: true
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    }
                }
            });
        }
    }
    merchants($c,d){
        var cbd = {
                ctx:$c.find('.chart:first').get(0),
                data:{},
                raw:{}
            },
            cbm = {
                ctx:$c.find('.chart:last').get(0),
                data:{},
                raw:{}
            },
            cbo={}
            ,$t=$c.find('.table tbody');
        for(var i in d){
            var row=d[i],dt = new Date(row.created_at*1000),
                date = leftZeroPad(dt.getDate())+' '+system.months[dt.getMonth()],
                amount=parseFloat(row.amount),
                office=(row.user && row.user.manager)?crm.user.getMeta(row.user.manager.meta,'office'):'notset',
                merchant = row.merchant.name;
            cbd.raw[date]=(cbd.raw[date])?cbd.raw[date]:0;
            cbd.raw[date]+=amount;
            cbm.raw[merchant]=(cbm.raw[office])?cbm.raw[office]:0;
            cbm.raw[merchant]+=amount;
            cbo[office]=(cbo[office])?cbo[office]:{amount:0,total:0};
            cbo[office].amount+=amount;
            cbo[office].total++;
        }
        cbd.data = splitObjectKeys(cbd.raw);
        cbm.data = splitObjectKeys(cbm.raw);
        if(cbd.ctx){
            if(crm.finance.charts['merchants_by_day']) crm.finance.charts['merchants_by_day'].destroy();
            crm.finance.charts['merchants_by_day'] = new Chart(cbd.ctx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: cbd.data.keys,
                    datasets: [
                        {
                            label: __('crm.dashboard.deposits'),
                            borderColor: page.dashboard.options.chart.borderColors[0],
                            data: cbd.data.values
                        }
                    ]
                }
            });
        }
        if(cbm.ctx){
            if(crm.finance.charts['merchants_by_merchants']) crm.finance.charts['merchants_by_merchants'].destroy();
            crm.finance.charts['merchants_by_merchants'] = new Chart(cbm.ctx.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: cbm.data.keys,
                    datasets: [
                        {
                            label: __('crm.dashboard.deposits'),
                            backgroundColor: page.dashboard.options.chart.backgroundColors,
                            borderColor: page.dashboard.options.chart.borderColors,
                            data: cbm.data.values
                        }
                    ]
                }
            });
        }
        $t.html('');
        for(var i in cbo){
            $t.append('<tr><td>'+i+'</td><td class="right aligned">'+cbo[i].total+'</td><td class="right aligned"><strong>'+cbo[i].amount.currency('T')+'</strong></td></tr>')
        }
    }
}
