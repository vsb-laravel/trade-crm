<div class="ui stackable grid two columns">
    <div class="column">
        <div class="ui header">Finance </div>
        @if(isset($totals) && count($totals))
                <div class="ui horizontal divider">{{ trans('crm.user.totals') }}</div>
                <table class="ui stacked padded table user-deposits">
                    <tbody>
                        @foreach($totals as $tot=>$val)
                        <tr>
                            <th class="four wide">
                                @lang('crm.user.'.$tot)
                            </th>
                            <th class="ui header right aligned" id="user-total-{{$tot}}" data-number="{{$val}}" data-value="{{$val}}">
                                {{ number_format($val,2,'.',' ') }}
                            </th>
                        </tr>
                        @endforeach
                    </tbody>
                </table>

        @endif
    </div>
    <div class="column">
        @can('do.deposit')
            @if(count($user->accounts))
            <div class="ui form submiter user-account" data-action="/transaction/add" data-callback="crm.user.deposited">
                <div class="ui header dividing">Make transaction on <b>Live</b> account</div>
                    <input type="hidden" data-name="currency" value="USD"/>
                    <input type="hidden" data-name="user_id" value="{{$user->id}}"/>
                    <div class="field">
                        <label>Account:</label>
                        @php($first = true)
                        @php($countReal = 0)
                        <div class="ui selection dropdown">
                            @foreach($user->accounts as $account)
                                @if($account->type == 'real')
                                    @php($countReal++)
                                    @if($first)
                                        @php($first=false)
                                        <input type="hidden" data-id="account_id" data-name="account_id" value="{{$account->id}}"/>
                                        <div class="default text">{{$account->currency->name}}</div>
                                        <i class="dropdown icon"></i>
                                        <div class="menu">
                                    @endif
                                    <div class="item" data-value="{{$account->id}}">
                                        <span class="text">{{$account->currency->name}}</span>
                                        <span class="description"><i class="ui icon ic ic_{{strtolower($account->currency->code)}}"></i></span>
                                    </div>
                                @endif
                            @endforeach
                            @if($countReal)
                            </div>
                            @endif
                        </div>
                    </div>
                    <div class="field">
                        <label>Transaction type:</label>
                        <div class="ui selection dropdown">
                            <input type="hidden" data-id="type" data-name="type" value="deposit"/>
                            <div class="default text">Deposit</div>
                            <i class="dropdown icon"></i>
                            <div class="menu">
                                <div class="item" data-value="deposit">
                                    <span class="text">Deposit</span>
                                    <span class="description">fund account</span>
                                </div>
                                @can('chief')
                                    <div class="item" data-value="debit">
                                        <span class="text">Return</span>
                                        <span class="description">refund account</span>
                                    </div>
                                    <div class="item" data-value="credit">
                                        <span class="text">Credit</span>
                                        <span class="description">withdraw</span>
                                    </div>
                                @endcan
                            </div>
                        </div>
                    </div>
                    <div class="ui two fields">
                        <div class="field">
                            <label>Merchant:</label>
                            <div class="ui selection dropdown">
                                <input type="hidden" data-id="merchants" data-name="merchant_id" value="1"/>
                                <div class="default text"></div>
                                <i class="dropdown icon"></i>
                                <div class="menu">
                                    @foreach(App\Merchant::all() as $merchant)
                                        <div class="item" data-value="{{$merchant->id}}">
                                            <span class="text">{{$merchant->title}}</span>
                                            <span class="description">{{$merchant->name}}</span>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                            <!-- <div class="loadering ui selection dropdown" data-id="merchants" data-title="Merchant" data-name="merchant_id" data-action="/json/merchant?enabled=1,2" data-autostart="true"></div> -->
                        </div>
                        <div class="field">
                            <label>Method:</label>
                            <div class="ui selection dropdown">
                                <input type="hidden" name="Method" data-name="method"/>
                                <div class="default text">Method</div>
                                <i class="dropdown icon"></i>
                                <div class="menu">
                                    <div class="item" data-value="false">Method</div>
                                    <div class="item" data-value="CreditCard"> {{ trans('messages.creditcard') }}</div>
                                    <div class="item" data-value="CryptoCurrency"> {{ trans('messages.CryptoCurrency') }}</div>
                                    <!-- <div class="item" data-value="YandexMoney"> {{ trans('messages.yandexmoney') }}</div> -->
                                    <div class="item" data-value="WireTransfer">WireTransfer</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>Amount:</label>
                        <div class="ui input">
                            <input type="number" data-name="amount" min="0" step="0.01"/>
                        </div>
                    </div>
                    <div class="ui field right aligned">
                        <button type="button" class="ui button deposit primary submit">{{ trans('messages.make') }}</button>
                    </div>
                </div>
            @endif
        @endcan
    </div>
</div>
<div class="ui horizontal divider">{{ trans('messages.transactions') }}</div>
<div class="ui attached form">
    <div class="fields">
        <div class="field">
            <div class="ui search selection dropdown">
                <input type="hidden" class="requester" data-id="merchants" data-name="merchant_id" data-trigger="change" data-target="user-finance-{{$user->id}}" />
                <div class="default text">Merchants</div>
                <i class="ui dropdown icon"></i>
                <div class="menu">
                    @foreach(App\Merchant::all() as $merchant)
                        <div class="item" data-value="{{$merchant->id}}">
                            <span class="text">{{ $merchant->title }}</span>
                            <span class="description">{{ $merchant->name }}</span>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
        <div class="field">
            <select class="ui dropdown requester" data-id="status" data-title="Status" data-name="status" data-trigger="change" data-target="user-finance-{{$user->id}}">
                <option value="false" selected>All</option>
                <option value="success">Success</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
            </select>
        </div>
    </div>
</div>
<table class="ui attached padded table">
    <tbody class="loadering" data-name="user-finance-{{$user->id}}" data-action="/finance/report/userTransactions?user_id={{$user->id}}" data-function="crm.user.transaction" data-autostart="true"></tbody>
</table>
