export class Partner {
    constructor() {
        this.__charts = {};
    };
    list($c, d) {
        $c.html('');
        d.data.map( (row,i) => {
            let tr = $('<tr data-class="user" data-id="' + row.id +'"></tr>').appendTo($c);
            let canFollow = crm.user.getMeta(row.meta,'can_follow');
            canFollow = canFollow?JSON.parse(canFollow):{
                partner:currentAuth.id,
                can:false
            };
            tr.append(`<td class="center aligned">${dateFormat(row.created_at)}</td>`);
            tr.append(`<td>${crm.user.showCustomer(row)}</td>`);
            tr.append(`<td>
                    <div class="ui slider checkbox submiter" data-action="/json/user/meta?meta_name=can_follow" data-name="user-can-follow">
                        <input type="hidden" data-name="user_id" value="${row.id}" />
                        <input type="hidden" data-name="meta_value" value='${JSON.stringify(canFollow)}'}/>
                        <input class="switcher" type="checkbox" data-name="" ${canFollow.can?'checked="checked"':''}/>
                        <input type="hidden" class="submit"/>
                        <label>${__('crm.customers.can_follow')}</label>
                    </div>

                </td>`);
            tr.append('<td>' + (row.comments.length ? '<i>' + row.comments[row.comments.length - 1].comment +'</i><br/><small>' + dateFormat(row.comments[row.comments.length - 1].created_at, false, 'simple') +'</small>' : '') + '</td>');
        })
        $('.switcher').on('change',function(){
            const $p = $(this).parent();
            let cf = JSON.parse($p.find('[data-name=meta_value]').val());
            cf.can = !cf.can;
            $p.find('[data-name=meta_value]').val(JSON.stringify(cf));
            $p.find('.submit').click();
        });
        page.paginate(d, 'partner-user-list', $c);
    }
    dashboard($c, d) {
        var rep = {
                ctx: $c.find('#chart__affilate_bycountry').get(0),
                data: {},
                raw: {}
            },
            rep1 = {
                ctx: $c.find('#chart__affilate_date').get(0),
                data: {},
                raw: {}
            },
            totalDeposit = 0;
        for (var i in d) {
            var u = d[i],
                name = u.name + ' ' + u.surname,
                status = u.status.title,
                country = (u.country && u.country.length) ? u.country[0].meta_value :'',
                date = new Date((u.created_at - (u.created_at % (24 * 60 *60))) * 1000),
                deposits = 0;
            for (var j in u.deposits) deposits += parseFloat(u.deposits[j].amount);
            rep.raw[country] = (rep.raw[country]) ? rep.raw[country] : 0;
            rep.raw[country]++;
            rep1.raw[date] = (rep1.raw[date]) ? rep1.raw[date] : 0;
            rep1.raw[date] += deposits;
            totalDeposit += deposits;
        }
        rep.data = splitObjectKeys(rep.raw);
        rep1.data = splitObjectKeys(rep1.raw);
        // console.debug(rep,rep1);
        if (rep.ctx) {
            if (crm.affilate.__charts['affilate_by_countries']) crm.affilate
                .__charts['affilate_by_countries'].destroy();
            crm.affilate.__charts['affilate_by_countries'] = new Chart(rep.ctx
                .getContext('2d'), {
                    type: 'pie',
                    data: {
                        labels: rep.data.keys,
                        datasets: [{
                            label: "",
                            borderColor: page.dashboard.options
                                .chart.borderColors,
                            backgroundColor: page.dashboard.options
                                .chart.backgroundColors,
                            data: rep.data.values
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Quantity of customers by countries'
                        }
                    }
                });
        }
        if (rep1.ctx) {
            if (crm.affilate.__charts['affilate_by_days']) crm.affilate.__charts[
                'affilate_by_days'].destroy();
            crm.affilate.__charts['affilate_by_days'] = new Chart(rep1.ctx.getContext(
                '2d'), {
                type: 'bar',
                data: {
                    labels: rep1.data.keys,
                    datasets: [{
                        label: __('crm.dashboard.deposits'),
                        borderColor: page.dashboard.options
                            .chart.borderColors,
                        backgroundColor: page.dashboard.options
                            .chart.backgroundColors,
                        data: rep1.data.values
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Total Amount of deposits ' +
                            totalDeposit.currency('$', 2)
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                displayFormats: {
                                    quarter: 'hh:mm:ss'
                                }
                            }
                        }]
                    }
                }
            });
        }
    }
}
