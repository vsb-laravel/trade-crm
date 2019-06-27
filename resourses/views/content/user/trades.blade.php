<div class="ui horizontal divider">{{ trans('crm.instruments.groups.title') }}</div>
<div class="ui form submiter" data-action="/json/user/meta?meta_name=pairgroup">
    <input type="hidden" data-name="user_id" value="{{$user->id}}" />
    <div class="fields">
        <div class="field four wide">
            <label>{{ trans('crm.instruments.groups.title') }}</label>
            @foreach($user->meta as $meta)
                @if($meta->meta_name == 'pairgroup')
                    @php($pairgroup=$meta->meta_value)
                @endif
            @endforeach
            <div class="ui selection dropdown loadering" id="user_{{$user->id}}_pair_group" data-name="meta_value" data-value="{{$pairgroup ?? ''}}" data-action="/pairgroup" data-autostart="true" data-trigger=""></div>
        </div>
        <div class="field">
            <label>&nbsp;</label>
            <div class="ui green button submit">{{ trans('crm.save') }}</div>
        </div>
    </div>

</div>
<div class="ui horizontal divider">{{ trans('crm.trade.list') }}</div>
<div class="ui form">
    <div class="fields">
        <div class="four wide field">
            <div class="ui icon input">
                <input placeholder="{{ trans('messages.search') }}..." class="requester" data-name="search" data-trigger="keyup" data-target="deal-list"><i class="search icon"></i>
            </div>
        </div>
        <div class="field">
            <div class="ui selection dropdown">
                <input type="hidden" class="requester" data-name="status_id" data-trigger="change" data-target="deal-list"/>
                <div class="default text">Status</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="false">Status</div>
                    <div class="item" data-value="10">{{ trans('crm.deal.active') }}</div>
                    <div class="item" data-value="20">{{ trans('crm.deal.delayed') }}</div>
                    <div class="item" data-value="20">{{ trans('crm.deal.closed') }}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="fields">

        <div class="field">
            <div class="ui selection dropdown">
                <input type="hidden" class="requester" name="{{ trans('messages.pnl') }}" data-name="pnl" data-trigger="change" data-target="deal-list"/>
                <div class="default text">{{ trans('crm.deal.pnl') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="false">{{ trans('crm.deal.pnl') }}</div>
                    <div class="item" data-value="profit">{{ trans('crm.deal.pnl_profit') }}</div>
                    <div class="item" data-value="lost">{{ trans('crm.deal.pnl_loose') }}</div>
                </div>
            </div>
        </div>
        <div class="field">
            <div class="ui selection dropdown">
                <input type="hidden" class="requester" name="{{ trans('messages.instruments') }}" data-name="instrument_id" data-trigger="change" data-target="deal-list"/>
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
            <div class="ui selection dropdown">
                <input type="hidden" class="requester" data-name="account_type" data-trigger="change" data-target="deal-list"/>
                <div class="default text">Account type</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="false">Account type</div>
                    <div class="item" data-value="real">Live</div>
                    <div class="item" data-value="demo">Demo</div>
                </div>
            </div>
        </div>
    </div>
</div>
<table class="ui table selectable sortable">
    <thead>
        <!-- <tr>
            <td>Registred <div class="arrow sorter" data-name="created_at" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
            <td>Status<div class="arrow sorter" data-name="status_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
            <td>User<div class="arrow sorter" data-name="user_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
            <td>Manager<div class="arrow sorter" data-name="manager_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
            <td>Instrument<div class="arrow sorter" data-name="instrument_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>

            <td>Amount<div class="arrow sorter" data-name="amount" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
            <td>Direction<div class="arrow sorter" data-name="direction" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
            <td>SL TP<div class="arrow sorter" data-name="direction" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
            <td>Profit<div class="arrow sorter" data-name="profit" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
            <td>Tuned<div class="arrow sorter" data-name="profit" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
            <td></td>
        </tr> -->
    </thead>
    <tbody class="loadering" data-name="deal-list" data-action="/json/deal?status=all&user_id={{$user->id}}" data-function="crm.deal.list" data-autostart="true" data-trigger=""></tbody>
</table>
