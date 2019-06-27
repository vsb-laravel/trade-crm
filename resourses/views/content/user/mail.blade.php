<div class="loadering ui comments" data-name="user-mail" data-action="/user/mail?user_id={{$user->id}}" data-refresh="0" data-autostart="true" data-function="crm.mail.user"></div>
<div class="ui horizontal divider">{{ trans('messages.writemessage') }}</div>
<div class="submiter ui form" data-action="/mail/send" data-callback="crm.mail.sent">
    <input type="hidden" data-name="user_id" value="{{$user->id}}">
    <div class="field">
        <label>{{ trans('crm.mail.template') }}</label>
        <div class="loadering ui selection dropdown" id="mailsTemplate" data-id="mailsTemplate" data-title="Templates" data-name="mail_id" data-action="/mail" data-autostart="true" data-function="crm.mail.chooseTemplate" data-function-change="crm.mail.loadTemplate"></div>
    </div>
    <div class="field">
        <label>Sender:</label>
        {{env('MAIL_USERNAME')}}
    </div>
    <div class="field">
        <div class="ui input">
            <textarea class="mailsText" data-name="text" required placeholder="{{ trans('messages.text') }}"></textarea>
        </div>
    </div>
    <div class="ui blue labeled submit icon button">
        <i class="icon send"></i> {{ trans('messages.Send') }}
    </div>
</div>
