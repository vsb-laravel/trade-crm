<div class="loadering ui item" data-name="user-messages" data-action="/user/messages?user_id={{$user->id}}" data-refresh="0" data-autostart="true" data-function="crm.messages.list"></div>
<div class="ui horizontal divider">{{ trans('messages.writemessage') }}</div>
<div class="submiter ui form" data-action="/user/message/add" data-callback="crm.messages.added">
        <input type="hidden" data-name="user_id" value="{{$user->id}}">
        <div class="field">
            <div class="ui input labeled">
                <div class="ui label">
                    {{ trans('messages.Subject') }}
                </div>
                <input type="text" data-name="subject" required placeholder="">
            </div>
        </div>
        <div class="field">
            <div class="ui input">
                <textarea data-name="message" required placeholder="{{ trans('messages.message') }}"></textarea>
            </div>
        </div>
        <div class="ui blue labeled submit icon button">
            <i class="icon send"></i> {{ trans('messages.Send') }}
        </div>
</div>
