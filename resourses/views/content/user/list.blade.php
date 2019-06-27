<div class="ui header">{{trans('crm.customers.title')}}</div>
<div class="ui form">
    <div class="fields three wide">
        <div class="six wide field">
            <div class="ui icon input">
                <input placeholder="{{ trans('crm.search') }}..." class="requester search" data-name="search" data-trigger="keyup" data-target="user-list"><i class="search icon"></i>
            </div>
        </div>

        <div class="field middle aligned six wide" style="padding-top:6px;">
            <div class="ui checkbox">
                <input type="checkbox" class="requester" data-name="online" data-trigger="change" data-target="user-list" data-depends="#ids"/>
                <input type="hidden" class="requester dynamic" data-target="user-list" data-name="ids" id="ids"/>
                <label>{{ trans('crm.sorts.online') }}<span class="ui basic circular label" id="user_list_online_count" style="display:none"></span></label>
            </div>
            <div class="ui checkbox">
                <input type="checkbox" class="requester" data-name="my" data-trigger="change" data-target="user-list"/>
                <label>{{ trans('crm.sorts.my_customers') }}</label>
            </div>
            <div class="ui checkbox">
                <input type="checkbox" class="requester" data-name="balance" data-trigger="change" data-target="user-list"/>
                <label>{{ trans('crm.sorts.balance') }}</label>
            </div>
            <div class="ui checkbox">
                <input type="checkbox" class="requester" data-name="activity" data-trigger="change" data-target="user-list"/>
                <label>{{ trans('crm.sorts.activity') }}</label>
            </div>
            <div class="ui checkbox">
                <input type="checkbox" class="requester" data-name="comment" data-trigger="change" data-target="user-list"/>
                <label>{{ trans('crm.sorts.last_comment') }}</label>
            </div>
        </div>

        <div class="field">
            <div class="ui buttons right floated">
                @can('admin')
                    <button onclick="crm.user.add()" class="add ui primary button labeled icon right floated"><i class="plus icon"></i>{{ trans('crm.customers.add') }}</button>
                @endcan
                <input type="hidden" class="requester" data-name="excel" data-trigger="change" data-target="user-list" value="false"/>
                @can('export')
                <button class="ui green button labeled icon  right floated" onclick="$('[data-name=excel]').val('1').change();"><i class="excel outline file icon"></i>Excel</button>
                @endcan
            </div>
        </div>
    </div>
    <div class="fields five wide">
        @can('superadmin')
            <div class="field">
                <div class="ui search selection dropdown loadering requester" data-id="user-hierarhy" data-title="All parents" data-name="parent_id" data-action="/json/user?assigner=1&_simple=1" data-autostart="true" data-trigger="change" data-target="user-list"></div>
            </div>
        @endcan
        @can('kyc')
            <div class="field">
                <div class="ui search selection dropdown loadering requester" data-id="user-managers" data-title="All managers" data-name="manager_id" data-action="/json/user?rights_id[0]=4&rights_id[1]=5&rights_id[2]=6&rights_id[3]=7&rights_id[4]=8&rights_id[5]=10&assigner=1&_simple=1" data-autostart="true" data-trigger="change" data-target="user-list"></div>
            </div>
        @endcan
        <div class="field">
            <div class="ui search selection dropdown loadering requester" data-id="user-affilates" data-title="All affilates" data-name="affilate_id" data-action="/json/user?rights_id[0]=2&rights_id[1]=3&assigner=1&_simple=1" data-autostart="true" data-target="user-list"  data-trigger="change"></div>
        </div>
        <div class="field">
            <div class="ui icon labeled calendar-notime input" >
                <div class="ui label"  onclick="$(this).next().val('').change();"><i class="ui refresh icon"></i></div>
                <input type="text" class="-ui-calendar requester" placeholder="Registration date from" data-name="date_from" data-target="user-list"  data-trigger="change"/>
                <i class="calendar icon"></i>
            </div>
        </div>
        <div class="field">
            <div class="ui icon labeled calendar-notime input" >
                <div class="ui label"  onclick="$(this).next().val('').change();"><i class="ui refresh icon"></i></div>
                <input type="text" class="-ui-calendar requester" placeholder="Registration date until" data-name="date_to" data-target="user-list"  data-trigger="change"/>
                <i class="calendar icon"></i>
            </div>
        </div>
    </div>
    @ifmodule('bets')
    @else
    <div class="fields four wide">
        <div class="field">
            <div class="ui search multiple selection dropdown">
                <input type="hidden" class="requester" name="{{ trans('crm.customers.status') }}" data-name="status_id" data-trigger="change" data-target="user-list" autocomplete="off"/>
                <div class="default text">{{ trans('crm.customers.status') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="false">{{ trans('crm.customers.status') }}</div>
                    @foreach($statuses["user"] as $row)
                        <div class="item" data-value="{{$row->id}}">{{$row->title}}</div>
                    @endforeach
                </div>
            </div>
        </div>
        <div class="field">
            <div class="ui search selection dropdown loadering requester" data-name="country" data-title="Country" data-action="/json/user/countries" data-autostart="true" data-trigger="change" data-target="user-list"></div>
        </div>

        <div class="field">
            <div class="ui search selection dropdown loadering requester" data-name="office" data-title="Office" data-action="/json/user/offices" data-autostart="true" data-trigger="change" data-target="user-list"></div>
        </div>
    </div>
    @endifmodule
    <div class="ui horizontal divider">{{ trans('crm.bulk') }}</div>
    <div class="user bulk fields four wide" style="display:none">

        @can('kyc')
            <div class="field">
                <label>{{ trans('crm.user.assign') }}</label>
                <div class="ui search selection dropdown bulker" data-title="Assign" data-name="manager_id" data-action="/json/user?assigner=1" data-autostart="true"
                    data-bulk-selector="[data-name=user_selected]"
                    data-bulk-name="parent_user_id"
                    data-bulk-trigger="buttonClick"
                    data-bulk-action="/json/user/{data-id}/update?{bulk-param-name}={bulk-param-value}"
                    data-bulk-param="{bulk-param-name}={bulk-param-value}"
                    data-bulk-target="user-list"
                    >
                    <input type="hidden" name="manager_id" data-name="manager_id">
                    <i class="dropdown icon"></i>
                    <div class="default text">{{ trans('crm.actions.assign') }}</div>
                    <div class="menu" tabindex="-1">
                        <div class="item" data-value="{{Auth::id()}}">
                            <span class="text">{{Auth::user()->title}}</span>
                            <span class="description">{{ trans('crm.sorts.me') }}</span>
                        </div>
                        @foreach($managers as $row)
                            <div class="item" data-value="{{$row->id}}">
                                <span class="text">{{$row->title}}</span>
                                <span class="description">{{$row->rights->name}}</span>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
            <div class="field">
                <label>{{ trans('crm.user.affilate') }}</label>
                <div class="ui search selection dropdown bulker" data-title="{{ trans('crm.actions.assign') }}" data-name="manager_id" data-action="/json/user?assigner=1" data-autostart="true"
                    data-bulk-selector="[data-name=user_selected]"
                    data-bulk-name="affilate_id"
                    data-bulk-trigger="buttonClick"
                    data-bulk-action="/json/user/{data-id}/update?{bulk-param-name}={bulk-param-value}"
                    data-bulk-param="{bulk-param-name}={bulk-param-value}"
                    data-bulk-target="user-list"
                    >
                    <input type="hidden" name="manager_id" data-name="manager_id">
                    <i class="dropdown icon"></i>
                    <div class="default text">{{ trans('crm.actions.assign') }}</div>
                    <div class="menu" tabindex="-1">
                        <div class="item" data-value="{{Auth::id()}}">
                            <span class="text">{{Auth::user()->title}}</span>
                            <span class="description">{{ trans('crm.sorts.me') }}</span>
                        </div>
                        @foreach($managers as $row)
                            <div class="item" data-value="{{$row->id}}">
                                <span class="text">{{$row->title}}</span>
                                <span class="description">{{$row->id==Auth::id()?'me':$row->rights->name}}</span>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        @endcan
        <div class="field">
            <label>{{ trans('crm.customers.status') }}</label>
            <div class="ui search selection dropdown">
                <input type="hidden" class="bulker" name="{{ trans('crm.customers.status') }}"
                    data-bulk-selector="[data-name=user_selected]"
                    data-bulk-name="status_id"
                    data-bulk-trigger="buttonClick"
                    data-bulk-action="/json/user/{data-id}/update?{bulk-param-name}={bulk-param-value}"
                    data-bulk-param="{bulk-param-name}={bulk-param-value}"
                    data-bulk-target="user-list"/>
                <div class="default text">{{ trans('crm.customers.status') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    @foreach($statuses["user"] as $row)
                        <div class="item" data-value="{{$row->id}}">{{$row->title}}</div>
                    @endforeach
                </div>
            </div>
        </div>
        <div class="field">
            <label>{{ trans('crm.customers.set_country') }}</label>
            <div class="ui selection search dropdown">
                <input type="hidden" class="bulker" name="{{ trans('crm.country') }}"
                    data-bulk-selector="[data-name=user_selected]"
                    data-bulk-name="country"
                    data-bulk-trigger="buttonClick"
                    data-bulk-action="/json/user/{data-id}/update?{bulk-param-name}={bulk-param-value}"
                    data-bulk-param="{bulk-param-name}={bulk-param-value}"
                    data-bulk-target="user-list"/>
                <div class="default text">{{ trans('crm.country') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    @foreach(App\Http\Controllers\UserController::$countries as $row)
                        <div class="item" data-value="{{$row['id']}}">{{$row['title']}}</div>
                    @endforeach
                </div>
            </div>
        </div>
        @can('chief')
        <div class="field">
            <label>&nbsp;</label>
            <div class="ui red icon button bulker" data-title="{{trans('crm.user.remove')}}"
                data-bulk-selector="[data-name=user_selected]"
                data-bulk-name="remove"
                data-bulk-trigger="click"
                data-bulk-action="/user/{data-id}/remove"
                data-bulk-target="user-list"
                >
                <i class="trash icon"></i> {{ trans('crm.user.remove') }}</div>
        </div>
        @endcan
        @can('kyc')
        <div class="field">
            <label>&nbsp;</label>
            <div class="ui primary icon button" onclick="skymechanics.bulkButton(this)"
                data-bulk-target="user-list"
                data-bulk-action="/json/user/{data-id}/update"
                data-bulk-selector="[data-name=user_selected]"
                ><i class="check icon"></i> {{ trans('crm.done') }}</div>
            <!-- <div class="ui primary icon button" onclick="$(this).parent().parent().find('.bulker[data-bulk-trigger=buttonClick]').each(function(){$(this).trigger($(this).attr('data-bulk-trigger'));})"><i class="check icon"></i> Done</div> -->
        </div>
        <!-- <div class="field">
            <label>&nbsp;</label>
            <div class="ui basic icon button" onclick="crm.user.card($('[data-name=user_selected]'))">
                <i class="address card outline icon"></i> {{ trans('crm.open_in_cards') }}
            </div>
        </div> -->
        @endcan
        <div class="field twelve wide mail" style="display:none;">
            <div class="ui form" data-action="/mail/send" data-callback="crm.mail.sent">
                <div class="field">
                    <label>{{ trans('crm.mail.template') }}</label>
                    <div class="loadering ui selection dropdown" id="mailsTemplate" data-id="mailsTemplate" data-title="Templates" data-name="mail_id" data-action="/mail" data-autostart="true"></div>
                </div>
                <div class="field">
                    <label>{{ trans('crm.mails.sender') }}:</label>
                    {{env('MAIL_USERNAME')}}
                </div>
                <div class="field">
                    <div class="ui input">
                        <textarea id="mailsText" data-name="text" required placeholder="{{ trans('crm.customers.text') }}"></textarea>
                    </div>
                </div>
                <div class="ui blue labeled icon button" id="sendMail">
                    <i class="icon send"></i> {{ trans('crm.send') }}
                </div>
            </div>
        </div>
    </div>
</div>
<!-- <div class="ui horizontal divider">list</div> -->
<table class="ui attached table selectable" id="users">
    <thead>
        <tr>
            <th class="one wide"><div class="ui fitted checkbox"><input type="checkbox" class="check-all" data-list="user_selected" /><label>&nbsp;&nbsp;&nbsp;</label></div></th>
            <th>{{ trans('crm.customer.registered') }}</th>
            <th class="four wide">{{ trans('crm.customers.name') }} <div class="arrow sorter" data-name="country" data-trigger="click" data-target="user-list" data-value="asc"><span></span><span></span></div></th>
            <th class="one wide client-only">{{ trans('crm.customers.kyc') }}</th>
            <th class="one wide client-only">{{ trans('crm.customers.trade') }}</th>
            <th class="two wide client-only">{{ trans('crm.customers.balance') }} <div class="arrow sorter" data-name="country" data-trigger="click" data-target="user-list" data-value="asc"><span></span><span></span></div></th>
            <th class="two wide client-only">{{ trans('crm.customers.status') }} <div class="arrow sorter" data-name="status" data-trigger="click" data-target="user-list" data-value="asc"><span></span><span></span></div></th>
            <th class="notclient-only">{{ trans('crm.customers.balance') }} <div class="arrow sorter" data-name="country" data-trigger="click" data-target="user-list" data-value="asc"><span></span><span></span></div></th>
            <th>{{ trans('crm.customers.status') }} <div class="arrow sorter" data-name="country" data-trigger="click" data-target="user-list" data-value="asc"><span></span><span></span></div></th>
            <th>{{ trans('crm.customers.manager_office') }} <div class="arrow sorter" data-name="country" data-trigger="click" data-target="user-list" data-value="asc"><span></span><span></span></div></th>
            <th>{{ trans('crm.customers.activity') }} <div class="arrow sorter" data-name="last_ip" data-trigger="click" data-target="user-list" data-value="asc"><span></span><span></span></div></th>
        </tr>
    </thead>
    <tbody id="user_list" data-name="user-list" class="loadering priorited" data-action="/json/user?rights_id[0]=1&rights_id[1]=3" data-function="crm.user.list" data-autostart="true" data-need-loader="true" data-trigger=""></tbody>
</table>
