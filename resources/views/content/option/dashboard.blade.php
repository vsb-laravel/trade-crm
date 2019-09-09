@can('admin')
    <div class="ui top attached tabular menu wide options">
        <a class="item active" data-tab="global">{{ trans('crm.options.global') }}</a>
        <a class="item" data-tab="merchants">{{ trans('crm.options.merchants') }}</a>
        <a class="item" data-tab="mails">{{ trans('crm.options.mails') }}</a>
        <a class="item" data-tab="telephony">{{ trans('crm.options.telephony') }}</a>
        <a class="item" data-tab="banners">{{ trans('crm.options.banners') }}</a>
        @can('superadmin')
            <a class="item" data-tab="roles">{{ trans('crm.options.roles') }}</a>
        @endcan
        @can('chief')
            <a class="item" data-tab="system">{{ trans('crm.option.system.title') }}</a>
        @endcan
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
    <div class="ui bottom attached tab segment page__" data-tab="banners">
        @include('crm.content.option.banners')
    </div>
    @can('superadmin')
        <div class="ui bottom attached tab segment " data-tab="roles">
            @include('crm.content.option.roles')
        </div>
        <div class="ui bottom attached tab segment page__" data-tab="system">
            @include('crm.content.option.system')
        </div>
    @endcan
@else
    <div class="ui top attached tabular menu wide options">
        <a class="item active" data-tab="mails">{{ trans('crm.options.mails') }}</a>
    </div>
    <div class="ui bottom attached tab segment" data-tab="mails">
        @include('crm.content.option.mails')
    </div>

@endcan
