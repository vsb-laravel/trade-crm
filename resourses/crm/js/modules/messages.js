export class Messages {
    touch(){
        if(cf._loaders['dashboard-messages'])cf._loaders['dashboard-messages'].execute();
    }
    added(d,$c){
        cf.touch('user-messages');
        crm.messages.touch();
        $c.find('input:visible,textarea:visible').val('');
    }
    list($c,d,x,s){
        if(!d.length)return;
        $c.html('');
        var ddt = parseInt(d[0].created_at).datetime({style:'simple',show:{time:false}});
        $c.append('<div class="ui horizontal divider">'+ddt+'</div>');
        for(var i in d){
            let m = d[i];
            let s='';
            let isme = (m.author_id == system.user.id);
            const mdt = parseInt(m.created_at).datetime({style:'simple',show:{time:false}})
            const status =( m.status=='new')?' blue':'';
            let $m = $('<div class="ui message from'+status+'"></div>').appendTo($c);
            if(mdt!=ddt){
                ddt = mdt;
                $c.append('<div class="ui horizontal divider">'+ddt+'</div>');
            }
            $m.addClass(isme?'me':'user');
            // s+=(m.author_id == {{Auth::id()}})?'<div class="message from-me">':'<div class="message from-user">';
            $m.append('<i class="close icon" onclick="crm.messages.delete(this,'+m.id+')"></i>'
                // +'<div class="right floated"><a class="ui link"><i class="icon eye"></i></a></div>'
                +'<div class="ui header">'+m.subject+'</div>'
                +'<div class="description">'+m.message+'</div>');
            $m.append('<div class="right floated right aligned meta"><i class="icon clock"></i>'+parseInt(m.created_at).datetime({style:'time'})+'</div>');

            if(m.status=='new' && m.user_id == system.user.id){
                $m.append('<div class="ui horizontal divider">actions</div>');
                const $b = $('<div class="ui right aligned buttons"></div>').appendTo($m);
                $b.append('<button class="ui button icon basic labeled" onclick="crm.messages.view(this,'+m.id+')"><i class="eye icon"></i>Viewed</button>');
            }
            // $m.append('<div class="meta"><i class="icon author"></i>'+m.author.name+' '+m.author.surname+'</div>');
        }
    }
    delete(that,id){
        $.ajax({
            url:'/user/message/'+id+'/delete',
            success:(d)=>{
                if(d==true){
                    $(that).closest('.message').transition('fade');
                    crm.messages.touch();
                }
            }
        })
    }
    view(that,id){
        console.debug('message viewed');
        $.ajax({
            url:'/user/message/'+id+'/edit',
            data:{
                status:'viewed'
            },
            success:(d)=>{
                $(that).closest('.message').removeClass('blue');
                $(that).closest('.message').find('.divider,.buttons').transition('fade');
                crm.messages.touch();
            }
        })
    }
    dashboard($cont,d){
        var counts = 0;
        const $c = $cont.find('.menu');
        $c.html('');
        for(var i in d){
            var row=d[i];
            if(row.author_id == system.user.id) continue;
            counts++;
            var $card = $('<div class="ui card"></div>').appendTo($c);
            $card.append('<div class="content">'
                +'<div class="right floated right aligned">'+dateFormat(row.created_at,true,'simple')+'</div>'
                +'<div class="header">'+row.subject+'</div>'
                +'<div class="meta">'+row.message+'</div>'
                +'</div>');
            $card.append('<div class="extra content">'
                // +'<div class="meta right aligned"></div>'
                +'<div class="meta right aligned"><i class="icon user"></i>'+row.author.name+' '+row.author.surname+'</div>'
                +'</div>');
            $card.on('click',function(){
                console.debug(`messages`,`crm.user.card(row.author.id,'messages')`)
                crm.user.card(row.author.id,'messages')
            });
        }

        if(counts){
            $cont.show();
            $cont.find('.messages').html(counts);
        }
        else {
            $cont.hide();
            $cont.find('.messages').html('');
        }
    }
}
export class Comments{
    added(d,container,a){
        if(!d.comment)return;
        let $comments = container.parent().find('.comment:first');
        let comment = $('<div class="comment"></div>').insertBefore($comments);
        const date = new Date(d.created_at);
        const avatar = system.user.id%5;
        comment.append('<a class="avatar"><img src="/crm.3.0/images/avatar/'+avatar+'.jpg"></a>');
        comment.append('<div class="content">'
                +'<a class="author">'+system.user.name+' '+system.user.surname+'</a>'
                +'<div class="metadata"><span class="date">'+dateFormat(d.created_at,true,'simple')+'</span></div>'
                +'<div class="text">'+d.comment+'</div>'
            +'</div>');
        $('.comment.empty').remove();
        $('#comment_list').scrollTop(0);
        $('textarea[name=comment]').val('');
        $('#comment').parents('.submiter').find('.submit').addClass('disabled');
        console.debug('comment added',d,crm.user,crm.lead);
        if(d.object_type=="user") crm.user.touch()
        else if(d.object_type=="lead") crm.lead.touch()
    }
}
export class Mails{
    add(){
        var $c = $('<div class="ui modal submiter" data-action="/mail/add" data-callback="crm.mail.touch" id="mail_add"></div>').appendTo('#modals');
        $c.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
        $c.append('<div class="header"><i class="icon mail outline"></i> New mail template</div>');
        var $bo = $('<div class="content ui form"></div>').appendTo($c);
        var $b = $('<div class="fields"></div>').appendTo($bo);
        $('<div class="field eight wide"><label>Name</label><div class="ui input"><input type="text" name="name" data-name="name" placeholder="Name" required></div></div>').appendTo($b);
        $('<div class="field eight wide"><label>Title</label><div class="ui input"><input type="text" name="title" data-name="title" placeholder="title"  required/></div></div>').appendTo($b);
        $('<h4 class="ui dividing header">Template</h4>').appendTo($bo);
        $b = $('<div class="fields"></div>').appendTo($bo);

        $('<div class="field sixteen wide"><label>Template</label><div class="ui input"><textarea data-name="template" placeholder="Template"  required></textarea></div></div>').appendTo($b);
        var $f = $('<div class="actions"></div>').appendTo($c);
        $('<div class="ui black deny button">Close</div>').appendTo($f);
        $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
        page.modal('#mail_add');
    }
    list($c,d){
        $c.html('');
        for(var i in d){
            $c.append('<div class="divider"></div>');
            var row = d[i],$i = $('<div class="item"></div>').appendTo($c),$i = $('<div class="content"></div>').appendTo($i);
            $i.append('<div class="ui header">'+row.title+'</div></div>');
            var $f = $('<div class="submiter ui form" data-action="/mail/'+row.id+'/update" data-callback="crm.mail.touch"></div>').appendTo($i);
            $('<div class="fields"><div class="field eight wide"><label>Name</label><div class="ui input"><input type="text" name="name" data-name="name" placeholder="Name" required value="'+row.name+'"></div></div>'
                +'<div class="field eight wide"><label>Title</label><div class="ui input"><input type="text" name="title" data-name="title" placeholder="title"  required value="'+row.title+'"/></div></div></div>').appendTo($f);
            $('<div class="field sixteen wide"><label>Template</label><div class="ui input"><textarea data-name="template" placeholder="Template"  required>'+row.template+'</textarea></div></div>').appendTo($f);
            // $f.append('<div class="right floated content"><button class="ui button basic icon"><i class="trash icon"></i>Delete</button><button class="ui button submit">Save</button></div>');
            $f.append('<div class="right floated content"><button class="ui button submit">Save</button></div>');
        }
        cf.reload();
    }
    touch(){
        $('#mail_add').show('close');
        cf.touch('mail-template-list');
    }
    sent(d,$c){
        cf.touch('user-mail');
        $c.find('.dropdown').dropdown('restore defaults');
        $c.find('input:visible,textarea:visible').val('');
    }
    chooseTemplate($c,d){
        crm.mail.templates = {};
        d.map( (t,i) => {crm.mail.templates[t.id]=t;});
    }
    loadTemplate(v,t,$choice){
        const $templ = $('.mailsText');
        const templ = crm.mail.templates[v]?crm.mail.templates[v].template:'';
        $templ.html(templ);
        console.debug($templ.text(),templ);
    }
    user($c,d){
        if(!d.length)return;
        $c.html('');
        var ddt = parseInt(d[0].created_at).datetime({style:'simple',show:{time:false}});
        $c.append('<div class="ui horizontal divider">'+ddt+'</div>');
        for(var i in d){
            var m = d[i],mdt = parseInt(m.created_at).datetime({style:'simple',show:{time:false}})
            $m = $('<div class="comment"></div>').appendTo($c);
            $m.append('<a class="avatar"><img src="/crm.3.0/images/avatar/'+(m.sender.id%5)+'.jpg"></a>');
            $m.append('<div class="content">'
                    +'<a class="author">'+m.sender.name+' '+m.sender.surname+'</a>'
                    +'<div class="metadata"><span class="date">'+parseInt(m.created_at).datetime({style:'time'})+'</span></div>'
                    +'<div class="metadata"><code>Template #'+m.mail.id+'</code><b>'+m.mail.name+'</b></div>'
                    +'<div class="text"><div class="ui header">'+m.mail.title+'</div>'+m.text+'</div>'
                +'</div>');
            if(mdt!=ddt){
                ddt = mdt;
                $c.append('<div class="ui horizontal divider">'+ddt+'</div>');
            }
        }
    }
}
export default Messages;
