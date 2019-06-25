<div class="ui header">{{ trans('crm.finance.transactions') }}</div>
<div class="ui form">
    <div class="ui fields">
        <div class="field">
            <div class="ui icon input">
                <input placeholder="{{ trans('messages.search') }}..." class="requester search" data-name="search" data-trigger="keyup" data-target="user-transactions"><i class="search icon"></i>
            </div>
        </div>
        <div class="field">
            <div class="ui icon labeled calendar-notime input" >
                <div class="ui label"  onclick="$(this).next().val('').change();"><i class="ui refresh icon"></i></div>
                <input type="text" class="-ui-calendar requester" data-name="date_from" placeholder="{{ trans('crm.date_from') }}" data-name="created_at" data-target="user-transactions"  data-trigger="change"/>
                <i class="calendar icon"></i>
            </div>
        </div>
        <div class="field">
            <div class="ui icon labeled calendar-notime input" >
                <div class="ui label"  onclick="$(this).next().val('').change();"><i class="ui refresh icon"></i></div>
                <input type="text" class="-ui-calendar requester" data-name="date_to" placeholder="{{ trans('crm.date_to') }}" data-name="created_at" data-target="user-transactions"  data-trigger="change"/>
                <i class="calendar icon"></i>
            </div>
        </div>
        <div class="field middle aligned center aligned">
            <div class="ui checkbox">
                <input type="checkbox" class="requester" data-name="success" data-trigger="change" data-target="user-transactions"/>
                <label>{{ trans('crm.finance.success_only') }}</label>
            </div>
        </div>
        <div class="field middle aligned center aligned">
            <div class="ui checkbox">
                <input type="checkbox" class="requester" data-name="bonus" data-trigger="change" data-target="user-transactions"/>
                <label>{{ trans('crm.finance.bonus_only') }}</label>
            </div>
        </div>
        <div class="field middle aligned center aligned">
            <div class="ui checkbox">
                <input type="checkbox" class="requester" data-name="notbonus" data-trigger="change" data-target="user-transactions"/>
                <label>{{ trans('crm.finance.deposit_only') }}</label>
            </div>
        </div>
    </div>
    <div class="ui fields">
        @can('admin')
            <div class="field">
                <div class="ui search selection dropdown loadering requester" data-id="user-managers" data-title="{{ trans('crm.allmanagers') }}" data-name="manager_id" data-action="/json/user?rights_id[0]=4&rights_id[1]=5&rights_id[2]=6&rights_id[3]=7&per_page=100" data-autostart="true" data-trigger="change" data-target="user-transactions"></div>
            </div>
        @endcan
        <div class="field">
            <div class="ui search selection dropdown loadering requester" data-id="user-offices" data-title="{{ trans('crm.offices') }}" data-name="office" data-action="/json/user/offices?per_page=100" data-autostart="true" data-target="user-transactions" data-trigger="change"></div>
        </div>
        <div class="field">
            <div class="ui search selection dropdown loadering requester" data-id="user-affilates" data-title="{{ trans('crm.allaffilates') }}" data-name="affilate_id" data-action="/json/user?rights_id[0]=2&per_page=100" data-autostart="true" data-target="user-transactions" data-trigger="change"></div>
        </div>
        <div class="field">
            <div class="ui search selection dropdown loadering requester" data-id="user-merchants" data-title="{{ trans('crm.allmerchants') }}" data-name="merchant_id" data-action="/json/merchant?enabled=0,1&per_page=100" data-autostart="true" data-target="user-transactions" data-trigger="change"></div>
        </div>
        <div class="field">
            <div class="ui search selection dropdown">
                <input type="hidden" class="requester" name="{{ trans('crm.finance.method') }}" data-name="method" data-trigger="change" data-target="user-transactions"/>
                <div class="default text">{{ trans('crm.finance.method') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="false">{{ trans('crm.finance.method') }}</div>
                    <div class="item" data-value="CreditCard"> {{ trans('crm.finance.creditcard') }}</div>
                    <div class="item" data-value="CryptoCurrency"> {{ trans('crm.finance.cryptocurrency') }}</div>
                    <div class="item" data-value="WireTransfer">{{ trans('crm.finance.wiretransfer') }}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="ui fields">
        <div class="field">
            <div class="ui search" id="transactions_user_search">
                <input class="requester" type="hidden" data-name="search_id" data-target="user-transactions" data-trigger="change"/>
                <div class="ui icon input">
                    <input class="prompt" type="text" placeholder="Customer search..."><i class="search icon"></i>
                </div>
                <div class="results"></div>
            </div>
            @push('scripts')
                <script>
                $('#transactions_user_search').search({
                    apiSettings: {
                        url: '/json/user?search={query}',
                        onResponse: function(result) {
                            var response = {
                                results: []
                            };
                            for (var i in result.data) {
                                var u = result.data[i];
                                response.results.push({
                                    id: u.id,
                                    title: u.name + ' ' + u.surname,
                                    description: '#<strong><code>' +
                                        u.id +
                                        '</code></strong> ' + u
                                        .rights.title
                                });
                            }
                            return response;
                        }
                    },
                    onSelect: function(result, response) {
                        console.log($('#transactions_user_search input[data-name=search_id]'),result.id);
                        $('#transactions_user_search input[data-name=search_id]').val(result.id).change();
                    },
                    minCharacters: 3
                })
                $('#transactions_user_search input.prompt').on('keyup',function(){
                    if($(this).val().length<3 && $('#transactions_user_search input[data-name=search_id]').val().length)
                        $('#transactions_user_search input[data-name=search_id]').val('').change();
                });
                </script>
            @endpush
        </div>
    </div>
</div>
<table class="ui attached table selectable sortable">
    <thead>
        <tr>
            <th class="one wide">{{ trans('crm.date') }}</th>
            <th class="two wide">{{ trans('crm.finance.merchant') }}</th>
            <th class="tree wide">{{ trans('crm.customers.title') }}</th>
            <th class="two wide">{{ trans('crm.customers.manager') }}</th>
            <th class="two wide">{{ trans('crm.finance.amount') }}</th>
            <th class="six wide">{{ trans('crm.finance.invoice') }}</th>
        </tr>
    </thead>
    <tbody class="loadering" data-name="user-transactions" data-action="/finance/invoice" data-autostart="true" data-need-loader="true" data-function="crm.finance.transaction"></tbody>
</table>
