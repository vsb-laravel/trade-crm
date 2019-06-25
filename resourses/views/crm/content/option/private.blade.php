@php
    $user = Auth::user()
@endphp
<div class="ui header">@lang('crm.private.title')</div>
<div class="ui form submiter globe" data-action="/json/user/{{$user->id}}/update" data-callback="crm.user.touch" id="">
    <input type="hidden" data-name="user_id" value="{{$user->id}}" />
    <div class="field">
        <label>{{ trans('crm.private.changepassword') }}</label>
        <div class="ui input">
            <input type="password" data-name="password" />
        </div>
    </div>
    @if($user->rights_id>1)
        <div class="field">
            <label>{{ trans('crm.private.office') }}</label>
            <div class="ui input">
                <input data-name="office" value="{{$user->office}}"/>
            </div>
        </div>
    @endif
    <buttom class="ui button green submit">{{ trans('crm.save') }}</button>
</div>
<div class="ui divided small header">@lang('crm.private.google2fa.title')</div>


@php
    $exist2fa = false;
    $meta2fa = 0;
    foreach($user->meta as $meta){
        if($meta->meta_name == 'google2fa'){
            $exist2fa = true;
            $meta2fa = $meta->id;
            break;
        }
    }
@endphp
@if($exist2fa)
    <div class="submiter" data-action="/usermeta/{{$meta2fa}}" data-method="PUT" data-google2fa="true" data-google2fa-condition="meta_value=='0'" data-name="user-google2fa" data-callback="register2fasecret">
@else
    <div class="submiter" data-action="/usermeta" data-method="POST" data-name="user-google2fa" data-callback="register2fasecret">
@endif
    <div class="ui switcher-a slider checkbox">
        <input type="hidden" data-name="user_id" value="{{$user->id}}" />
        <input type="hidden" data-name="meta_name" value="google2fa"/>
        <input class="" type="checkbox" data-name="meta_value" @if($user->google2fa=="1") checked="checked" @endif>

        <label>{{ trans('crm.private.google2fa.use') }}</label>
    </div>
    <input type="hidden" class="submit"/>
</div>
