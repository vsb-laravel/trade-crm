export class Newsfeed {
    constructor(){
    };
    render($c,d){
        $c.html('');
        d.data.map( (row,i) => {
            let $row = $(`<tr data-id="${row.id}"></tr>`).appendTo($c);
            $(`<td class="center aligned">${dateFormat(row.created_at)}</td>`).appendTo($row);
            $(`<td class="">
                <div class="ui unstackable item">
                    <div class="image">
                        <img class="ui tiny image" src="${row.icon}"/>
                    </div>
                    <div class="content">
                        <div class="ui header"><a href="javascript:crm.newsfeed.edit(${row.id})">${row.title}</a></div>
                        <div class="meta">Category <b>${row.category}</b></div>
                        <div class="description">${row.anonce}</div>
                        <div class="extra">Author: ${crm.user.showManager(row.user)}</div>
                    </div>
                </div>
            </td>`).appendTo($row);
            // $cell =
            $(`<td>
                <div class="ui slider checkbox submiter" data-action="/newsfeed/${row.id}" data-method="put"><input type="hidden" class="submit"/><input class="publish-unpublish" type="checkbox" data-name="published" `+(row.published==1?'checked="checked"':'')+`/><label></label></div>
                <div class="submiter" style="display:inline-block" data-action="/newsfeed/${row.id}" data-method="delete" data-callback="crm.newsfeed.added"><button class="ui basic icon button submit" title="Remove"><i class="trash icon"></i></button></div>
            </td>`).appendTo($row);
        });
        $('.publish-unpublish').on('change',function(){$(this).parent('.submiter').find('.submit').click();})
        // page.refresh();
        page.paginate(d, 'newsfeed-list', $c);
    }
    added() {
        $('#newsfeed_add').modal('hide');
        $('#newsfeed_edit').modal('hide');
        cf.touch('newsfeed-list');
    }
    add() {
        let $c = $('<div class="ui ontop fullscreen scrolling long modal submiter" data-action="/newsfeed" data-method="post" data-callback="crm.newsfeed.added" id="newsfeed_add"></div>').appendTo('#modals');
        $c.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
        $c.append('<div class="header"><i class="icon newspaper outline"></i> Create news</div>');
        let $bo = $('<div class="content ui form "></div>').appendTo($c),
            $b = $('<div class="fields"></div>').appendTo($bo);

        $('<div class="field required"><label>Category</label><div class="ui left icon input search"><i class="ui folder icon"></i><input type="text" name="category" data-name="category" placeholder="Category" required></div></div>').appendTo($bo);
        $('<div class="field required"><label>Title</label><div class="ui left icon input"><i class="ui heading icon"></i><input type="text" name="title" data-name="title" placeholder="Title" required></div></div>').appendTo($bo);
        $('<div class="field required"><label>Image</label><div class="ui left icon input"><i class="ui image icon"></i><input type="text" name="icon" data-name="icon" placeholder="Image" required></div></div>').appendTo($bo);
        $(`<div class="field required">
            <label>Anonce</label>
            <div class="richtext-editor" data-id="newsfeed_anonce" id="newsfeed_anonce_edtor" data-size="normal"></div>
            <input type="hidden" data-name="anonce" id="newsfeed_anonce"/>
        </div>`).appendTo($bo);
        $(`<div class="field required">
            <label>Content</label>
            <div class="richtext-editor" data-id="newsfeed_content" id="newsfeed_edtor" data-size="large"></div>
            <input type="hidden" data-name="content" id="newsfeed_content"/>
        </div>`).appendTo($bo);
        const $f = $('<div class="actions"></div>').appendTo($c);
        $('<div class="ui black deny button">Close</div>').appendTo($f);
        $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
        cf.reload();
        page.modal('#newsfeed_add');

    }
    edit(id) {
        let $c = $(`<div class="ui ontop fullscreen scrolling modal long submiter" data-action="/newsfeed/${id}" data-method="put" data-callback="crm.newsfeed.added" id="newsfeed_edit"></div>`).appendTo('#modals');
        $c.append(`<i class="close icon" onclick="$('#newsfeed_edit').modal('hide')"></i>`);
        $c.append(`<div class="header"><i class="icon newspaper outline"></i> Edit news #${id}</div>`);
        let $bo = $('<div class="content ui form"></div>').appendTo($c),
            $b = $('<div class="fields"></div>').appendTo($bo);
        $('<div class="field required"><label>Category</label><div class="ui left icon input search"><i class="ui folder icon"></i><input type="text" name="category" data-name="category" placeholder="Category" required></div></div>').appendTo($bo);
        $('<div class="field loader"><label>Title</label><div class="ui left icon input"><i class="ui heading icon"></i><input type="text" name="title" data-name="title" placeholder="Title"></div></div>').appendTo($bo);
        $('<div class="field loader"><label>Image</label><div class="ui left icon input"><i class="ui image icon"></i><input type="text" name="icon" data-name="icon" placeholder="Image" required></div></div>').appendTo($bo);
        $(`<div class="field loader">
            <label>Anonce</label>
            <div class="richtext-editor" data-id="newsfeed_anonce" id="newsfeed_anonce_edtor" data-size="normal"></div>
            <input type="hidden" data-name="anonce" id="newsfeed_anonce"/>
        </div>`).appendTo($bo);
        $(`<div class="field loader">
            <label>Content</label>
            <div class="richtext-editor" data-id="newsfeed_content" id="newsfeed_edtor"></div>
            <input type="hidden" data-name="content" id="newsfeed_content"/>
        </div>`).appendTo($bo);
        const $f = $('<div class="actions"></div>').appendTo($c);
        $('<div class="ui black deny button">Close</div>').appendTo($f);
        $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
        page.modal('#newsfeed_edit');
        $.ajax({
            url:`/newsfeed/${id}`,
            type:'get',
            success:function(d,s,x){
                $c.find('[data-name=title]').val(d.title);
                $c.find('[data-name=category]').val(d.category);
                $c.find('[data-name=anonce]').val(d.anonce);
                $c.find('[data-name=content]').val(d.content);
                $c.find('[data-name=icon]').val(d.icon);
                $c.find('#newsfeed_anonce_edtor .ui.segment').html(d.anonce);
                $c.find('#newsfeed_edtor .ui.segment').html(d.content);
                $('#newsfeed_edit').modal('setting', 'centered', false);
                $('#newsfeed_edit').modal('refresh');
                $('#newsfeed_edit .field').removeClass('loader');

            }
        })

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
