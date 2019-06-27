<div class="ui header">{{ trans('crm.finance.transactions') }}</div>
<table class="ui attached padded table selectable sortable">
    <thead>
        <tr>
            <th>{{ trans('messages.date') }}</th>
            <th>{{ trans('messages.merchant') }}</th>
            <th>{{ trans('messages.customer') }}</th>
            <th>{{ trans('messages.manager') }}</th>
            <th>{{ trans('messages.method') }}</th>
            <th>{{ trans('messages.amount') }}</th>
            <th>{{ trans('messages.invoice') }}</th>
        </tr>
    </thead>
    <tbody class="loadering" data-name="user-transactions" data-action="/finance/invoice" data-autostart="true" data-function="crm.finance.transaction"></tbody>
</table>
