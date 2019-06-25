<div class="right ui rail">
    <div class="ui menu vertical byperiod sticky" data-context="#page__brands">
        <!-- <a class="ui item" onclick="crm.brands.byperiod(this,'q')">{{ trans('crm.periods.this_quarter') }}</a>
        <a class="ui item" onclick="crm.brands.byperiod(this,'2lm')">{{ trans('crm.periods.2last_month') }}</a>
        <a class="ui item" onclick="crm.brands.byperiod(this,'lm')">{{ trans('crm.periods.last_month') }}</a> -->

        <!-- <a class="ui item " onclick="crm.brands.byperiod(this,'jan')">{{ trans('crm.periods.jan') }}</a>
        <a class="ui item " onclick="crm.brands.byperiod(this,'feb')">{{ trans('crm.periods.feb') }}</a>
        <a class="ui item " onclick="crm.brands.byperiod(this,'mar')">{{ trans('crm.periods.mar') }}</a> -->
        @php($mms=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'])
        @foreach($mms as  $i=>$m)
            @if($i<intval(date("m"))-1)
                <a class="ui item" onclick="crm.brands.byperiod(this,'{{$m}}')">@lang('crm.periods.'.$m)</a>
            @endif
        @endforeach
        <a class="ui item active" onclick="crm.brands.byperiod(this,'m')">{{ trans('crm.periods.this_month') }}</a>
        <a class="ui item" onclick="crm.brands.byperiod(this,'y')">{{ trans('crm.periods.this_year') }}</a>
    </div>
</div>
<div class="loadering" data-name="finance-report-brands" data-action="/api/brand?period={crm.brands.__currentPeriod}" data-trigger="show" data-function="crm.brands.list">
    <div class="ui grid segment">
        <div class="sixteen wide column ui header center aligned">{{ trans('crm.finance.deposits') }} of <span id="brands_period" style="font-weight:100;">{{ trans('crm.periods.this_month') }}</span></div>
        <div class="eight wide column">
            <div class="ui aligned left">
                <canvas class="chart" width="160" height="160"></canvas>
            </div>
        </div>
        <div class="eight wide column">
            <table class="ui table sortable" id="brands_total">
                <thead>
                    <tr>
                        <th>{{ trans('crm.brands.title') }}</th>
                        <th>{{ trans('messages.total') }}</th>
                        <th>{{ trans('messages.amount') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div  class="ui active loader"></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="ui grid segment" id="brand_info">

    </div>
</div>
