import {User} from './user/user';
import {Defer} from '../core/defer';
export class Users{
    constructor() {
        this._data={};
        this.current = null;
        this.kyc = {
            accept: function(doc, user_id) {
                var $c = $('#kyc_' + user_id + '_' + doc);
                $.ajax({
                    url: '/user/kyc/' + doc +
                        '/update/verified',
                    success: function() {
                        $c.find('.verified').fadeIn();
                    }
                });
            },
            decline: function(doc, user_id) {

                var $c = $('#kyc_' + user_id + '_' + doc);
                $.ajax({
                    url: '/user/kyc/' + doc +
                        '/update/declined',
                    success: function() {
                        $c.fadeOut();
                    }
                });
            },
            delete: function(doc, user_id) {
                var $c = $('#kyc_' + user_id + '_' + doc);
                $.ajax({
                    url: `/user/kyc/${doc}/delete`,
                    success: function() {
                        $c.remove();
                    }
                });
            }

        };
        this.calendar = {
            init: function(id) {
                scheduler.config.xml_date = "%Y-%m-%d %H:%i";
                scheduler.templates.week_date_class = function(date,
                    today) {
                    if (date.getDay() == 0 || date.getDay() ==
                        6)
                        return "weekday";
                    return "";
                };
                scheduler.init(id, new Date(2018, 0, 13), "week");
                scheduler.load("./Scheduler/data/events.xml");
            }
        };
        this.tune = {
            getcurdata: function() {
                var v = $("#user_chart_tune").text().replace(/%/i,
                    "");
                v = isNaN(v) ? 0 : parseInt(v);
                return {
                    tune: v,
                    user: crm.user.current
                };
            },
            setcurdata: function(v) {

                $("#user_chart_tune").text(v.tune + '%');

            },
            send: function(v) {
                var chart;
                $.ajax({
                    url: '/json/user/meta',
                    dataType: "json",
                    data: {
                        meta_name: 'user_chart_tune',
                        meta_value: v.tune,
                        user_id: v.user
                    },
                    success: function(d) {
                        graphControl.makeChart(6000,
                            "user_chart", v.user,
                            chart);
                    }
                });
            },
            up: function() {
                var d = this.getcurdata();
                if (d.tune < 0) d.tune = 5;
                else if (d.tune <= 10) d.tune += 5;
                this.send(d);
                this.setcurdata(d);
            },
            real: function() {
                var d = this.getcurdata();
                d.tune = 0;

                this.send(d);
                this.setcurdata(d);
            },
            down: function() {
                var d = this.getcurdata();
                if (d.tune > 0) d.tune = -5;
                else if (Math.abs(d.tune) <= 10) d.tune -= 5;
                this.send(d);
                this.setcurdata(d);
            }
        };
        this.mail = {
            choose:function(that){
                const val = $(that).val(),
                    form = $('.mail-params'),
                    findOrSet=function(n,v){
                        form.find(`[data-name="${n}"]`).length
                            ?form.find(`[data-name="${n}"]`).val(v)
                            :form.append(`<input type="hidden" data-name="${n}" value="${v}"/>`);
                    };
                switch(val){
                    case 'yandex':
                        findOrSet('mail.imap.host','imap.yandex.ru');
                        findOrSet('mail.imap.port',993);
                        findOrSet('mail.imap.encryption','ssl');
                        findOrSet('mail.smtp.host','smtp.yandex.ru');
                        findOrSet('mail.smtp.port',465);
                        findOrSet('mail.smtp.encryption','ssl');
                    break;
                    case 'gmail':
                        findOrSet('mail.imap.host','imap.gmail.com');
                        findOrSet('mail.imap.port',993);
                        findOrSet('mail.imap.encryption','ssl');
                        findOrSet('mail.smtp.host','smtp.gmail.com');//'smtp.gmail.com', 465, 'ssl'
                        findOrSet('mail.smtp.port',465);
                        findOrSet('mail.smtp.encryption','ssl');
                    break;
                }
                $('.mail-params').slideDown();
            }
        };
        this.data = {}
        this.info = this.info.bind(this);
        this.reload = this.reload.bind(this);
        this.adminTreeCollapsed = {};
        this.admintree = this.admintree.bind(this);
        this.card = this.card.bind(this);
        this.list = this.list.bind(this);
        this.__loaded();
    };
    card(id,tab="kyc",that=null){
        const users = crm.user._data;
        const lastIcon = (that)?$(that).html():null

        if(that) $(that).html(`<i class="ui circle notched loading icon"></i>`);
        // //console.debug(id,id instanceof $)
        if(id instanceof $){
            let list = [];
            id.each(function(){
                const id = $(this).attr('data-id');
                const ucard = new User(users[id],tab);
                list.push(ucard);
                $(this).prop('checked',false);
            })
            cardContainer.append(list).then( () => {$(that).html(lastIcon)});
            return;
        }
        users[id]?cardContainer.append(new User(users[id],tab)).then( () => {$(that).html(lastIcon)}) :this.info(id,tab);
    }
    info(id,tab="kyc"){
        const that = this;
        if (id == undefined) return;
        if(that._data[id]){cardContainer.append(new User(that._data[id],tab));return;}
        else {
            $.ajax({
                url: "/json/user/" + id,
                dataType: "json",
                data: {tab: tab},
                success: function(d, x, s) {
                    that._data[id] = d;
                    cardContainer.append(new User(that._data[id],tab))

                },
            });
            return;
        }
        this.current = id;
        const $dash = page.modalPreloaderStart(`user_${id}_dashboard`);
        $.ajax({
            url: "/html/user/" + id,
            dataType: "html",
            data: {tab: tab},
            success: function(d, x, s) {
                if(d == "false" || d == false){
                    $dash.html(`<div class="header">Access denied</div><div class="content"></div>`);
                }
                page.modalPreloaderEnd($dash,d,true);
            },
        });
    }
    reload(){
        const id = this.current;
        const tab = $(`#user_${id}_dashboard .tabular .item.active`).attr('data-tab');
        //console.debug('crm user reload',this.current,tab);
        const $dash = page.modalPreloaderStart(`user_${id}_dashboard`);
        $.ajax({
            url: "/html/user/" + id,
            dataType: "html",
            data: {tab: tab},
            success: function(d, x, s) {
                if(d == "false" || d == false){
                    $dash.html(`<div class="header">Access denied</div><div class="content"></div>`);
                }
                page.modalPreloaderEnd($dash,d,true);
            },
        });
    }
    __loaded(){
        $('#body_event_trigger').trigger('crm.user::loaded');
    }
    accountsTouch(d, $c) {
        cf.touch('user-accounts');
    }
    showManager(manager,title='Manager'){
        if(!manager)return '';
        return `<b>${title}:</b>`
            +(system.user.rights_id>manager.rights_id)?'<a href="javascript:crm.user.card(' +manager.id + ')">' + manager.title + "</a>":manager.title;
    }
    showCustomer(row){
        let c2c = undefined;
        if (system.telephony) {
            for (let i in system.telephony.get()) {
                const tel = system.telephony.list[i];
                const userExt = crm.user.getMeta(system.user.meta, tel.name +'_ext');
                c2c = (c2c) ? c2c : '';
                if (userExt.length && tel.enabled == "1") c2c +=
                    '<br><small><i class="icon phone"></i><a href="javascript:crm.telephony.link(' +
                    i + ',\'' + userExt + '\',\'' + row.phone +
                    '\')" target="_blank">' + row.phone +
                    '</a></small>'
            }
        }
        const country = `<br><small><i class="icon world"></i>${crm.user.getMeta(row.meta, 'country')}</small>`
        return `<code>#${row.id}</code>
            <a onclick="crm.user.card(${row.id})">${row.title}</a>&nbsp;&nbsp;
            <small><i class="icon mail` + ((row.email_verified == "1") ? '' : ' outline') + '"></i>' + row.email + '</small>' + (c2c || '<br><small><i class="icon phone"></i>' + row.phone + '</small>')+
            `${country}`

    }
    accounts($c, d) {
        $c.html('');
        for (let i in d) {
            let account = d[i],
                $i = $('<div class="item"></div>').appendTo($c);
            $i.append('<div class="ui tiny image"><i class="ic ic_' + account.currency.code.toLowerCase() + '"></i></div>');
            $('<div class="content"></div>').appendTo($i)
                .append('<div class="header">' + account.type + '</div>')
                .append('<div class="description">' + account.amount.currency() +'</div>')
                .append('<div class="extra">' +'<div class="submiter" data-action="/account/' +account.id +'" data-method="delete" data-callback="crm.user.accountsTouch"><input type="hidden" data-name="_token" value="' +window.Laravel.csrfToken +'"/><div class="ui right floated red button submit"><i class="times icon"></i>Close</div></div>' +
                    ((account.status == 'open') ?
                        '<i class="green check icon"></i>' :
                        '<i class="grey times icon"></i>') + account.status +
                    '</div>');
        }
        cf.reload();
    }
    added(d, $c) {
        if (d.error) {
            alert(d.message);

        } else {
            crm.user.touch();
            $c.modal('hide');
        }

    }
    online($c, d) {
        let onlineCounts = 0,
            $l = $c.find('.label'),
            $s = $c.find('.menu');
        $s.html('');
        // //console.debug('Online users',$l, $s, d);
        d.map( (row,i) => {
            $s.append(`<a class="item" onclick="crm.user.card(${row.id})"><i class="user` + ((row.rights_id > 1) ? ' circle' :'') + ` icon"></i>&nbsp;${row.title}</a>`)
            onlineCounts++;
        });
        $l.text(onlineCounts);
        if(onlineCounts){$c.show();$l.show();}else $c.hide();
    }
    getMeta(l, n, type='string') {
        let ret = false;
        for (var i in l) {
            var m = l[i];
            if (m.meta_name == n) {
                ret = m.meta_value;
                break;
            }
        }
        if(ret){
            try{
                switch(type){
                    case 'json':
                        ret = JSON.parse(ret);
                        break;
                }
            }catch(e){
                console.error('cast data error',type,ret,e)
            }
        }
        return ret?ret:'';
    }
    adminTouch() {
        cf.touch('admin-tree');
        cf.touch('admin-list');
    }
    touch() {
        cf.touch('admin-tree');
        cf.touch('user-list');
        cf.touch('user-log');
        cf.touch('deal-list');
        cf.touch('user-accounts');
        cf.touch(`user-finance-${crm.user.current}`);
        $('#customers_count').text(crm.user.data.total);
    }
    showList(opts) {
        $.ajax({
            url: '/html/user',
            dataType: "html",
            data: opts,
            success: function(d, x, s) {
                var container = $(d).appendTo('body');
                cf.reload();
                cf._loaders['user-list'].opts.data = {};
                // cf._loaders['user-list'].execute();
                for (var i in opts) {
                    container.find('[data-name="' + i + '"]')
                        .val(opts[i]).change();
                }
            }
        });
        return;
    }
    list(container, d, x, s) {
        crm.user.data=d;
        var rights = parseInt($('[data-id=user-rights]').val()),
            showBalances = (rights < 2) ? true : false;
        if (!showBalances) {
            $('#users .client-only').hide();
            $('#users .notclient-only').show();
        } else {
            $('#users .client-only').show();
            $('#users .notclient-only').hide();
        }
        // //console.debug(rights,showBalances);
        container.html('');
        for (var i in d.data) {
            let row = d.data[i],
                tr = $('<tr data-class="user" data-id="' + row.id +'"></tr>').appendTo(container),
                c2c = undefined;
            this._data[row.id]=row;
            if (system.telephony) {
                for (let i in system.telephony.get()) {
                    let tel = system.telephony.list[i],
                        userExt = crm.user.getMeta(system.user.meta, tel.name +
                            '_ext');
                    c2c = (c2c) ? c2c : '';
                    if (userExt.length && tel.enabled == "1") c2c +=
                        '<br><small><i class="icon phone"></i><a href="javascript:crm.telephony.link(' +
                        i + ',\'' + userExt + '\',\'' + row.phone +
                        '\')" target="_blank">' + row.phone +
                        '</a></small>'
                }
            }
            tr.append(
                '<td><div class="ui checkbox"><input type="checkbox" class="bulker" data-name="user_selected" value="user_' +row.id + '" data-id="' + row.id +'" /><label></label></div></td>'+
                '<td class="center aligned">' + dateFormat(row.created_at) +'</td>'+
                '<td>'+crm.user.showCustomer(row)+'</td>');

            const $td1 = $(`<td class="ui right aligned"></td>`).appendTo(tr);
            new Defer(row,'user',(row)=>{
                $td1.html(row.balance.currency('USD',2))
                let $td = $(`<td class="ui right aligned"></td>`).appendTo(tr);
                    let kyc = crm.user.getMeta(row.meta, 'kyc');
                    switch (kyc) {
                        case "true":
                        case "2":
                            kyc = '<i class="hourglass full icon helper" data-html="KYC status:&lt;b&gt;Full&lt;/b&gt;"></i>';
                            break;
                        case "1":
                            kyc = '<i class="hourglass half icon helper" data-html="KYC status:&lt;b&gt;Partial&lt;/b&gt;"></i>';
                            break;
                        default:
                            kyc = '<i class="hourglass empty icon helper" data-html="KYC status:&lt;b&gt;None&lt;/b&gt;"></i>';
                            break;
                    }
                    $td.html((row.rights?row.rights.title:'') + '<br/><small>' + (row.status?row.status.title:'') + '</small>' + '<br/>KYC: ' + kyc + '</td>');
                $td = $(`<td class="ui right aligned"></td>`).appendTo(tr);
                let campaign = decodeURI(crm.user.getMeta(row.meta, 'campaign'));
                    try{
                        campaign = JSON.stringify(JSON.parse(campaign), null, 2);
                    }
                    catch(e){}
                    const ftd = crm.user.getMeta(row.meta, 'ftd','json');
                    let comment = (row.comments&&row.comments.length)?row.comments[0]:false;
                    const commentRow = (comment!==false) ?`<b>Last comments:</b><i><p>${comment.comment}</p></i><br/><small>${dateFormat(comment.created_at, false, 'simple')}</small><br/>`: '';
                    $td.html(crm.user.showManager(row.manager)
                        + '<br/><small>' +((row.manager) ? crm.user.getMeta(row.manager.meta,'office') : '') + '</small>'
                        + '<br/>'+ crm.user.showManager(row.affilate,'Affilate')
                            + `<br/>${commentRow}`
                            + ((campaign) ?'<br/><b>Campaign:</b> <pre>' + campaign+'</pre>' : '')
                            + (row.source?`<br/><small>Source: ${row.source}</small>`:'')
                            + ((ftd && ftd.amount)?(`<br>FTD: ` + crm.user.showManager(ftd.manager,'FTD') + `&nbsp; `+ftd.amount.dollars()):'')
                    );
                tr.append('<td class="center aligned">' + dateFormat(parseInt(crm.user.getMeta(row.meta, 'last_login'))) + '<br>' +crm.user.getMeta(row.meta, 'last_login_ip') + '</td>');
            },'meta');

        }
        container.visibility({
                initialCheck:false,
                // continuous:true,
                once:false,
                onTopVisible: function(calculations) {
                    ////console.debug('Top',calculations)
                },
                onTopPassed: function(calculations) {
                    //console.debug('Top passed',calculations)
                },
                onBottomVisible: function(calculations) {
                    //console.debug('onBottomVisible',calculations)
                }
            });
        page.paginate(d, 'user-list', container, `<div class="ui basic icon button open-in-cards" onclick="crm.user.card($('[data-name=user_selected]:checked'),'kyc',this)" style="display:none;"><i class="address card outline icon"></i> ${__('crm.open_in_cards')}</div>`);
        container.find('[data-name=user_selected]').on('click change keyup',
            function(e) {
                if ($('[data-name=user_selected]:checked').length) {
                    $('.user.bulk').show();
                    $('.open-in-cards').show();
                    // skymechanics.reload();
                }
                else {
                    $('.user.bulk').hide();
                    $('.open-in-cards').hide();
                }
            })
        container.parent().parent().find('.form #sendMail:not(.bulk.assigned)').on('click', function() {
            var mail = $(this).closest('.form').find('#mailsTemplate').dropdown('get value'),
                val = $(this).closest('.form').find('#mailsText').val();
            $('[data-name=user_selected]').each(function() {
                var id = $(this).attr('data-id'),
                    $that = $(this).parent();
                if ($that.checkbox('is checked') && id) {
                    //console.debug('sending mail [' + mail +', ' + val + '] to ' + id);
                    $.ajax({
                        url: '/mail/send',
                        data: {
                            user_id: id,
                            sender_id: system.user.id,
                            mail_id: mail,
                            text: val
                        },
                        success: function() {
                            $that.checkbox(
                                'uncheck');
                        }
                    });
                }
            }).promise().done(function() {
                crm.mail.touch();
            });
        }).addClass('assigned');
        $('[data-name=search]:visible').each(function(){
            const $that=$(this),keyword=$that.val();
            // //console.debug('search field need mark',keyword,$("table:visible tbody tr td").length);
            $("table:visible tbody tr td").unmark({
                done: function() {
                    $("table:visible tbody tr td").mark(keyword, {});
                }
            });
        })
    }
    admins(container, d, x, s) {
        var rights = parseInt($('[data-id=user-rights]').val())
            // //console.debug(rights,showBalances);
        container.html('');
        for (var i in d.data) {
            var row = d.data[i];
            var tr = $('<tr data-class="user" data-id="' + row.id +
                '"></tr>').appendTo(container);
            switch (row.rights_id) {
                case "0":
                    tr.addClass('negative');
                    break;
                case "10":
                    tr.addClass('positive');
                    break;
            }

            tr.append(
                '<td><div class="ui checkbox"><input type="checkbox" class="bulker" data-name="admin_selected" value="user_' +
                row.id + '" data-id="' + row.id +
                '" /><label></label></div></td>');
            tr.append('<td class="center aligned">' + dateFormat(row.created_at) +
                '</td>');
            tr.append('<td>#' + row.id + ' <a onclick="crm.user.card(' +row.id + ')">' + row.name + ' ' + row.surname + '</a>' +
                '<br><small><i class="icon mail' + ((row.email_verified ==
                    "1") ? '' : ' outline') + '"></i>' + row.email +
                '</small>' + '<br><small><i class="icon phone"></i>' +
                row.phone + '</small>' +
                '<br><small><i class="icon world"></i>' + crm.user.getMeta(
                    row.meta, 'country') + '</small>' + '</td>');
            tr.append('<td class="">' + row.office +'</td>');
            tr.append('<td class="right aligned">' + row.users_count +'</td>');
            tr.append('<td class="ui header">' + row.rights.title + '</td>');
            tr.append('<td>' + ((row.manager) ?
                    '<b>Administrator:</b><a href="javascript:crm.user.card(' +
                    row.manager.id + ')">' + row.manager.name + ' ' +
                    row.manager.surname + "</a>" : '') + '<br><small>' +
                ((row.manager) ? crm.user.getMeta(row.manager.meta,
                    'office') : '') + '</small>' + '</td>');
            tr.append('<td class="center aligned">' + dateFormat(parseInt(
                    crm.user.getMeta(row.meta, 'last_login'))) + '<br>' +
                crm.user.getMeta(row.meta, 'last_login_ip') + '</td>');
        }
        page.paginate(d, 'admin-list', container);
        container.find('[data-name=admin_selected]').on(
            'click change keyup',
            function(e) {
                if ($('[data-name=admin_selected]:checked').length) {$('.admin.bulk').show(); skymechanics.reload();}
                else $('.admin.bulk').hide();
            })
        container.parent().parent().find(
            '.form #sendMail:not(.bulk.assigned)').on('click', function() {
            var mail = $(this).closest('.form').find(
                    '#mailsTemplate').dropdown('get value'),
                val = $(this).closest('.form').find('#mailsText').val();
            $('[data-name=user_selected]').each(function() {
                var id = $(this).attr('data-id'),
                    $that = $(this).parent();
                if ($that.checkbox('is checked') && id) {
                    console.debug('sending mail [' + mail +
                        ', ' + val + '] to ' + id);
                    $.ajax({
                        url: '/mail/send',
                        data: {
                            user_id: id,
                            sender_id: system.user.id,
                            mail_id: mail,
                            text: val
                        },
                        success: function() {
                            $that.checkbox(
                                'uncheck');
                        }
                    });
                }
            }).promise().done(function() {
                crm.mail.touch();
            });
        }).addClass('assigned');
    }

