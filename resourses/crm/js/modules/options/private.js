import { VUIPassword, VUICopytext,VUIResourceRemove, VUIEditable, VUIMessage, VUIModal } from '../../components';
export class Private{
    constructor(d,c,a){
        this.args = {
            request:a,
            response:d,
            container:c
        };
        this.guid = guid();
        this.getqr=this.getqr.bind(this);
        this.render=this.render.bind(this);
        if(this.args.response.meta_value=='1'){
            const $modal = new VUIModal({
                title:__('crm.private.google2fa.one_time_password'),
                message:`<div class="ui loading placeholder segment" id="g2fa_code" style="height:460px;"></div>`,
                approve:($e)=>{console.log('Ok')}
            });
            this.getqr().then((d)=>{
                this.render(d);
            })
            this.$section=$(`#g2fa_code`);
        }else{
            new VUIMessage({
                title:__('crm.success'),
                message:' '
            });
        }
    }
    getqr(){
        const userId = this.args.request.user_id;
        const container = this.args.container;
        return new Promise( (resolve,reject) => {
            $.ajax({
                url:`/user/${userId}/google2fa`,
                type:'post',
                success:(d,x,s)=>{
                    resolve(d);
                },
                error:(x,s)=>{
                    reject();
                }
            });
        });
    }
    render(d){
        const $section = this.$section;
        $section.removeClass('loading');
        $section.replaceWith(d);
    }
}
