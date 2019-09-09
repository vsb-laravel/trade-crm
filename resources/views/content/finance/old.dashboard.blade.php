<div class="popup popup_b intrument" style="display:block;">
    <style>
        
    </style>
    <div class="close" onclick="{ $(this).parent().fadeOut( 256, function(){ $(this).remove(); } ); }"></div>
    <strong class="title">{{ trans('messages.instrument_dashboard') }}</strong>

    <div class="contenta flex info">
        <div class="item dashblock-4">
            @if(isset($row))
            <div class="inner submiter" data-action="/html/instrument/{{$row->id}}/update" data-callback="crmInstrumentInfoCallback">
                <span class="title">{{ trans('messages.instrument') }}: <b>{{ $row->from->name }}/{{ $row->to->name }}</b></span>
                <span class="text">{{ trans('messages.current') }}: <b class="loader" data-action="/json/price/{{$row->id}}" data-name="current-price" data-autostart="true" data-refresh="1000" data-function="currentPrice">{{ $price->price ?? '0' }}</b></span><br />
                <ul>
                    <li>{{ trans('messages.commission') }}: <input data-name="commission" type="text" value="{{ $row->commission ?? '0' }}"><sup>x100</sup>%</li>
                    <li>{{ trans('messages.enabled') }}: <input data-name="enabled" type="checkbox" @if($row->enabled==1) checked="checked" @endif></li>
                    <li>{{ trans('messages.multiplex') }}: <input data-name="multiplex" type="text" value="{{ $row->multiplex ?? '1' }}"></li>
                </ul>
                <button class="submit">{{ trans('messages.save') }}</button>
            </div>
            @endif
            <div class="inner chart">
                <div id="instrument_{{$row->id}}_chart" class="width" style="height:380px;">
                    <div class="chart2-panel" style="display:none;">
                        <input type="checkbox" id="sma0Show" onclick="checkForm()">Show SMA-0
                        <input type="text" id="sma0_value" value="10" style="width: 40px"><br>
                        <input type="checkbox" id="sma1Show" onclick="checkForm()">Show SMA-1
                        <input type="text" id="sma1_value" value="20" style="width: 40px"><br>
                        <input type="checkbox" id="ema2Show" onclick="checkForm()">Show EMA-2
                        <input type="text" id="ema2_value" value="50" style="width: 40px"><br>
                        <br>

                        <p><b> 4. MAC, RSI settings: </b></p>
                        <input type="checkbox" id="macdShow" onclick="checkForm()">Show MACD
                        <input type="checkbox" id="rsiShow" onclick="checkForm()">Show RSI
                        <br>

                        <p><b> 5. View settings: </b></p>
                        <select onchange="chartType(parseInt(this.value))">Point type
                            <option value="0">OHLC</option>
                            <option selected value="1">CandleStick</option>
                            <option value="2">Close</option>
                        </select>
                        <!--button onclick="chartType(0)">OHLC</button><br>
                        <button onclick="chartType(1)">CandleStick</button><br>
                        <button onclick="chartType(2)">Close</button--><br>
                        <br>
                        <button onclick="addTrendline()">Add trendline</button><br>

                        <br>
                        <button class="black_button" onclick="setBackground()">Change background</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="item dashblock">
        </div>
    </div>
</div>


<script>
    $('ul.tabs_in_dashbord li:not(.active)').on('click', function() {
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.tabs_in').find('div.tabs_in_dash').removeClass('active').eq($(this).index()).addClass('active');
    });
    // var dealChart = new Chart(document.getElementById('instrument_{{$row->id}}_chart'),{
    //     xhrInstrumentId: {{$row->id}},     // query type currency number
    //     xhrPeriodFull: 1440,    // data max period
    //     dataNum: 60,          // default zoom number of dataset in 1 screen
    //     xhrMaxInterval: 45000,  // renewal full data interval
    //     xhrMinInterval: 1000,    // ticks - min interval to update and redraw last close data
    //     btnVolume: true,       // bottom volume graph default state
    //     colorCandleBodyUp: "#f59" // example to change positive candle body
    // });

    try{
        var instrument = {!! json_encode($row,JSON_UNESCAPED_UNICODE) !!};
        // console.debug(instrument);
        // clearChart();
        var rp = createChart("#instrument_{{$row->id}}_chart", instrument );
        // console.debug( rp );
        newData.length = 0;
        sendRequest( rp );
    }
    catch(e){
        console.error('Graph error',e);
    }

    // createChart('#instrument_{{$row->id}}_chart','{{$row->title}}', '{{$row->to->code}}');
    // $.ajax({
    //     url:'/data/amcharts/histominute?limit=1440&instrument_id={{$row->id}}',
    //     data:"json",
    //     success:function(d,x,s){
    //         for(var i in d){
    //             d[i].date = new Date(d[i].date);
    //         }
    //         dataChart(d);
    //         // checkForm();
    //     }
    // });

    //    setPeriod(newData, 5);


    function currentPrice(container,d,x,s){
        var hh = d.price;
        if(d.volation>1)hh+='<span class="up">buying</span>';
        else if(d.volation<1)hh+='<span class="down">selling</span>';
        container.html(hh);
    }
    function crmInstrumentInfoCallback(){
        cf._loaders['instrument-list'].execute();
    }
    cf.reload();
</script>
