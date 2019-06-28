@extends('crm.layouts.default')
@section('page')
@php($page=app('request')->input('page','dashboard'))
@php($subpage=app('request')->input('subpage',''))
@php($tab=app('request')->input('tab',false))

@if($tab!==false)
    @push('scripts')
        <script>
            const PAGE_TAB = '{{$tab}}';
        </script>
    @endpush
@endif


<div class="ui main container" style="padding-bottom:80px;">

    <div id="notifTasks" style="display:none">
        {!! $listTasks ?? '' !!}
    </div>

    <!-- dashboard page -->

    <div class="ui segment page__" id="page__dashboard" name="Dashboard">
        @include('crm.content.dashboard')
    </div>
    @ifmodule('chat')
    <!-- chart page -->
    <div class="ui page__" id="page__chart" style="height:100vh;margin-top: -50px;padding-bottom: 50px;">
        <iframe src="https://dashboard.tawk.to/login" style="width:100%;height:100%;margin-bottom:0;marborder:solid 1px #eee"></iframe>
    </div>
    @endif

    <!-- <div class="ui page__" id="page__support" style="height:100vh;margin-top: -50px;padding-bottom: 50px;">
        <iframe src="http://xptx.us/login" style="width:100%;height:100%;margin-bottom:0;marborder:solid 1px #eee"></iframe>
    </div> -->
    <!-- mail page -->
    <div class="ui segment page__" id="page__imap">
        <div class="ui header">{{ trans('crm.imap.title') }}</div>
        @include('crm.content.imap.dashboard')
    </div>
    <!-- scheduler page -->
    <div class="ui segment page__" id="page__tasks">
        <div class="ui header">{{ trans('crm.dashboard.tasks') }}</div>
        <div class="ui segment">@include('crm.content.calendar_main.main_scheduler')</div>
    </div>
    <!-- customers page -->
    <div class="ui segment page__" id="page__customers">
        <div class="ui left rail">
            <div class="ui vertical secondary menu sticky" data-context="#page__customers">
                @can('marketing')
                <a class="item" data-href="page__customers_clients" onclick="page.show(this,'customers','clients');">{{ trans('crm.dashboard.clients') }}<div class="ui teal left pointing label" id="customers_count">{{count($users)}}</div></a>
                @endcan
                @can('affilate')
                <a class="item" data-href="page__customers_leads" onclick="page.show(this,'customers','leads');">{{ trans('crm.dashboard.leads') }}<div class="ui teal left pointing label"  id="leads_count">{{count($leads)}}</div></a>
                <a class="item" onclick="crm.lead.showImport();">{{ trans('crm.dashboard.import_leads') }}</a>
                @endcan
                @can('export')
                <div class="item">
                    <form class="ui form" action="/export/customers">
                        <div class="field">
                            <label>&nbsp;</label>
                            <button type="submit" class="ui icon olive button right floated">
                                <i class="file excel outline icon"></i>
                                {{ trans('crm.finance.export_button') }}
                            </button>
                        </div>

                    </form>
                </div>
                @endcan
            </div>
        </div>
        @can('affilate')
            @can('marketing')
                <div class="page__" id="page__customers_clients">@include('crm.content.user.list')</div>
            @endcan
            <div class="page__" id="page__customers_leads">@include('crm.content.lead.list')</div>
        @endcan
    </div>
    <!-- pairs page -->
    <div class="ui segment page__" id="page__pairs">
        <div class="ui left rail">
            <div class="ui vertical secondary pointing menu sticky" data-context="#page__pairs">
                <a class="item" data-href="page__pairs_groups" onclick="page.show(this,'pairs','groups');">{{ trans('crm.instruments.groups.title') }}<div class="ui teal left pointing label" id="groups_count">{{Vsb\Crm\InstrumentGroup::count()}}</div></a>
                @can('superadmin')
                <a class="item" data-href="page__pairs_list" onclick="page.show(this,'pairs','list');">{{ trans('crm.dashboard.instruments') }}<div class="ui teal left pointing label" id="pairs_count">{{count($instruments)}}</div></a>
                <a class="item" data-href="page__pairs_currencies" onclick="page.show(this,'pairs','currencies');">{{ trans('crm.dashboard.currencies') }}<div class="ui label">{{count($currencies)}}</div></a>
                <a class="item" data-href="page__pairs_sources" onclick="page.show(this,'pairs','sources');">{{ trans('crm.dashboard.sources') }}<div class="ui label">{{count($sources)}}</div></a>
                <a class="item" data-href="page__pairs_prices" onclick="page.show(this,'pairs','prices');">{{ trans('crm.dashboard.prices') }}</a>
                @endcan
            </div>
        </div>
        <div class="page__" id="page__pairs_groups">@include('crm.content.instrument.groups')</div>
        <div class="page__" id="page__pairs_sources">@include('crm.content.instrument.sources')</div>
        <div class="page__" id="page__pairs_currencies">@include('crm.content.instrument.currencies')</div>
        <div class="page__" id="page__pairs_prices">@include('crm.content.instrument.prices')</div>
        <div class="page__" id="page__pairs_list">@include('crm.content.instrument.list')</div>
    </div>
    <!-- newss page -->
    <div class="ui segment page__" id="page__newsfeed">
        <div class="page__" id="page__newsfeed_list">@include('crm.content.newsfeed.list')</div>
    </div>
    <!-- deals page -->
    <div class="ui segment page__" id="page__trades">
        <div class="page__" id="page__trades_list">@include('crm.content.deal.list')</div>
    </div>
    <!-- finance page -->
    <div class="ui segment page__" id="page__finance">
        <div class="ui left rail">
            <div class="ui vertical secondary pointing menu sticky" data-context="#page__finance">
                <a class="item" data-href="page__finance_dashboard" onclick="page.show(this,'finance','dashboard');">{{ trans('crm.finance.title') }}</a>
                <a class="item" data-href="page__finance_withdrawals" onclick="page.show(this,'finance','withdrawals');">{{ trans('crm.finance.withdrawals') }}</a>
                <a class="item" data-href="page__finance_transactions" onclick="page.show(this,'finance','transactions');">{{ trans('crm.finance.transactions') }}</a>
            </div>
        </div>
        <div class="page__" id="page__finance_dashboard">@include('crm.content.finance.dashboard')</div>
        <div class="page__" id="page__finance_withdrawals">@include('crm.content.finance.withdrawals')</div>
        <div class="page__" id="page__finance_transactions">@include('crm.content.finance.transactions')</div>
    </div>
    <div class="ui segment page__" id="page__options">
        <div class="ui left rail">
            <div class="ui vertical secondary pointing menu sticky" data-context="#page__options">
                @can('chief')
                <a class="item" data-href="page__options_dashboard" onclick="page.show(this,'options','dashboard');">{{ trans('crm.options.title') }}</a>
                @endcan
                @can('kyc')
                <a class="item" data-href="page__options_admins" onclick="page.show(this,'options','admins');">{{ trans('crm.options.administrators') }}</a>
                @endcan
            </div>
        </div>
        <div class="page__" id="page__options_admins">@include('crm.content.option.admins')</div>
        <div class="page__" id="page__options_dashboard">
            <div class="ui header">{{ trans('crm.options.title') }}</div>
            <div class="ui segment">@include('crm.content.option.dashboard')</div>
        </div>
    </div>
    <div class="page__" id="page__admintree" style="height:100%">@include('crm.content.option.admintree')</div>
    <div class="page__" id="page__private" style="height:100%">@include('crm.content.option.private')</div>
    <div class="page__" id="page__brands" style="margin-left:5vw;margin-right:20vw">
        <div class="ui header">@lang('crm.brands.title')</div>
        <div class="ui segment">@include('crm.content.brands.dashboard')</div>
    </div>
</div>
@endsection
