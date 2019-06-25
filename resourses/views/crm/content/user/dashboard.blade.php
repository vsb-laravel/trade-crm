<!-- <div class="ui modal fullscreen calendar-user" id="user_{{$user->id}}_dashboard"> -->
    <div class="header">
        <i class="icon user"></i><code>#{{$user->id}}</code> {{$user->name}} {{$user->surname}}
        &nbsp;&nbsp;&nbsp;&nbsp;
        @foreach($user->accounts as $account)
            @if($account->status=='open')
                @if($account->type == 'real')
                    <a class="ui label blue large ">
                        Live
                        <div class="detail user-real-account-balance">{{number_format($account->amount, 2, '.', ' ')}}</div>
                        <div class="detail">P&amp;L {{number_format(floatval($pnl), 2, '.', ' ')}}</div>
                        <div class="detail">Trading volume {{number_format(floatval($trading_volume), 2, '.', ' ')}}</div>
                    </a>
                @else
                    <a class="ui label">
                        Demo
                        <div class="detail">{{number_format($account->amount, 2, '.', ' ')}}</div>
                        <div class="detail">P&amp;L {{number_format(floatval($pnl_demo), 2, '.', ' ')}}</div>
                        <div class="detail">Trading volume {{number_format(floatval($trading_volume_demo), 2, '.', ' ')}}</div>
                    </a>
                @endif
            @endif
        @endforeach
        &nbsp;&nbsp;&nbsp;&nbsp;
        @ifmodule('bets')
        @if(!is_null($user->rang))
            @php($color='#88D4B8')
            @if($user->rang->id==0)
                @php($color='#88D4B8')
            @elseif($user->rang->id==1)
                @php($color='#407A1C')
            @elseif($user->rang->id==2)
                @php($color='#8B7742')
            @elseif($user->rang->id==3)
                @php($color='#7795F7')
            @elseif($user->rang->id==4)
                @php($color='#D5D5D7')
            @elseif($user->rang->id==5)
                @php($color='#487BEF')
            @elseif($user->rang->id==6)
                @php($color='#487BEF')
            @elseif($user->rang->id==7)
                @php($color='#487BEF')
            @elseif($user->rang->id==8)
                @php($color='#F27C3A')
            @elseif($user->rang->id==9)
                @php($color='#976870')
            @elseif($user->rang->id==10)
                @php($color='#8E54F9')
            @elseif($user->rang->id==11)
                @php($color='#FFC700')
            @elseif($user->rang->id==12)
                @php($color='#7171DB')
            @elseif($user->rang->id==13)
                @php($color='#75ADF8')
            @endif
        <div class="ui inverted large label" style="background-color:{{$color}}">
            {{ trans('crm.bets.rang') }}
            <div class="detail">
                #<code>{{$user->rang->id}}</code> {{ $user->rang->r_name }}
            </div>
        </div>
        @endif

        @else
            @if(count($user->kyc) && $user->kyc[0]->meta_value=="true")
                <i class="hourglass full icon"></i><span>KYC status: <b>Full</b></span>
            @elseif(count($documents))
                <i class="hourglass end icon helper"></i><span>KYC status: <b>Partial</b></span>
            @else
                <i class="hourglass empty icon helper"></i><span>KYC status: <b>None</b></span>
            @endif
        @endifmodule
        <button class="ui icon basic right floated button" onclick="crm.user.reload()"><i class="ui refresh icon"></i></button>
    </div>
    <div class="content scrolling">
        <div class="ui stackable grid">
            <div class="column four wide">
                @include('crm.content.user.left_dashboard')
            </div>
            <div class="column twelve wide">
                <div class="ui top attached tabular menu">
                    @can('ftd')
                    <a class="item active" data-tab="kyc">{{ trans('crm.customers.kyc') }}</a>
                    @endcan
                    @ifmodule('bets')
                    @else
                        @can('retention')
                            <a class="item" data-tab="trades">{{ trans('crm.customers.trades') }}</a>
                        @endcan
                    @endifmodule
                    <a class="item task-user-item" data-tab="tasks">{{ trans('crm.customers.tasks') }}</a>
                    @can('ftd')
                        <a class="item" data-tab="finance">{{ trans('crm.customers.finance') }}</a>
                    @endcan
                    @can('admin')
                        <a class="item" data-tab="accounts">{{ trans('crm.accounts.title') }}</a>
                    @endcan
                    <a class="item" data-tab="messages">{{ trans('crm.customers.messages') }}</a>
                    <a class="item" data-tab="mail">{{ trans('crm.mail.title') }}</a>
                    @can('admin')
                    <a class="item" data-tab="meta">{{ trans('crm.admin.meta') }}</a>
                    @endcan
                    @can('ftd')
                        <a class="item" data-tab="log">{{ trans('crm.customers.log') }}</a>
                    @else
                        <a class="item active" data-tab="log">{{ trans('crm.customers.log') }}</a>
                    @endcan
                    @can('admin')
                        <a class="item color green" href="/user/fastlogin/{{$user->id}}" target="_blank">Fastlogin</a>
                    @endcan
                </div>
                
                @can('admin')
                <div class="ui bottom attached tab segment" data-tab="meta">@include('crm.content.user.meta')</div>
                @endcan
                @can('ftd')
                <div class="ui bottom attached tab segment active" data-tab="kyc">@include('crm.content.user.kyc')</div>
                @endcan
                <div class="ui bottom attached tab segment " data-tab="trades">@include('crm.content.user.trades')</div>
                <div class="ui bottom attached tab segment" data-tab="tasks">@include('crm.content.user.tasks')</div>
                <div class="ui bottom attached tab segment" data-tab="finance">@include('crm.content.user.finance')</div>
                <div class="ui bottom attached tab segment" data-tab="accounts">@include('crm.content.user.accounts')</div>
                @can('ftd')
                    <div class="ui bottom attached tab segment" data-tab="log">
                @else
                    <div class="ui bottom attached tab segment active" data-tab="log">
                @endcan
                    @include('crm.content.user.log')
                </div>
                <div class="ui bottom attached tab segment" data-tab="messages">@include('crm.content.user.messages')</div>
                <div class="ui bottom attached tab segment" data-tab="mail">@include('crm.content.user.mail')</div>
            </div>
        </div>
    </div>
    <div class="actions">
        <div class="ui black deny button">
            {{ trans('crm.close') }}
        </div>
        <div class="ui positive right labeled icon button okclose">
            Ok
            <i class="checkmark icon"></i>
        </div>
    </div>
