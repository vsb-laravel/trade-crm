<!-- <div class="ui modal fullscreen" id="pair_{{$row->id}}_dashboard"> -->
    <i class="close icon" onclick="$('.ui.modal').show('close')"></i>
    <div class="header">
        <i class="icon industry"></i><code>#{{$row->id}}</code> {{$row->title}}
    </div>
    <div class="content scrolling">
        <div class="ui stackable grid">
            <div class="column four wide">
                <div class="ui images">
                    <img class="ui mini image" src="{{$row->from->image}}" />
                    <img class="ui mini image" src="{{$row->to->image}}" />
                </div>
                <div class="ui form submiter globe" data-action="/instrument/{{$row->id}}" data-method="put" data-callback="crm.instrument.touch">
                    <input type="hidden" data-name="_token" value="{{ csrf_token() }}" />
                    <div class="field">
                        <div class="ui checkbox slider">
                            <input type="checkbox" data-name="enabled" @if($row->enabled=='1') checked @endif/>
                            <label>{{ trans('crm.instruments.enabled') }}</label>
                        </div>
                    </div>
                    <div class="field">
                        <label>Symbol</label>
                        <div class="ui input">
                            <input data-name="symbol" type="text" value="{{ $row->symbol ?? '0' }}">
                        </div>
                    </div>
                    <div class="field">
                        <label>Type</label>
                        <select class="ui search dropdown" data-name="type">
                            <option value="default" @if($row->type=="default") selected="selected" @endif>Default</option>
                            <option value="fiat" @if($row->type=="fiat") selected="selected" @endif>Fiat</option>
                            <option value="crypto" @if($row->type=="crypto") selected="selected" @endif>Crypto</option>
                            <option value="equities" @if($row->type=="equities") selected="selected" @endif>Equities</option>
                            <option value="commodities" @if($row->type=="commodities") selected="selected" @endif>Commodities</option>
                            <option value="indices" @if($row->type=="indices") selected="selected" @endif>Indices</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>{{ trans('crm.instruments.fee') }}</label>
                        <div class="ui right labeled input">
                            <input data-name="commission" type="text" value="{{ $row->commission ?? '0' }}">
                            <div class="ui basic label">x100 %</div>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{ trans('crm.instruments.multiplex') }}</label>
                        <div class="ui right labeled input">
                            <input data-name="multiplex" type="text" value="{{ $row->multiplex ?? '0' }}">
                            <div class="ui basic label">x</div>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{ trans('crm.instruments.source') }}</label>
                        @can('superadmin')
                            <select class="ui dropdown" data-name="source_id">
                                @foreach($sources as $source)
                                <option value="{{$source->id}}"
                                    @if($source->id == $row->source->id )
                                        selected="selected"
                                    @endif
                                    >
                                    {{$source->name}}
                                </option>
                                @endforeach
                            </select>
                        @else
                            <div class="ui input">
                                <input type="text" readonly="readonly" value="{{$row->source->name}}" />
                            </div>
                        @endcan
                    </div>

                    <!-- <div class="field"><label>{{ trans('crm.instruments.Grouping') }}</label><div class="ui input"><input data-name="grouping" type="text" value="{{ $row->grouping ?? '0' }}"></div></div> -->

                    <div class="field"><label>{{ trans('crm.instruments.lot') }}</label><div class="ui input"><input data-name="lot" type="number" value="{{ $row->lot ?? 1 }}"></div></div>
                    <div class="field"><label>{{ trans('crm.instruments.pips') }}</label><div class="ui input"><input data-name="pips" type="number" value="{{ $row->pips ?? 1 }}"></div></div>
                    <div class="field"><label>{{ trans('crm.instruments.spread_buy') }}</label><div class="ui icon input"><input data-name="spread_buy" type="number" value="{{ $row->spread_buy ?? '0' }}"><i class="percent icon"></i></div></div>
                    <div class="field"><label>{{ trans('crm.instruments.spread_sell') }}</label><div class="ui icon input"><input data-name="spread_sell" type="number" value="{{ $row->spread_sell ?? '0' }}"><i class="percent icon"></i></div></div>

                    <div class="field"><label>{{ trans('crm.instruments.swap') }}</label><div class="ui input"><input data-name="dayswap" type="number" value="{{ $row->dayswap ?? '0' }}"></div></div>
                    <div class="field">
                        <label>{{ trans('crm.instruments.Ordering') }}</label>
                        <div class="ui input">
                            <input data-name="ordering" type="text" value="{{ $row->ordering ?? '0' }}">
                        </div>
                    </div>
                    <input type="hidden" class="submit"/>
                </div>
            </div>
            <div class="column twelve wide">
                <div class="loadering" data-action="/price/json/{{$row->id}}?date_from={timestamp_10minute}&date_to={timestamp_now}" data-autostart="true" data-refresh="0" data-function="crm.instrument.price">
                    <canvas id="chart__instrument_price" class="chart" width="640"></canvas>
                </div>

                <!-- <div class="inner chart">
                    <div id="instrument_{{$row->id}}_chart" class="width" style="height:380px;"></div>
                </div>
                <div class="inner submiter risk-manage" data-action="/json/instrument/{{$row->id}}/update" data-callback="">
                    <input type="hidden" id="riskon" data-name="riskon" value="{{$row->riskon ?? 0}}" />

                    <a href="#" onclick="toogleRisk(this)" class="switch-onoff">
                        @if($row->riskon == "1")
                            Risk OFF
                        @else
                            Risk ON
                        @endif
                    </a><br />
                    <label>High</label><input type="number" data-name="high" id='risk_high' value="{{$row->high ?? ''}}"/><br />
                    <label>Low</label><input type="number" data-name="low" id="risk_low" value="{{$row->low}}"/><br />
                    <button class="submit">Save</button>
                </div> -->
            </div>
        </div>
    </div>
    <div class="actions">
        <div class="ui black deny button">
            {{ trans('crm.close') }}
        </div>
        <div class="ui positive right labeled icon button okclose">
            Ok
            <i class="checkmark icon"></i>
        </div>
    </div>
<!-- </div> -->
<script>
var defaults ={
    min:{{$histo->low ?? '0'}},
    max:{{$histo->high ?? '0'}}
};
function currentPrice(container,d,x,s){
    var hh = d.price;
    if(d.volation>1)hh+='<span class="up">buying</span>';
    else if(d.volation<1)hh+='<span class="down">selling</span>';
    container.html(hh);
}

function toogleRisk(t){
    var v = parseInt($('#riskon').val());
    v=(v==1)?0:1;
    if(v == 1){
        setRiskSupport();
        $(t).text('Risk ON').addClass('active');
        $('#riskon').val(0);
    }
    else {
        delete_indicators();
        $(t).text('Risk OFF').removeClass('active');
        $('#riskon').val(0);
    }

}
function setRiskSupport(){
    var max = $('#risk_high').val(),min=$('#risk_low').val();
    SetSupportLine(max,min);
}
$('ul.tabs_in_dashbord li:not(.active)').on('click', function() {
    $(this)
        .addClass('active').siblings().removeClass('active')
        .closest('div.tabs_in').find('div.tabs_in_dash').removeClass('active').eq($(this).index()).addClass('active');
});
$('#risk_high,#risk_low').on('change keyup',function(){
    @if($row["riskon"] == "1")
        AddSupportLine(defaults.max,defaults.min);
    @endif
});
</script>
