<div class="ui header">{{ trans('crm.finance.withdrawals') }}</div>
<table class="ui attached padded table selectable sortable">
    <thead>
        <tr>
            <th>{{ trans('messages.date') }}</th>
            <th>{{ trans('messages.merchant') }}</th>
            <th>{{ trans('messages.customer') }}</th>
            <th>{{ trans('messages.manager') }}</th>
            <th>{{ trans('messages.status') }}</th>
            <th>{{ trans('messages.amount') }}</th>
            <th>{{ trans('messages.actions') }}</th>
        </tr>
    </thead>
    <tbody class="loadering" data-name="user-withdrawals" data-action="/json/finance/withdrawal" data-autostart="true" data-function="crm.finance.withdrawal"></tbody>
</table>
