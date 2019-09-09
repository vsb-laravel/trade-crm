export class OnlineUsers{
    constructor(){
        this.list={};
        this.socketList = [];
        this.ids = [];
        this.currentAuth = window.user;
        this.load = this.load.bind(this);
        this.handle = this.handle.bind(this);
        this.render = this.render.bind(this);
        this.onlineNowById = this.onlineNowById.bind(this);
    }
    handle(d){
        this.socketList = d;
        this.load();
    }
    load(){
        const that = this;
        this.ids = [];
        this.socketList.map( (item,i) => {
            const id = item.id;
            if(id != user.id ){
                if(user.rights_id>=8 || user.childs.indexOf(item.parent_user_id)>-1 || user.childs.indexOf(item.affilate_id)>-1){
                    if( that.list[id] == undefined || that.list[id] == null ){
                        that.list[id] = item;
                        that.list[id].signin = true;
                        that.render(that.list[id]);
                    }else{
                        that.list[id].signin = true
                    }
                }
                if(item.rights_id==1 && !user.fastlogin && this.ids.indexOf(id) == -1)this.ids.push(id);
            }

        });
        for(let i in that.list){
            if(that.list[i].signin === false) {
                let $u = $(`#online-user-${that.list[i].id}`);
                if(that.list[i].rights_id>1 ) $('#online_admins').find('.label').text( parseInt($('#online_admins').find('.label').text())-1 );
                else $('#online_users').find('.label').text( parseInt($('#online_users').find('.label').text())-1 );
                $u.remove();
                delete that.list[i];
            }
            else that.list[i].signin = false;
        }
        $('input[data-name=ids]').val(this.ids.join());
        $('#user_list_online_count').text(this.ids.length);
        // that.render();
    }
    onlineNowById(){
        this.ids.join();
    }
    render(user,force = false){
        if($(`#online-user-${user.id}`).length ) {
            if(!force)return;
            $(`#online-user-${user.id}`).remove();
        }

        const $admins = $('#online_admins');
        const $users = $('#online_users');
        $admins.removeClass('yellow changed');
        $users.removeClass('yellow changed');

        const $al = $admins.find('.label');
        const $as = $admins.find('.menu');
        const $ul = $users.find('.label');
        const $us = $users.find('.menu');

        if(user.rights_id>1){//admins
            $as.append(`<a class="right aligned item" id="online-user-${user.id}" data-type="admin" onclick="crm.user.card(${user.id})">
                <i class="user circle icon"></i>
                <span class="text">${user.title || `#${user.id}`}</span>
                <span class="description">${user.rights.name || ''}</span></a>`);
            $admins.find('.label').text( parseInt($admins.find('.label').text())+1 );
            $admins.addClass('yellow changed');

        }
        else{ // user
            $us.append(`<a class="right aligned item" id="online-user-${user.id}" data-type="user" onclick="crm.user.card(${user.id})">
                <i class="user icon"></i>
                <span class="text">${user.title || `#${user.id}`}</span>
                <span class="description">${user.fastlogin?__('crm.fastlogin'):user.balance.dollars()}</span>
            </a>`);
            $users.find('.label').text( parseInt($users.find('.label').text())+1 );
            $users.addClass('yellow changed');
        }
    }
}