<!-- </div> -->

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
        if(d.meta_value=="true" || d.meta_value==true){
            container.find('[data-name=meta_value]').val('false');
            container.find('.submit').html('On');

        }else {
            container.find('[data-name=meta_value]').val('true');
            container.find('.submit').html('Off');
        }
        crm.user.touch();
    }
    function userKYC(d,container,a){
        if(d.meta_value==2){
            $('.hourglass').removeClass('empty half').addClass('full');
            $('.hourglass').next().html('KYC status: <b>Full</b>');
        }
        else if(d.meta_value==1){
            $('.hourglass').removeClass('full empty').addClass('half');
            $('.hourglass').next().html('KYC status: <b>Partial</b>');
        }
        else {
            $('.hourglass').removeClass('full half').addClass('empty');
            $('.hourglass').next().html('KYC status: <b>None</b>');
        }
        crm.user.touch();
    }

    $(".cantrade.switcher").on('change',function(){
        $(this).parent('.submiter').find('[data-name=meta_value]').val( $(this).is(':checked')?'true':'false' );
        $(this).parent('.submiter').find('.submit').click();
    });
    $(".ui.tabular .item").tab('change tab', '{{$tab}}');
    // $('.date').appendDtpicker({futureOnly: true});
    $('.datetask').on('change keyup blur',function(){
        var $d = $(this).parents('.form').find('.datetask.date'),$t = $(this).parents('.form').find('.datetask.time'),$r = $(this).parents('.form').find('[data-name=start_date]');
        console.debug($d.val(),$t.val());
        $r.val($d.val()+' '+$t.val());
    });

    $('#user_{{$user->id}}_kyc').progress({
        // showActivity:false,
        label: false,
        // text: {
        //     ratio:'{text} KYC'
        // },
        onChange:function(p,v,t){
            console.debug(p,v,t);
            switch(v){
                case 0:$(this).progress('set bar label','None KYC');break;
                case 1:$(this).progress('set bar label','Partial KYC');break;
                case 2:$(this).progress('set bar label','Fully KYC');break;
            }
            $(this).closest('.submiter').find('[data-name=meta_value]').val(v);
            $(this).closest('.submiter').find('.submit').click();
        }
    }).progress('set progress',@if(count($user->kyc)) {{$user->kyc[0]->meta_value ?? 0}} @endif);
</script>
