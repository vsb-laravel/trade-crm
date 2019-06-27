@can('admin')
    <div class="ui top attached tabular menu wide options">
        <a class="item active" data-tab="global">{{ trans('crm.options.global') }}</a>
        <a class="item" data-tab="merchants">{{ trans('crm.options.merchants') }}</a>
        <a class="item" data-tab="mails">{{ trans('crm.options.mails') }}</a>
        <a class="item" data-tab="telephony">{{ trans('crm.options.telephony') }}</a>
    </div>
    <div class="ui bottom attached tab segment active" data-tab="global">
        @include('crm.content.option.global')
    </div>
    <div class="ui bottom attached tab segment " data-tab="merchants">
        @include('crm.content.option.merchants')
    </div>

    <div class="ui bottom attached tab segment " data-tab="mails">
        @include('crm.content.option.mails')
    </div>
    <div class="ui bottom attached tab segment " data-tab="telephony">
        @include('crm.content.option.telephony')
    </div>
@else
    <div class="ui top attached tabular menu wide options">
        <a class="item active" data-tab="mails">{{ trans('crm.options.mails') }}</a>
    </div>
    <div class="ui bottom attached tab segment" data-tab="mails">
        @include('crm.content.option.mails')
    </div>

@endcan
