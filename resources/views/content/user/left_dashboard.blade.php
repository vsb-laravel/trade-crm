<div class="ui clearing">
    <label>{{ trans('crm.customers.login') }}</label>
    <input type="text" readonly="readonly" class="ui input" style="border:none" id="useremail{{$user->id}}" value="{{$user->email}}"/>
    <button class="ui basic right icon button floated" onclick="copyValue(this,'#useremail{{$user->id}}')"><i class="copy icon"></i></button>
</div>
@include('crm.content.user.comments')
<div class="ui horizontal divider">{{ trans('crm.customers.statuses') }}</div>
<div class="ui clearing">
    <label>{{ trans('crm.customers.registered') }}</label>
    <h5 class="ui header" style="display:inline;">{{$user->created_at}}</h5>
</div>
@foreach($user->meta as $meta)
    @if($meta->meta_name =='ftd')
        @php($ftd = json_decode($meta->meta_value))
        <div class="ui clearing">
            <label>{{ trans('crm.customers.ftd') }}</label>
            <h5 class="ui header" style="display:inline;">{{$ftd->manager->title ?? ''}}</h5>
        </div>
    @endif
@endforeach
<div class="ui clearing">
    <label>{{ trans('crm.customers.source') }}</label>
    <h5 class="ui header" style="display:inline;">{{$user->source}}</h5>
</div>
<div class="ui items">
    @if($user->rights_id>1)
    <div class="ui action input">
        <input type="text" readonly value="{{$admincode ?? ''}}" id="admincode" />
        <button class="ui teal right labeled icon button" onclick="copyValue(this,'#admincode')">
            <i class="copy icon"></i>
        </button>
    </div>
    @endif
    @ifmodule('bets')
    @else
        @can('kyc')
        <div class="item">
            <div class="submiter" data-action="/json/user/meta?meta_name=kyc" data-name="user-kyc" data-callback="userKYC" style="width:100%;">
                <input type="hidden" data-name="user_id" value="{{$user->id}}" />
                <input type="hidden" data-name="meta_value" value="{{$user->kyc[0]->meta_value ?? 0}}" />
                <input type="hidden" class="submit"/>
                <div class="ui indicating progress" data-value="{{$user->kyc[0]->meta_value ?? 0}}" data-total="2" id="user_{{$user->id}}_kyc">
                    <div class="bar">
                        <div class="progress"></div>
                    </div>
                    <div class="label">
                        <div class="ui inline buttons">
                            <button class="ui icon basic button" onclick="$('#user_{{$user->id}}_kyc').progress('decrement')"><i class="arrow left icon"></i></button>
                            <button class="ui basic button disabled">KYC</button>
                            <button class="ui icon basic button" onclick="$('#user_{{$user->id}}_kyc').progress('increment')"><i class="arrow right icon"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="ui slider checkbox submiter" data-action="/json/user/meta?meta_name=can_trade" data-name="user-can-trade" data-callback="userCanTrade">
                <input type="hidden" data-name="user_id" value="{{$user->id}}" />
                <input type="hidden" data-name="meta_value" @if(count($user->can_trade) && $user->can_trade[0]->meta_value=="true") value="true" @endif/>
                <input class="cantrade switcher" type="checkbox" data-name="" @if(count($user->can_trade) && $user->can_trade[0]->meta_value=="true") checked="checked" @endif>
                <input type="hidden" class="submit"/>
                <label>{{ trans('crm.customers.can_trade') }}</label>
            </div>
        </div>
        @endcan
    @endifmodule
