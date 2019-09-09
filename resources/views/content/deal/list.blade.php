<div class="ui header">{{ trans('crm.trades.list') }}</div>
<div class="ui form">

    <div class="inline fields">
        <label>{{ trans('crm.trades.status') }}</label>
        <div class="field">
            <div class="ui huge radio checkbox">
                <input type="radio" name="status_id"class="requester" data-name="status_id" data-value="false" data-trigger="change" data-target="deal-list">
                <label>{{ trans('crm.all') }}</label>
            </div>
        </div>
        <div class="field">
            <div class="ui radio checkbox">
                <input type="radio" name="status_id" checked="checked"  class="requester" data-name="status_id" data-value="10" data-trigger="change" data-target="deal-list">
                <label>{{ trans('crm.trades.active') }}</label>
            </div>
        </div>
        <div class="field">
            <div class="ui radio checkbox">
                <input type="radio" name="status_id" class="requester" data-name="status_id" data-value="30" data-trigger="change" data-target="deal-list">
                <label>{{ trans('crm.trades.delayed') }}</label>
            </div>
        </div>
        <div class="field">
            <div class="ui radio checkbox">
                <input type="radio" name="status_id" class="requester" data-name="status_id" data-value="20" data-trigger="change" data-target="deal-list">
                <label>{{ trans('crm.trades.closed') }}</label>
            </div>
        </div>
        @can('superadmin')
        <div class="field">
            <div class="ui radio checkbox">
                <input type="radio" name="status_id" class="requester" data-name="status_id" data-value="100" data-trigger="change" data-target="deal-list">
                <label>{{ trans('crm.trades.hidden') }}</label>
            </div>
        </div>
        @endcan
    </div>
    <div class="fields">
        <div class="four wide field">
            <div class="ui icon input">
                <input placeholder="{{ trans('crm.search') }}..." class="requester search" data-name="search" data-trigger="keyup" data-target="deal-list"><i class="search icon"></i>
            </div>
        </div>
        <div class="field">
            <div class="ui selection dropdown">
                <input type="hidden" class="requester" name="{{ trans('crm.instruments.title') }}" data-name="instrument_id" data-trigger="change" data-target="deal-list"/>
                <div class="default text">{{ trans('crm.instruments.title') }}</div>
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
            <div class="ui selection dropdown">
                <input type="hidden" class="requester" name="{{ trans('crm.trades.pnl') }}" data-name="pnl" data-trigger="change" data-target="deal-list"/>
                <div class="default text">{{ trans('crm.trades.pnl') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="false">{{ trans('crm.trades.pnl') }}</div>
                    <div class="item" data-value="profit">{{ trans('crm.trades.pnl_profit') }}</div>
                    <div class="item" data-value="lost">{{ trans('crm.trades.pnl_loose') }}</div>
                </div>
            </div>
        </div>
        <div class="field">
            <div class="ui selection dropdown">
                <input type="hidden" class="requester" name="{{ trans('crm.accounts.account_type') }}" data-name="account_type" data-trigger="change" data-target="deal-list"/>
                <div class="default text">{{ trans('crm.accounts.type') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="false">{{ trans('crm.accounts.type') }}</div>
                    <div class="item" data-value="real">{{ trans('crm.accounts.real') }}</div>
                    <div class="item" data-value="demo">{{ trans('crm.accounts.demo') }}</div>
                </div>
            </div>
        </div>
    </div>
</div>
<table class="ui table attached selectable sortable">
    <thead>
        <tr>
            <th>Registred <div class="arrow sorter" data-name="created_at" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></th>
            <th>Status<div class="arrow sorter" data-name="status_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></th>
            <th>User<div class="arrow sorter" data-name="user_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></th>
            <th>Manager<div class="arrow sorter" data-name="manager_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></th>
            <th>Instrument<div class="arrow sorter" data-name="instrument_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></th>
            <th>Amount<div class="arrow sorter" data-name="amount" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></th>
            <!-- <th class="one wide">Direction<div class="arrow sorter" data-name="direction" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></th> -->
            <!-- <th>SL TP<div class="arrow sorter" data-name="direction" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></th> -->
            <th>Trade balance<div class="arrow sorter" data-name="profit" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></th>
            <th class="one wide">Tuned<div class="arrow sorter" data-name="profit" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></th>
        </tr>
    </thead>
    <tbody class="loadering" data-name="deal-list" data-action="/json/deal?status_id=10" data-function="crm.deal.list" data-autostart="true" data-trigger="" data-need-loader="true"></tbody>
</table>
