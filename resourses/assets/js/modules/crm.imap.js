class Imap {
    constructor(){
        this.sent= [];
        this.inbox = [];
    };
    render($c,d){
        const readBody=function(b){
            const re = /<meta.+?\/?>/ig;
            if(b.html) return b.html.content.replace(re,'');
        }, $s = $c.find('.smtp');
        // if($c.find('table').length==0){
            // const $m = $('<div class="ui secondary menu"></div>').appendTo($c);
            // $m.append('<div class="right menu"><a class="item"><i class="ui plus icon"></i></a></div>');

        // }
        $c = $c.find('.imap');

        $c.find('.loader').removeClass('active');
        // $s.html('');
        let $inboxToday=$c.find('.today .sm-mail'),
            $inboxYesterday=$c.find('.yesterday .sm-mail'),
            $inboxLater=$c.find('.later .sm-mail'),
            $sentToday=$s.find('.today .sm-mail'),
            $sentYesterday=$s.find('.yesterday .sm-mail'),
            $sentLater=$s.find('.later .sm-mail');
        if($c.find('.today').length==0){
            $c.append('<div class="ui message fluid attached today" style="width:100%;"><div class="ui checkbox" onchange="crm.imap.select(this,\'today\')"><input type="checkbox"/><label>&nbsp;</label></div><strong>Today</strong></div>');
            $inboxToday = $(`<div class="ui styled fluid accordion attached sm-mail"></div>`).appendTo($c);
        }
        if($c.find('.yesterday').length==0){
            $c.append('<div class="ui message attached yesterday" style="width:100%;"><div class="ui checkbox" onchange="crm.imap.select(this,\'yesterday\')"><input type="checkbox"/><label>&nbsp;</label></div><strong>Yesterday</strong></div>');
            $inboxYesterday = $(`<div class="ui styled fluid accordion attached sm-mail"></div>`).appendTo($c);
        }
        if($c.find('.later').length==0){
            $c.append('<div class="ui message attached later" style="width:100%;"><div class="ui checkbox" onchange="crm.imap.select(this,\'later\')"><input type="checkbox"/><label>&nbsp;</label></div><strong>Later</strong></div>');
            $inboxLater = $(`<div class="ui styled fluid accordion attached sm-mail"></div>`).appendTo($c);
        }
        if($s.find('.today').length==0){
            $s.append('<div class="ui message attached today" style="width:100%;"><div class="ui checkbox" onchange="crm.imap.select(this,\'today\')"><input type="checkbox"/><label>&nbsp;</label></div><strong>Today</strong></div>');
            $sentToday = $(`<div class="ui styled fluid accordion attached sm-mail"></div>`).appendTo($s);
        }
        if($s.find('.yesterday').length==0){
            $s.append('<div class="ui message attached yesterday" style="width:100%;"><div class="ui checkbox" onchange="crm.imap.select(this,\'yesterday\')"><input type="checkbox"/><label>&nbsp;</label></div><strong>Yesterday</strong></div>');
            $sentYesterday = $(`<div class="ui styled fluid accordion attached sm-mail"></div>`).appendTo($s);
        }
        if($s.find('.later').length==0){
            $s.append('<div class="ui message attached later" style="width:100%;"><div class="ui checkbox" onchange="crm.imap.select(this,\'later\')"><input type="checkbox"/><label>&nbsp;</label></div><strong>Later</strong></div>');
            $sentLater = $(`<div class="ui styled fluid accordion attached sm-mail"></div>`).appendTo($s);
        }
        let hideSentToday = true,
            hideSentYesterday = true,
            hideInboxToday = true,
            hideInboxYesterday = true,
            countNew = 0;
        for(let i in d.reverse()){
            const im = d[i],
                date = new Date(im.date),
                dateTrunc = date,
                today = new Date(),
                yesterday = new Date(),
                dateStr = (date.getMonth()+1).leftPad()+'/'+date.getDate().leftPad()+'<span class="year">&nbsp;'+date.getFullYear()+'</span>',
                timeStr = date.getHours().leftPad()+':'+date.getMinutes().leftPad();
            today.setHours(0,0,0,0);
            dateTrunc.setHours(0,0,0,0);
            yesterday.setDate(today.getDate() - 1);
            // console.debug(im);
            // if(system.user.mail.login == im.from[0].mail){
            let senderObj = (typeof(im.sender)==="string")?JSON.parse(im.sender)[0]:im.sender[0];
            let recieverObj = (typeof(im.reciever)==="string")?JSON.parse(im.reciever)[0]:im.reciever[0];
            recieverObj = recieverObj?recieverObj:{personal:'Unknown',mail:'not valid'};
            let $accords = $inboxLater,
                avatar = new Avatar(senderObj.full),
                client = im.client,
                user = im.user,
                dateFrame = 'later',
                sender =
                    im.user
                        ?`<div class="ui mini statistic blue from" style="font-size:75%;" onclick="crm.user.info(${user.id})"><div class="value" style="text-align:left;"><i class="ui icon user"></i> ${user.title}</div><div class="label" style="text-align:left;">${user.rights.title}</div></div>`
                        :`<div class="ui mini statistic from" style="font-size:75%;"><div class="value" style="text-align:left;">${senderObj.personal}</div><div class="label" style="text-align:left;">${senderObj.mail}</div></div>`,

                reciever = `<div class="ui mini statistic from" style="font-size:75%;"><div class="value" style="text-align:left;">${recieverObj.personal}</div><div class="label" style="text-align:left;">${recieverObj.mail}</div></div>`,
                subject = im.subject?im.subject:'no set';
            countNew+=(im.status==='new')?1:0;
            if(im.type=='sent'){
                crm.imap.sent.push(im);
                if(dateTrunc.getTime() == today.getTime()){ $accords = $sentToday; dateFrame = 'today'; hideSentToday = false;}
                if(dateTrunc.getTime() == yesterday.getTime()) {$accords = $sentYesterday; dateFrame = 'yesterday'; hideSentYesterday = false;}
            }
            else{
                sender = `<div class="ui mini statistic from" style="font-size:75%;"><div class="value" style="text-align:left;">${senderObj.personal}</div><div class="label" style="text-align:left;">${senderObj.mail}</div></div>`;
                reciever = im.user
                    ?`<div class="ui mini statistic blue from" style="font-size:75%;" onclick="crm.user.info(${user.id})"><div class="value" style="text-align:left;"><i class="ui icon user"></i> ${user.title}</div><div class="label" style="text-align:left;">${user.rights.title}</div></div>`
                    :`<div class="ui mini statistic from" style="font-size:75%;"><div class="value" style="text-align:left;">${recieverObj.personal}</div><div class="label" style="text-align:left;">${recieverObj.mail}</div></div>`;

                if(dateTrunc.getTime() == today.getTime()){ $accords = $inboxToday; dateFrame = 'today'; hideInboxToday = false;}
                if(dateTrunc.getTime() == yesterday.getTime()){ $accords = $inboxYesterday; dateFrame = 'yesterday'; hideInboxYesterday = false;}
                crm.imap.inbox.push(im);
            }
            if($accords.find(`.imap-${im.uid}`).length==0)$accords.prepend(`<div class="title imap-${im.uid} ${im.status} ${dateFrame}" data-id="${im.id}">
                <div class="ui checkbox" data-uid="${im.uid}" data-user-id="${user.id}" data-id="${im.id}">
                    <input type="checkbox"/>
                    <label></label>
                </div>
                ${avatar.getCircleLabel()}
                ${sender}
                ${reciever}
                <!--<div class="reciever ui mini statistic"><div class="value">${reciever.title}</div><div class="label">${reciever.email}</div></div>-->
                <div class="time ui mini statistic"><div class="value">${timeStr}</div><div class="label">${dateStr}</div></div>
                <span class="subject">${subject}</span>

                <span class="actions buttons right aligned">
                    <!--<button class="ui basic circular icon button" onclick="crm.imap.update(${im.uid},${im.user.id})">
                        <i class="ui icon eye helper" data-content="Viewed"></i>
                    </button>-->
                    <button class="ui basic circular icon button" onclick="new MailMessage('${senderObj.mail}','Re: ${im.subject}')">
                        <i class="ui icon reply helper" data-content="Reply"></i>
                    </button>
                    <button class="ui basic circular icon button" onclick="crm.imap.delete(${im.uid},${im.user.id})">
                        <i class="ui icon trash helper" data-content="Remove mail"></i>
                    </button>
                </span>

            </div>
            <div class="content imap-${im.uid}" style="position:relative"  data-id="${im.id}">
                <div class="ui active inverted dimmer"><div class="ui loader"></div></div>
                <div class="description">${im.message}</div>
            </div>`);
        }
        if(hideSentToday)$('.smtp .today').hide();
        if(hideSentYesterday)$('.smtp .yesterday').hide();
        if(crm.imap.sent.length==0)$('.smtp .later').hide();
        if(hideInboxToday)$('.imap .today').hide();
        if(hideInboxYesterday)$('.imap .yesterday').hide();
        if(crm.imap.inbox.length==0)$('.imap .later').hide();
        $(".ui.tabular .item").tab({
            onVisible:function(that){
                console.debug('Tab loaded',that);
            }
        });
        $('.accordion:not(.accordion-assigned)').accordion({
            selector: {
                trigger: '.title .subject',
                accordion : '.accordion',
                title     : '.title',
                content   : '.content'
            },
            silent: true,
            verbose: true,
            onOpening:function(e){
                let $that = $(this);
                const id = $(this).attr('data-id');
                $.get(`/imap/${id}`,function(d){
                    $that.find('.dimmer').removeClass('active');
                    $that.find('.description').html(d.message);
                });
            }
        }).addClass('accordion-assigned');
        // $('.accordion .title .subject').on('click',function(){console.debug('show imap',$(this).parent('.title').attr('data-id'));});
        if(countNew){
            $('#mail_count').animateNumber({
                number: countNew,
            }).prop('number', countNew);
            $('#mail_count').addClass('label purple');
        }else $('#mail_count').removeClass('label purple');

        $c.parent().find('.checkbox').checkbox({
            onChange:function(){
                console.debug($('.checkbox.checked:visible').length);
                $('.checkbox.checked:visible').length
                    ?$('.bulk-actions').fadeIn()
                    :$('.bulk-actions').fadeOut();
            }
        });
        // .on('change',function(){})
        skymechanics.reload();
    }
    sentHandler(d,$c){
        // $c.find('.close').click();
        $('#new_mail_message').modal('hide');
        skymechanics.touch('imap-list');
         //onclick="$(\'.ui.modal\').show(\'close\')"
    }
    update(uid,user_id){
        let m = [];
        if(uid == undefined){
            $('.checkbox.checked[data-uid][data-user-id]').each(function(){
                m.push({
                    uid:$(this).attr('data-uid'),
                    user_id:$(this).attr('data-user-id')
                });
            });
        }
        else m.push({uid:uid,user_id:user_id});
        m.map(r=>{
            $.ajax({
                url:`/imap/${r.uid}`,
                type:'put',
                data:{
                    _token:window.Laravel.csrfToken,
                    user_id:r.user_id,
                    status:'read'
                },
                success:function(){
                    $(`.imap-${r.uid}`).addClass('viewed');
                }
            });
        });
    }
    delete(uid,user_id){
        let m = [];
        if(uid == undefined){
            $('.checkbox.checked[data-uid][data-user-id]').each(function(){
                m.push({
                    uid:$(this).attr('data-uid'),
                    user_id:$(this).attr('data-user-id')
                });
            });
        }
        else m.push({uid:uid,user_id:user_id});
        m.map(r=>{
            $.ajax({
                url:`/imap/${r.uid}`,
                data:{
                    _token:window.Laravel.csrfToken,
                    user_id:r.user_id
                },
                type:'delete',
                success:function(){
                    $(`.imap-${r.uid}`).remove();
                }
            });
        })
    }
    select(that,df){
        const st = $(that).checkbox('is checked')?'check':'uncheck';
        $(that).closest('.message').next('.accordion').find(`.${df} .checkbox`).checkbox(`${st}`);
    }
};
class Avatar{
    constructor(n){
        this.title = n;
    };
    getFirstLetter(){
        for(let i in this.title){
            const cc = this.title.toUpperCase()[i].charCodeAt(0);
            if((64<cc && cc<91)||(1071<cc && cc<1104)) return this.title[i];
        }
        return '-';
    }
    getColor(){
        let t = this.getFirstLetter();
        switch(t.charCodeAt(0)%11){
            case 0: return 'red';
            case 1: return 'yellow';
            case 2: return 'green';
            case 3: return 'olive';
            case 4: return 'blue';
            case 5: return 'teal';
            case 6: return 'brown';
            case 7: return 'grey';
            case 8: return 'violet';
            case 9: return 'purple';
            case 10: return 'pink';
        }
    };
    getCircleLabel(){
        return `<div class="ui label circular huge ${this.getColor()}">${this.getFirstLetter()}</div>`
    }
};
class MailMessage{
    constructor(to,subject){
        console.debug('mail to '+to)
        this.to = to || '';
        this.subject = subject || '';
        this.render();
    }
    render(){
        let $c = $('<div class="ui modal fullscreen submiter"  data-action="/imap" data-method="post" id="new_mail_message" data-callback="crm.imap.sentHandler"></div>').appendTo('#modals');
        $c.append('<div class="header"><i class="icon envelope outline"></i> New mail</div>');
        let $co = $('<div class="ui content"></div>').appendTo($c);
        let $bo = $('<div class="ui form"></div>').appendTo($co);
        $(`<input type="hidden" data-name="_token" value="${window.Laravel.csrfToken}"/>`).appendTo($bo);
        // $().appendTo($bo);

        let $usearch = $(`<div class="field"></div>`).appendTo($bo);
        $usearch.append(`<label>To</label>`);
        $('<div class="ui search"><div class="ui icon input"><input class="prompt" type="text" value="'+this.to+'" data-name="to" placeholder="Customer search..."><i class="search icon"></i></div><div class="results"></div></div>').appendTo($usearch).search({
            apiSettings: {
                url: '/json/user?search={query}',
                onResponse:function(result){
                    var response = {results : []};
                    for(var i in result.data){
                        var u = result.data[i];
                        response.results.push({
                            id:u.email,
                            title: u.email,
                            description: `${u.title}<br/>#<strong><code>${u.id}</code></strong> ${u.rights.title}`
                        });
                    }
                    return response;
                }
            },
            onSelect:function(result, response){
                console.debug('onSelect',result,response,$c.find('[data-name=to]'));
                $c.find('[data-name=to]').val(result.id);
            },
            minCharacters : 3
        });

        $(`<div class="field"><label>Subject</label><div class="ui input"><input class="ui input" type="text" data-name="subject"  value="${this.subject}"/></div></div>`).appendTo($bo);
        $('<div class="field"><label>Message</label><div class="ui input"><textarea data-name="message"></textarea></div></div>').appendTo($bo);
        $('<div class="actions"><button class="ui button icon submit"><i class="paper plane outline icon"></i> Send</button></div>').appendTo($c);
        page.modal('#new_mail_message');
    }
}

if(!crm || crm == undefined || crm == null ) crm = {};
crm['imap'] = new Imap;
// export crm.imap;
