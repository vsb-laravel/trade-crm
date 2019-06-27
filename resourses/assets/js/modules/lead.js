export class Lead {
    constructor(){
        this.current = null;
        this.data = {};
    }
	showList(opts){
        $.ajax({
            url:'/lead/list/html',
            dataType:"html",
            data:opts,
            success:function(d,x,s){
                $(d).appendTo('body');
                cf.reload();
            }
        });
	}
	showImport(o){
        $('.import_leads').fadeIn((animationTime)?animationTime:256);$('body').addClass('active');
        var $c = $('<div class="ui modal small" id="lead_import"></div>').appendTo('#modals');
        $c.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
        $c.append(`<div class="header"><i class="icon user outline"></i> ${__('crm.leads.import')}</div>`);
        var $co = $('<div class="ui content"></div>').appendTo($c);
        var $bo = $('<form class="ui form" action="/lead/upload" method="post" enctype="multipart/form-data"></form>').appendTo($co);
        let $bo1 = $('<div class="fields"></div>').appendTo($bo);
        $bo = $('<div class="fields"></div>').appendTo($bo);
        $('<input type="hidden" name="_token" value="'+window.Laravel.csrfToken+'"/>').appendTo($bo);
        $(`<div class="field twelve wide">
            <label>${__('crm.affilate')}</label>
            <div class="ui search selection dropdown">
                <input type="hidden" name="affilate_id" value="${window.user.id}"/>
                <i class="ui dropdown icon"/>
                <div class="default text"></div>
                <div class="menu">${employees.toItemList()}</div>
            </div>
        </div>`).appendTo($bo1).dropdown();
        $('<div class="field twelve wide"><div class="ui input"><input class="ui input file" type="file" name="import" /></div></div>').appendTo($bo);
        $('<div class="field four wide right aligned"><button class="ui button icon" type="submit"><i class="upload icon"></i> Import</button></div> ').appendTo($bo);
        $('<div class="ui floating message info"><div class="header">Format xls(x)</div><p>Name, Surname, email, phone number, country, source, source description</p></div>').appendTo($co);
        $('<div class="ui floating bottom warning message"><div class="header">Note!</div><p>Required fields are <b>name</b> and <b>phone</b> or <b>mail</b></p></div>').appendTo($co);
        page.modal('#lead_import');
	}
	info(){
        if(!arguments.length)return;
        var id = arguments[0];
        id=(typeof(id)=="object")?window.crm.lead.current:id;
        if(id==undefined)return;
        this.current = id;
        $.ajax({
            url:"/lead/"+id+'/html',
            dataType:"html",
            success:function(d,x,s){
                // console.debug(d,x,s);
                $('body').append(d);
                // crm.user.calendar.init('scheduler_here');
            }
        });
	}
	touch(){
        if(cf._loaders['lead-list'])cf._loaders['lead-list'].execute();
        cf.touch('user-list');
        $('#customers_count').text(crm.user.data.total);
        $('#leads_count').text(crm.lead.data.total);
	}
    list(container,d,x,s){
        container.html('');
        crm.lead.data = d;
        for(var i in d.data){
            var row=d.data[i];
            var tr = $('<tr data-class="user" data-id="'+row.id+'"></tr>').appendTo(container);
            tr.append('<td><div class="ui checkbox"><input type="checkbox" data-name="lead_selected" value="lead_'+row.id+'" data-id="'+row.id+'" /><label></label></div></td>');
            tr.append('<td class="center aligned">'+dateFormat(row.created_at)+'</td>');
            let c2c = '<br><small><i class="icon phone"></i>'+row.phone+'</small>';
            if (system.telephony) {
                for (let i in system.telephony.get()) {
                    let tel = system.telephony.list[i],
                        userExt = crm.user.getMeta(system.user.meta, tel.name +
                            '_ext');
                    c2c = '';
                    if (userExt.length && tel.enabled == "1") c2c +=
                        '<br><small><i class="icon phone"></i><a href="javascript:crm.telephony.link(' +
                        i + ',\'' + userExt + '\',\'' + row.phone +
                        '\')" target="_blank">' + row.phone +
                        '</a></small>'
                    else c2c = `<br/><small>${row.phone}</small>`
                }
            }
            tr.append('<td>#'+row.id
                +'<a onclick="crm.lead.info('+row.id+')">'+row.name+' '+row.surname+'</strong>'
                +'<br><small><i class="icon mail"></i>'+row.email+'</small>'
                +c2c
                +((row.country)?'<br><small><i class="icon world"></i>'+row.country+'</small>':'')
                +'</td>');

            // tr.append('<td>'+((row.manager && row.manager.meta)?crm.user.getMeta(row.manager.meta,'office'):'')+'</td>');
            tr.append('<td>'+row.status.title+'</td>');
            let comment = row.comments.length?row.comments[0]:false;
            const commentRow = (comment!==false) ?`<b>Last comments:</b><i>${comment.comment}</i><br/><small>${dateFormat(comment.created_at, false, 'simple')}</small><br/>`: '';
            tr.append('<td>'+((row.manager)?'<b>Manager: </b><a href="javascript:crm.user.card('+row.manager.id+')">'+row.manager.name+' '+row.manager.surname+'</a>':'')
                +'<br><small>'+((row.manager&&row.manager.meta)?crm.user.getMeta(row.manager.meta,'office'):'')+'</small>'
                +((row.affilate)?'<br><b>Affilate:</b><a href="javascript:crm.user.card('+row.affilate.id+')">'+row.affilate.name+' '+row.affilate.surname+'</a>':'')
                + `<br/>${commentRow}`
                +`<br/><small>Source: ${row.source}</small>`
                +'</td>');

        }
        page.paginate(d,'lead-list',container);
        container.find('[data-name=lead_selected]').on('click change keyup',function(e){
            if($('[data-name=lead_selected]:checked').length){
                $('.lead.bulk').show();
                skymechanics.reload();
            }
            else $('.lead.bulk').hide();
        });
        $('input.search:visible').each(function(){
            const $that=$(this),keyword=$that.val();
            $("table:visible tbody tr td").unmark({
                done: function() {
                    $("table:visible tbody tr td").mark(keyword, {});
                }
            });
        })
	}
	assign(that){
        var manager_id = $(that).dropdown('get value');
        if(manager_id){
            $('[data-name=lead_selected]:checked').each(function(){
                var id = $(this).attr('data-id'),$that = $(this).parent();
                $.ajax({
                    url:'/lead/'+id+'/update?manager_id='+manager_id,
                    success:function(){
                        $that.checkbox('uncheck');
                    }
                });
            }).promise().done(function(){
                $('.onselect').hide();
                $(that).dropdown('restore defaults');
                crm.lead.touch();
            });
        }

	}
	delete(){
        $('[data-name=lead_selected]:checked').each(function(){
            var id = $(this).attr('data-id');
            $.ajax({
                url:'/lead/'+id+'/delete',
                success:function(){}
            });
        }).promise().done(function(){
            $('.onselect').hide();
            crm.lead.touch();
        });
	}
	add(){
        var $c = $('<div class="ui modal submiter" data-action="/lead/add" data-callback="crm.lead.added" id="lead_add"></div>').appendTo('#modals');
        $c.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
        $c.append('<div class="header"><i class="icon user outline"></i> New lead registration form</div>');
        var $bo = $('<div class="content ui form"></div>').appendTo($c);
        var $b = $('<div class="fields"></div>').appendTo($bo);
        $('<div class="field eight wide"><label>Name</label><div class="ui input"><input type="text" name="name" data-name="name" placeholder="Name" required></div></div>').appendTo($b);
        $('<div class="field eight wide"><label>Surname</label><div class="ui input"><input type="text" name="surname" data-name="surname" placeholder="Surname"  required/></div></div>').appendTo($b);
        $('<h4 class="ui dividing header">Contacts</h4>').appendTo($bo);
        $b = $('<div class="fields"></div>').appendTo($bo);

        $('<div class="field eight wide"><label>Email</label><div class="ui input"><input type="email" name="email" data-name="email" placeholder="Nameaddress@servername.com"  required></div></div>').appendTo($b);
        $('<div class="field eight wide"><label>Phone</label><div class="ui input"><input type="tel" name="phone" data-name="phone" placeholder="Phone number"  required/></div></div>').appendTo($b);
        $('<div class="field eight wide"><label>Country</label><select class="ui dropdown" name="country" data-title="Choose country" data-name="country" required>'+system.countries.toOptionList()+'</select>').appendTo($b);
        $('<div class="field eight wide"><label>Office</label><div class="ui input"><input type="text" name="office" data-name="office" placeholder="Office"/></div></div>').appendTo($b);
        $('<h4 class="ui dividing header">Status</h4>').appendTo($bo);
        $b = $('<div class="fields"></div>').appendTo($bo);

        $('<div class="field eight wide"><label>Status</label><select class="ui dropdown loadering" name="status_id" data-title="Status" data-name="status_id" placeholder="User status" required data-action="/json/user/status" data-autostart="true"></select>').appendTo($b);
        $('<input type="hidden" data-name="manager_id" value="'+system.user.id+'" />').appendTo($b);
        $('<input type="hidden" data-name="source" value="crm system">').appendTo($b);
        var $f = $('<div class="actions"></div>').appendTo($c);
        $('<div class="ui black deny button">Close</div>').appendTo($f);
        $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
        page.modal('#lead_add');
	}
	added(d,$c){
        if(d.name){
            crm.lead.touch();
            $c.modal('hide');
        }
        else alert(d);
    }
};
