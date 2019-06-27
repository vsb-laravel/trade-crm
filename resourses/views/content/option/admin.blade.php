
    <i class="close icon"></i>
    <div class="header">
        <div class="ui tiny image"><img src="/crm.3.0/images/avatar/{{$user->id%5}}.jpg"/></div><code>#{{$user->id}}</code> {{$user->name}} {{$user->surname}}
    </div>
    <div class="content scrolling">
        <div class="ui stackable grid">
            <div class="column four wide">
                <div class="ui clearing">
                    <label>{{ trans('crm.customers.login') }}</label>
                    <h5 class="ui header" style="display:inline;">{{$user->email}}</h5>
                </div>
                <div class="ui clearing">
                    <label>{{ trans('messages.registered') }}</label>
                    {{$user->created_at}}
                </div>
                @if($user->rights_id>1)
                <div class="ui action input">
                    <input type="text" readonly value="{{$admincode ?? ''}}" id="admincode" />
                    <button class="ui teal right labeled icon button" onclick="copyValue(this,'#admincode')"><i class="copy icon"></i></button>
                </div>
                @endif
                <p>
                    <div class="ui slider checkbox submiter" data-action="/json/user/meta?meta_name=can_trade" data-name="user-can-trade" data-callback="userCanTrade">
                        <input type="hidden" data-name="user_id" value="{{$user->id}}" />
                        <input type="hidden" data-name="meta_value" @if(count($user->can_trade) && $user->can_trade[0]->meta_value=="true") value="true" @endif/>
                        <input class="cantrade switcher" type="checkbox" data-name="" @if(count($user->can_trade) && $user->can_trade[0]->meta_value=="true") checked="checked" @endif>
                        <input type="hidden" class="submit"/>
                        <label>{{ trans('messages.can_trade') }}</label>
                    </div>
                </p>
<!--                 <p>
                    <div class="ui slider checkbox submiter" data-action="/json/user/meta?meta_name=verified" data-name="user-kyc" data-callback="userCanTrade">
                        <input type="hidden" data-name="user_id" value="{{$user->id}}" />
                        <input type="hidden" data-name="meta_value" @if(count($user->kyc) && $user->kyc[0]->meta_value=="true") value="true" @endif/>
                        <input class="cantrade switcher" type="checkbox" data-name="" @if(count($user->kyc) && $user->kyc[0]->meta_value=="true") checked="checked" @endif>
                        <input type="hidden" class="submit"/>
                        <label>{{ trans('messages.KYC') }}</label>
                    </div>
                </p> -->
                <div class="ui form submiter globe" data-action="/json/user/{{$user->id}}/update" data-callback="crm.user.touch" id="">
                    <input type="hidden" data-name="user_id" value="{{$user->id}}" />
                        <div class="field">
                            <div class="ui slider checkbox">
                                <input type="checkbox" data-name="email_verified" @if($user->email_verified=="1") checked="checked" value="true" @endif/>
                                <label>{{ trans('messages.email_verified') }}</label>
                            </div>
                        </div>
                        <div class="field">
                            <label>{{ trans('messages.rights') }}</label>
                            <select class="ui dropdown" data-name="rights_id">
                                @foreach($rights as $row)
                                    <option value="{{$row->id}}" @if($row->id==$user->rights_id) selected="selected" @endif>
                                        {{$row->title}}
                                    </option>
                                @endforeach
                            </select>
                        </div>
<!--                         <div class="field">
                            <label>{{ trans('messages.manager') }}</label>
                            <select class="ui dropdown" data-name="parent_user_id">
                                @foreach($managers as $row)
                                    <option value="{{$row->id}}" @if($row->id==$user->parent_user_id) selected="selected" @endif>
                                        {{$row->name}} {{$row->surname}}
                                    </option>
                                @endforeach
                            </select>
                        </div> -->
