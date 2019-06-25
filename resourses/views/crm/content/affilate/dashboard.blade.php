<div class="ui header">{{ trans('crm.dashboard.customers') }}</div>
<div class="ui grid loadering" id="affilate_report_a" data-name="affilate-report-a" data-action="/finance/report/affilateReport?period={page.dashboard.__currentPeriod}" data-autostart="true" data-function="crm.affilate.dashboard" data-refresh="60000">

    <div class="eight wide column">
        <canvas id="chart__affilate_bycountry"></canvas>
        <div class="ui header">{{ trans('crm.dashboard.bycountry') }}</div>
        <div class="meta">
            <span class="date">{{ trans('crm.dashboard.for_last_7_days') }}</span>
        </div>
    </div>
    <div class="eight wide column">
        <canvas id="chart__affilate_date"></canvas>
        <div class="ui header">{{ trans('crm.dashboard.bydays') }}</div>
        <div class="meta">
            <span class="date">{{ trans('crm.dashboard.for_last_7_days') }}</span>
        </div>
    </div>
</div>
<div class="ui grid">
    <div class="sixteen wide column">
        <div class="ui header">{{ trans('crm.dashboard.customers') }}</div>
        <div class="ui form attached">
            <div class="fields">
                <div class="six wide field">
                    <div class="ui icon input">
                        <input placeholder="{{ trans('crm.dashboard.search') }}..." class="requester search" data-name="search" data-trigger="keyup" data-target="affilate-user-list"><i class="search icon"></i>
                    </div>
                </div>
                <div class="field">
                    <div class="ui search selection dropdown loadering requester" data-name="country" data-title="Country" data-action="/json/user/countries" data-autostart="true" data-trigger="change" data-target="affilate-user-list"></div>
                </div>
                <div class="field">
                    <div class="ui search selection dropdown">
                        <input type="hidden" class="requester" name="{{ trans('crm.dashboard.status') }}" data-name="status_id" data-trigger="change" data-target="affilate-user-list"/>
                        <div class="default text">{{ trans('crm.customers.status') }}</div>
                        <i class="dropdown icon"></i>
                        <div class="menu">
                            <div class="item" data-value="false">{{ trans('crm.customers.status') }}</div>
                            @foreach($statuses["user"] as $row)
                                <div class="item" data-value="{{$row->id}}">{{$row->title}}</div>
                            @endforeach
                        </div>
                    </div>
                </div>
                <div class="field">
                    <form class="ui form" action="/export/affilate">
                        <div class="field">
                            <button type="submit" class="ui icon olive button right floated">
                                <i class="file excel outline icon"></i>
                                {{ trans('crm.finance.export_button') }}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
        <div class="ui horizontal divider">{{ trans('crm.dashboard.list') }}</div>
        <table class="ui attached table selectable sortable" id="users">
            <thead>
                <tr>
                    <th>{{ trans('crm.customers.registered') }}</th>
                    <th class="four wide">{{ trans('crm.customers.name') }}</th>
                    <th class="two wide">{{ trans('crm.customers.status') }}</th>
                    <th class="two wide">{{ trans('crm.customers.deposit') }}</th>
                    <th class="six wide">{{ trans('crm.customers.comment') }}</th>

                </tr>
            </thead>
            <tbody id="affilate_user_list" data-name="affilate-user-list" class="loadering" data-action="/json/user?affilate_id={{Auth::id()}}" data-function="crm.affilate.list" data-autostart="true"></tbody>
        </table>
    </div>
</div>
