<div class="popup popup_b user_dashboard user_dashboard_kyc show" style="display:block;">
    <div class="close" onclick="{ $(this).parent().fadeOut( 256, function(){ $(this).remove(); } ); }"></div>
    <strong>{{ trans('messages.user_dashboard') }}</strong>
    <div class="contenta flex info">
        <div class="item">
            <div class="inner">
                <div class="wrap">
                    <div class="left">
                        <!-- <a href="#" class="edit">Edit data user</a> -->
                        <ul class="hidden">
                            <li>
                                {{ trans('messages.can_trade') }}:
                                <span class="user-can-trade submiter" data-action="/json/user/meta?meta_name=can_trade" data-name="user-can-trade" data-callback="userCanTrade">
                                    <input type="hidden" data-name="user_id" value="{{$user->id}}" />
                                    @if(isset($user->can_trade) && $user->can_trade == "true")
                                        <input type="hidden" data-name="meta_value" value="false" />
                                        <button class="submit on">On</button>
                                    @else
                                        <input type="hidden" data-name="meta_value" value="true" />
                                        <button class="submit off">Off</button>
                                    @endif

                                </span>
                            </li>
                        </ul>
                        <div class="user-basic-info submiter" data-action="/json/user/{{$user->id}}/update" data-callback="crmUserInfoCallback">
                            <ul class="">
                                <li>First name: <span class="user-name"><input data-name="name" value="{{$user->name}}"/></span></li>
                                <li>Last name: <span class="user-surname"><input data-name="surname" value="{{$user->surname}}"/></span></li>
                                <li>Created: <span class="user-created">{{date("Y-m-d H:i:s",time($user->created_at))}}</span></li>
                                <li>E-mail: <span class="user-email"><input data-name="email" value="{{$user->email}}"/></span></li>
                                <li>Password: <span class="user-password"><input data-name="password" value=""/></span></li>
                                <li>Phone number: <span class="user-phone"><input data-name="phone" value="{{$user->phone}}"/></span></li>
                                <li>Country: <span class="user-country">
                                    <select data-name="country">
                                    @foreach($countries as $country)
                                        <option value="{{$country["id"]}}" @if(isset($user->country) && $user->country==$country["id"]) selected="selected" @endif>{{$country["title"]}}</option>
                                    @endforeach
                                    </select>
                                </span></li>
                                <li>Office: <span class="user-office">
                                    <input data-name="office" value="@if(count($user->office)){{$user->office[0]->meta_value}}@endif" />
                                </span></li>
                                <li>KYC: <span class="user-rurs">
                                    @if(isset($user->verified) && $user->verified == "true")
                                        Verified
                                    @else
                                        Pending
                                    @endif
                                </span></li>
                                <li>Manager: <span class="user-manager">
                                    <select data-name="parent_user_id">
                                        <option value="false" selected="selected">Not setted</option>
                                        <option value="{{Auth::id()}}" @if($user->manager && $user->manager->id == Auth::id())
                                            selected="selected"
                                        @endif
                                        >Me</option>
                                        @foreach($managers as $row)
                                            <option value="{{$row->id}}"
                                                @if(isset($user->manager->id) && $user->manager->id == $row->id)
                                                    selected="selected"
                                                @endif
                                                >{{$row->name}} {{$row->surname}}</option>
                                        @endforeach
                                    </select>
                                </span></li>
                                <li>Status: <span class="user-status">
                                    <select data-name="status_id">
                                        @foreach($statuses as $row)
                                            <option value="{{$row->id}}"
                                                @if($user->status_id == $row->id)
                                                    selected="selected"
                                                @endif
                                                >{{$row->title}}</option>
                                        @endforeach
                                    </select>
                                </span></li>
                                <li>Rights:
                                    <span class="user-rights_id">
                                        <select data-name="rights_id">
                                            @foreach($rights as $row)
                                                <option value="{{$row->id}}"
                                                    @if($user->rights_id == $row->id)
                                                        selected="selected"
                                                    @endif
                                                    >{{$row->title}}</option>
                                            @endforeach
                                        </select>
                                    </span>
                                </li>
                                @if($user->rights_id>2 && $user->users_count>0)
                                    <li>Controll: <span class="user-control">
                                        <button class="" onclick="crmControllOff()">{{ trans('messages.controll_off') }}</button>
                                    </span></li>
                                @endif
                                <!-- <li>Source Description: <span class="user-name"></span></li> -->
                            </ul>
                            <!-- <div class="button flex"> -->
                                <!-- <a href="javascript:void(0);" class="submit">{{ trans('messages.save') }}</a> -->
                                <!-- <a href="javascript:void(0);" class="submit">{{ trans('edit.save') }}</a> -->
                            <!-- </div> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="inner">
                <div class="tab_cab flex flex-top" data-action="/json/user/{{$user->id}}/update" data-callback="userInfoCallback">
                    <div class="item flex column">
                        <div class="inner">
                            <label for="name">{{ trans('messages.name') }}</label>
                            <input type="text" data-name="name" placeholder="{{ trans('messages.Enter_your_name') }}" value="{{$user->name}}" >
                        </div>
                        <div class="inner">
                            <label for="l_name">{{ trans('messages.Surname') }}</label>
                            <input type="text" data-name="surname" placeholder="{{ trans('messages.Enter_last_name') }}" value="{{$user->surname}}">
                        </div>
                        <div class="inner">
                            <label for="l_name_l">{{ trans('messages.middle-name') }}</label>
                            <input type="text" data-name="midname" placeholder="{{ trans('messages.Enter_middle_name') }}"  value="{{$user->midname ?? ''}}">
                        </div>
                        <div class="inner">
                            <label for="country">{{ trans('messages.country') }}</label>
                            <input type="text" data-name="country" placeholder="{{ trans('messages.Enter-country-of-residence') }}" value="{{$user->country ?? ''}}" />
                        </div>
                        <div class="inner">
                            <label for="city">{{ trans('messages.city') }}</label>
                            <input type="text" data-name="city" placeholder="{{ trans('messages.Enter_the_name_of_the_city') }}" value="{{$user->address->city ?? ''}}">
                        </div>
                        <div class="inner">
                            <label for="name">{{ trans('messages.index') }}</label>
                            <input type="text" data-name="zip" placeholder="{{ trans('messages.Enter_the_index') }}" value="{{$user->address->zip ?? ''}}">
                        </div>
                        <div class="inner">
                            <label for="address1">{{ trans('messages.address') }} 1</label>
                            <input type="text" data-name="address1" placeholder="{{ trans('messages.Enter_the_address') }} 1" value="{{$user->address->address1 ?? ''}}">
                        </div>
                        <div class="inner">
                            <label for="address2">{{ trans('messages.address') }} 2</label>
                            <input type="text" data-name="address2" placeholder="{{ trans('messages.Enter_the_address') }} 2" value="{{$user->address->address2 ?? ''}}">
                        </div>
                    </div>
                    <div class="item">
                        <div class="inner">
                            <label for="tel">{{ trans('messages.phone') }}</label>
                            <input type="tel" data-name="tel" placeholder="{{ trans('messages.Enter_phone_number') }}" value="{{$user->phone}}">
                        </div>
                        <div class="inner">
                            <label for="date">{{ trans('messages.Birthday') }}</label>
                            <input type="date" data-name="birthday" placeholder="{{ trans('messages.dd_mm_yyyy') }}" value="{{$user->birthday ?? ''}}">
                        </div>
                        <div class="inner">
                            <label for="pasport">{{ trans('messages.Passport-Series') }}</label>
                            <input type="text" data-name="passport" placeholder="{{ trans('messages.Enter_the_series') }}" value="{{$user->passport->passport ?? ''}}">
                        </div>
                        <div class="inner">
                            <label for="num_pasport">{{ trans('messages.Passport-ID') }}</label>
                            <input type="text" data-name="num_pasport" placeholder="{{ trans('messages.Passport-ID') }}" value="{{$user->passport->num_pasport ?? ''}}">
                        </div>
                        <div class="inner">
                            <label for="kem">{{ trans('messages.Issued-by') }}</label>
                            <input type="text" data-name="issued" placeholder="{{ trans('messages.Issued-by') }}" value="{{$user->passport->issued ?? ''}}">
                        </div>
                        <div class="inner">
                            <label for="until">{{ trans('messages.Valid-until') }}</label>
                            <input type="date" data-name="until" placeholder="{{ trans('messages.dd_mm_yyyy') }}" value="{{$user->passport->until ?? ''}}">
                        </div>
                        <div class="inner orderr">
                            <!-- <a href="#" class="submit file_loader">{{ trans('messages.Save') }}</a> -->
                            <a href="#" class="more">more</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="item_bot">
            <div class="item">
                <div class="box">
                    <div class="ed">1/{{count($user->documents)}}</div>
                    <div class="item">
                        @foreach($user->documents as $doc)
                            <div class="img">
                                <img src="{{$doc->file}}" alt="">

                                <div class="relative-block submiter" data-action="/user/kyc/{{$doc->id}}/update/declined" data-callback="crmUserDocVerified">
                                    <a href="#" class="submit"><i class="ic1"></i></a>
                                </div>
                                <div class="relative-block submiter" data-action="/user/kyc/{{$doc->id}}/update/verified" data-callback="crmUserDocVerified">
                                    <a href="#" class="submit"><i class="ic2"></i></a>
                                </div>
                                <div class="relative-block submiter" data-action="/user/kyc/{{$doc->id}}/delete" data-callback="crmUserDocDelete">
                                    <a href="#" class="submit del"><i class="ic3"></i></a>
                                </div>
                            </div>
                        @endforeach

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    function crmUserDocVerified(d,container,a){
        if(d.status) container.parent().find('img').addClass(d.status);
    }
    function crmUserDocDelete(d,container,a){
        if(d.status) container.parent().find('img').remove();
    }
    jQuery('.contenta.info .item .box .item .img').click(function(){
        jQuery( this ).toggleClass('active');
    });

    jQuery('a.more').click(function(){
        if ( jQuery('.item_bot').is(':visible') ) {
            jQuery('.item_bot').slideUp();
        } else {
            jQuery('.item_bot').slideDown();
        }
        return false;
    });

    $('ul.tabs_in_dashbord li:not(.active)').on('click', function() {
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.tabs_in').find('div.tabs_in_dash').removeClass('active').eq($(this).index()).addClass('active');
    });

    // var dp = dataProcessor("/json/task?user_id={{$user->id}}");
    // dp.init(scheduler);
    try{
        var scheduler = tasksPane("user_scheduler_{{$user->id}}",{{$user->id}});
    }
    catch(e){
        console.log('Error in scheduler',e);
    }



    function crmUserInfoCallback(){
        console.debug("UserInfoCallback");
        cf._loaders['user-list'].execute();
    }
    function crmControllOff(){
        $.ajax({
            url:"/user/{{$user->id}}/controll/off",
            dataType:"html",
            success:function(d,x,s){
                $('.user_dashboard').replaceWith(d);
            }
        });
    }
    function replaceDashBoard(d){
        $('.user_dashboard').replaceWith(d);
    }
    function commentsAdded(d,container,a){
        var comment = $('<p class="coment"></p>').insertAfter(container.find('p.coment:last')),date = new Date(d.created_at);
        comment.append('<span class="date">'+dateFormat(d.created_at)+'</span>');
        comment.append('<span class="author">'+currentAuth.name+' '+currentAuth.surname+'</span>');
        comment.append(d.comment);
        container.find('p.coment.empty').remove();
    }
    function crmUserDealList(container,d,x,s){
        container.html('');
        console.debug(d);
        for(var i in d.data){
            var row=d.data[i],s = '<tr data-class="deal" data-id="'+row.id+'">';
            /*
            <td>ID <div class="arrow"><span></span><span></span></div></td>
            <td>Registred <div class="arrow"><span></span><span></span></div></td>
            <td>Updated <div class="arrow"><span></span><span></span></div></td>
            <td>Instrument <div class="arrow"><span></span><span></span></div></td>
            <td>Status <div class="arrow"><span></span><span></span></div></td>
            <td>Amount <div class="arrow"><span></span><span></span></div></td>
            <td>Multiplier <div class="arrow"><span></span><span></span></div></td>
            <td>Direction <div class="arrow"><span></span><span></span></div></td>
            <td>Profit <div class="arrow"><span></span><span></span></div></td>
            <td>Stops <div class="arrow"><span></span><span></span></div></td>
            <td>&nbsp;</td>
            */
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
        console.debug(d);
        if(d.meta_value=="true"){
            container.find('[data-name=meta_value]').val('false');
            container.find('.submit').html('On');

        }else {
            container.find('[data-name=meta_value]').val('true');
            container.find('.submit').html('Off');
        }
    }
    cf.reload();
</script>