<!--                         <div class="field">
                            <select class="ui dropdown" data-name="status_id">
                                @foreach($statuses as $row)
                                    <option value="{{$row->id}}" @if($row->id==$user->status_id) selected="selected" @endif>{{$row->title}}</option>
                                @endforeach
                            </select>
                        </div> -->
                        <div class="field">
                            <label>{{ trans('messages.changepassword') }}</label>
                            <div class="ui input">
                                <input type="password" data-name="password" />
                            </div>
                        </div>
                        @if($user->rights_id>1)
                            <div class="field">
                                <label>{{ trans('messages.office') }}</label>
                                <div class="ui input">
                                    <input data-name="office" value="{{$user->office}}" />
                                </div>
                            </div>

                        @endif
                        <buttom class="ui button green submit">{{ trans('messages.save') }}</button>
                    </div>

            </div>
            <div class="column twelve wide">
                <div class="ui top attached tabular menu wide">
                    <!-- <a class="item active" data-tab="telephony">{{ trans('crm.options.telephony') }}</a> -->
                    <a class="item active" data-tab="restricts">{{ trans('crm.options.restricts') }}</a>
                    <!-- <a class="item" data-tab="finance">{{ trans('messages.finance') }}</a> -->
                    <!-- <a class="item" data-tab="messages">{{ trans('messages.messages') }}</a> -->
                    <a class="item" data-tab="log">{{ trans('messages.log') }}</a>
                    <a class="item" data-tab="mailer">{{ trans('crm.imap.title') }}</a>
                    <a class="item" data-tab="meta">{{ trans('crm.admin.meta') }}</a>
                </div>
                <div class="ui bottom attached tab segment" data-tab="meta">
                    @include('crm.content.user.meta')
                </div>
                <div class="ui bottom attached tab segment" data-tab="mailer">
                    <div class="ui form mail globe submiter" data-action="/json/user/{{$user->id}}/update">
                        <div class="field">
                            <label>Mail server</label>
                            <div class="ui selection dropdown mail-server" >
                                <input type="hidden" name="mail" data-name="mail.server" value="" onchange="crm.user.mail.choose(this)">
                                <i class="dropdown icon"></i>
                                <div class="default text">Choose mail server</div>
                                <div class="menu">
                                    <div class="item" data-value="yandex">Yandex.Mail</div>
                                    <div class="item" data-value="gmail">Google.Mail</div>
                                </div>
                            </div>
                        </div>
                        <div class="two fields mail-params" style="display:none;">
                            <div class="field">
                                <label>Mail login</label>
                                <div class="ui input">
                                    <input type="text" data-name="mail.login" value="{{$user->mail['login'] ?? ''}}"/>
                                </div>
                            </div>
                            <div class="field">
                                <label>Mail password</label>
                                <div class="ui input">
                                    <input type="password" data-name="mail.password" value="{{$user->mail['password'] ?? ''}}"/>
                                </div>
                            </div>
                        </div>
                        <input type="button" class="submit"  value="save"/>
                        <script>
                            $('.mail-server').dropdown('set value','{{$user->mail['server'] ?? ""}}');
                        </script>
                    </div>
                </div>
                <div class="ui bottom attached tab segment active" data-tab="restricts">
                    <div class="ui header">IP restrictions</div>
                    @php($allow = '')
                    @php($deny = '')
                    @foreach($user->meta as $meta)
                        @if($meta->meta_name == 'ip_allow' )
                            @php($allow = $meta->meta_value)

                        @elseif ($meta->meta_name == 'ip_deny' )
                            @php($deny = $meta->meta_value)

                        @endif
                    @endforeach
                    <div class="ui header">Allow access from IP</div>
                    <div class="ui form globe submiter" data-action="/json/user/meta?meta_name=ip_allow">
                        <input type="hidden" data-name="user_id" value="{{$user->id}}" />
                        <div class="ui field">
                            <textarea data-name="meta_value">{{$allow}}</textarea>
                        </div>
                        <div class="ui field right aligned submit">
                            <button class="ui button">Save</button>
                        </div>
                    </div>
                    <div class="ui header">Deny access from IP</div>
                    <div class="ui form globe submiter" data-action="/json/user/meta?meta_name=ip_deny">
                        <input type="hidden" data-name="user_id" value="{{$user->id}}" />
                        <div class="ui field">
                            <textarea data-name="meta_value">{{$deny}}</textarea>
                        </div>
                        <div class="ui field right aligned submit">
                            <button class="ui button">Save</button>
                        </div>
                    </div>
                </div>
                <div class="ui bottom attached tab segment" data-tab="messages">
                    @include('crm.content.user.messages')
                </div>
                <div class="ui bottom attached tab segment" data-tab="log">
                    @include('crm.content.user.log')
                </div>
                <div class="ui bottom attached tab segment" data-tab="mail">
                    @include('crm.content.user.mail')
                </div>
                <div class="ui bottom attached tab segment" data-tab="finance">
                    @include('crm.content.user.finance')
                </div>

            </div>

        </div>
    </div>
    <div class="actions">
        @can('superadmin')
        <button class="ui red icon button" onclick="crm.user.remove({{$user->id}})">
            <i class="trash icon"></i>
            {{ trans('crm.user.remove') }}
        </button>
        @endcan
        <div class="ui black deny button">
            {{ trans('messages.close') }}
        </div>
        <div class="ui positive right labeled icon button okclose">
            Ok
            <i class="checkmark icon"></i>
        </div>
    </div>

