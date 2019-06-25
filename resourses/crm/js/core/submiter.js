import { VUIMessage, VUIModal, VUIPrompt } from '../components';
export class VUISubmiter {
    constructor( that ){
        this.container = $(that);
        this.clickfn = this.clickfn.bind(this);
        this.getargs = this.getargs.bind(this);
        this.checkvals = this.checkvals.bind(this);
        this.google2fa = this.google2fa.bind(this);
        this.query = this.query.bind(this);
        this.checkGoogle2faCondition = this.checkGoogle2faCondition.bind(this);
        this.$buttonSubmiter = this.container.find('.submit');
        this.container.find('.cancel').on('click',function(){});
        if(this.container.data("autostart")){
            // console.log('VUISubmiter autostart=',this.container.data("autostart"),this.clickfn());
            this.clickfn();
        }
        else{
            const trigger = this.$buttonSubmiter.data('trigger') || 'click';
            const {clickfn} = this;
            this.$buttonSubmiter.on(trigger,function(e){clickfn();});
        }
    }
    checkvals($c){
        let ret = true;
        $c.find('input,textarea,select').filter('[required]:visible').each(function(){
            if(!ret)return;
            if($(this).val().length==0){
                $(this).addClass('value-empty').focus();
                ret = false;
            }else $(this).removeClass('value-empty');
        });
        $c.find('input').each(function(){
            if(!ret)return;
            var min = parseFloat($(this).attr('min')),max = parseFloat($(this).attr('max')), val = parseFloat($(this).val()),$that = $(this),$alerter = $that.next('.alerter'),popup = $(this).attr('data-validate-text');
            if(!$alerter.length)$alerter = $('<span class="red alerter" style="display:none;"></span>').insertAfter($that);
            if(popup==undefined)popup = 'Value should be from '+min;
            popup = popup.replace(/\{([^\}]+)\}/g,function(m,p,o,s){
                if(p=='min')return min;
                if(p=='max')return max;
            });
            if(min){
                if(val<min){
                    ret = false;
                    $alerter.text(popup);
                    $alerter.fadeIn();
                }
                else $alerter.fadeOut();
            }
            if(max){
                if(val>max){
                    ret = false;
                    $alerter.text(popup);
                    $alerter.fadeIn();
                }
                else $alerter.fadeOut();
            }
        });
        return ret;
    }
    getargs($c){
        let args = {};
        $c.find("input,select,textarea").each(function(){
            let n = $(this).attr("data-name"),v = ($(this).attr('type')=='checkbox')?($(this).is(':checked')?"1":'0'):$(this).val();
            if($(this).hasClass('-ui-calendar')){
                const date = $(this).parents('.ui.calendar').calendar('get date');
                v = date.getFullYear()+'-'+(1+date.getMonth()).leftPad()+'-'+date.getDate().leftPad()+' '+date.getHours().leftPad()+':'+date.getMinutes().leftPad()+":"+date.getSeconds().leftPad();
            }
            if($(this).data('prompt')){
                v = prompt($(this).data('title'),v);
                // const vals = new VUIPrompt({
                //     title:$(this).data('title'),
                //     values:[
                //         {
                //             title:$(this).data('title'),
                //             value:v,
                //             name:n
                //         }
                //     ]
                // });
                // console.log('VUIPrompted ',vals);
            }
            if(n!=undefined && n.length){
                let nn = n.split(/\./),argss = args;
                if(nn.length>1){
                    for(let i = 0; i<nn.length-1;++i){
                        argss[nn[i]] = (argss[nn[i]])?argss[nn[i]]:{};
                        argss = argss[nn[i]];
                    }
                    n= nn[nn.length-1];
                }
                argss[n]=v;
            }
        });
        return args;
    }
    google2fa(args,error=false){
        const {container} = this;
        return new Promise( (resolve,reject) => {
            const $modal = new VUIModal({
                title:__('crm.private.google2fa.one_time_password'),
                message:`<div class="ui form">
                        <div class="ui field">
                            <div class="ui massive icon blue color input">
                                <input id="one_time_password" class="google2fa-otp" class="ui huge input" name="one_time_password" required autofocus/>
                                <i class="ui google blue color icon"></i>
                            </div>
                            ${(error)?'<div class="ui error bottom attached message">'+error.message+'</div>':''}
                        </div>
                    </div>`,
                approve: ($e)=>{
                    console.log('approving',$e.parents('.form'),$e.parent('.form').find('#one_time_password'));
                    args['__g2fa']=$('#one_time_password').val();
                    resolve(args);
                },
                deny: ($e)=>{
                    console.log('decline',$e);
                    // document.location.reload(true);

                    reject(args);
                }
            });
            $('#one_time_password').inputmask({autoUnmask: true, mask: "999 999"});
            $('#one_time_password').on(`keyup`,function(){
                const val = $(this).val();
                if(val.length==6) $modal.find('.ok.button').trigger('click');
            });
        });
    }
    query(args){
        const {container,$buttonSubmiter,google2fa} = this;
        const callback = getFunctionByName( container.attr("data-callback") );
        const error = container.attr("data-callback-error");
        const btnText = $buttonSubmiter.html();
        const action = container.attr("data-action");
        const ftype = container.attr("data-method") || 'GET';
        $.ajax({
            url:action,
            data:args,
            type:ftype,
            beforeSend:function(){
                if( $buttonSubmiter.find('i.icon').length )$buttonSubmiter.find('i.icon').replaceWith('<i class="cf-loader fa fa-spin fa-fw fa-circle-o-notch"></i>')
                else $buttonSubmiter.html('<i class="cf-loader fa fa-spin fa-fw fa-circle-o-notch"></i>');
            },
            success:function(d){
                callback(d,container,args);
                if(d.redirect){
                    if(d.redirect.form){
                        $(d.redirect.form).appendTo('body').submit();
                    }
                    else if(d.redirect.url){
                        document.location.href = d.redirect.url;
                    }
                }
                else if(d.append){
                    if(d.append.view){
                        $(d.append.view).appendTo('body');
                    }
                }
            },
            error:function(x,s){
                console.debug('Error in submiter response',container.find('.changed'),x.responseJSON);
                container.find('.need-rollback').each(function(){
                    const $that = $(this);
                    const val = $that.data('rollback-value');
                    console.log('rollback changes',$that,val);
                    if($that.hasClass('checkbox')){
                        // const $check = $that.parents('.checkbox:first');
                        const $check = $that;
                        console.log('rollback changes on checkbox',$check);
                        $check.checkbox( `set ${(val==1)?'checked':'unchecked'}` );
                    }
                    $that.removeClass('need-rollback');
                });
                try{
                    const err = x.responseJSON;
                    if(err.error && err.error == 762){
                        new VUIMessage({
                            error:true,
                            title:__('crm.error'),
                            message:err.message
                        });
                        return;
                    }
                }
                catch(e){
                    console.error(e);
                }
                try{
                    if(error){
                        error = getFunctionByName(error);
                        error(x.responseJSON,container,args);

                    }
                    else callback(x.responseJSON,container,args);
                }
                catch(e){
                    console.error(e);
                }
                console.error(x.responseJSON,args);
            },
            complete:function(){
                $buttonSubmiter.html(btnText);
            }
        });
    }
    clickfn(e){
        const container = this.container;
        if(e)e.preventDefault();
        if(e)e.stopPropagation();
        if(!this.checkvals(container))return false;
        let args = this.getargs(container);
        const g2fa = container.data('google2fa') || false;
        const g2faCondition = container.data('google2fa-condition') || false;
        if(window.user.google2fa=="1" && g2fa && this.checkGoogle2faCondition(args,g2faCondition)) this.google2fa(args).then( (arge)=>{
            this.query(arge);
        }).catch( (arge)=>{} );
        else this.query(args);
    }
    checkGoogle2faCondition(args,condition){
        if(condition==false)return true;
        console.debug('VUISubmiter.checkGoogle2faCondition',args,eval(`args.${condition}`));
        return eval(`args.${condition}`);
    }
}
