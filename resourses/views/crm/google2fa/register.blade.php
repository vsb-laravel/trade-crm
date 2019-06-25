<div class="ui card" id="google2fa-{{Auth::id()}}" style="margin: 0 auto;">
    <div class="image">
        <img src="{{ $QR_Image }}">
    </div>
    <div class="content">
        <div class="header">
            {{ trans('crm.private.google2fa.setup') }}
        </div>
        <div class="description">
            {{ trans('crm.private.google2fa.manual', ["secret"=>$secret]) }}
        </div>
        <div class="meta">{{ trans('crm.private.google2fa.require') }}</div>
        {{-- <button class="ui primary button" onClick="{$(`#google2fa-{{Auth::id()}}`).slideUp()}">{{ trans('crm.message.ok') }}</button> --}}
    </div>
</div>
