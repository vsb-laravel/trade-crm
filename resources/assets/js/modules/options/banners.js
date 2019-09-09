import { VUIPassword, VUICopytext,VUIResourceRemove, VUIEditable, VUIMessage, VUIModal, VUIFileupload } from '../../components';
export class Banners{
    constructor(){
        this.$form = false;
        this.index=this.index.bind(this);
        this.add=this.add.bind(this);
        this.touch=this.touch.bind(this);
    }
    index($c,d,x){
        console.debug('Banners.index',$c,d,x);
        $c.html('');
        const $tr = $(`<tr></tr>`).appendTo($c);
        if(d.length){
            const banner = d.reverse()[0];
            $tr.append(`<td><code>${banner.id}</code></td>`);

            $tr.append(`<td><div class="ui small image"><img height="4em" src="${banner.data.src}" /></div></td>`);
            $(`<td></td>`).appendTo($tr).append( new VUIEditable('/banner/'+banner.id,'href',banner.data.href || '') );
            $tr.append(`<td><div class="ui basic buttons">
                <button class="ui read icon button" data-action="/banner/${banner.id}" data-method="DELETE" data-callback="crm.banners.touch" data-autostart="true" onclick="skymechanics.submiterHandler(this)">
                    <input type="hidden" class="submit"/>
                    <i class="ui trash icon"></i></button>
                </div>
            </td>`);
        }

        $('#banner_add_update').html( (d.length)? `<i class="ui refresh icon"></i>${__('crm.update')}`: `<i class="ui plus icon"></i>${__('crm.add')}`);
        // d.map( banner => {
        //     const $tr = $(`<tr></tr>`).appendTo($c);
        //     $tr.append(`<td><code>${banner.id}</code></td>`);
        //     $tr.append(`<td><div class="ui small image"><img height="4em" src="/${banner.data.src}"/></div></td>`);
        //     $tr.append(`<td><span class="ui link">${banner.data.href}</span></td>`);
        //     // $tr.append(`<td><div class="ui basic buttons"><button class="ui read icon button submiter" data-action="/banner/${banner.id}" data-method="DELETE" data-callback="crm.banners.touch" onclick="$(this).find('.submit').click()"><input type="hidden" class="submit"/><i class="ui trashicon"></i></button></div></td>`);
        // })
    }
    add(that){
        if(this.$form!=false)return;
        const $that = $(that);
        this.$form = $(`<div class="ui form -submiter"  data-action="/banner" data-method="POST" data-name="options-banner" data-callback="crm.banners.touch"></div>`).insertAfter($that);
        // const $button = $(`<button class="ui primary button submit disabled">${__('crm.save')}</button>`);
        // $(`<div class="ui field"><label>URL</label><div class="ui input"><input data-name="href" value=""/></div></div>`).appendTo($form);
        const _that = this;
        const $imgContainer = $(`<div class="ui field required"><label>${__('crm.image')}</label></div>`).appendTo(this.$form);
        const $fu = new VUIFileupload({
            container:$imgContainer,
            action:'/banner',
            autoUpload:false,
            done:(e,data)=>{
                _that.touch();
            }
        });
        $(`<a class="ui pointing grey basic label">${__('crm.banners.restrictions')}</a>`).appendTo($imgContainer);
        // $(`<div class="ui field"><label>&nbsp;</label></div>`).appendTo(this.$form).append($button);
        skymechanics.reload();
    }
    touch(){
        if(this.$form!=false){
            this.$form.remove();
            this.$form=false;
        }
        skymechanics.touch('banners-list');
    }
}
