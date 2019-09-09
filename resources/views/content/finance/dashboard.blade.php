<div class="ui menu secondary byperiod" data-context="#page__finance_dashboard">
    <a class="ui item" onclick="crm.finance.byperiod(this,'today')">{{ trans('crm.periods.today') }}</a>
    <a class="ui item" onclick="crm.finance.byperiod(this,'7d')">{{ trans('crm.periods.last_7_days') }}</a>
    <a class="ui item active" onclick="crm.finance.byperiod(this,'m')">{{ trans('crm.periods.this_month') }}</a>
    <a class="ui item" onclick="crm.finance.byperiod(this,'y')">{{ trans('crm.periods.this_year') }}</a>
</div>

@can('export')
<div class="ui segment">
    <div class="ui header">{{ trans('crm.finance.export') }}</div>
    <form class="ui form" action="/finance/export">
        <div class="fields">
            <div class="four wide field">
                <label>{{ trans('crm.finance.date_from') }}</label>
                <div class="ui icon input">
                    <input class="" name="date_from" data-name="date_from" type="date">
                    <i class="calendar icon"></i>
                </div>
            </div>
            <div class="four wide field">
                <label>{{ trans('crm.finance.date_to') }}</label>
                <div class="ui icon input">
                    <input class="" name="date_to" data-name="date_to" type="date">
                    <i class="calendar icon"></i>
                </div>
            </div>
            <!-- <div class="four wide field">
                <label>{{ trans('crm.finance.office') }}</label>
                <div class="ui selection dropdown loadering" name="office" data-name="office" data-title="Office" data-action="/json/user/offices" data-autostart="true"></div>
            </div> -->

            <div class="eight wide field">
                <label>&nbsp;</label>
                <button class="ui icon olive button right floated">
                    <i class="file excel outline icon"></i>
                    {{ trans('crm.finance.export_button') }}
                </button>
            </div>

        </div>
    </form>

</div>
@endcan
<div class="loadering" data-name="finance-report-r" data-action="/finance/report/depositReport?period={crm.finance.__currentPeriod}" data-autostart="true" data-function="crm.finance.merchants">
    <div class="ui grid segment">
        <div class="sixteen wide column ui header">{{ trans('crm.finance.deposits') }}</div>
        <div class="six wide column">
            <div class="ui aligned left">
                <div class="meta">
                    <span class="date today hidden">{{ trans('crm.periods.today') }}</span>
                    <span class="date 7d">{{ trans('crm.periods.last_7_days') }}</span>
                    <span class="date m hidden">{{ trans('crm.periods.this_month') }}</span>
                    <span class="date y hidden">{{ trans('crm.periods.this_year') }}</span>
                </div>
                <canvas class="chart" width="160" height="160"></canvas>
                <div class="ui header">{{ trans('crm.finance.bydate') }}</div>

            </div>
        </div>
        <div class="six wide column">
            <div class="ui aligned left">
                <div class="meta">
                    <span class="date today hidden">{{ trans('crm.periods.today') }}</span>
                    <span class="date 7d">{{ trans('crm.periods.last_7_days') }}</span>
                    <span class="date m hidden">{{ trans('crm.periods.this_month') }}</span>
                    <span class="date y hidden">{{ trans('crm.periods.this_year') }}</span>
                </div>
                <canvas class="chart" width="240" height="160"></canvas>
                <div class="ui header">{{ trans('crm.finance.by_merchant') }}</div>
            </div>
        </div>
        <div class="four wide column">
            <div class="meta">
                <span class="date today hidden hidden">{{ trans('crm.periods.today') }}</span>
                <span class="date 7d">{{ trans('crm.periods.last_7_days') }}</span>
                <span class="date m hidden">{{ trans('crm.periods.this_month') }}</span>
                <span class="date y hidden">{{ trans('crm.periods.this_year') }}</span>
            </div>
            <table class="ui table collapsing sortable" id="deposit_total">
                <thead>
                    <tr>
                        <th>{{ trans('crm.finance.office') }}</th>
                        <th>{{ trans('crm.finance.total') }}</th>
                        <th>{{ trans('crm.finance.amount') }}</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <div class="ui header">{{ trans('crm.finance.by_office') }}</div>
        </div>
    </div>
</div>
<div class="loadering" data-name="finance-report-d" data-action="/finance/report/deposits?period={crm.finance.__currentPeriod}" data-autostart="true" data-function="crm.finance.deposits">
    <div class="ui grid segment">
        <div class="sixteen wide column ui header">{{ trans('crm.finance.KPI') }}</div>
        <div class="eight wide column">
            <div class="ui aligned left">
                <canvas class="chart" width="160" height="160"></canvas>
                <div class="ui header">{{ trans('crm.finance.by_office') }}</div>
            </div>
        </div>
        <div class="eight wide column">
            <table class="ui table collapsing sortable">
                <thead>
                    <tr>
                        <th>{{ trans('crm.finance.manager') }}</th>
                        <th>{{ trans('crm.finance.office') }}</th>
                        <!-- <th>{{ trans('crm.finance.process') }}</th> -->
                        <th>{{ trans('crm.finance.declined') }}</th>
                        <th>{{ trans('crm.finance.approved') }}</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</div>
@ifmodule('bets')
@else
<div class="loadering" data-name="finance-report-w" data-action="/finance/report/withdrawalRepo?period={crm.finance.__currentPeriod}" data-autostart="true" data-function="crm.finance.withdrawals">
    <div class="ui grid segment">
        <div class="sixteen wide column ui header">{{ trans('crm.dashboard.withdrawals') }}</div>
        <div class="six wide column">
            <div class="ui aligned left">
                <canvas class="chart" width="160" height="160"></canvas>
                <div class="ui header">{{ trans('crm.dashboard.bydate') }}</div>
                <div class="meta">
                    <span class="date">{{ trans('crm.periods.last_7_days') }}</span>
                </div>
            </div>
        </div>
        <div class="six wide column">
            <div class="ui aligned left">
                <canvas class="chart" width="240" height="160"></canvas>
                <div class="ui header">{{ trans('crm.finance.by_status') }}</div>
                <div class="meta">
                    <span class="date">{{ trans('crm.periods.last_7_days') }}</span>
                </div>
            </div>
        </div>
        <div class="four wide column">
            <table class="ui table collapsing sortable" id="withdrawals_total">
                <thead>
                    <tr>
                        <th>{{ trans('crm.finance.office') }}</th>
                        <th>{{ trans('crm.finance.total') }}</th>
                        <th>{{ trans('crm.finance.amount') }}</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</div>
@endifmodule
