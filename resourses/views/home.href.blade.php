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


<div class="ui main" style="padding-bottom:80px;">
    <div id="notifTasks" style="display:none">
        {!! $listTasks !!}
    </div>

    <!-- dashboard page -->
    @if($page=='dashboard')
    <div class="ui container segment active page__" id="page__dashboard">
        <div class="ui header">{{ trans('crm.dashboard.title') }}</div>
        <div class="ui stackable grid">
            @ifmodule('bets')
                @include('crm.content.arena.map')
            @endifmodule
        @can('chief')
            <div class="row">
                <div class="six wide column">
                    <div class="ui segment aligned left">
                        <div class="ui header">{{ trans('crm.dashboard.money_report') }}</div>
                        <div class="loadering ui statistics" data-action="/finance/report/dashboardMoneyRepo?period={page.dashboard.__currentPeriod}" data-name="dashboard-money-report" data-autostart="true" data-function="page.dashboard.money"></div>
                        <!-- <canvas id="chart__money_report" width="160" height="160"></canvas> -->

                        <div class="meta" style="margin-top:1em;">
                            <span class="date">{{ trans('crm.dashboard.for_last_7_days') }}</span>
                        </div>
                    </div>
                </div>
                <div class="six wide column">
                    <div class="ui segment aligned left">
                        <div class="ui header">{{ trans('crm.dashboard.deposits_report') }}</div>
                        <div class="loadering ui statistics" data-action="/finance/report/dashboardDepositRepo?period={page.dashboard.__currentPeriod}" data-name="dashboard-deposit-report" data-autostart="true" data-function="page.dashboard.deposits"></div>
                        <!-- <canvas id="chart__deposit_report" width="160" height="160"></canvas> -->
                        <div class="meta" style="margin-top:1em;">
                            <span class="date">{{ trans('crm.dashboard.by_merchants') }}</span>
                        </div>
                    </div>
                </div>
                <div class="four wide column">
                    <table class="ui single line unstackable table" id="deposit_total"></table>
                    @ifmodule('bets')
                    @else
                    <table class="ui single line unstackable table" id="withdrawal_total"></table>
                    @endifmodule
                </div>
            </div>
            @ifmodule('bets')
            @else
            <div class="row">
                <div class="ten wide column">
                    <div class="ui segment aligned left">
                        <div class="ui header">{{ trans('crm.dashboard.lead_client_report') }}</div>
                        <div class="loadering ui statistics" data-action="/finance/report/dashboardCustomersRepo?period={page.dashboard.__currentPeriod}" data-name="dashboard-customers-report" data-autostart="true" data-function="page.dashboard.customers"></div>
                        <!-- <canvas id="chart__lead_client"></canvas> -->

                        <div class="meta" style="margin-top:1em;">
                            <span class="date">{{ trans('crm.dashboard.for_last_7_days') }}</span>
                        </div>
                    </div>
                </div>
                <div class="six wide column">
                    <table class="ui single line unstackable table" id="lead_total"></table>
                </div>
            </div>
            @endifmodule
        @elsecan('ftd')
            <div class="row">
                <div class="ten wide column">
                    <div class="ui segment aligned left">
                        <div class="loadering" data-action="/finance/report/dashboardDealsRepo?period={page.dashboard.__currentPeriod}" data-name="dashboard-trade-report" data-trigger="show" data-function="page.dashboard.deals"></div>
                        <canvas id="chart__deals"></canvas>
                        <div class="ui header">{{ trans('crm.dashboard.deals_report') }}</div>
                        <div class="meta" style="margin-top:1em;">
                            <span class="date">{{ trans('crm.dashboard.for_last_7_days') }}</span>
                        </div>
                    </div>
                </div>
                <div class="six wide column">
                    <table class="ui single line unstackable table" id="deal_total">
                        <thead>
                            <tr>
                                <th>&nbsp;</th>
                                <th class="">{{ trans('crm.dashboard.total') }}</th>
                                <th class="">{{ trans('crm.dashboard.today') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td class="ui header">{{ trans('crm.dashboard.invested') }}</td><td class="ui header right aligned color"></td><td class="ui right aligned color"></td></tr>
                            <tr><td class="ui header">{{ trans('crm.dashboard.profit') }}</td><td class="ui header right aligned color"></td><td class="ui right aligned color"></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        @endcan
        </div>
        @can('partner')
            @include('crm.content.partner.dashboard')
        @elsecan('affilate')
            @can('export')
                <div class="left ui rail">
                    <div class="ui menu vertical byperiod bound bottom sticky" data-context="#page__dashboard">
                        <a class="item" onclick="crm.lead.showImport();">{{ trans('crm.dashboard.import_leads') }}</a>
                    </div>
                </div>
            @endcan
            <div class="right ui rail">
                <div class="ui menu vertical byperiod bound bottom sticky" data-context="#page__dashboard">
                    <a class="ui item" onclick="page.dashboard.byperiod(this,'today')">{{ trans('crm.periods.today') }}</a>
                    <a class="ui item active" onclick="page.dashboard.byperiod(this,'7d')">{{ trans('crm.periods.last_7_days') }}</a>
                    <a class="ui item" onclick="page.dashboard.byperiod(this,'m')">{{ trans('crm.periods.this_month') }}</a>
                    <a class="ui item" onclick="page.dashboard.byperiod(this,'y')">{{ trans('crm.periods.this_year') }}</a>
                </div>
            </div>
            @include('crm.content.affilate.dashboard')
        @endcan
    </div>
    @elseif($page=='chart')
    <!-- chart page -->
    <div class="ui page__" id="page__chart" style="height:100vh;margin-top: -50px;padding-bottom: 50px;">
        <iframe src="https://dashboard.tawk.to/login" style="width:100%;height:100%;margin-bottom:0;marborder:solid 1px #eee"></iframe>
    </div>
    @elseif($page=='support')
    <div class="ui page__" id="page__support" style="height:100vh;margin-top: -50px;padding-bottom: 50px;">
        <iframe src="http://xptx.us/login" style="width:100%;height:100%;margin-bottom:0;marborder:solid 1px #eee"></iframe>
    </div>
    <!-- mail page -->
    @elseif($page=='imap')
    <div class="ui container segment page__" id="page__imap">
        <div class="ui header">{{ trans('crm.imap.title') }}</div>
        @include('crm.content.imap.dashboard')
    </div>
    @elseif($page=='tasks')
    <!-- scheduler page -->
    <div class="ui container segment page__" id="page__tasks">

        <div class="ui header">{{ trans('crm.dashboard.tasks') }}</div>

        <div class="ui segment">@include('crm.content.calendar_main.main_scheduler')</div>
    </div>
    @elseif($page=='customers')

    <!-- customers page -->
    <div class="ui container segment page__container" id="page__customers">
        <div class="ui left rail">
        <div class="ui vertical secondary pointing menu sticky" data-context="#page__customers">
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
            @if($subpage=='clients')
                @can('marketing')
                    <div class="page__" id="page__customers_clients">@include('crm.content.user.list')</div>
                @endcan
            @elseif($subpage=='leads')
                <div class="page__" id="page__customers_leads">@include('crm.content.lead.list')</div>
            @endif
        @endcan
    </div>

    @elseif($page=='pairs')
    <!-- pairs page -->
    <div class="ui container segment page__" id="page__pairs">
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
        @if($subpage=='groups')
        <div class="page__" id="page__pairs_groups">@include('crm.content.instrument.groups')</div>
        @elseif($subpage=='sources')
        <div class="page__" id="page__pairs_sources">@include('crm.content.instrument.sources')</div>
        @elseif($subpage=='currencies')
        <div class="page__" id="page__pairs_currencies">@include('crm.content.instrument.currencies')</div>
        @elseif($subpage=='prices')
        <div class="page__" id="page__pairs_prices">@include('crm.content.instrument.prices')</div>
        @else
        <div class="page__" id="page__pairs_list">@include('crm.content.instrument.list')</div>
        @endif
    </div>
    @elseif($page=='newsfeed')
    <!-- deals page -->
    <div class="ui container segment page__" id="page__newsfeed">
        <div class="page__" id="page__newsfeed_list">@include('crm.content.newsfeed.list')</div>

    </div>
    @elseif($page=='trades')
    <!-- deals page -->
    <div class="ui container segment page__" id="page__trades">
        <!-- <div class="ui left rail">
            <div class="ui vertical secondary pointing menu sticky" data-context="#page__trades">
                <a class="item teal" data-href="page__trades_list" onclick="page.show(this,'trades','list');">{{ trans('crm.dashboard.trades') }}
                    @if(isset($trades))
                    <div class="ui teal left pointing label" id="pairs_count">{{count($trades)}}</div></a>
                    @endif
            </div>
        </div> -->
        <div class="page__" id="page__trades_list">@include('crm.content.deal.list')</div>

    </div>
    @elseif($page=='finance')
    <!-- finance page -->
    <div class="ui container segment page__" id="page__finance">
        <div class="ui left rail">
            <div class="ui vertical secondary pointing menu sticky" data-context="#page__finance">
                <a class="item" data-href="page__finance_dashboard" onclick="page.show(this,'finance','dashboard');">{{ trans('crm.finance.title') }}</a>
                <a class="item" data-href="page__finance_withdrawals" onclick="page.show(this,'finance','withdrawals');">{{ trans('crm.finance.withdrawals') }}</a>
                <a class="item" data-href="page__finance_transactions" onclick="page.show(this,'finance','transactions');">{{ trans('crm.finance.transactions') }}</a>
            </div>
        </div>
        @if($subpage=='dashboard')
        <div class="page__" id="page__finance_dashboard">@include('crm.content.finance.dashboard')</div>
        @elseif($subpage=='withdrawals')
        <div class="page__" id="page__finance_withdrawals">@include('crm.content.finance.withdrawals')</div>
        @elseif($subpage=='transactions')
        <div class="page__" id="page__finance_transactions">@include('crm.content.finance.transactions')</div>
        @endif
    </div>
    @elseif($page=='options')
    <div class="ui container segment page__" id="page__options">
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
        @if($subpage=='admins')
        <div class="page__" id="page__options_admins">@include('crm.content.option.admins')</div>
        @elseif($subpage=='dashboard')
        <div class="page__" id="page__options_dashboard">
            <div class="ui header">{{ trans('crm.options.title') }}</div>
            <div class="ui segment">@include('crm.content.option.dashboard')</div>
        </div>

        @endif

    </div>
    @elseif($page=='brands')
        <div class="ui page__" id="page__brands" style="margin-left:5vw;margin-right:20vw">
            <div class="ui header">{{ trans('crm.brands.title') }}</div>
            <div class="ui segment">@include('crm.content.brands.dashboard')</div>
        </div>
    @elseif($page=='bets')
        <div class="ui container segment page__" id="page__brands">
            <div class="ui header">{{ trans('crm.bets.title') }}</div>
            <div class="ui segment">@include('crm.content.bets.dashboard')</div>
        </div>
    @endif
</div>
@endsection

<input type="hidden" name="campaign" value='{"source":"promotion"}'/>
<input type="hidden" name="admincode" value=""/>
