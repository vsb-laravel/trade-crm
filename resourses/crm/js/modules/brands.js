export class Brands {
    constructor(){
        this.__currentPeriod = 'm';
    };
    byperiod(that,p){
        $('.byperiod .active').removeClass('active');
        $('.date').fadeOut(function(){
            $('.date.'+p).fadeIn();
        });
        $(that).addClass('active');
        // console.debug($(that).text());
        $('#brands_period').text($(that).text());
        crm.brands.__currentPeriod = p;
        cf.touch('finance-report-brands');
    };
    calculatePercent(amt,percent){
        var percents = {200000:10,500000:8,1000000:6},cur=10;
        if(percent)cur = percent;
        else {
            for(var i in percents){
                if(amt<=i)cur = percents[i];break;
            }
        }
        return {value:amt*cur/100,percent:cur};
    };
    info(id){
        let $c = $('#brand_info'),jsonPrint=function(s){
            let r = '',j={};
            if(typeof(s)==='string'){
                try{j= JSON.parse(s);}
                catch(e){console.warn(s,'is not VALID JSON');}
            }else j=s;
            for(let i in j){
                r += '<b>'+i+'</b>:&nbsp;<code style="color:#999;font-weight:100;">'+j[i]+'</code>  ';
            }
            return r;
        };
        $.ajax({
            url:'/api/brand/'+id,
            type:'get',
            beforeSend(){
                $c.html('');
                $c.addClass('loader active ui');
            },
            success(u,s,x){
                let $f = $('<div class="column sixteen wide"></div>').appendTo($c),
                    $t = $('<div class="column sixteen wide"></div>').appendTo($c),
                    t = {};
                $f.append('<h3>Brand <span style="font-weight:100">"'+u.title+'"</span>');
                $f = $('<div class="ui form"></div>').appendTo($f);
                $f.append(
                    '<div class="field submiter loadering" data-action="/api/brand/'+u.id+'" data-method="put" data-name="brand-off-{{$option->id}}">'
                        +'<div class="ui slider checkbox resource">'
                            +'<input  data-name="value" type="checkbox" '+((u.active && u.active.value=="1")?' checked="checked"':'')+' name="can_use_crm" onchange="$(this).closest(\'.submiter\').find(\'.submit\').click()"/>'
                            +'<label>Active CRM system</label>'
                        +'</div>'
                        +'<input type="hidden" data-name="action" value="option" />'
                        +'<input type="hidden" data-name="option" value="can_use_crm" />'
                        // +'<input type="hidden" data-name="_token" value="{{ csrf_token() }}" />'
                        +'<input type="hidden" class="submit" />'
                    +'</div>'
                );
                $t = $('<table class="ui table"></table').appendTo($t);
                $t.append('<caption>Invoices for today</caption>');
                $t.append('<thead><tr>'
                    // +'<th class="two wide">Time</th>'
                    +'<th class="two wide">Amount</th>'
                    +'<th class="fourteen wide">Details</th>'
                    +'</tr></thead>');
                if(u.invoices.length)u.invoices.map((row,i) => {
                    $t.append('<tr>'
                        // +'<td class="center aligned">'+row.created_at.datetime({show:{time:true,date:false},style:'simple'})+'</td>'
                        +'<td class="right aligned">'+row.amount.currency('$')+'</td>'
                        +'<td class="small">'+jsonPrint(row.raw)+'</td>'
                        +'</tr>');
                });
                else $t.append('<tr><td>No one</td></tr>');
                skymechanics.reload();
            },
            complete(x,s){
                $c.removeClass("active loader");
            }
        });
    };
    list($c,d){
        var rep={ctx:$c.find('.chart').get(0),data:{},raw:{}},amountSum=function(l){
            var res=0;
            for(var i in l){
                res+=parseFloat(l[i].amount);
            }
            return res;
        },calcToday=function(l){
            let res={count:0,amt:0};
            const td = truncDay((new Date()).getTime());
            for(var i in l){
                if(truncDay(l[i].created_at*1000) == td){
                    res.count+=1;
                    res.amt+=parseFloat(l[i].amount);
                }
            }
            return (res.count==0)?false:res;
        },totalDeposit=0,totalPercent=0,$t=$c.find('#brands_total tbody'),$foot=$t.parent().find('tfoot');
        $t.html('');
        for(var i in d){
            var u = d[i],
                amt = amountSum(u.invoices),total = (u.invoices)?u.invoices.length:'-',
                perc = (u.id==8)?crm.brands.calculatePercent(amt,7):crm.brands.calculatePercent(amt),
                calc = calcToday(u.invoices);
            rep.raw[u.title]=(rep.raw[u.title])?rep.raw[u.title]:0;
            rep.raw[u.title]+=amt;
            calc = (calc==false)?'':`<div class="ui tag olive label">+${calc.amt.currency('$',2)} (${calc.count})</div>`;
            $t.append('<tr  class="'+((total==0 || total=='-')?'negative':'positive')+'">'
                +'<td>'
                    +'<h3><a href="#brand_info" onclick="crm.brands.info('+u.id+')" style="position:relative;">'+u.title+'</a>'+calc+'</h3>'
                    +'<a href="'+u.url+'" target="_blank"><i class="hashtag icon"></i>'+u.url+'</a>'
                    // +'<div class="field submiter loadering" data-action="/api/brand/'+u.id+'" data-method="put" data-name="brand-off-{{$option->id}}">'
                    //     +'<div class="ui slider checkbox resource">'
                    //         +'<input  data-name="value" type="checkbox" '+((u.active && u.active.value=="1")?' checked="checked"':'')+' name="can_use_crm" onchange="$(this).closest(\'.submiter\').find(\'.submit\').click()"/>'
                    //         +'<label>Active CRM system</label>'
                    //     +'</div>'
                    //     +'<input type="hidden" data-name="action" value="option" />'
                    //     +'<input type="hidden" data-name="option" value="can_use_crm" />'
                    //     // +'<input type="hidden" data-name="_token" value="{{ csrf_token() }}" />'
                    //     +'<input type="hidden" class="submit" />'
                    // +'</div>'
                +'</td>'
                +'<td>'+total+'</td>'
                +'<td class="right aligned">'
                    +amt.currency('$',2)
                    +'<br/><small class="color grey">'+perc.value.currency('$',2)+' ('+perc.percent+'%)</small>'
                +'</td>'
                +'</tr>');
            // console.debug(totalDeposit,isNaN(amt)?0:amt);
            totalDeposit+=isNaN(amt)?0:amt;
            totalPercent+=perc.value;
        }
        $foot = ($foot.length)?$foot:$('<tfoot></tfoot').appendTo($t.parent());
        $foot.html('');
        $foot.append('<tr><td colspan=3 class="right aligned ui header">'
            +totalDeposit.currency('$',2)
            +'<br/><small class="color grey">'+totalPercent.currency('$',2)+'</small>'
        +'</td></tr>');
        rep.data = splitObjectKeys(rep.raw);
        if(crm.finance.charts['brands_chart']) crm.finance.charts['brands_chart'].destroy();
        crm.finance.charts['brands_chart'] = new Chart(rep.ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: rep.data.keys,
                datasets: [
                    {
                        label: "",
                        borderColor: page.dashboard.options.chart.borderColors,
                        backgroundColor:page.dashboard.options.chart.backgroundColors,
                        data: rep.data.values
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Total Amount of deposits '+totalDeposit.currency('$',2)
                }
                // ,scales: {
                //     xAxes: [{
                //         type: 'time',
                //         time: {
                //             displayFormats: {
                //                 quarter: 'hh:mm:ss'
                //             }
                //         }
                //     }]
                // }
            }
        });
        cf.reload();
    };
};
