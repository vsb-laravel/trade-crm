<div class="ui header">{{ trans('crm.dashboard.prices') }}<div class="ui right floated basic label" id="tick_counter"></div></div>
<div class="ui top attached form prices-form">
    <div class="fields">
        <div class="field">
            <div class="ui icon input">
                <input type="text" class="" name="search" id="search" placeholder="Search by symbol"/>
            </div>
        </div>
        <div class="field">
            <div class="ui selection search multiple dropdown">
                <input type="hidden" class="" name="pair" id="pair"/>
                <div class="default text">{{ trans('messages.instruments') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    @foreach($instruments as $pair)
                    <div class="item" data-value="{{$pair->id}}">
                        {{$pair->title}}
                        <small><div class="description">{{$pair->source->name}}</div></small>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
        <div class="field">
            <div class="ui selection search multiple dropdown">
                <input type="hidden" class="" name="type" id="type"/>
                <div class="default text">{{ trans('crm.pair.type') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="crypto">Crypto</div>
                    <div class="item" data-value="fiat">Fiat</div>
                    <div class="item" data-value="equities">Equities</div>
                    <div class="item" data-value="commodities">Commodities</div>
                    <div class="item" data-value="indices">Indices</div>
                    <div class="item" data-value="default">Default</div>

                </div>
            </div>
        </div>
        <div class="field">
            <div class="ui selection search multiple dropdown">
                <input type="hidden" class="" name="source" id="source"/>
                <div class="default text">{{ trans('crm.source.title') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    @foreach($sources as $source)
                    <div class="item" data-value="{{$source->id}}">
                        {{$source->name}}
                        <small><div class="description">{{$source->url}}</div></small>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
        <div class="field">
            <div class="ui selection search dropdown">
                <input type="hidden" class="" name="count" id="count" value="20"/>
                <div class="default text">20</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item">20</div>
                    <div class="item">30</div>
                    <div class="item">40</div>
                    <div class="item">50</div>
                    <div class="item">100</div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="ui relaxed bottom attached list" id="prices">
</div>
