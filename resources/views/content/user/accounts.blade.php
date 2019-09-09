<div class="ui grid two columns">
    <div class="column">
        <div class="ui header">Accounts</div>
        <div class="ui items loadering" data-name="user-accounts" data-action="/account?user_id={{$user->id}}" data-function="crm.user.accounts" data-autostart="true"></div>
    </div>
    <div class="column">
        <div class="ui header dividing">Add Account</div>
            <div class="ui form submiter user-account" id="add_user_account_" data-action="/account" data-method="post" data-callback="crm.user.accountsTouch">
                <input type="hidden" data-name="_token" value="{{ csrf_token() }}" />
                <input type="hidden" data-name="status" value="open" />
                <input type="hidden" data-name="user_id" value="{{$user->id}}" />
                <input type="hidden" data-name="amount" value="0" />
                <div class="field">
                    <label>Type:</label>
                    <div class="ui selection dropdown">
                        <input type="hidden" data-id="type" data-name="type"/>
                        <div class="default text">Account type</div>
                            <i class="dropdown icon"></i>
                            <div class="menu">
                                <div class="item" data-value="real">Live</div>
                                <div class="item" data-value="demo">Demo</div>
                            </div>
                    </div>
                </div>
                <div class="field">
                    <label>Currency:</label>
                    <div class="ui labeled selection dropdown">
                        <input type="hidden" data-id="currency_id" data-name="currency_id"/>
                        <div class="default text">Currency</div>
                        <i class="dropdown icon"></i>
                        <div class="menu">
                            @foreach($currencies as $currency)
                            <div class="item" data-value="{{$currency->id}}">
                                <i class="ic ic_{{strtolower($currency->code)}}"></i>
                                {{$currency->name}}
                            </div>
                            @endforeach
                        </div>
                    </div>
                </div>
                <div class="ui field right aligned">
                    <button type="button" class="ui button deposit primary submit">{{ trans('crm.accounts.add') }}</button>
                </div>
            </div>

    </div>

</div>
