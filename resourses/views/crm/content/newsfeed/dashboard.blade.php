<div class="ui scrolling modal deals fullscreen" id="deal_{{$deal->id}}_dashboard">
    <i class="close icon" onclick="$('.ui.modal').show('close')"></i>
    <div class="header">
        <div class="ui images" style="display:inline-block;">
            <img class="ui mini image" src="{{$deal->instrument->from->image}}" style="margin-top:-10px;"/>
            <img class="ui mini image" src="{{$deal->instrument->to->image}}" style="margin-left:-10px;"/>
        </div><code>#{{$deal->id}}</code> <a href="javascript:crm.user.card({{$deal->user->id}})">{{$deal->user->name ?? ''}} {{$deal->user->surname ?? ''}}</a> {{ trans('crm.deal_dashboard') }}
    </div>
    <div class="content scrolling">
        <div class="ui grid">
            <div class="column four wide">
                <div class="ui header">{{ trans('crm.dealdata') }}</div>
                <table class="ui relaxed table">

                    <tr>
                        <td></td>
                        <td>
                            <strong>Type:</strong> {{$deal->type}}
                        </td>
                        <td class="ui right aligned">
                            @if(in_array($deal->status_id,[10,30]))
                                <div class="submiter" data-action="/deal/delete?deal_id={{$deal->id}}" data-callback="crm.deal.onClose">
                                    <input type="hidden" class="current" data-name="current_price" value="{{$deal->close_price}}" />
                                    <button class="ui icon red button right floated submit"><i class="close icon"></i>Terminate</button>
                                </div>
                            @else
                            <!-- <div class="submiter" data-action="/deal/update?deal_id={{$deal->id}}" data-callback="crm.deal.onClose">
                                <input type="hidden" class="current" data-name="status" value="10" />
                                <button class="ui icon olive button right floated submit"><i class="refresh icon"></i>Reopen</button>
                            </div> -->
                            @endif
                        </td>
                    </tr>

                    <tr>
						<td><i class="large industry middle aligned icon"></i></td>
						<td>{{ trans('messages.instruments') }}<br /><small>{{ trans('messages.Fee') }} {{ $deal->instrument->commission*100 }}%</small></td>
						<td>
                            <a onclick="crm.instrument.edit({{$deal->instrument->id}})">{{ $deal->instrument->title }}</a><br />
                            <small>{{$deal->instrument->source->name}}</small><br />
                            <small>
                            @if($deal->direction>0)
                                <i class="large arrow up middle aligned icon green"></i> BUY
                            @else
                                <i class="large arrow down middle aligned icon red"></i> SELL
                            @endif
                            </small>

                        </td>
                    </tr>
                    <tr>
                        <td><i class="large leaf middle aligned icon"></i></td>
                        <td><a class="header"></a><div class="description">{{ trans('messages.account_type') }}</div></td>
						<td class="right aligned">
                            @if($deal->account->type=='real')
                                Live account
                            @else
                                Demo account
                            @endif
                        </td>
                    </tr>
                    <tr>
						<td><i class="large calendar middle aligned icon"></i></td>
						<td><a class="header"></a><div class="description">Opened at</div></td>
						<td class="right aligned">
                            <div class="header">{{ $deal->created_at}}</div>
                        </td>
					</tr>
                    @if($deal->status_id==20)
                    <tr>
						<td><i class="large calendar middle aligned icon"></i></td>
						<td><a class="header"></a><div class="description">Closed at</div></td>
						<td class="right aligned">
                            <div class="header">{{ $deal->updated_at}}</div>
                        </td>
					</tr>
                    @endif
                    <tr>
						<td><i class="large dollar middle aligned icon"></i></td>
						<td><a class="header"></a><div class="description">{{ trans('messages.Invested') }}</div></td>
						<td class="right aligned">
                            <div class="header">{{ $deal->invested}} <small>x{{ $deal->multiplier ?? '1' }}</small></div>
                            fee: {{ $deal->fee ?? '0' }}
                        </td>
					</tr>
                    <tr>
						<td><i class="large circle middle aligned icon"></i></td>
						<td>{{ trans('messages.status') }}</td>
						<td class="right aligned">{{$deal->status->name}}</td>
					</tr>
                    @if($deal->status_id==30)
                    <tr>
						<td><i class="large circle middle aligned icon"></i></td>
						<td>{{ trans('messages.ATP') }}</td>
						<td class="right aligned">{{ $deal->open_price ?? '0' }}</td>
					</tr>
                    @else
                    <tr>
						<td><i class="large circle middle aligned icon"></i></td>
						<td>{{ trans('messages.open_price') }}</td>
						<td class="right aligned">{{ $deal->open_price ?? '0' }}</td>
					</tr>
                    @endif
                    @if($deal->status_id==20)
                    <tr>
						<td><i class="large circle middle aligned icon"></i></td>
						<td>{{ trans('messages.close_price') }}</td>
						<td class="right aligned">{{ $deal->close_price ?? '0' }}</td>
					</tr>
                    @else
                    <tr>
						<td><i class="large circle middle aligned icon"></i></td>
						<td>{{ trans('messages.current') }}</td>
						<td class="right aligned current" number="{{ $deal->close_price ?? '0' }}">{{ $deal->close_price ?? '0' }}</td>
					</tr>
                    @endif
                    <tr>
						<td><i class="large circle middle aligned icon"></i></td>
						<td>{{ trans('messages.TP') }}<br />{{ trans('messages.SL') }}</td>
						<td class="right aligned">{{ $deal->stop_high ?? '0' }}<br />{{ $deal->stop_low ?? '0' }}</td>
					</tr>
                    <tr>
						<td><i class="large dollar middle aligned icon"></i></td>
						<td><a class="header"></a><div class="description">{{ trans('messages.Profit') }}</div></td>
                        @if($deal->type=='forex')
                            <td class="right aligned">
                                <span class="forex @if($deal->status_id==10) profit @endif" number="{{ $deal->profit }}">{{ $deal->profit }}</span><br />
                                <small class="forex @if($deal->status_id==10) percent @endif" number="{{ ceil(10000*($deal->profit)/($deal->invested))/100  }}">
                                    {{ ceil(10000*($deal->profit)/($deal->invested))/100  }}%
                                </small>
                            </td>
                        @else
						<td class="right aligned">
                            <span class="@if($deal->status_id==10) profit @endif" number="{{ $deal->amount+ $deal->profit }}">{{ $deal->profit+$deal->amount }}</span><br />
                            <small class="@if($deal->status_id==10) percent @endif" number="{{ ceil(10000*($deal->profit+$deal->amount)/($deal->invested))/100  }}">
                                {{ ceil(10000*($deal->profit+$deal->amount)/($deal->invested))/100  }}%
                            </small>
                        </td>
                        @endif
					</tr>
                </table>
                <div class="ui horizontal divider">Daily swaps</div>
                <table class="ui relaxed table">
                    @foreach($deal->user->meta as $meta)
                    <tr>
                        @if( preg_match('/trade#'.$deal->id.'_swap_(\d+)/i',$meta->meta_name,$ms) )
                        <td>
                            <i class="calendar icon"></i>{{date('Y-m-d',$ms[1])}}
                        </td>
                        <td>
                            T{{ number_format($meta->meta_value,2) }}
                        </td>
                        @endif
                    </tr>
                    @endforeach
                </table>
                <div id="trade_data" style="display:none">
                    {!! json_encode($deal) !!}
                </div>
            </div>
            @if($deal->status_id==20 || $deal->multiplier <50)
                <div class="column twelve wide">
            @else
                <div class="column eight wide">
            @endif
                <div class="ui header">{{ trans('crm.dealchart') }}</div>

                <div class="loadering" data-action="/price/json/{{$deal->instrument->id}}?user_id={{$deal->user_id}}&date_from={timestamp_20minute}" data-autostart="true" @if ($deal->status_id != '20') data-refresh="60000" @endif data-function="crm.instrument.price">
                <!-- <div class="loadering" data-action="/price/json/{{$deal->instrument->id}}?user_id={{$deal->user_id}}" data-autostart="true" @if ($deal->status_id != '20') data-refresh="60000" @endif data-function="crm.instrument.price"> -->
                @if($deal->status_id==20)
                    <canvas id="chart__instrument_price" class="chart" width="640" height="280"></canvas>
                @else
                    <canvas id="chart__instrument_price" class="chart" width="640" height="480"></canvas>
                @endif
                </div>

            </div>
            @if($deal->status_id!=20  && $deal->multiplier >=50)
            <div class="column four wide">
                <div class="ui header">{{ trans('crm.dealtune') }}</div>
                <div class="ui horizontal divider">{{ trans('crm.deal.tune_corrida') }}</div>
                <div class="ui form @if($deal->status_id=='20') disabled @endif corrida">
                    <div class="field">
                        <div class="ui checkbox slider" id="riskon">
                            <input type="checkbox" data-name="riskon" value=""/>
                            <label>{{ trans('crm.deal.tuneon') }}</label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui checkbox" id="onclose">
                            <input type="checkbox" data-name="onclose" value="" disabled="disabled"/>
                            <label>{{ trans('crm.deal.onclose') }}</label>
                        </div>
                    </div>
                    <input type="hidden" data-name="high" id='risk_high' value=""/>
                    <input type="hidden" data-name="low" id="risk_low" step="1" min=1 max="10" value="1"/>
                </div>
                <div class="ui horizontal divider">Approximate values</div>
                <table class="ui table relaxed predictions">
                    <tbody>
                        <tr><td>Reach instrument price</td><td class="right aligned"><strong></strong></td></tr>
                        <tr><td>Profit</td><td class="right aligned"><strong></strong><br /><small></small></td></tr>
                        <tr><td>Duration</td><td class="right aligned"></td></tr>
                    </tbody>
                </table>
                <div class="field right floated">
                    <button class="ui button basic primary corida-set-button" onclick="crm.deal.corida.data()">Set</button>
                </div>
            </div>
            @endif
        </div>
    </div>
    <div class="actions">
        <div class="ui black deny button">
            {{ trans('messages.close') }}
        </div>
        <div class="ui positive right labeled icon button okclose">
            Ok
            <i class="checkmark icon"></i>
        </div>
    </div>
