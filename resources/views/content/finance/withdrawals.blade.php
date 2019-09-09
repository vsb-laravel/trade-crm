<div class="ui header">{{ trans('crm.finance.withdrawals') }}</div>
<div class="ui form">
    <div class="ui fields five wide">
        <div class="field four wide">
            <div class="ui icon input">
                <input placeholder="{{ trans('messages.search') }}..." class="requester search" data-name="search" data-trigger="keyup" data-target="user-withdrawals"><i class="search icon"></i>
            </div>
        </div>
        @can('admin')
            <div class="field">
                <div class="ui search selection dropdown loadering requester" data-id="user-managers" data-title="All managers" data-name="manager_id" data-action="/json/user?rights_id[0]=4&rights_id[1]=5&rights_id[2]=6&rights_id[3]=7&per_page=100" data-autostart="true" data-trigger="change" data-target="user-withdrawals"></div>
            </div>
        @endcan
        <div class="field">
            <div class="ui search selection dropdown loadering requester" data-id="user-affilates" data-title="All affilates" data-name="affilate_id" data-action="/json/user?rights_id[0]=2&per_page=100" data-autostart="true" data-target="user-withdrawals" data-trigger="change"></div>
        </div>
        <div class="field">
            <div class="ui search selection dropdown">
                <input type="hidden" class="requester" name="{{ trans('crm.finance.status') }}" data-name="status" data-trigger="change" data-target="user-withdrawals"/>
                <div class="default text">{{ trans('crm.finance.status') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="false">{{ trans('crm.finance.status') }}</div>
                    <div class="item" data-value="request">{{ trans('crm.finance.withdrawal_request') }}</div>
                    <div class="item" data-value="approved">{{ trans('crm.finance.approved') }}</div>
                    <div class="item" data-value="declined"> {{ trans('crm.finance.declined') }}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="ui fields">
        <div class="field">
            <div class="ui icon labeled calendar-notime input" >
                <div class="ui label"  onclick="$(this).next().val('').change();"><i class="ui refresh icon"></i></div>
                <input type="text" class="-ui-calendar requester" data-name="date_from" placeholder="Date from" data-name="created_at" data-target="user-withdrawals"  data-trigger="change"/>
                <i class="calendar icon"></i>
            </div>
        </div>
        <div class="field">
            <div class="ui icon labeled calendar-notime input" >
                <div class="ui label"  onclick="$(this).next().val('').change();"><i class="ui refresh icon"></i></div>
                <input type="text" class="-ui-calendar requester" data-name="date_to" placeholder="Date to" data-name="created_at" data-target="user-withdrawals"  data-trigger="change"/>
                <i class="calendar icon"></i>
            </div>
        </div>
    </div>
</div>
<table class="ui attached table selectable sortable">
    <thead>
        <tr>

            <th class="two wide">{{ trans('crm.date') }}</th>
            <th class="four wide">{{ trans('crm.customers.title') }}</th>
            <th class="two wide">{{ trans('crm.table.status') }}</th>
            <th class="tree wide">{{ trans('crm.amount') }}</th>
            <th>{{ trans('crm.actions.title') }}</th>
        </tr>
    </thead>
    <tbody class="loadering" data-name="user-withdrawals" data-action="/json/finance/withdrawal" data-autostart="true" data-need-loader="true" data-function="crm.finance.withdrawal"></tbody>
</table>
