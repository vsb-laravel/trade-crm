export class Telephony {
    constructor(){

    };
    list($c,d){
        for(let i in d){
            let row = d[i],
                $item = $('<div class="ui form submiter" data-action="/api/telephony/'+row.id+'" data-method="put"></div>');
            $('<div class="field">'
                +'<div class="ui slider checkbox">'
                    +'<input  data-name="enabled" type="checkbox" '+((row.enabled && row.enabled==1)?'checked="checked"':'')+' name="enabled"/>'
                    +'<label>'+row.name+'</label>'
                +'</div>'
                +'</div>').appendTo($item);
            $(skymechanics.jobj.toFormFields(row.settings,'settings')).appendTo($item);
            $('<div class="field">'+'<button class="ui green button submit">Save</button>'+'</div>').appendTo($item);
            $c.append($item);
            $c.append('<div class="divider"></div>');
        }
    }
    lazyLink(phone){
        const i =system.telephony.available();
        console.debug('LazyLink', i,phone);
        const tel = system.telephony.get()[i];
        console.debug('LazyLink', i,phone,tel);
        const ext = crm.user.getMeta(system.user.meta,tel.name+"_ext");
        console.debug('LazyLink', i,tel,ext,phone);
        crm.telephony.link(i,ext,phone);

    }
    link(i,ext,phone){
        let tel = system.telephony.list[i];
        // console.info('C2C: '+tel.settings.url+'?username='+ext+'&number='+phone+'&caller_id_number=0');
        if(tel.name=='Odricall'){
            $.ajax({
                url:tel.settings.url+'?username='+ext+'&number='+phone+'&caller_id_number='+phone,
                success:function(d,x,s){
                    console.debug(d)
                },
                error:function(x,s){
                    alert(tel.name+': '+x.responseJSON.message);
                }
            });
        }
    }
};