</div>
<script>
    $('#riskon').on('change', function() {
        console.debug('riskon changed');
        // $('.corida-set-button').removeClass('basic');
        if($('#riskon').checkbox('is checked')){
            $('#smoothing,#risk_high,#risk_low').closest('.ui.input').removeClass('disabled');
            $('#risk_high:not(.initialized)').val(parseFloat(deal.open_price)).addClass('initialized');
            setMaxOfRange();
        }
        else{
            $('#smoothing,#risk_high,#risk_low').closest('.ui.input').addClass('disabled');
            skymechanics.__charts['pair_chart'].removeSupports();
        }
    });
    function setMaxOfRange(){
        // var val = parseFloat($('#risk_high').val()),min = parseFloat($('#risk_low').val());
        // min = (min)?min:1;
        // min = val*min/100;
        // skymechanics.__charts['pair_chart'].setLine(val,min,crm.deal.corida.render);
        // return;
    }

    // $('.corida-set-button:not(.assigned)').on('click',function(){$(this).addClass('basic');}).addClass('.assigned')
    var deal = {!!json_encode($deal, JSON_UNESCAPED_UNICODE) !!};
    crm.deal.current = deal;
    // $('.corrida input').on('change blur keyup',function(){
    //     var open = parseFloat(deal.close_price),duration = 0,$level = $(this).parents('.corrida').find('#risk_high'),
    //         $aprox = $(this).parents('.modal').find('.predictions tbody'),
    //         // level = $('.corrida input[data-name=high]').val();
    //         level = parseFloat($level.val());
    //     if(isNaN(level) || isNaN(open))return;
    //     res = crm.deal.calculate(deal,level);
    //     duration = parseInt(Math.abs(1 - open/level)/0.0004);
    //     // console.debug($aprox,level,open,res,duration);
    //     $aprox.find('tr:eq(1) td:eq(1) strong')
    //         .animateNumber({number:res.profit,numberStep:function(now,tween){$(tween.elem).html(now.currency('T'));}}).prop('number', res.profit);
    //     $aprox.find('tr:eq(1) td:eq(1) small')//.html(res.percent.toFixed(2)+'%');
    //         .animateNumber({number:res.percent,numberStep:function(now,tween){$(tween.elem).html(now.currency('')+'%');}}).prop('number', res.percent);
    //     $aprox.find('tr:eq(2) td:eq(1)')//.html(duration+'s');
    //         .animateNumber({number:duration,numberStep:function(now,tween){$(tween.elem).html(now+'<code>s</code>');}}).prop('number', duration);
    // });




    function currentPrice(container, d, x, s) {
        container.html(d.price);
    }
    function currentProfit(container, d, x, s) {
        container.html(d.data[0].profit);
    }
    function currentTune(container, d, x, s) {
        if (typeof(d.meta_value != "undefined")) {
            container.val(d.meta_value);
            if (d.meta_value != undefined) crm.deal.tune.raw = JSON.parse(d.meta_value);
        }
    }
    page.modal("#deal_{{$deal->id}}_dashboard");
    var onceLoaded = false;
    $(document).on('skymechanics:chartLoaded',function(e,uid){
        if(!onceLoaded){
            onceLoaded = true;
            crm.deal.corida.read();
        }
    });

</script>