    log($c, d) {
        $c.html('');
        d.data.map( (row,i) => {
            let $s = $(`<tr id="log-${row.id}" class="user-log user-log-${row.type}"></tr>`).appendTo($c);
            $('<td class="user-log-date">' + dateFormat(row.created_at,true, 'simple') + '</td>').appendTo($s);
            let $o = $('<td class="user-log-object"></td>').appendTo($s);
            switch (row.type) {
                case 'deal.open':
                    $o.html('<b class="ui header small">Trade opened</b>' + row.description + ' <button class="ui button" onclick="crm.deal.info(' +row.object_id + ')">View</button>'+'<br/><small>'+crm.json2html(row.object?row.object:{})+'</small>');
                    break;
                case 'deal.close':
                    $o.html('<b class="ui header small">Trade closed</b>' + row.description + ' <button class="ui button" onclick="crm.deal.info(' +row.object_id + ')">View</button>'+'<br/><small>'+crm.json2html(row.object?row.object:{})+'</small>');
                    break;
                case 'deal.drop':
                    $o.html('<b class="ui header small">Autoclosed trade</b> ' + row.description + '- <button class="ui button" onclick="crm.deal.info(' +row.object_id + ')">View</button>'+'<br/><small>'+crm.json2html(row.object?row.object:{})+'</small>');
                    break;
                case 'login':
                    $o.html( row.description);
                    break;
                case 'deposit':
                    let status = 'processing';
                    if(row.object.code==200) status = 'success';
                    else if(row.object.code>200) status='failed'
                    $o.html('<div class="ui header small">Deposit on ' + (row.object.amount?currency.value(row.object.amount,(row.object.currency)?row.object.currency.code:'USD'):'') + '. Status = ' +status+'</div>'+row.description +'<br/><small>'+crm.json2html(row.object?row.object:{})+'</small>');
                    break;
                case 'credit':
                    $o.html('<div class="ui header small">Credit on ' + (row.object.amount?currency.value(row.object.amount,(row.object.currency)?row.object.currency.code:'USD'):'') + '. Status = ' + ((row.object.code <= 200) ? 'success' :'failed')+'</div>'+row.description +'<br/><small>'+crm.json2html(row.object?row.object:{})+'</small>');
                    break;
                case 'withdrawal':
                    $o.html('<div class="ui header small">Withdrawal on ' + currency.value(row.object.amount, (row.object.currency)?row.object.currency.code:'USD') +'. Status = ' + ((row.object.code <= 200) ?'success' : 'failed')+'</div>'+row.description +'<br/><small>'+crm.json2html(row.object?row.object:{})+'</small>');
                    break;
                case 'register':
                    $o.html(row.description);
                    break;
                default: $o.html( row.description +'<br/><small>'+crm.json2html(row.object?row.object:{})+'</small>');break;
            }
        })
        page.paginate(d, 'user-log', $c);
    }
    deposited(d,$c){
        if(d.type=='deposit'){
            if( d.merchant){
                if(d.merchant.enabled == "1") {
                    const was = parseFloat($('#user-total-deposits').data('value'));
                    const amount = parseFloat(d.amount);
                    //console.debug('total deposits',was,amount)
                    $('#user-total-deposits').animateNumber({number:(amount+was),numberStep:(now,tween)=>{$(tween.elem).html(now.currency());}});
                }
                if(d.merchant.enabled == "2" && d.merchant.title.match(/bonus/i)) {
                    const was = parseFloat($('#user-total-bonus').data('value'));
                    const amount = parseFloat(d.amount);
                    //console.debug('total deposits',was,amount)
                    $('#user-total-bonus').animateNumber({number:(amount+was),numberStep:(now,tween)=>{$(tween.elem).html(now.currency());}});
                }
            }
        }

        cf.touch('user-accounts');
        cf.touch(`user-finance-${crm.user.current}`);
    }
    transaction($c, d) {
        $c.html('');
        var first = true;
        let totals = {
            deposit:0,
            bonus:0,
            withdrawal:0
        };
        for (var i in d.data) {
            const row = d.data[i];
            const transactionClass = (row.code=='200')?'positive':((row.code=='0')?'':'negotive');
            if(row.type=='deposit'){
                if(row.merchant_id==3) totals.bonus +=parseFloat(row.amount);
                else totals.deposit +=parseFloat(row.amount);
            }
            else if( row.withdrawalStatus=='approved' && (row.type=='withdrawal' || row.type=='withdraw') ) totals.withdrawal += parseFloat(row.amount);
            let $s = $(`<tr id="transaction-${row.id} class="ui ${transactionClass} user-transaction user-transaction-${row.status} "></tr>`).appendTo($c);
            if (first) {
                first = false;
                const balance = parseFloat(row.accountBalance);
                $('.user-real-account-balance') //.animateNumber({row.accountBalance.currency('T')});
                    .animateNumber({
                        number: balance,
                        numberStep: function(now, tween) {
                            $(tween.elem).html(balance.currency('T'));
                        }
                    }).prop('number', balance);
            }
            $('<td class="user-transaction-id">' + row.id + '</td>').appendTo($s);
            $('<td class="center aligned user-transaction-date">' +dateFormat(row.created_at) + '</td>').appendTo($s);
            $('<td class="user-transaction-amount">' + row.amount.dollars() + '</td>').appendTo($s);
            $('<td class="user-transaction-merchant">' + row.merchant_name +'</td>').appendTo($s);
            $('<td class="user-transaction-type">' + row.type + '</td>').appendTo($s);
            var code = $('<td class="user-transaction-code"></td>').appendTo($s);
            // $('<span class="user-transaction-code-value">'+row.code+'</span>').appendTo(code);
            $('<span class="user-transaction-code-status"><i class="fa ' +((row.code == '200') ? 'fa-check-circle-o' : ((row.code =='0') ? 'fa-spin fa-fw fa-circle-o-notch' :'fa-minus-circle')) + '"></i></span>').appendTo(code);
            let withdrawalStr = '';
            if(row.type == 'withdraw'){
                if(row.withdrawalStatus == 'approved') withdrawalStr = `<i class="ui green checkmark icon"></i> ${__('crm.finance.approved')}`;
                else if(row.withdrawalStatus == 'declined') withdrawalStr = `<i class="ui red ban icon"></i> ${__('crm.finance.declined')}`;
                else if(row.withdrawalStatus == 'request') withdrawalStr = `${__('crm.finance.request')}`;
            }
            $(`<td class="user-transaction-actions">
            ${
                (row.code=='200' && row.type!='fee' && window.user.can.admin && row.type != 'withdraw')
                ?`<div class="submiter user-transaction-reverse" id="user_transactio_reverse" data-action="/transaction/${row.id}" data-method="delete" data-callback="crm.user.touch">
                    <input type="hidden" data-name="_token" value="${window.Laravel.csrfToken}" />
                    <button class="ui icon red submit button"><i class="ui ban icon"></i>${__('crm.reverse')}</button>
                </div>`
                :(
                    (row.type == 'withdraw' )?withdrawalStr:''
                )
            }
            </td>`).appendTo($s);
        }
        // //console.debug('totals:',totals)
        // $('#user-total-deposits').animateNumber({number:totals.deposit,numberStep:(now,tween)=>{$(tween.elem).html(now.currency());}}).prop('number',totals.deposit);
        // $('#user-total-bonus').animateNumber({number:totals.bonus,numberStep:(now,tween)=>{$(tween.elem).html(now.currency());}}).prop('number',totals.bonus);
        // $('#user-total-withdraws').animateNumber({number:totals.withdrawal,numberStep:(now,tween)=>{$(tween.elem).html(now.currency());}}).prop('number',totals.withdrawal);
        $('.user-account .input, .user-account input:visible').val('');
        $('.user-account .dropdown').dropdown('restore defaults');
        page.paginate(d, `user-finance-${crm.user.current}`, $c);
        cf.reload();
    }
    add() {
        let $c = $('<div class="ui modal submiter" data-action="/user/add/json" data-callback="crm.user.added" id="user_add"></div>').appendTo('#modals');
        $c.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
        $c.append('<div class="header"><i class="icon user outline"></i> New customer registration form</div>');
        let $bo = $('<div class="content ui form"></div>').appendTo($c),
            $b = $('<div class="fields"></div>').appendTo($bo);
        $('<div class="field eight wide"><label>Name</label><div class="ui input"><input type="text" name="name" data-name="name" placeholder="Name" required></div></div>').appendTo($b);
        $('<div class="field eight wide"><label>Surname</label><div class="ui input"><input type="text" name="surname" data-name="surname" placeholder="Surname"  required/></div></div>').appendTo($b);
        $('<h4 class="ui dividing header">Contacts</h4>').appendTo($bo);
        $b = $('<div class="fields"></div>').appendTo($bo);
        $('<div class="field eight wide"><label>Email</label><div class="ui input"><input type="email" name="email" data-name="email" placeholder="Nameaddress@servername.com"  required></div></div>').appendTo($b);
        $('<div class="field eight wide"><label>Phone</label><div class="ui input"><input type="tel" name="phone" data-name="phone" placeholder="Phone number"  required/></div></div>').appendTo($b);
        $b = $('<div class="fields"></div>').appendTo($bo);
        $('<div class="field eight wide"><label>Country</label><select class="ui search dropdown" name="country" data-title="Choose country" data-name="country" required>'+system.countries.toOptionList() + '</select>').appendTo($b);
        $('<div class="field eight wide"><label>Office</label><div class="ui input"><input type="text" name="office" data-name="office" placeholder="Office"/><div class="ui search selection dropdown loadering" data-name="office2" data-title="Office" data-action="/json/user/offices" data-autostart="true" onchange="{$(\'[data-name=office]\').val($(this).find(\'input\').val());}"></div></div></div>').appendTo($b);
        $('<h4 class="ui dividing header">Access</h4>').appendTo($bo);
        $b = $('<div class="fields"></div>').appendTo($bo);
        $('<div class="field eight wide"><label>Rights</label><select class="ui dropdown loadering" name="rights_id" data-title="Rights" data-name="rights_id" placeholder="User rights" required data-action="/json/user/rights" data-autostart="true"></select>')
            .appendTo($b)
            .on('change',function(){
                //console.debug('dropdown changed',$(this).find('.dropdown').dropdown('get value'));
                if($(this).find('.dropdown').dropdown('get value')[0]>2){
                    $(this).closest('.modal').find('.mail').slideDown();
                }else $(this).closest('.modal').find('.mail').slideUp();
            });
        $('<div class="field eight wide"><label>Password</label><div class="ui input"><input type="password" name="password" data-name="password" placeholder="password" required></div></div>').appendTo($b);
        $('<input type="hidden" data-name="parent_user_id" value="' +system.user.id + '" />').appendTo($b);
        $('<input type="hidden" name="status_id" data-name="status_id" value="200"/>').appendTo($b);
        $(`<div class="mail" style="display:none">
            <h4 class="ui dividing header">Mail access</h4>
            <div class="field">
                <label>Mail server</label>
                <div class="ui selection dropdown" >
                    <input type="hidden" name="mail" data-name="mail.server" value="" onchange="crm.user.mail.choose(this)">
                    <i class="dropdown icon"></i>
                    <div class="default text">Choose mail server</div>
                    <div class="menu">
                        <div class="item" data-value="yandex">Yandex.Mail</div>
                        <div class="item" data-value="gmail">Google.Mail</div>
                    </div>
                </div>
            </div>
            <div class="two fields mail-params" style="display:none;">
                <div class="field">
                    <label>Mail login</label>
                    <div class="ui input">
                        <input type="text" data-name="mail.login"/>
                    </div>
                </div>
                <div class="field">
                    <label>Mail password</label>
                    <div class="ui input">
                        <input type="password" data-name="mail.password"/>
                    </div>
                </div>
            </div>
        </div>`).appendTo($bo);
        const $f = $('<div class="actions"></div>').appendTo($c);
        $('<div class="ui black deny button">Close</div>').appendTo($f);
        $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
        page.modal('#user_add');
    }
    edit(id) {
        $.ajax({
            url: "/json/user/" + id,
            dataType: "json",
            success: function(d, x, s) {
                var user = d[0];
                $('.edit_user').attr('data-action',
                    '/json/user/' + id + '/update');
                for (var i in user) $(
                    '.edit_user form [data-name="' + i +
                    '"]').val(user[i]);
                // $('.popup,.bgc').fadeOut((window.animationTime!=undefined)?window.animationTime:256);
                $('.edit_user').fadeIn((window.animationTime != undefined) ? window.animationTime : 256);
                // cf.submiter($('.edit_user'));
            }
        });
    }
    remove(id) {
        var $c = $(this).parent().parent('.modal');
        // //console.debug('remove user #'+id,$(this),$c);
        $.ajax({
            url: "/user/" + id + "/remove",
            dataType: "json",
            success: function(d, x, s) {
                crm.user.touch();
                cf.touch('admin-list');
                cf.touch('user-list');
                $('.modal').modal('hide');
            }
        });
    }
    deposit(i) {
        var tut = $('#' + i);
        cf.submiter(tut);
        ////console.debug(tut);
    }
    deals(container, d, x, s) {
        container.html('');
        for (var i in d) {}
        var pp = cf.pagination(d),
            $pp = container.parent().next(".pagination");
        if (!$pp.length) $pp = $('<div class="pagination"></div>').insertAfter(
            container.parent());
        $pp.html(pp);
    }
    instruments($cnr, id) {
        var inst_tabs = $cnr.find('.user-instruments-tab'),
            inst_tab_cons = inst_tabs.parent(),
            first = true;
        inst_tabs.html('');
        for (var i in window.crm.instrument.data) {
            var inst = window.crm.instrument.data[i],
                s = '';
            inst_tabs.append('<li>' + inst.title + '</li>');
            s += '<div class="tabs_dash_con user-instrument" data-id="' +
                inst.id + '">';
            s += '<h3>' + inst.title + '</h3>';
            s += '<img alt="chart for ' + inst.title +'" style="width:60%;height:300px; border:solid 1px grey;float:left;"/>';
            s +=
                '<div class="submiter instrument-fee" style="width:30%;float:left;margin-left:10px;">';
            s +=
                '<label for="user_instrument_fee">Commission: <input name="fee" value="1"/>%</label>';
            s +=
                '<a href="#" class="edit button submit">${__("messages.save")}</a>';
            s += '</div>';
            s +=
                '<div class="tunner" style="float:left;margin:10px 0 0 10px; border-top:solid 1px grey;width:30%;">';
            s += '<span class="user_chart_tune">5%</span>&nbsp;';
            s +=
                '<a id="user_chart_up" href="#" class="button" onclick="crm.user.tune.up(' +
                inst.id + ')">Up</a>&nbsp;';
            s +=
                '<a id="user_chart_up" href="#" class="button" onclick="crm.user.tune.real(' +
                inst.id + ')">Real</a>&nbsp;';
            s +=
                '<a id="user_chart_up" href="#" class="button" onclick="crm.user.tune.down(' +
                inst.id + ')">Down</a>';
            s += '</div>';
            s += '</div>';
            inst_tab_cons.append(s);
            /*<div class="tabs_dash_con">
                <div class="user-chart-tuner">
                    <span id="user_chart_tune">5%</span>&nbsp;
                    <a id="user_chart_up" href="#" onclick="crm.user.tune.up()">Up</a>&nbsp;
                    <a id="user_chart_up" href="#" onclick="crm.user.tune.real()">Real</a>&nbsp;
                    <a id="user_chart_up" href="#" onclick="crm.user.tune.down()">Down</a>
                </div>
                <div id="user_chart" class="chart"></div>
            </div>*/
        }
        inst_tabs.find('li:first').click();
    }
    admintree($c,d,dataName){
        const pref = 'caus_admin_';
        const that = this;
        $c.html(`<div id="admins_tree"></div>`);
        $(`<button class="ui basic icon button" style="position:absolute; top:0; right:0;"><i class="ui refresh icon"></i></button>`).appendTo($c).on('click',()=>{skymechanics.touch(dataName)});
        let treantConfig = {
            chart:{
                container: "#admins_tree",
                // connectors: 'step',
                // rootOrientation: 'WEST',

                callback:{
					// onCreateNode:function(){ //console.log('onCreateNode',arguments) },
					// onCreateNodeCollapseSwitch:function(){ //console.log('onCreateNodeCollapseSwitch',arguments) },
					// onAfterAddNode:function(){ //console.log('onAfterAddNode',arguments) },
					// onBeforeAddNode:function(){ //console.log('onBeforeAddNode',arguments) },
					// onAfterPositionNode:function(){ //console.log('onAfterPositionNode',arguments) },
					// onBeforePositionNode:function(){ //console.log('onBeforePositionNode',arguments) },
					onToggleCollapseFinished:(node,s)=>{
                        // //console.log('onToggleCollapseFinished',node.text['data-id']);
                        that.adminTreeCollapsed[node.text['data-id']] = node.collapsed;
                    }
					// onAfterClickCollapseSwitch:function(){ //console.log('onAfterClickCollapseSwitch',arguments) },
					// onBeforeClickCollapseSwitch:function(){ //console.log('onBeforeClickCollapseSwitch',arguments) },
					// onTreeLoaded:function(){ //console.log('onTreeLoaded',arguments) }
                },
                animateOnInit: true,
                node: {
                    collapsable: true
                },
                animation: {
                    nodeAnimation: "easeOutBounce",
                    nodeSpeed: 700,
                    connectorsAnimation: "bounce",
                    connectorsSpeed: 700
                }
            },
            nodeStructure:{
                image: `/images/favicon.png`,
                text:{
                    name: ''
                },
                children:[]
            }
        };
        let nodes=treantConfig.nodeStructure.children;
        let list = d.data;
        const makeNode = (node, collapsed = true) => {
            let error= false;
            let chlds = recurse(node.id,node.rights_id,error);
            let clps = (that.adminTreeCollapsed[node.id]!=undefined)?that.adminTreeCollapsed[node.id]:true;
            // //console.debug('collapsed',that.adminTreeCollapsed[node.id], that.adminTreeCollapsed[node.id]!=undefined)
            let ret = {
                collapsed: ((chlds.length>0) && clps)  ,
                image: `/crm.3.0/images/avatar/${node.id%5}.jpg`,
                stackChildren:true,
                link: {
                    href: `javascript:crm.user.info(${node.id})`
                },
                text:{
                    name:  `#${node.id} ${node.title} - [${chlds.length}]`,
                    title: `${node.rights.name || '-'}`,
                    desc: `${node.office || ''}`,
                    'data-id': node.id
                }
            }
            if(chlds.length)ret['children']=chlds;
            if(error)ret['HTMLclass']='alarm';
            return ret;
        }
        const recurse = (id,rights,error=false) => {
            let ret = [];
            list.map( (node,i) => {
                if(node.parent_user_id == id ){
                    if(parseInt(node.rights_id)<parseInt(rights))ret.push(makeNode(node));
                    else  error=true;
                }
            });
            return ret;
        };
        let found = false;
        list.map( (node,i) => {
            // if(node.rights_id >= 8 && node.rights_id<10){
            if(node.rights_id == ((window.user.rights_id==10)?8:window.user.rights_id)){
                found=true;
                nodes.push(makeNode(node));
            }
        });
        if(!found){
            list.map( (node,i) => {
                //console.debug(node.rights_id);
                if(node.rights_id==10){
                    found=true;
                    nodes.push(makeNode(node));
                }
            });
        }
        if(!found){
            list.map( (node,i) => {
                //console.debug(node.rights_id);
                if(node.rights_id==7){
                    found=true;
                    nodes.push(makeNode(node));
                }
            });
        }
        //console.log('user.admintree',nodes);
        const tree = new Treant( treantConfig );

        const onDrag = (e) => {
            let dd = $(e.target)
            if(!dd.hasClass('node'))dd = dd.parents('.node:first');
            //console.debug('onDrag',dd.data('id'),e);
            e.originalEvent.dataTransfer.setData("user-id",dd.data('id'))
        }
        const onDrop = (e) => {
            const uid = e.originalEvent.dataTransfer.getData("user-id")
            let cur = $(e.target);
            if(!cur.hasClass('node'))cur = cur.parents('.node:first');
            cur.removeClass('allow-assign')
            const parentId = cur.data('id');
            //console.debug('drop',uid,parentId,e);
            $.ajax({
                url:`/json/user/${uid}/update`,
                type:'get',
                data:{
                    parent_user_id: cur.data('id')
                },
                before:(x,s)=>{},
                success:(d,x,s)=>{},
                complete:(x,s)=>{
                    //console.debug('finished');
                    crm.user.adminTouch();
                }
            })
        }
        const onDragOver = (e) => {

            e.preventDefault();
            let $allow = $(e.target);
            if(!$allow.hasClass('node'))$allow = $allow.parents('.node');
            $allow.addClass('allow-assign');

        }
        const onDragLeave = (e) => {
            e.preventDefault();
            let $allow = $(e.target);
            if(!$allow.hasClass('node'))$allow = $allow.parents('.node');
            $allow.removeClass('allow-assign')
            //console.debug('onDragOut',$allow);
        }
        $('.node').attr('draggable',true).on('dragstart',onDrag).on('drop',onDrop).on('dragover',onDragOver).on('dragleave',onDragLeave);
    }
};