<script>
    function crmUserDocVerified(d,container,a){if(d.status) container.parent().find('img').addClass(d.status);}
    function crmUserDocDelete(d,container,a){if(d.status) container.parent().find('img').remove();}
    function crmUserInfoCallback(){cf._loaders['user-list'].execute();}
    function crmControllOff(){
        $.ajax({
            url:"/user/{{$user->id}}/controll/off",
            dataType:"html",
            success:function(d,x,s){
                $('.user_dashboard').replaceWith(d);
            }
        });
    }
    function replaceDashBoard(d){$('.user_dashboard').replaceWith(d);}
    function commentsAdded(d,container,a){
        var comment = $('<p class="coment"></p>').insertAfter(container.find('p.coment:last')),date = new Date(d.created_at);
        comment.append('<span class="date">'+dateFormat(d.created_at)+'</span>');
        comment.append('<span class="author">'+currentAuth.name+' '+currentAuth.surname+'</span>');
        comment.append(d.comment);
        $('#comment').val('');
        container.find('p.coment.empty').remove();
    }
    function crmUserDealList(container,d,x,s){
        container.html('');
        console.debug(d);
        for(var i in d.data){
            var row=d.data[i],s = '<tr data-class="deal" data-id="'+row.id+'">';
            s+='<td>'+row.id+'</td>';
            s+='<td>'+new Date(row.created_at*1000)+'</td>';
            s+='<td>'+new Date(row.updated_at*1000)+'</td>';
            s+='<td><a href="#" data-class="instrument" data-id="'+row.instrument_id+'">'+row.instrument.title+'</a></td>';
            // s+='<td><a href="#" data-class="user" data-id="'+row.user.id+'">'+row.user.name+' '+row.user.surname+'</a></td>';
            // s+=(row.manager)?'<td><a href="#" data-class="manager" data-id="'+row.manager.id+'">'+row.manager.name+' '+row.manager.surname+'</a></td>':'<td></td>';

            s+='<td>'+row.status.name+'</td>';
            s+='<td>'+currency.value(row.amount,row.currency.code)+'</td>';
            s+='<td>x'+row.multiplier+'</td>';
            s+='<td>'+((row.direction==-1)?'<i class="fa fa-arrow-down"></i>':'<i class="fa fa-arrow-up"></i>')+'</td>';
            s+='<td>'+currency.value(row.profit,row.currency.code)+'</td>';
            s+='<td>'+row.stop_low+' - '+row.stop_high+'</td>';

            // s+='<td><a href="#" onclick="crm.deal.edit('+row.id+')" id="edit_deal">{{ trans('messages.edit') }}</a><a href="#" onclick="crm.deal.info('+row.id+')" class="edit">{{ trans('messages.info') }}</a></td>';
            s+='<td><a href="#" onclick="crm.deal.info('+row.id+')" class="edit">{{ trans('messages.info') }}</a></td>';
            s+='</tr>'
            container.append(s);
        }
        cf.pagination(d,'deal-list',container);
    }
    function userCanTrade(d,container,a){
        console.debug('userCanTrade: '+d.meta_value,container);
        if(d.meta_value=="true" || d.meta_value==true){
            container.find('[data-name=meta_value]').val('false');
            container.find('.submit').html('On');

        }else {
            container.find('[data-name=meta_value]').val('true');
            container.find('.submit').html('Off');
        }
        cf._loaders['user-list'].execute();
    }

    $(".cantrade.switcher").on('change',function(){
        $(this).parent('.submiter').find('[data-name=meta_value]').val( $(this).is(':checked')?'true':'false' );
        $(this).parent('.submiter').find('.submit').click();
    });
    $(".ui.tabular .item").tab({
        onVisible:function(that){
            console.debug('Tab loaded',that);
        }
    }).tab('change tab', '{{$tab}}');
    // $('.date').appendDtpicker({futureOnly: true});
    $('.datetask').on('change keyup blur',function(){
        var $d = $(this).parents('.form').find('.datetask.date'),$t = $(this).parents('.form').find('.datetask.time'),$r = $(this).parents('.form').find('[data-name=start_date]');
        console.debug($d.val(),$t.val());
        $r.val($d.val()+' '+$t.val());
    });
</script>
