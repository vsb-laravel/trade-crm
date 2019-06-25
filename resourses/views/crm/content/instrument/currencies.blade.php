<div class="ui header">{{ trans('crm.currencies.title') }}</div>
<table class="ui table padded attached">
    <tbody>
        @foreach($currencies as $currency)
        <tr>
            <td class="two wide">
                #{{$currency->id}}
                <strong>{{$currency->name}}</strong>
            </td>
            <td class="two wide center aligned">
                <a class="ui huge basic circular label">{{$currency->code}}</a>
            </td>
            <td class="two wide center aligned">
                <i class="ic ic_{{ strtolower($currency->code) }}"></i>
            </td>
            <td class="ten wide center aligned">
                @can('admin')
                <br />
                <div class="ui form submiter" data-action="/currency/{{$currency->id}}/update" data-callback="crm.instrument.currency.update">
                    <div class=" fields">
                        <div class="ui field left aligned">
                            <label for="reserve">Name</label>
                            <div class="ui input">
                                <input type="text" placeholder="Name" data-name="name" value="{{$currency->name ?? ''}}">
                            </div>
                        </div>
                        <div class="ui field left aligned">
                            <label for="reserve">Reserve</label>
                            <div class="ui input">
                                <input type="number" placeholder="Reserve..." data-name="reserve" value="{{$currency->reserve ?? 0}}">
                            </div>
                        </div>
                        <div class="field">
                            <label>&nbsp;</label>
                            <button class="ui button basic submit">Change</button>
                        </div>
                    </div>
                </div>
                @endcan
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
<!--
BTC/USD
LTC/USD
ETH/USD

LTC/BTC
ETH/BTC
LTC/ETH
 -->
