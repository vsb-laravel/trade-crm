<div class="ui header">{{ trans('crm.instruments.title') }}</div>
<div class="ui form">
    <div class="fields">
        <div class="four wide field">
            <div class="ui icon input">
                <input placeholder="{{ trans('messages.search') }}..." class="requester search" data-name="search" data-trigger="keyup paste" data-target="instrument-list"><i class="search icon"></i>
            </div>
        </div>
        <div class="field">
            <div class="ui checkbox">
                <input type="checkbox" class="requester" data-name="all" data-trigger="change" data-target="instrument-list"/>
                <label>{{ trans('crm.all') }}</label>
            </div>
        </div>
        <div class="field">
            <div class="ui selection dropdown search multiple requester loadering" data-action="/currency" data-title="Currency" data-autostart="true" data-name="currency_id" data-trigger="change" data-target="instrument-list"></div>
        </div>
        <div class="field">
            <div class="ui selection search multiple dropdown">
                <input type="hidden" class="requester" name="source_id" data-name="source_id" data-trigger="change" data-target="instrument-list"/>
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
            <div class="ui selection search multiple dropdown">
                <input type="hidden" class="requester" name="type" data-name="type" data-trigger="change" data-target="instrument-list"/>
                <div class="default text">{{ trans('crm.instruments.type') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">

                    <div class="item" data-value="default">Default</div>
                    <div class="item" data-value="fiat">Fiat</div>
                    <div class="item" data-value="crypto">Crypto</div>
                    <div class="item" data-value="equities">Equities</div>
                    <div class="item" data-value="commodities">Commodities</div>
                    <div class="item" data-value="indices">Indices</div>
                </div>
            </div>
        </div>
    <!-- </div>
    <div class="fields floated right"> -->
        <div class="field">
            <button onclick="crm.instrument.add()" class="icon ui primary button"><i class="icon plus"></i>{{ trans('crm.add') }}</button>
        </div>
    </div>
</div>
<table class="ui table padded attached sortable stackable">
    <thead>
        <tr>
            <th class="one wide">ID</th>
            <th class="two wide">Enabled</th>
            <th class="three wide">Code</th>
            <th class="four wide">Title</th>
            <th class=" wide">&nbsp</th>
            <!-- <th class="two wide">Fee<div class="arrow"><span></span><span></span></div></th>
            <th class="one wide">Ordering <div class="arrow"><span></span><span></span></div></th>
            <th class="one wide">Grouping <div class="arrow"><span></span><span></span></div></th> -->
        </tr>
    </thead>
    <tbody class="loadering" data-name="instrument-list" data-action="/instrument" data-function="crm.instrument.list" data-autostart="true" data-trigger="" data-need-loader="true"></tbody>
</table>
