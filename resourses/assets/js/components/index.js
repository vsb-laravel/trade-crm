class VUIComponent{
    constructor(){}
}
export class LimitlessList extends VUIComponent{
    constructor(){
        super();
    }
}
export class VUIPassword extends VUIComponent{
    constructor(n='password'){
        super();
        this.name=n;
        this.id=skymechanics.guid();
        this.render=this.render.bind(this);
        this.toggle=this.toggle.bind(this);
        return this.render();
    }
    toggle(){
        const $input = $(`#${this.id}`);
        const $eye = $(`#clicker${this.id}`);
        console.debug('Password component eye click',$input,$eye);
        if($input.attr(`type`)=="password"){
            $input.get(0).type = 'text';
            $eye.addClass('slash');
        }else{
            $input.get(0).type = 'password';
            $eye.removeClass('slash');
        }
    }
    render(){
        const that = this;
        let $div = $(`<div class="ui action input"></div>`);

        $(`<input id="${this.id}" type="password" data-name="${this.name}" name="${this.name}"/>`).appendTo($div);
        $(`<button class="ui basic icon button"><i  id="clicker${this.id}" class="ui eye icon"></i></button>`).appendTo($div).on('click',that.toggle);

        return $div;
    }
}
export class VUICopytext extends VUIComponent{
    constructor(v=''){
        super();
        this.value=v;
        this.id=skymechanics.guid();
        this.render=this.render.bind(this);
        return this.render();
    }
    render(){
        const {id,value} = this;
        let $div = $(`<div class="ui action input"></div>`);
        $(`<input id="${id}" type="text" readonly="readonly" value="${value}"/>`).appendTo($div);
        $(`<button class="ui basic icon button" onclick="copyValue(this,'#${id}')"><i  id="clicker${id}" class="ui copy icon"></i></button>`).appendTo($div);
        return $div;
    }
}
export class VUIEditable extends VUIComponent{
    constructor(a,n='',v='',c=''){
        super();
        this.action=a;
        this.name=n;
        this.value=v;
        this.callback=c;
        this.id=skymechanics.guid();
        this.render=this.render.bind(this);
        return this.render();
    }
    render(){
        const that = this;
        let $res = $('<div class="ui action input"></div>');
        $(`<a class="ui icon link editor" id="${that.id}"><i class="ui pencil icon"></i></a>`).appendTo($res).on('click',function(){
            $(`#${that.id}_editable_part`).show();
            $(`#${that.id}_static_part`).hide();
            $(`#${that.id}`).hide();
        })
        $(`<span class="static" id="${that.id}_static_part">${that.value}</span>`).appendTo($res);
        let $form = $(`<div class="ui form" data-action="${that.action}" style="display:none;" id="${that.id}_editable_part" data-method="put" data-callback="${that.callback || ''}"></div>`).appendTo($res);
        let $fields = $(`<div class="fields"></div>`).appendTo($form);
        $(`<div class="field"><div class="ui input"><input type="${isNaN(that.value)?'text':'number'}" id="${that.id}_value" data-name="${that.name}" value="${that.value}" /></div></div>`).appendTo($fields);
        $fields = $(`<div class="field"></div>`).appendTo($fields);
        $(`<button class="ui primary button submit">${ __('crm.save') }</button>`).appendTo($fields).on('click',function(){
            $(`#${that.id}_editable_part`).hide();
            $(`#${that.id}_static_part`).html($(`#${that.id}_value`).val());
            $(`#${that.id}_static_part`).show();
            $(`#${that.id}`).show();
        });

        skymechanics.submiter($form)
        return $res;
    }
}
export class VUIResourceRemove extends VUIComponent{
    constructor(a,c=null){
        super();
        this.action=a;
        this.callback=c;
        this.id=skymechanics.guid();
        this.render=this.render.bind(this);
        return this.render();
    }
    render(){
        const that = this;
        let $form = $(`<div class="ui form" data-action="${that.action}" id="${that.id}" data-method="delete" data-callback="${that.callback || ''}"></div>`);
        $(`<button class="ui red icon button submit"><i class="ui trash icon"></i></button>`).appendTo($form);
        skymechanics.submiter($form)
        return $form;
    }
}
export class VUIMessage extends VUIComponent{
    constructor(data={}){
        super();
        this.title = data.title || __('crm.message.title');
        this.message = data.message || __('crm.message.empty');
        this.warn = data.warn || false;
        this.error = data.error || false;
        this.render=this.render.bind(this);
        return this.render();
    }
    render(){
        const m = `<div class="ui basic small modal">
            <div class="ui icon header">
                ${
                    this.warn?'<i class="yellow info icon"></i>':(
                        this.error?'<i class="red remove icon"></i>':'<i class="green checkmark icon"></i>'
                    )
                }
                ${this.title}
            </div>
            <div class="content" style="text-align:center">
                ${this.message}
            </div>
            <div class="actions" style="text-align:center">
                <div class="ui green ok inverted button">
                    <i class="checkmark icon"></i>
                    ${__('crm.message.ok')}
                </div>
            </div>
        </div>`;
        const $message = $(m).appendTo('body').modal({
            transition: 'scale',
            allowMultiple:true,
            onHidden:function(e){
                $(this).remove();
            }
        }).modal('show');
        return $message;
    }
}
export class VUIModal extends VUIComponent{
    constructor(data={}){
        super();
        this.title = data.title || __('crm.message.title');
        this.message = data.message || __('crm.message.empty');
        this.warn = data.warn || false;
        this.error = data.error || false;
        this.approve = data.approve || false;
        this.deny = data.deny || false;
        this.render=this.render.bind(this);
        return this.render();
    }
    render(){
        const approve = this.approve;
        const deny = this.deny;
        const m = `<div class="ui mini modal">
            <div class="ui icon header">
                ${this.title}
            </div>
            <div class="content" style="text-align:center">
                ${this.message}
            </div>
            <div class="actions" style="text-align:center">
                ${ deny
                    ? '<div class="ui red cancel button"><i class="checkmark icon"></i>'+__('crm.message.cancel')+'</div>'
                    :''
                }
                ${ approve
                    ?'<div class="ui green ok button"><i class="checkmark icon"></i>'+__('crm.message.ok')+'</div>'
                    :''
                }
            </div>
        </div>`;
        const $message = $(m).appendTo('body').modal({
            transition: 'scale',
            allowMultiple:true,
            onHidden:function(e){
                $(this).remove();
            },
            onApprove:function(e){
                if(approve)approve(e);
            },
            onDeny:function(e){
                if(deny)deny(e);
            },
        }).modal('show');
        // if(skymechanics && skymechanics.reload) skymechanics.reload();
        return $message;
    }
}
export class VUIPrompt extends VUIComponent{
    constructor(data={}){
        super();
        this.title = data.title || __('crm.message.title');
        this.values = data.values || false;
        this.render=this.render.bind(this);
        if(this.values===false)return;
        return this.render();
    }
    render(){
        return new Promise((resolve,reject)=>{
            const m = `<div class="ui mini modal">
                <div class="ui icon header">
                    ${this.title}
                </div>
                <div class="content" style="text-align:center">
                    <div class="ui form">
                        ${this.values.map( (val,i) => {
                            return `<div class="ui field">
                                <!-- <div class="ui label"></div> -->
                                <label>${val.title || 'Value'}</label>
                                <div class="ui input">
                                    <input class="prompted" type="text" data-name="${val.name || 'name'}"  name="${val.name || 'name'}"  value="${val.value || ''}" />
                                </div>
                            </div>`;
                        }).join()}
                    </div>
                </div>
                <div class="actions" style="text-align:center">
                    <div class="ui red cancel button"><i class="checkmark icon"></i>${__('crm.message.cancel')}</div>
                    <div class="ui green ok button"><i class="checkmark icon"></i>${__('crm.message.ok')}</div>
                </div>
            </div>`;
            $(m).appendTo('body').modal({
                transition: 'scale',
                allowMultiple:true,
                onHidden:function(e){$(this).remove();},
                onApprove:function(e){
                    let ret=[];
                    $(m).find('.prompted').each(function(){
                        ret.push({
                            name:$(this).data('name'),
                            value:$(this).val()
                        });
                    });
                    console.log('resolved',ret);
                    resolve(ret);
                },
                onDeny:function(e){
                    resolve([]);
                },
            }).modal('show');
        });
    }
}
export class VUIFileupload extends VUIComponent {
    constructor(options={}){
        super();
        this.options = $.extend({
            container:$('body'),
            action:'/',
            button:false,
            autoUpload:false,
            done:(e,data)=>{}
        },options);
        this.render=this.render.bind(this);
        return this.render();
    }
    render(){
        const that = this;
        const $container = that.options.container;
        const $list = $(`<div class="ui items"></div>`).appendTo($container);
        const $progress = $(`<div class="ui progress fileupload-progress"><div class="bar"><div class="progress"></div></div><div class="label">${__('crm.fileuploading')}</div></div>`);
        const $fu = $(`<input class="ui input fileupload" id="fileupload" type="file" accept=".gif,.jpg,.jpeg,.png" name="upload[]" data-url="${that.options.action}"/>`).appendTo($container).addClass('fileupload-assigned').fileupload({
            autoUpload: that.options.autoUpload,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 999000,
            disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
            previewMaxWidth: 100,
            previewMaxHeight: 100,
            previewCrop: true
        })
        .on('fileuploadadd', function (e, data) {
            // $('#uploadall').removeClass('disabled');
            // console.debug('fileuploadadd',that.options.button,$progress);
            $.each(data.files, function (index, file) {
                $list.html('');
                let node = $(`<div class="ui item" data-name="${file.name}"></div>`);
                const $imageplace = $(`<div class="ui tiny image"></div>`).appendTo(node)
                $(`<div class="ui middle aligned content">
                    <a class="header">${file.name}</a>
                    <div class="description">${(file.size/1024).toFixed(0)} Kb</div>
                    <div class="meta red error"></div>
                </div>`).appendTo(node).append($progress);
                if(that.options.button){
                    that.options.button.removeClass('disabled').on('click', function () {
                        const $this = $(this);
                        const data = $this.data();
                        $('#fileupload_progress').progress({percent: 0});
                        $this.off('click').html(`<i class="ui ban icon"></i> ${__('crm.abort')}`)
                        $this.on('click', function () {
                            $this.remove();
                            data.abort();
                        });
                        data.submit().always(function () {
                            $this.remove();
                        });
                    }).data(data);
                }
                data.context = node;
                node.appendTo($list);
                let image = image = new Image();

                $(image).on('load',function() {
                    const dim = this.width/this.height;
                    const $this = $(this);
                    const data = $this.data();
                    $imageplace.append(image);
                    if( dim < (1.6) ){
                        data.abort();
                        console.log("The image width is " +this.width + " and image height is " + this.height +" dim="+dim, (dim<(4/3)));
                        console.warn('wrong image format')
                        var error = $('<span class="text-danger"/>').text(__('crm.options.banner_file_wrong_dim'));
                        node.find('.meta').append(error);
                    }else{
                        console.debug(data);
                        data.submit();
                    }
                }).data(data);
                image.src = window.URL.createObjectURL(file);
            });
        })
        .on('fileuploadprocessalways', function (e, data) {

            var index = data.index,
                file = data.files[index],
                node = $(data.context.children()[index]);
            console.debug('fileuploadprocessalways',file)
            if (file.preview) {
                node.prepend(file.preview);
            }
            if (file.error) {
                node.append($('<span class="text-danger"/>').text(file.error));
            }
        })
        .on('fileuploadprogressall', function (e, data) {
            console.debug('fileuploadprogressall:',e);
            const $prog = data.context;
            // data.bitrate
            $('.fileupload-progress:first').progress({percent: parseInt(data.loaded / data.total * 100, 10)});
        })
        .on('fileuploaddone', function (e, data) {
            data.context.remove();
            // const img = (doc.file.match(/\.(pdf|docx?)$/))
            //     ?`<iframe src="https://docs.google.com/viewer?url=${document.location.hostname}/${doc.file}&embedded=true" style="width: 100%; height: 100%" frameborder="0">${__('crm.message.browser_doesnt_support')}</iframe>`
            //     :`<img src="${doc.file}"/>`;
            // $(`#uploaded_${user.id}`).append(`<div class="card" id="kyc_${user.id}_${doc.id}">
            //     <a class="ui image" style="position:relative;" href="javascript:0" onclick="page.image.view(this,{'<i class=\\'check icon\\'></i>':'crm.user.kyc.accept(${doc.id},${user.id})','<i class=\\'ban icon\\'></i>':'crm.user.kyc.decline(${doc.id},${user.id})'})">
            //         <div style="background-color:rgba(33,186,69,.2);position:absolute;width:100%;height:100%;"><i class="ui big green check icon"></i></div>
            //         ${img}
            //     </a>
            //     <div class="content">
            //         <div class="meta">
            //             ${doc.created_at}
            //         </div>
            //     </div>
            //     <div class="actions">
            //         <button class="ui icon black button" onclick="crm.user.kyc.delete(${doc.id},${user.id})"><i class="ui trash icon"></i></button>
            //     </div>
            // </div>`);
            that.options.done(e,data);
        })
        .on('fileuploadfail', function (e, data) {
            $.each(data.files, function (index) {
                var error = $('<span class="text-danger"/>').text('File upload failed.');
                $(data.context.children()[index])
                    .append('<br>')
                    .append(error);
            });
        })
        .prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
        return $fu;
    }
}
