export class Affilate {
    constructor() {
        this.__charts = {};
    };
    list($c, d) {
        $c.html('');
        for (var i in d.data) {
            var row = d.data[i],
                tr = $('<tr data-class="user" data-id="' + row.id +'"></tr>').appendTo($c),
                deposits = 0;

            let campaign = decodeURI(crm.user.getMeta(row.meta, 'campaign'));
            let comment = row.comments.length?row.comments[row.comments.length - 1]:false;
            try{campaign = JSON.stringify(JSON.parse(campaign), null, 2);}
            catch(e){campaign=false}
            for (var j in row.deposits) deposits += parseFloat(row.deposits[j].amount);

            tr.append('<td class="center aligned">' + dateFormat(row.created_at) +'</td>');
            tr.append('<td><code>#' + row.id + '</code> ' + row.name + ' ' +row.surname + ((system.options.get('show_email_2_affilate')) ?'<br><small><i class="icon mail' + ((row.email_verified =="1") ? '' : ' outline') + '"></i>' + row.email +'</small>' : '')
                // +'<br><small><i class="icon phone"></i>'+row.phone+'</small>'
                + '<br><small><i class="icon world"></i>' + crm.user.getMeta(
                    row.meta, 'country') + '</small>' + '</td>');
            tr.append('<td>' + row.status.title + '</td>');
            tr.append('<td>' + deposits.currency('T') + '</td>');
            const commentRow = (comment!==false) ?`<b>Comments:</b><i>${comment.comment}</i><br/><small>${dateFormat(comment.created_at, false, 'simple')}</small><br/>`: '';
            const campaignRow = (campaign!==false)?`<b>Campaign:</b>${campaign}`:'';
            tr.append(`<td>${commentRow}${campaignRow}</td>`);
        }
        page.paginate(d, 'affilate-user-list', $c);
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

export default Affilate;