</div>
<div class="ui form submiter globe" data-action="/json/user/{{$user->id}}/update" data-callback="crm.user.touch" id="">
    @can('kyc')
    <input type="hidden" data-name="user_id" value="{{$user->id}}" />
    <div class="field">
        <div class="ui slider checkbox">
            <input type="checkbox" data-name="email_verified" @if($user->email_verified=="1") checked="checked" value="true" @endif/>
            <label>{{ trans('crm.customers.email_verified') }}</label>
        </div>
    </div>
    @endcan
    <div class="field">
        <label>{{ trans('crm.customers.status') }}</label>
        <select class="ui dropdown" data-name="status_id">
            @foreach($statuses as $row)
                <option value="{{$row->id}}" @if($row->id==$user->status_id) selected="selected" @endif>{{$row->title ?? ''}}</option>
            @endforeach
        </select>
    </div>
    @can('kyc')
    <div class="field">
        <label>{{ trans('crm.customers.rights') }}</label>
        <select class="ui dropdown" data-name="rights_id">
            @foreach($rights as $row)
                <option value="{{$row->id}}" @if($row->id==$user->rights_id) selected="selected" @endif>
                    {{$row->title ?? ''}}
                </option>
            @endforeach
        </select>
    </div>

    <div class="field">
        <label>{{ trans('crm.customers.manager') }}</label>
        <div class="ui selection dropdown" id="user-manager">
            <input type="hidden" name="parent_user_id" data-name="parent_user_id" value={{$user->parent_user_id || ''}}>
            <i class="dropdown icon"></i>
            <div class="default text">{{$user->manager->title ?? ''}}</div>
            <div class="menu" tabindex="-1">
                <div class="item" data-value="{{Auth::id()}}">
                    <span class="text">{{Auth::user()->title ?? ''}}</span>
                    <span class="description">Me</span>
                </div>
                @foreach($managers as $row)
                    @if($row->id!=Auth::id())
                    <div class="item @if($row->id==$user->parent_user_id) selected @endif" data-value="{{$row->id}}">
                        <span class="text">{{$row->title ?? ''}}</span>
                        <span class="description">{{$row->rights->name}}</span>
                    </div>
                    @endif
                @endforeach
                @foreach($affilates as $row)
                    @if($row->id!=Auth::id())
                    <div class="item @if($row->id==$user->parent_user_id) selected @endif" data-value="{{$row->id}}">
                        <span class="text">{{$row->title ?? ''}}</span>
                        <span class="description">{{$row->rights->name}}</span>
                    </div>
                    @endif
                @endforeach
            </div>
            <script>
                $('#user-manager').dropdown('set value',{{$user->parent_user_id}});
            </script>
        </div>
    </div>
    @ifmodule('bets')
    @else
    <div class="field">
        <label>{{ trans('crm.customers.affilate') }}</label>
        <div class="ui search selection dropdown" id="user-affilate">
            <input type="hidden" name="affilate_id" data-name="affilate_id" value={{$user->affilate_id || ''}}>
            <i class="dropdown icon"></i>
            <div class="default text">{{$user->affilate->title ?? ''}}</div>
            <div class="menu" tabindex="-1">
                <div class="item" data-value="{{Auth::id()}}">
                    <span class="text">{{Auth::user()->title ?? ''}}</span>
                    <span class="description">Me</span>
                </div>
                @foreach($affilates as $row)
                    @if($row->id!=Auth::id())
                    <div class="item @if($row->id==$user->affilate_id) selected @endif" data-value="{{$row->id}}">
                        <span class="text">{{$row->title ?? ''}}</span>
                        <span class="description">{{$row->rights->name}}</span>
                    </div>
                    @endif
                @endforeach
                @foreach($managers as $row)
                    @if($row->id!=Auth::id())
                    <div class="item @if($row->id==$user->affilate_id) selected @endif" data-value="{{$row->id}}">
                        <span class="text">{{$row->title ?? ''}}</span>
                        <span class="description">{{$row->rights->name}}</span>
                    </div>
                    @endif
                @endforeach
            </div>
            <script>
                $('#user-affilate').dropdown('set value',{{$user->affilate_id}});
            </script>
        </div>
    </div>
    @endifmodule

    <div class="field">
        <label>{{ trans('crm.customers.changepassword') }}</label>
        <div class="ui input">
            <input type="password" data-name="password" />
        </div>
    </div>
    @endcan
    @if($user->rights_id>1)
        <div class="field">
            <label>{{ trans('crm.customers.office') }}</label>
            <div class="ui input">
                <input data-name="office" value="{{$user->office}}" />
            </div>
        </div>

    @endif
    <buttom class="ui button green submit">{{ trans('crm.save') }}</button>
</div>
