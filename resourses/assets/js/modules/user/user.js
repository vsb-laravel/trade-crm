import { Card } from '../../components/card';
import { VUIPassword, VUICopytext,VUIResourceRemove, VUIEditable, VUIMessage } from '../../components';
export class User extends Card{
    constructor(u,tab='kyc') {
        super('user');
        this._uid='cuser_'+u.id;
        this.user = u;
        this.auth = window.user;
        this.tab = `${tab}_${u.id}`;
        this.getTitle = this.getTitle.bind(this);
        this.draw = this.draw.bind(this);
        this.leftColumn = this.leftColumn.bind(this);
        this.kyc = this.kyc.bind(this);
        this.trades = this.trades.bind(this);
        this.comments = this.comments.bind(this);
        this.tasks = this.tasks.bind(this);
        this.finance = this.finance.bind(this);
        this.accounts = this.accounts.bind(this);
        this.log = this.log.bind(this);
        this.messages = this.messages.bind(this);
        this.mail = this.mail.bind(this);
        this.meta = this.meta.bind(this);
        this.compare = this.compare.bind(this);
        this.pnl = this.pnl.bind(this);
        this.restrictions = this.restrictions.bind(this);
    }
    getBalance(user){
        let a = 0;
        if(!user.accounts)return a;
        user.accounts.map( (account,i) => {
            if(account.type=='real')a+=parseFloat(account.amount);
        })
        return a;
    }
    compare(data){
        const {user} = this;
        if(JSON.stringify(user.messages)!=JSON.stringify(data.messages)) return false;
        if(this.getBalance(user)!=this.getBalance(data)) return false;
        // if(data.comments == undefined) return false;
        if(user.comments && user.comments.length!=data.comments.length) return false;
        // if(user.deal.length!=data.deal.length) return false;
        return true;
    }
    getMetaRaw(n) {
        let ret = false;
        const l = this.user.meta;
        for (var i in l) {
            var m = l[i];
            if (m.meta_name === n) {
                return m;
            }
        }

        return false;
    }
    getMeta(n, type='string') {
        let ret = this.getMetaRaw(n);
        if(ret){
            try{
                ret = ret.meta_value;
                switch(type){
                    case 'json':
                        ret = JSON.parse(ret);
                        break;
                }
            }catch(e){
                console.error('cast data error',type,ret,e)
            }
        }
        return ret?ret:'';
    }
    fresh(d){
        // console.debug('callback user fresh',d);
        if(!this.compare(d)){
            // this.user = $.extend(this.user,d);
            this.user = d;
            this.draw(true);
            this.shouldUpdate = true;
            this.isUpdate = true;
            this.rendered = false;
        }
    }
    getTitle(){
        return `#${this.user.id} ${this.user.title}`;
    }
    draw(isUpdate=false){
        if(this.rendered)return;
        isUpdate = this.isUpdate;
        console.log('card.user.draw');
        const that = this;
        const {user,$container,auth} = this;
        this.pnl();
        if(!isUpdate)this.$container.html('');
        let $content = isUpdate?this.$container.find('.content:first'):$(`<div class="ui content"><div class="ui inverted dimmer"><div class="ui text loader">${__('crm.fetching')}</div></div></div>`).appendTo($container);
        this.$container.find('.dimmer').addClass('active');
        let $grid = isUpdate?this.$container.find('.grid:first'):$(`<div class="ui stackable grid"></div>`).appendTo($content);
        let $left = isUpdate?this.$container.find('.left-column'):$(`<div class="column four wide left-column"></div>`).appendTo($grid);
        this.leftColumn($left,isUpdate);
        if(!isUpdate){
            let $right = isUpdate?this.$container.find('.right-column'):$(`<div class="column twelve wide right-column"></div>`).appendTo($grid);
            let $tab = isUpdate?$right.find('.tabular.menu:first'):$(`<div class="ui top attached tabular menu"></div>`).appendTo($right);
            if(auth.can.ftd) $tab.append(`<a class="item active" data-tab="kyc_${user.id}">${__('crm.customers.kyc')}</a>`)
            if(auth.rights_id==10 || (user.rights_id==1 && auth.can.retention)) $tab.append(`<a class="item" data-tab="trades_${user.id}">${__('crm.customers.trades')}</a>`)
            // $tab.append(`<a class="item task-user-item" data-tab="tasks_${user.id}">${__('crm.customers.tasks')}</a>`)
            if(auth.rights_id==10 || (user.rights_id==1 && auth.can.ftd)) $tab.append(`<a class="item" data-tab="finance_${user.id}">${__('crm.customers.finance')}</a>`)
            if(auth.rights_id==10 || (user.rights_id==1 && auth.can.admin)) $tab.append(`<a class="item" data-tab="accounts_${user.id}">${__('crm.accounts.title')}</a>`)
            $tab.append(`<a class="item" data-tab="messages_${user.id}">${__('crm.customers.messages')}</a>`)
            $tab.append(`<a class="item" data-tab="mail_${user.id}">${__('crm.mail.title')}</a>`)
            if(auth.can.admin) $tab.append(`<a class="item" data-tab="meta_${user.id}">${__('crm.admin.meta')}</a>`)
            if(auth.can.ftd) $tab.append(`<a class="item${auth.can.ftd?'':' active'}" data-tab="log_${user.id}">${__('crm.customers.log')}</a>`)
            if(auth.can.admin && user.rights_id!=1)$tab.append(`<a class="item" data-tab="restrictions_${user.id}">${__('crm.restrictions.title')}</a>`)
            if(auth.rights_id==10 || (user.rights_id==1 && auth.can.fastlogin)) $tab.append(`<a class="ui item color blue inverder label" href="//${window.tradehost}/user/fastlogin/${user.id}" target="_blank">${__('crm.fastlogin')}</a>`)

            if(auth.can.ftd) this.kyc(isUpdate?$right.find(`.tab[data-tab="kyc_${user.id}"]`):$(`<div class="ui bottom attached tab segment active" data-tab="kyc_${user.id}"></div>`).appendTo($right))
            if(auth.rights_id==10 || user.rights_id==1)this.trades(isUpdate?$right.find(`.tab[data-tab="trades_${user.id}"]`):$(`<div class="ui bottom attached tab segment " data-tab="trades_${user.id}"></div>`).appendTo($right))
            if(auth.rights_id==10 || user.rights_id==1)this.tasks(isUpdate?$right.find(`.tab[data-tab="tasks_${user.id}"]`):$(`<div class="ui bottom attached tab segment" data-tab="tasks_${user.id}"></div>`).appendTo($right))
            if(auth.rights_id==10 || user.rights_id==1)this.finance(isUpdate?$right.find(`.tab[data-tab="finance_${user.id}"]`):$(`<div class="ui bottom attached tab segment" data-tab="finance_${user.id}"></div>`).appendTo($right))
            if(auth.rights_id==10 || user.rights_id==1)this.accounts(isUpdate?$right.find(`.tab[data-tab="accounts_${user.id}"]`):$(`<div class="ui bottom attached tab segment" data-tab="accounts_${user.id}"></div>`).appendTo($right))
            this.log(isUpdate?$right.find(`.tab[data-tab="log_${user.id}"]`):$(`<div class="ui bottom attached tab segment${auth.can.ftd?'':' active'}" data-tab="log_${user.id}"></div>`).appendTo($right))
            this.messages(isUpdate?$right.find(`.tab[data-tab="messages_${user.id}"]`):$(`<div class="ui bottom attached tab segment" data-tab="messages_${user.id}"></div>`).appendTo($right))
            this.mail(isUpdate?$right.find(`.tab[data-tab="mail_${user.id}"]`):$(`<div class="ui bottom attached tab segment" data-tab="mail_${user.id}"></div>`).appendTo($right))
            if(auth.rights_id==10 || (auth.can.admin && user.rights_id!=1))this.restrictions(isUpdate?$right.find(`.tab[data-tab="restrictions_${user.id}"]`):$(`<div class="ui bottom attached tab segment" data-tab="restrictions_${user.id}"></div>`).appendTo($right))
            if(auth.can.admin) this.meta(isUpdate?$right.find(`.tab[data-tab="meta_${user.id}"]`):$(`<div class="ui bottom attached tab segment" data-tab="meta_${user.id}"></div>`).appendTo($right))
            // skymechanics.reload();
            $tab.tab({
                onLoad: (tabPath)=>{
                    console.debug('card tab changed',that.tab);
                    that.tab = tabPath
                }
            });
            $tab.tab('change tab',that.tab);
        }
        else{
            console.log('touching cards');
            skymechanics.touch(`user-trade-${user.id}`);
            skymechanics.touch(`user-finance-${user.id}`);
            skymechanics.touch(`user-accounts-${user.id}`);
            skymechanics.touch(`user-log-${user.id}`);
            skymechanics.touch(`user-messages-${user.id}`);
        }
        this.$container.find('.dimmer').removeClass('active');
        this.shouldUpdate = false;
        this.rendered = true;
        this.isUpdate = false;
    }
    comments($div){
        const {user} = this;
        $(`<div class="ui horizontal divider">${__("crm.customers.comments")}</div>`).appendTo($div);
        $div = $(`<div class="ui item clearing"></div>`).appendTo($div);
        $div = $(`<div class="ui comments" style="width:100%;"></div>`).appendTo($div);
        let $form = $(`<div class="ui form submiter" data-action="/user/${user.id}/comment" data-name="user-comment" data-callback="crm.comments.added"></div>`).appendTo($div);
        let $field = $(`<div class="ui field"></div>`).appendTo($form);
        $(`<textarea name="comment" class="ui input" data-name="comment" id="${user.id}comment" placeholder="${__('crm.comments.comment_text')}" required style="height:2rem;"></textarea>`).appendTo($field).on('change keyup',function(e){
            const $btn = $(this).parents('.submiter').find('.submit');
            if($(this).val().length) {
                $btn.removeClass('disabled');
                if(e.keyCode == 13 && e.ctrlKey) $btn.click();
            }
            else $btn.addClass('disabled');
        });
        $(`<div class="ui field right aligned">
                <div class="ui blue labeled submit icon button disabled">
                    <i class="icon edit"></i> ${__('crm.customers.addcomment')}
                </div>
            </div>`).appendTo($form);

        if(!user.comments || user.comments.length==0)$(`<div class="comment empty">No Comments</div>`).appendTo($div);
        else {
            user.comments.map( (comment,i) => {
                $(`<div class="comment">
                    <a class="avatar"><img src="/crm.3.0/images/avatar/${comment.author.id%5}.jpg"></a>
                    <div class="content">
                        <a class="author">${comment.author.title}</a>
                        <div class="metadata">
                            <span class="date">${comment.created_at.datetime({style:'simple'})}</span>
                        </div>
                        <div class="text">${comment.comment}</div>
                    </div>
                </div>`).appendTo($div);
            })
        }

    }
    leftColumn($div,isUpdate=false){
        const {user,auth} = this;
        $div = isUpdate ? $div.find(`#user-${user.id}left-column`):$(`<div id="user-${user.id}left-column" class="ui items"></div>`).appendTo($div);
        if(isUpdate){
            $div.find(`#user-${user.id}-card-title`).html(`<div class="ui content">
                <div class="ui header">
                    <code>#${user.id}</code> ${user.title}
                    <h5 class="ui header" style="display:inline;">${user.created_at.datetime({style:'simple'})}</h5>
                </div>
            </div>`)
            $div.find(`#user-${user.id}-balance`).html(`<h5 class="ui large label blue"><div class="detail">${__('crm.customers.balance')}</div> ${this.getBalance(user).dollars()}</h5>`);
            $div.find(`#user-${user.id}-pnl`).html(`<h5 class="ui large label purple"><div class="detail">${__('crm.customers.pnl')}</div> ${user.pnl.dollars()}</h5>`);
            $div.find(`#user-${user.id}-tradeVolume`).html(`<h5 class="ui large label green"><div class="detail">${__('crm.customers.tradeVolume')}</div> ${user.tradeVolume.dollars()}</h5>`);
            return;
        }

        $div.append(`<div class="ui item" id="user-${user.id}-card-title"><div class="ui content"><div class="ui header"><code>#${user.id}</code> ${user.title} <h5 class="ui header" style="display:inline;">${user.created_at.datetime({style:'simple'})}</h5></div></div></div>`);
        $div.append(`<div class="ui clearing right aligned" id="user-${user.id}-balance"><h5 class="ui large label blue"><div class="detail">${__('crm.customers.balance')}</div>${this.getBalance(user).dollars()}</h5></div>`)
        $div.append(`<div class="ui clearing right aligned" id="user-${user.id}-pnl"><h5 class="ui large label purple"><div class="detail">${__('crm.customers.pnl')}</div> ${user.pnl.dollars()}</h5></div>`)
        $div.append(`<div class="ui clearing right aligned" id="user-${user.id}-tradeVolume"><h5 class="ui large label green"><div class="detail">${__('crm.customers.tradeVolume')}</div> ${user.tradeVolume.dollars()}</h5></div>`)


        if(user.rights_id>1 && this.getMeta('admincode'))$(`<div class="ui clearing right aligned"><label>${__('crm.customers.admincode')}</label></div>`).appendTo($div).append(new VUICopytext(this.getMeta('admincode')))
        $(`<div class="ui clearing right aligned"><label>${__('crm.customers.login')}</label></div>`).appendTo($div).append(new VUICopytext(user.email))
        this.comments($div);
        $div.append(`<div class="ui horizontal divider">${__('crm.customers.statuses')}</div>`)
        const ftd = this.getMeta('ftd','json');
        if(ftd)$div.append(`<div class="ui clearing"><label>${__('crm.customers.ftd')}</label><h5 class="ui header" style="display:inline;">${ftd.manager.title}</h5></div>`)
        $div.append(`<div class="ui clearing item"><label>${__('crm.customers.source')}</label><h5 class="ui header" style="display:inline;">${user.source?user.source:''}</h5></div>`);
        if(this.auth.can.kyc){
            const canTradeMeta = this.getMeta('can_trade');
            const can_trade = (canTradeMeta=='1' || canTradeMeta == 'true')?true:false;
            const kyc = this.getMeta('kyc');
            $(`<div class="ui clearing item">
                <div class="submiter" data-action="/json/user/meta?meta_name=kyc" data-name="user-kyc" data-callback="crm.user.touch" style="width:100%;">
                    <input type="hidden" data-name="user_id" value="${user.id}" />
                    <input type="hidden" data-name="meta_value" value="${kyc}" />
                    <input type="hidden" class="submit"/>
                    <div class="ui indicating progress" data-value="${kyc}" data-percent="${100*kyc/2}" data-total="2" id="user_${user.id}_kyc">
                        <div class="bar">
                            <div class="progress"></div>
                        </div>
                        <div class="label">
                            <div class="ui inline buttons">
                                <button class="ui icon basic button" onclick="$('#user_${user.id}_kyc').progress('decrement')"><i class="arrow left icon"></i></button>
                                <button class="ui basic button disabled">KYC</button>
                                <button class="ui icon basic button" onclick="$('#user_${user.id}_kyc').progress('increment')"><i class="arrow right icon"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`).appendTo($div).find('.progress').progress({
                label: false,
                onChange:function(p,v,t){
                    switch(v){
                        case 0:$(this).progress('set bar label','None KYC');break;
                        case 1:$(this).progress('set bar label','Partial KYC');break;
                        case 2:$(this).progress('set bar label','Fully KYC');break;
                    }
                    $(this).closest('.submiter').find('[data-name=meta_value]').val(v);
                    $(this).closest('.submiter').find('.submit').click();
                }
            }).progress('set progress',kyc?kyc:0);

            $div.append(`<div class="ui item">
                <div class="ui slider checkbox submiter" data-action="/json/user/meta?meta_name=can_trade" data-name="user-can-trade" data-callback="userCanTrade">
                    <input type="hidden" data-name="user_id" value="${user.id}" />
                    <!-- <input type="hidden" class="submit" /> -->
                    <input class="cantrade submit" data-trigger="change" type="checkbox" data-name="meta_value" ${can_trade?'checked="checked" value="true"':''}/>
                    <label>${__('crm.customers.can_trade')}</label>
                </div>
            </div>`)
        }
        let $form=$(`<div class="ui form submiter globe" data-action="/json/user/${user.id}/update" data-callback="crm.user.touch" id=""></div>`).appendTo($div);
        $form.append(`<input type="hidden" data-name="user_id" value="${user.id}" />`);
        if(this.auth.can.kyc){
            $form.append(`<div class="field">
                <div class="ui slider checkbox">
                    <input type="checkbox" data-name="email_verified" ${(user.email_verified=="1")?'checked="checked" value="true"':''} />
                    <label>${__('crm.customers.email_verified')}</label>
                </div>
            </div>`);
        }

        $(`<div class="field">
            <label>${__('crm.customers.status')}</label>
            <div class="ui search selection dropdown">
                <input type="hidden"  data-name="status_id" value="${user.status_id}"/>
                <i class="dropdown icon"></i>
                <div class="default text"></div>
                <div class="menu" tabindex="-1">${this.auth.statuses.toItemList()}</div>
            </div>
        </div>`).appendTo($form);//.dropdown().dropdown('set value', user.status_id);
        if(this.auth.can.kyc){
            $(`<div class="field">
                <label>${__('crm.customers.rights')}</label>
                <div class="ui search selection dropdown">
                    <input type="hidden"  data-name="rights_id" value="${user.rights_id}"/>
                    <i class="dropdown icon"></i>
                    <div class="default text"></div>
                    <div class="menu" tabindex="-1">${this.auth.rights.toItemList()}</div>
                </div>
            </div>`).appendTo($form);//.dropdown('set value', user.rights_id)
            $(`<div class="field">
                <label>${__('crm.customers.manager')}</label>
                <div class="ui selection dropdown" id="user-manager">
                    <input type="hidden" name="parent_user_id" data-name="parent_user_id" value="${user.parent_user_id}">
                    <i class="dropdown icon"></i>
                    <div class="default text"></div>
                    <div class="menu" tabindex="-1">
                        ${window.employees.toItemList()}
                    </div>
                </div>
            </div>`).appendTo($form)
            $(`<div class="field">
                <label>${__('crm.customers.affilate')}</label>
                <div class="ui search selection dropdown" id="user-affilate">
                    <input type="hidden" name="affilate_id" data-name="affilate_id" value="${user.affilate_id}">
                    <i class="dropdown icon"></i>
                    <div class="default text"></div>
                    <div class="menu" tabindex="-1">
                        ${window.employees.toItemList()}
                    </div>
                </div>
            </div>`).appendTo($form)
        }
        if(auth.can.retention) $(`<div class="field"><label>${__('crm.customers.changepassword')}</label></div>`).appendTo($form).append(new VUIPassword());
        if(user.rights_id>1)$form.append(`
            <div class="field">
                <label>${__('crm.customers.office')}</label>
                <div class="ui input">
                    <input data-name="office" value="${user.office}" />
                </div>
            </div>`)
        $form.append(`<buttom class="ui button green submit">${__('crm.save')}</button>`)
        // $form.append(``)

        return $div;
    }
    kyc($div){
        const {user,auth} = this;
        $div.html('');
        let $form =$(`<div class="ui form submiter globe" data-action="/json/user/${user.id}/update" data-callback="crm.user.touch"></div>`).appendTo($div);
        const address = this.getMeta('')
        $(`<div class="three fields">
            <div class="field">
                <label for="name">${__('crm.customers.name')}</label>
                <input ${auth.can.retention?'':'readonly="readonly"'} type="text" data-name="name" placeholder="${__('messages.Enter_your_name')}" value="${user.name}" >
            </div>
            <div class="field">
                <label for="l_name">${__('crm.customers.surname')}</label>
                <input ${auth.can.retention?'':'readonly="readonly"'} type="text" data-name="surname" placeholder="${__('messages.Enter_last_name')}" value="${user.surname}">
            </div>
            <div class="field">
                <label for="l_name_l">${__('crm.customers.middlename')}</label>
                <input ${auth.can.retention?'':'readonly="readonly"'} type="text" data-name="midname" placeholder="${__('messages.Enter_middle_name')}"  value="${this.getMeta('midname') || ''}">
            </div>
        </div>
        <div class="three fields">
            <div class="field">
                <label for="date">${__('crm.customers.birthday')}</label>
                <input ${auth.can.retention?'':'readonly="readonly"'} type="date" data-name="birthday" placeholder="${__('crm.customers.dd_mm_yyyy')}" value="${this.getMeta('birthday') || ''}">
            </div>
        </div><div class="ui horizontal divider">${__('crm.customers.contacts')}</div>
        <div class="two fields">
            <div class="field">
                <label for="tel">${__('crm.customers.phone')}</label>
                <div class="ui action input">
                    <input ${auth.can.retention?'':'readonly="readonly"'} type="tel" data-name="phone" placeholder="${__('messages.Enter_phone_number')}" value="${user.phone}">
                    <button class="ui icon button" onclick="crm.telephony.lazyLink('${user.phone}')"><i class="phone icon"></i></button>
                </div>
            </div>
            <div class="field">
                <label for="tel">${__('crm.customers.email')}</label>
                <input ${auth.can.retention?'':'readonly="readonly"'} type="tel" data-name="email" placeholder="${__('crm.customers.email')}" value="${user.email}">
            </div>
        </div><div class="ui horizontal divider">${__('crm.customers.location')}</div>
        <div class="three fields">
            <div class="field">
                <label for="country">${__('crm.customers.country')}</label>
                <div class="ui selection search dropdown">
                    <input type="hidden"  data-name="country" value="${this.getMeta('country') || ''}"
                    <i class="dropdown icon"></i>
                    <div class="default text"></div>
                    <div class="menu" tabindex="-1">${window.countries.toItemList(true)}</div>
                </div>
            </div>
            <div class="field">
                <label for="city">${__('crm.customers.city')}</label>
                <input ${auth.can.retention?'':'readonly="readonly"'} type="text" data-name="city" placeholder="${__('messages.Enter_the_name_of_the_city')}" value="${user.address?user.address.city:''}">
            </div>

            <div class="field">
                <label for="name">${__('crm.customers.index')}</label>
                <input ${auth.can.retention?'':'readonly="readonly"'} type="text" data-name="zip" placeholder="${__('messages.Enter_the_index')}" value="${user.address?user.address.zip:''}">
            </div>
        </div>
        <div class="field">
            <label for="address1">${__('crm.customers.address')} 1</label>
            <input ${auth.can.retention?'':'readonly="readonly"'} type="text" data-name="address1" placeholder="${__('messages.Enter_the_address')} 1" value="${user.address?user.address.address1:''}">
        </div>
        <div class="field">
            <label for="address2">${__('crm.customers.address')} 2</label>
            <input ${auth.can.retention?'':'readonly="readonly"'} type="text" data-name="address2" placeholder="${__('messages.Enter_the_address')} 2" value="${user.address?user.address.address2:''}">
        </div>
        <div class="ui horizontal divider">${__('crm.customers.passport')}</div>
        <div class="fields">
            <div class="six wide field">
                <label for="pasport">${__('crm.customers.passportseries')}</label>
                <input ${auth.can.retention?'':'readonly="readonly"'} type="text" data-name="passport" placeholder="${__('messages.Enter_the_series')}" value="${user.passport?user.address.series:''}">
            </div>
            <div class="ten wide field">
                <label for="num_pasport">${__('crm.customers.passportid')}</label>
                <input ${auth.can.retention?'':'readonly="readonly"'} type="text" data-name="num_pasport" placeholder="${__('crm.customers.passportid')}" value="${user.passport?user.address.num_pasport:''}">
            </div>
        </div>
        <div class="fields">
            <div class="ten wide field">
                <label for="kem">${__('crm.customers.passportissuedby')}</label>
                <input ${auth.can.retention?'':'readonly="readonly"'} type="text" data-name="issued" placeholder="${__('crm.customers.passportissuedby')}" value="${user.passport?user.address.issued:''}">
            </div>
            <div class="six wide field">
                <label for="until">${__('crm.customers.passportvalid')}</label>
                <input ${auth.can.retention?'':'readonly="readonly"'} type="date" data-name="until" placeholder="${__('messages.dd_mm_yyyy')}" value="${user.passport?user.address.until:''}">
            </div>
        </div>
        <div class="ui right">
            <button class="ui button green submit">${__('crm.save')}</button>
        </div>`).appendTo($form);
        if(!auth.can.kyc)return;
        $(`<div class="ui horizontal divider">${__('crm.customers.uploads')}</div>`).appendTo($div);
        $form = $(`<div class="ui form"></div>`).appendTo($div);
        $form = $(`<div class="two fields"></div>`).appendTo($form);
        $form = $(`<div class="ui field"><label>${__('crm.upload')}</label></div>`).appendTo($form);
        $(`<input class="ui input fileupload" id="fileupload" type="file" name="upload[]" multiple data-url="/user/${user.id}/upload"/>`).appendTo($form).addClass('fileupload-assigned').fileupload({
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|doc?x)$/i,
            maxFileSize: 999000,
            disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
            previewMaxWidth: 100,
            previewMaxHeight: 100,
            previewCrop: true
        })
        .on('fileuploadadd', function (e, data) {
            $('#uploadall').removeClass('disabled');
            $.each(data.files, function (index, file) {
                // console.debug(index,file);
                let node = $(`<div class="ui item" data-name="${file.name}"/>`)
                        // .append($(`<img class="ui avatar image" src="/images/avatar2/small/rachel.png">`)
                        .append(`<div class="content" style="position:relative;">
                                    <a class="header">${file.name}</a>
                                    <div class="description">${(file.size/1024).toFixed(0)} Kb</div>
                                    <div class="ui progress fileupload-progress"><div class="bar"><div class="progress"></div></div><div class="label">Uploading File</div></div>
                                </div>`);
                node.find('.content button')
                            .on('click', function () {
                                var $this = $(this),
                                    data = $this.data();
                                $('#fileupload_progress').progress({percent: 0});
                                $this
                                    .off('click')
                                    .html('<i class="ui ban icon"></i> Abort')
                                    .on('click', function () {
                                        $this.remove();
                                        data.abort();
                                    });
                                data.submit().always(function () {
                                    $this.remove();
                                });
                            }).data(data);
                // node.find('.content').append(uploadButton.clone(true).data(data));
                data.context = node;
                node.appendTo(`#fileupload_list_${user.id}`);
            });
        })
        .on('fileuploadprocessalways', function (e, data) {
            var index = data.index,
                file = data.files[index],
                node = $(data.context.children()[index]);
            // console.debug('fileuploadprocessalways',file)
            if (file.preview) {
                node.prepend(file.preview);
            }
            if (file.error) {
                node.append($('<span class="text-danger"/>').text(file.error));
            }
        })
        .on('fileuploadprogressall', function (e, data) {
            const $prog = data.context;
            $('.fileupload-progress:first').progress({percent: parseInt(data.loaded / data.total * 100, 10)});
        })
        .on('fileuploaddone', function (e, data) {
            const doc = data.result;
            // console.debug('fileuploaddone',data);
            data.context.remove();
            const img = (doc.file.match(/\.(pdf|docx?)$/))
                ?`<iframe src="https://docs.google.com/viewer?url=${document.location.hostname}/${doc.file}&embedded=true" style="width: 100%; height: 100%" frameborder="0">${__('crm.message.browser_doesnt_support')}</iframe>`
                :`<img src="${doc.file}"/>`;
            $(`#uploaded_${user.id}`).append(`<div class="card" id="kyc_${user.id}_${doc.id}">
                <a class="ui image" style="position:relative;" href="javascript:0" onclick="page.image.view(this,{'<i class=\\'check icon\\'></i>':'crm.user.kyc.accept(${doc.id},${user.id})','<i class=\\'ban icon\\'></i>':'crm.user.kyc.decline(${doc.id},${user.id})'})">
                    <div style="background-color:rgba(33,186,69,.2);position:absolute;width:100%;height:100%;"><i class="ui big green check icon"></i></div>
                    ${img}
                </a>
                <div class="content">
                    <div class="meta">
                        ${doc.created_at}
                    </div>
                </div>
                <div class="actions">
                    <button class="ui icon black button" onclick="crm.user.kyc.delete(${doc.id},${user.id})"><i class="ui trash icon"></i></button>
                </div>
            </div>`);
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
        $(`<div class="ui list" id="fileupload_list_${user.id}"></div>`).appendTo($div);
        $form = $(`<div class="ui cards" id="uploaded_${user.id}"></div>`).appendTo($div);

        if(user.documents)user.documents.map( (doc,i) => {
            const icName = `imageClick_${doc.id}_${user.id}`;
            window[icName] = (that) => {
                page.image.view(that,{
                    '<i class="check icon"></i>':`crm.user.kyc.accept(${doc.id},${user.id})`,
                    '<i class="ban icon"></i>':`crm.user.kyc.decline(${doc.id},${user.id})`
                });
            }
            $(`<div class="card" id="kyc_${user.id}_${doc.id}">
                <a class="ui image" style="position:relative;cursor:pointer;"
                    onclick="${icName}(this)">
                    <div class="verified" style="background-color:rgba(33,186,69,.2);position:absolute;width:100%;height:100%;${(doc.status != 'verified')?'display:none;':''} "><i class="ui big green check icon"></i></div>
                    ${doc.file.match(/\.(pdf|docx?)$/)
                        ?`<iframe src="https://docs.google.com/viewer?url=${document.location.hostname}/${doc.file}&embedded=true" style="width: 100%; height: 100%" frameborder="0">${__('crm.message.browser_doesnt_support')}</iframe>`
                        :`<img src="${doc.file}"/>`
                    }
                </a>
                <div class="content">
                    <!-- <div class="header">${doc.type}</div> -->
                    <div class="meta">
                        ${doc.created_at.datetime({style:'simple'})}
                    </div>
                </div>
                <div class="actions">
                    <button class="ui icon black button" onclick="crm.user.kyc.delete(${doc.id},${user.id})"><i class="ui trash icon"></i></button>
                </div>
            </div>`).appendTo($form);
        })
        // $(``).appendTo($div);
    }
    trades($div){
        $div.html('');
        const {user,auth}=this;
        $(`<div class="ui horizontal divider">${__('crm.instruments.groups.title')}</div>
        <div class="ui form submiter" data-action="/json/user/meta?meta_name=pairgroup">
            <input type="hidden" data-name="user_id" value="${user.id}" />
            <div class="fields">
                <div class="field four wide">
                    <label>${__('crm.instruments.groups.title')}</label>
                    <div class="ui selection dropdown loadering" id="user_${user.id}_pair_group" data-name="meta_value" data-value="${this.getMeta('pairgroup') || ''}" data-action="/pairgroup" data-autostart="true" data-trigger=""></div>
                </div>
                <div class="field">
                    <label>&nbsp;</label>
                    <div class="ui green button submit">${__('crm.save')}</div>
                </div>
            </div>
        </div>
        <div class="ui horizontal divider">${__('crm.trades.list')}</div>
        <div class="ui form">
            <div class="inline fields">
                <label>${__('crm.trades.status')}</label>
                <div class="field">
                    <div class="ui huge radio checkbox">
                        <input type="radio" name="status_id" checked="checked" class="requester" data-name="status_id" data-value="false" data-trigger="change" data-target="deal-list">
                        <label>${ __('crm.all') }</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui radio checkbox">
                        <input type="radio" name="status_id"  class="requester" data-name="status_id" data-value="10" data-trigger="change" data-target="deal-list">
                        <label>${ __('crm.trades.active') }</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui radio checkbox">
                        <input type="radio" name="status_id" class="requester" data-name="status_id" data-value="30" data-trigger="change" data-target="deal-list">
                        <label>${ __('crm.trades.delayed') }</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui radio checkbox">
                        <input type="radio" name="status_id" class="requester" data-name="status_id" data-value="20" data-trigger="change" data-target="deal-list">
                        <label>${ __('crm.trades.closed') }</label>
                    </div>
                </div>
                ${auth.can.superadmin?`<div class="field">
                    <div class="ui radio checkbox">
                        <input type="radio" name="status_id" class="requester" data-name="status_id" data-value="100" data-trigger="change" data-target="deal-list">
                        <label>${ __('crm.trades.hidden') }</label>
                    </div>
                </div>`:''}
            </div>
        </div>`).appendTo($div);
        $div.find('[name=status_id]').on('click change',(a,b,s)=>{})
        let $table = $(`<div class="for-loader"><table class="ui table selectable sortable"><thead></thead><tbody class="loadering" data-need-loader="true" data-id="user-trade-${user.id}" data-action="/json/deal?status=all&user_id=${user.id}" data-function="crm.deal.list" data-autostart="true" data-trigger=""></tbody></table></div>`).appendTo($div);
    }
    tasks($div){
        const {user,auth}=this;
    }
    transactions($div,from=0){
        const _count = 15
        const {user,auth}=this;
        const  trs = user.transactions.reverse();
        let _till = from+_count;
        _till = (_till>trs.length)?trs.length:_till;
        for( let i=from;i<_till;++i){
            const row = trs[i];
            const transactionClass = (row.code=='200')?'positive':((row.code=='0')?'':'negative');
            const code = (row.code == '200') ? 'fa-check-circle-o' : ((row.code =='0') ? 'fa-spin fa-fw fa-circle-o-notch' :'fa-minus-circle')
            let $row = $(`<tr id="transaction-${row.id} class="ui ${transactionClass} user-transaction user-transaction-${row.status} "></tr>`).appendTo($div);
            $(`<td class="user-transaction-id">${row.id}</td>`).appendTo($row);
            $(`<td class="center aligned user-transaction-date">${row.created_at.datetime()}</td>`).appendTo($row);
            $(`<td class="user-transaction-amount">${row.amount.dollars()}</td>`).appendTo($row);
            $(`<td class="user-transaction-merchant">${row.merchant.name}</td>`).appendTo($row);
            $(`<td class="user-transaction-type">${row.type}</td>`).appendTo($row);
            $(`<td class="user-transaction-code"><span class="user-transaction-code-status"><i class="fa ${code}"></i></span></td>`).appendTo($row);
            const $actions = $(`<td class="user-transaction-actions"></td>`).appendTo($row);
            if(row.code=='200' && row.type!='fee'){
                $(`<div class="submiter user-transaction-reverse" id="user_transactio_reverse" data-action="/transaction/$${row.id}" data-method="delete" data-callback="crm.user.touch">
                    <input type="hidden" data-name="_token" value="{{ csrf_token() }}" />
                    <button class="ui icon red submit button"><i class="ui ban icon"></i>${__('crm.reverse')}</button>
                </div>`);
                $(``).appendTo($actions);
            }
        }

    }
    finance($div){
        const {user,auth}=this;
        $div.html('');
        let realAccs =[];
        if(user.accounts)user.accounts.map( (acc,i) => { if(acc.type=="real")realAccs.push(acc); });
        let accounts = new Collection(realAccs,{name:'currency.name',value:'id',desc:'currency.code'});
        const account = accounts.first()
        let totals = {
            deposit:0,
            bonus:0,
            withdrawal:0
        };
        if(false && user.olap){
            totals.deposit = user.olap.deposit || 0;
            totals.withdrawal = user.olap.withdrawal || 0;
            totals.bonus = user.olap.bonus || 0;
        }
        else if(user.transactions)user.transactions.reverse().map( (row,i) => {
            if(row.code==200){
                if(row.type=='deposit'){
                    if(row.merchant && row.merchant.enabled==2) totals.bonus +=parseFloat(row.amount);
                    else if(row.merchant && row.merchant.enabled==1) totals.deposit +=parseFloat(row.amount);
                }
                else if( row.type=='withdrawal' || row.type=='withdraw' && row.withdrawal && row.withdrawal.status == "approved") totals.withdrawal += parseFloat(row.amount);
            }
        });
        let $cols = $(`<div class="ui stackable grid two columns"></div>`).appendTo($div);
        $cols = $(`<div class="ui row"></div>`).appendTo($cols);
        $(`<div class="ui column">
            <div class="ui horizontal divider">${__('crm.user.totals')}</div>
            <table class="ui definition table">
                <thead><tr><th></th><th>${__('crm.amount')}</th></tr></thead>
                <tbody>
                    ${ Object.keys(totals).map( (i)=>{
                            const total = totals[i];
                            const tot = i;
                            const val = total;
                            return `<tr>
                                <td>${__(`crm.customers.${tot}`)}</td>
                                <td id="user-total-${tot}" data-number="${val}" data-value="${val}">${val.dollars()}</td>
                            </tr>`;
                    }).join('') }
                </tbody>
            </table>
        </div>`).appendTo($cols);
        if(auth.can.deposit){
            //data-callback="callback_${this.getUid()}"
            const f_success = `transaction_add_${user.id}`;
            const f_error = f_success+'_error';
            window[f_success]=(response,container,request)=>{
                new VUIMessage({
                    title:__('crm.success'),
                    message:`<b>${__('crm.transactions.'+response.type)}</b> <i>${response.merchant.name}</i><h3>${response.amount.dollars()}</h3>`
                });
            }
            window[f_error]=(response,container,request)=>{
                new VUIMessage({
                    title:__('crm.error'),
                    message:`${response.message}`,
                    error:true
                });
            }
            $(`<div class="column">
                <div class="ui form submiter user-account" data-action="/transaction/add" data-callback="${f_success}" data-callback-error="${f_error}">
                    <div class="ui header dividing">Make transaction on <b>Live</b> account</div>
                        <input type="hidden" data-name="currency" value="USD"/>
                        <input type="hidden" data-name="user_id" value="${user.id}"/>
                            <div class="field">
                                <label>Account:</label>
                                <div class="ui selection dropdown">
                                    <input type="hidden" data-id="account_id" data-name="account_id" value="${accounts.first()?accounts.first().id:''}"/>
                                    <div class="default text"></div>
                                    <i class="dropdown icon"></i>
                                    <div class="menu">${accounts.toItemList()}</div>
                                </div>
                            </div>
                            <div class="field">
                                <label>Transaction type:</label>
                                <div class="ui selection dropdown">
                                    <input type="hidden" data-id="type" data-name="type" value="deposit"/>
                                    <div class="default text">Deposit</div>
                                    <i class="dropdown icon"></i>
                                    <div class="menu">
                                        <div class="item" data-value="deposit">
                                            <span class="text">Deposit</span>
                                            <span class="description">fund account</span>
                                        </div>
                                        ${auth.can.chief
                                            ?`<div class="item" data-value="debit">
                                                <span class="text">Return</span>
                                                <span class="description">refund account</span>
                                            </div>
                                            <div class="item" data-value="credit">
                                                <span class="text">Credit</span>
                                                <span class="description">withdraw</span>
                                            </div>`
                                            :''}
                                    </div>
                                </div>
                            </div>
                            <div class="ui two fields">
                                <div class="field">
                                    <label>Merchant:</label>
                                    <div class="ui selection dropdown">
                                        <input type="hidden" data-id="merchants" data-name="merchant_id" value="${merchants.first()?merchants.first().id:''}"/>
                                        <div class="default text"></div>
                                        <i class="dropdown icon"></i>
                                        <div class="menu">
                                            ${merchants.toItemList()}
                                        </div>
                                    </div>
                                </div>
                                <div class="field">
                                    <label>Method:</label>
                                    <div class="ui selection dropdown">
                                        <input type="hidden" name="Method" data-name="method"/>
                                        <div class="default text">Method</div>
                                        <i class="dropdown icon"></i>
                                        <div class="menu">
                                            <div class="item" data-value="false">Method</div>
                                            <div class="item" data-value="CreditCard"> ${__('messages.creditcard')}</div>
                                            <div class="item" data-value="CryptoCurrency"> ${__('messages.CryptoCurrency')}</div>
                                            <!-- <div class="item" data-value="YandexMoney"> ${__('messages.yandexmoney')}</div> -->
                                            <div class="item" data-value="WireTransfer">WireTransfer</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label>Amount:</label>
                                <div class="ui input">
                                    <input type="number" data-name="amount" min="0" step="0.01"/>
                                </div>
                            </div>
                            <div class="ui field right aligned">
                                <button type="button" class="ui button deposit primary submit">${__('crm.done')}</button>
                            </div>
                        </div>
            </div>`).appendTo($cols);
        }
        $(`<div class="ui horizontal divider">${__('crm.finance.transactions')}</div>`).appendTo($div);
        $(`<div class="ui attached form">
            <div class="fields">
                <div class="field">
                    <div class="ui search selection dropdown">
                        <input type="hidden" class="requester" data-id="merchants" data-name="merchant_id" data-trigger="change" data-target="user-finance-${user.id}" />
                        <div class="default text">Merchants</div>
                        <i class="ui dropdown icon"></i>
                        <div class="menu">${merchants.toItemList()}</div>
                    </div>
                </div>
                <div class="field">
                    <div class="ui search selection dropdown">
                        <input type="hidden" class="requester" data-id="status" data-name="status" data-trigger="change" data-target="user-finance-${user.id}" />
                        <div class="default text">${__('crm.all')}</div>
                        <i class="ui dropdown icon"></i>
                        <div class="menu">
                            <div class="item" data-value="false" selected>All</div>
                            <div class="item" data-value="success">Success</div>
                            <div class="item" data-value="processing">Processing</div>
                            <div class="item" data-value="failed">Failed</div>
                        </div>
                </div>
            </div>
        </div>
        <table class="ui stackable table"><tbody class="loadering" data-id="user-finance-${user.id}" data-need-loader="true" data-action="/finance/report/userTransactions?user_id=${user.id}" data-function="crm.user.transaction" data-autostart="true"></tbody></table>`).appendTo($div);
        // let $tbody = $(`<tbody class="_loadering" data-id="user-finance-${user.id}" data-need-loader="false" data-action="/finance/report/userTransactions?user_id=${user.id}" data-function="crm.user.transaction" data-autostart="true"></tbody>`)
        //     .visibility({
        //         onTopVisible: function(calculations) {
        //             console.debug('Top',calculations)
        //         },
        //         onTopPassed: function(calculations) {
        //             console.debug('Top passed',calculations)
        //         },
        //         onBottomVisible: function(calculations) {
        //             console.debug('onBottomVisible',calculations)
        //         }
        //     });
        // this.transactions($tbody);
        // let $table = $(`<table class="ui stackable table"></table>`).appendTo($div).append($tbody);
    }
    accounts($div){
        const {user,auth}=this;
        $div.html(`<div class="ui grid two columns">
            <div class="column">
                <div class="ui header">Accounts</div>
                <div class="ui items loadering" data-id="user-accounts-${user.id}" data-need-loader="true" data-action="/account?user_id=${user.id}" data-function="crm.user.accounts" data-autostart="true"></div>
            </div>
            <div class="column">
                <div class="ui header dividing">Add Account</div>
                    <div class="ui form submiter user-account" id="add_user_account_" data-action="/account" data-method="post" data-callback="crm.user.accountsTouch">
                        <input type="hidden" data-name="_token" value="{{ csrf_token() }}" />
                        <input type="hidden" data-name="status" value="open" />
                        <input type="hidden" data-name="user_id" value="${user.id}" />
                        <input type="hidden" data-name="amount" value="0" />
                        <div class="field">
                            <label>Type:</label>
                            <div class="ui selection dropdown">
                                <input type="hidden" data-id="type" data-name="type"/>
                                <div class="default text">Account type</div>
                                    <i class="dropdown icon"></i>
                                    <div class="menu">
                                        <div class="item" data-value="real">Live</div>
                                        <div class="item" data-value="demo">Demo</div>
                                    </div>
                            </div>
                        </div>
                        <div class="field">
                            <label>Currency:</label>
                            <div class="ui labeled selection dropdown">
                                <input type="hidden" data-id="currency_id" data-name="currency_id"/>
                                <div class="default text">Currency</div>
                                <i class="dropdown icon"></i>
                                <div class="menu">
                                    ${currency.toOptionListDiv()}
                                </div>
                            </div>
                        </div>
                        <div class="ui field right aligned">
                            <button type="button" class="ui button deposit primary submit">${__("crm.accounts.add")}</button>
                        </div>
                    </div>
            </div>
        </div>`);
    }
    log($div){
        const {user,auth}=this;
        // <div class="six wide field">
        //     <div class="ui search icon input">
        //         <input placeholder="${__('crm.search')}..." class="requester search" data-name="search" data-trigger="keyup" data-target="user-log"><i class="search icon"></i>
        //     </div>
        // </div>
        $div.html(`
            <div class="ui form">
                <div class="inline fields">
                    <div class="field">
                        <div class="ui search selection dropdown">
                            <input type="hidden" data-name="type" class="requester" data-trigger="change" data-target="user-log"/>
                            <i class="dropdown icon"></i>
                            <div class="default text">${__('crm.history.type')}</div>
                            <div class="menu" tabindex="-1">${window.user.historyTypes.toItemList()}</div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui icon labeled calendar-notime input" >
                            <div class="ui label"  onclick="$(this).next().val('').change();"><i class="ui refresh icon"></i></div>
                            <input type="text" class="-ui-calendar requester" placeholder="${__('crm.date_from')}" data-name="date_from" data-target="user-log"  data-trigger="change"/>
                            <i class="calendar icon"></i>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui icon labeled calendar-notime input" >
                            <div class="ui label"  onclick="$(this).next().val('').change();"><i class="ui refresh icon"></i></div>
                            <input type="text" class="-ui-calendar requester" placeholder="${__('crm.date_to')}" data-name="date_to" data-target="user-log"  data-trigger="change"/>
                            <i class="calendar icon"></i>
                        </div>
                    </div>
                </div>
            </div>
        <table class="ui attached padded selectable stackable table">
            <thead>
                <th>Date</th>
                <th>Event</th>
            </thead>
            <tbody class="loadering"  data-need-loader="true" data-id="user-log-${user.id}" data-action="/json/user/${user.id}/history" data-function="crm.user.log" data-autostart="true"></tbody>
        </table>`);
        skymechanics.reload();
    }
    messages($div){
        $div.html('');
        const {user,auth}=this;
        const callBackfunction = `user_messages_added_${user.id}`;
        const $c = $(`<div class="loadering ui item" data-id="user-messages-${user.id}" data-action="/user/messages?user_id=${user.id}" data-refresh="0" data-autostart="true" data-function="crm.messages.list"></div>`).appendTo($div);
        $div.append(`<div class="ui horizontal divider">${__('crm.messages.write')}</div>`);
        const $container = $(`<div class="submiter ui form" data-action="/user/message/add" data-callback="${callBackfunction}">
            <input type="hidden" data-name="user_id" value="${user.id}">
            <input type="hidden" data-name="subject" value="#${auth.id} ${auth.title}">
            <div class="field">
                <div class="ui input">
                    <textarea data-name="message" required placeholder="${__('messages.message')}"  maxlength="1000"></textarea>
                </div>
            </div>
            <div class="ui blue labeled submit icon button">
                <i class="icon send"></i> ${__('crm.send')}
            </div>
        </div>`).appendTo($div);
        window[callBackfunction]=(d,$c)=>{
            console.log(`Calling ${callBackfunction}`)
            $container.find('textarea').val('').text('');
            skymechanics.touch(`user-messages-${user.id}`);
        };
        const d = user.messages;
        if(d==undefined || !d.length)return;
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
    mail($div){
        const {user,auth}=this;
        $div.html(`<div class="loadering ui comments" data-id="user-mail" data-action="/user/mail?user_id=${user.id}" data-refresh="0" data-autostart="true" data-function="crm.mail.user"></div>
        <div class="ui horizontal divider">${__('messages.writemessage')}</div>
        <div class="submiter ui form" data-action="/mail/send" data-callback="crm.mail.sent">
            <input type="hidden" data-name="user_id" value="${user.id}">
            <div class="field">
                <label>${__('crm.mail.template')}</label>
                <div class="loadering ui selection dropdown" id="mailsTemplate" data-id="mailsTemplate" data-title="Templates" data-name="mail_id" data-action="/mail" data-autostart="true" data-function="crm.mail.chooseTemplate" data-function-change="crm.mail.loadTemplate"></div>
            </div>
            <div class="field">
                <label>Sender:</label>
                ${window.system.mailer}
            </div>
            <div class="field">
                <div class="ui input">
                    <textarea class="mailsText" data-name="text" required placeholder="${__('messages.text')}"></textarea>
                </div>
            </div>
            <div class="ui blue labeled submit icon button">
                <i class="icon send"></i> ${__('messages.Send')}
            </div>
        </div>`)
    }
    meta($div){
        const {user,auth}=this;
        $div.html('');
        $div = $(`<div class="ui relaxed list"></div>`).appendTo($div)
        if(user.meta) user.meta.map( (meta,i) => {
            window[`user_meta_remove_${meta.id}_callback`] = (d,s)=>{
                $(`#usermeta_${meta.id}`).remove();
            };
            const $meta = $(`<div class="ui item" id="usermeta_${meta.id}">
                <div class="content">
                    <div class="header">${meta.meta_name}</div>
                    <div class="description" id="user_meta_edit_${meta.id}">
                        ${meta.meta_value || '' }
                    </div>
                </div>
                <div class="right floated content" id="user_meta_remove_${meta.id}"></div>
                <div class="right floated content">${meta.created_at.datetime({style:'simple'})}</div>
            </div>`).appendTo($div);
            auth.can.admin?$meta.find(`#user_meta_edit_${meta.id}`).html(new VUIEditable('/usermeta/'+meta.id,'meta_value',meta.meta_value || '')):null;
            $meta.find(`#user_meta_remove_${meta.id}`).append(new VUIResourceRemove('/usermeta/'+meta.id,`user_meta_remove_${meta.id}_callback`));
        })
    }
    pnl(){
        let {user} = this;
        if(false && user.olap){
            this.user.pnl = this.user.olap.pnl || 0;
            this.user.tradeVolume = this.user.olap.tradeVolume || 0;
        }
        else{
            let pnl = 0;
            let tradeVolume = 0;
            if(user.deal) user.deal.map((trade,i) =>{
                pnl+=parseFloat(trade.profit);
                tradeVolume+=parseFloat(trade.invested);
            })
            this.user.pnl = pnl
            this.user.tradeVolume = tradeVolume
        }

    }
    restrictions($div){
        const {user,auth}=this;
        const allow = this.getMetaRaw('ip_allow');
        const deny = this.getMetaRaw('ip_deny');
        const allowDropButton = `<div class="ui submiter form" id="allow_drop_button_${user.id}" data-action="/usermeta/${allow.id}" data-method="DELETE" data-callback="allowDropCallback_${user.id}" style="margin-top: -3rem;margin-bottom: 1rem;"><div class="field right aligned"><button class="ui icon red submit button">${__('crm.drop')} <i class="ui trash icon"></i></button></div></div>`;
        const denyDropButton = `<div class="ui submiter form" id="deny_drop_button_${user.id}" data-action="/usermeta/${deny.id}" data-method="DELETE" data-callback="denyDropCallback_${user.id}" style="margin-top: -3rem;margin-bottom: 1rem;"><div class="field right aligned"><button class="ui icon red submit button">${__('crm.drop')} <i class="ui trash icon"></i></button></div></div>`;
        window[`allowCallback_${user.id}`] = (d,$s)=>{
            const allow = d;
            if($(`#allow_drop_button_${user.id}`).length==0) $(`#drop_allow_button_section_${user.id}`).html(`<div class="ui submiter form" id="allow_drop_button_${user.id}" data-action="/usermeta/${allow.id}" data-method="DELETE" data-callback="allowDropCallback_${user.id}" style="margin-top: -3rem;margin-bottom: 1rem;"><div class="field right aligned"><button class="ui icon red submit button">${__('crm.drop')} <i class="ui trash icon"></i></button></div></div>`);
            skymechanics.reload();
        };
        window[`allowDropCallback_${user.id}`] = (d,$s)=>{
            $(`#allow_value_${user.id}`).val('');
            $s.remove();
        };
        window[`denyCallback_${user.id}`] = (d,$s)=>{
            const deny = d;
            if($(`#deny_drop_button_${user.id}`).length==0) $(`#drop_deny_button_section_${user.id}`).html(`<div class="ui submiter form" id="deny_drop_button_${user.id}" data-action="/usermeta/${deny.id}" data-method="DELETE" data-callback="denyDropCallback_${user.id}" style="margin-top: -3rem;margin-bottom: 1rem;"><div class="field right aligned"><button class="ui icon red submit button">${__('crm.drop')} <i class="ui trash icon"></i></button></div></div>`);
            skymechanics.reload();
        };
        window[`denyDropCallback_${user.id}`] = (d,$s)=>{
            $(`#deny_value_${user.id}`).val('');
            $s.remove();
        };

        $div.html(`<div class="ui bottom attached tab segment active" data-tab="restricts">
            <div class="ui center aligned huge header">${__('crm.restrictions.ip')}</div>
            <div class="ui items">
                <div class="item">
                    <div class="content">
                        <div class="ui header" id="allow_header_${user.id}">${__('crm.restrictions.allow')}</div>
                        <div class="description"></div>
                        <div class="extra">
                            <i class="ui info icon"></i>${__('crm.value_separate_comma')}
                        </div>
                        <div class="right floated extra" id="drop_allow_button_section_${user.id}">
                            ${allow?allowDropButton:''}
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="content">
                    <div class="ui form globe submiter" data-action="/json/user/meta?meta_name=ip_allow" data-callback="allowCallback_${user.id}">
                        <input type="hidden" data-name="user_id" value="${user.id}" />
                        <div class="ui field">
                            <textarea data-name="meta_value" id="allow_value_${user.id}">${allow?allow.meta_value:''}</textarea>
                        </div>
                        <div class="ui field right aligned">
                            <button class="ui icon green button submit">${__('crm.save')} <i class="ui save icon"></i></button>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="item">
                    <div class="content">
                        <div class="ui header" id="allow_header_${user.id}">${__('crm.restrictions.deny')}</div>
                        <div class="description"></div>
                        <div class="extra">
                            <i class="ui info icon"></i>${__('crm.value_separate_comma')}
                        </div>
                        <div class="right floated extra" id="drop_deny_button_section_${user.id}">
                            ${deny?denyDropButton:''}
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="content">
                        <div class="ui form globe submiter" data-action="/json/user/meta?meta_name=ip_deny" data-callback="denyCallback_${user.id}">
                            <input type="hidden" data-name="user_id" value="${user.id}" />
                            <div class="ui field">
                                <textarea data-name="meta_value" id="deny_value_${user.id}">${deny?deny.meta_value:''}</textarea>
                            </div>
                            <div class="ui field right aligned">
                                <button class="ui icon green submit button">${__('crm.save')} <i class="ui save icon"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>`);

    }
}
