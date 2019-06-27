<div class="ui header">{{ trans('crm.dashboard.title') }}</div>
<div class="ui menu">
    <div class="ui borderless right menu byperiod bound" data-context="#page__dashboard">
        <a class="ui item" onclick="page.dashboard.byperiod(this,'today')">{{ trans('crm.periods.today') }}</a>
        <a class="ui item active" onclick="page.dashboard.byperiod(this,'7d')">{{ trans('crm.periods.last_7_days') }}</a>
        <a class="ui item" onclick="page.dashboard.byperiod(this,'m')">{{ trans('crm.periods.this_month') }}</a>
        <a class="ui item" onclick="page.dashboard.byperiod(this,'lm')">{{ trans('crm.periods.2last_month') }}</a>
        <a class="ui item" onclick="page.dashboard.byperiod(this,'y')">{{ trans('crm.periods.this_year') }}</a>
        <a class="ui item" onclick="page.dashboard.byperiod(this,'365d')">{{ trans('crm.periods.year_ago') }}</a>
    </div>
</div>
<div class="ui stackable grid">
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
                <div class="meta" style="margin-top:1em;">
                    <span class="date">{{ trans('crm.dashboard.by_merchants') }}</span>
                </div>
            </div>
        </div>
        <div class="four wide column">
            <table class="ui single line unstackable table" id="deposit_total"></table>
            <table class="ui single line unstackable table" id="withdrawal_total"></table>
        </div>
    </div>
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
    <div class="row">
        <div class="ten wide column">
            <div class="ui segment aligned left">
                <div class="loadering" data-action="/finance/report/dashboardDealsRepo?period={page.dashboard.__currentPeriod}" data-name="dashboard-trade-report" data-autostart="true" data-function="dashboard_trades"></div>
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
        <!-- <div class="left ui rail">
            <div class="ui menu vertical byperiod bound top sticky" data-context="#page__dashboard">
                <a class="item" onclick="crm.lead.showImport();">{{ trans('crm.dashboard.import_leads') }}</a>
            </div>
        </div> -->
    @endcan
    {{-- <div class="right ui rail">
        <div class="ui menu vertical byperiod bound top sticky" data-context="#page__dashboard">
            <a class="ui item" onclick="page.dashboard.byperiod(this,'today')">{{ trans('crm.periods.today') }}</a>
            <a class="ui item active" onclick="page.dashboard.byperiod(this,'7d')">{{ trans('crm.periods.last_7_days') }}</a>
            <a class="ui item" onclick="page.dashboard.byperiod(this,'m')">{{ trans('crm.periods.this_month') }}</a>
            <a class="ui item" onclick="page.dashboard.byperiod(this,'lm')">{{ trans('crm.periods.2last_month') }}</a>
            <a class="ui item" onclick="page.dashboard.byperiod(this,'y')">{{ trans('crm.periods.this_year') }}</a>
            <a class="ui item" onclick="page.dashboard.byperiod(this,'365d')">{{ trans('crm.periods.year_ago') }}</a>
        </div>
    </div> --}}
    @include('crm.content.affilate.dashboard')
@endcan
