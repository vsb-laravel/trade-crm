<div class="ui header">{{ trans('crm.options.administrators') }}</div>
<div class="ui form">
    <div class="fields">
        <div class="six wide field">
            <div class="ui icon input">
                <input placeholder="{{ trans('messages.search') }}..." class="requester search" data-name="search" data-trigger="keyup" data-target="admin-list"><i class="search icon"></i>
            </div>
        </div>
        <!-- <div class="field">
            <div class="ui selection dropdown">
                <input type="hidden" class="requester" name="{{ trans('messages.status') }}" data-name="status_id" data-trigger="change" data-target="admin-list"/>
                <div class="default text">{{ trans('messages.status') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="false">{{ trans('messages.status') }}</div>
                    @foreach($statuses["user"] as $row)
                        <div class="item" data-value="{{$row->id}}">{{$row->title}}</div>
                    @endforeach
                </div>
            </div>
        </div> -->
        @can('add_admin')
            <div class="field">
                <button onclick="crm.user.add()" class="add ui primary button labeled icon right floated"><i class="plus icon"></i>Add</button>
            </div>
        @endcan
    </div>
    <div class="fields">
        <div class="field">
            <div class="ui search selection dropdown">
                <input type="hidden" class="requester" data-name="rights_id" data-trigger="change" data-target="admin-list"/>
                <div class="default text">All user rights</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="false">All user rights</div>
                    @foreach($rights["list"] as $row)
                        @if($row->id!=1)
                            <div class="item" data-value="{{$row->id}}">{{$row->title}}</div>
                        @endif
                    @endforeach
                </div>
            </div>
        </div>
        @can('superadmin')
            <div class="field">
                <div class="ui search selection dropdown">
                    <input type="hidden" class="requester" data-name="parent_id" data-trigger="change" data-target="admin-list"/>
                    <div class="default text">All administrators</div>
                    <i class="dropdown icon"></i>
                    <div class="menu">
                        <div class="item" data-value="false">All administrators</div>
                        @foreach($rights["admins"] as $row)
                            <div class="item" data-value="{{$row->id}}">{{$row->name}} {{$row->surname}}</div>
                        @endforeach
                    </div>
                </div>
            </div>
        @endcan
        @can('admin')
            <div class="field">
                <div class="ui selection search dropdown loadering requester" data-id="user-managers" data-title="All managers" data-name="parent_id" data-action="/json/user?rights_id[0]=4&rights_id[1]=5&rights_id[2]=6&per_page=100" data-autostart="true" data-trigger="change" data-target="admin-list"></div>
            </div>
        @endcan
        <div class="field">
            <div class="ui selection search dropdown loadering requester" data-id="user-affilates" data-title="All affilates" data-name="affilate_id" data-action="/json/user?rights_id[0]=2&per_page=100" data-autostart="true" data-target="admin-list"  data-trigger="change"></div>
        </div>
    </div>
    <div class="fields">
        <div class="field">
            <div class="ui selection search dropdown loadering requester" data-name="country" data-title="Country" data-action="/json/user/countries" data-autostart="true" data-trigger="change" data-target="admin-list"></div>
        </div>

        <div class="field">
            <div class="ui selection search dropdown loadering requester" data-name="office" data-title="Office" data-action="/json/user/offices" data-autostart="true" data-trigger="change" data-target="admin-list"></div>
        </div>
    </div>

    <div class="ui horizontal divider">{{ trans('crm.bulk') }}</div>
    <div class="admin bulk fields" style="display:none">
        @can('admin')
            <div class="field">
                <label>{{ trans('crm.user.assign') }}</label>
                <div class="ui selection dropdown loadering bulker" data-title="Assign" data-name="manager_id" data-action="/json/user?assigner=1" data-autostart="true"
                    data-bulk-selector="[data-name=admin_selected]"
                    data-bulk-name="parent_user_id"
                    data-bulk-trigger="change"
                    data-bulk-action="/json/user/{data-id}/update?{bulk-param-name}={bulk-param-value}"
                    data-bulk-target="admin-list"
                    ></div>
            </div>
        @endcan
        <div class="field">
            <label>Set country</label>
            <div class="ui selection search dropdown loadering bulker" data-name="country" data-title="Country" data-action="/json/user/countries" data-autostart="true"
                data-bulk-selector="[data-name=admin_selected]"
                data-bulk-name="country"
                data-bulk-trigger="change"
                data-bulk-action="/json/user/{data-id}/update?{bulk-param-name}={bulk-param-value}"
                data-bulk-target="admin-list"
                ></div>
        </div>
        @can('superadmin')
        <div class="field">
            <label>&nbsp;</label>
            <div class="ui red icon button bulker" data-title="Remove"
                data-bulk-selector="[data-name=admin_selected]"
                data-bulk-name="remove"
                data-bulk-trigger="click"
                data-bulk-action="/user/{data-id}/remove"
                data-bulk-target="admin-list"
                >
                <i class="trash icon"></i> {{ trans('crm.user.remove') }}</div>
        </div>
        @endcan
    </div>
</div>
<!-- <div class="ui horizontal divider">list</div> -->
<table class="ui padded attached table selectable sortable" id="users">
    <thead>
        <tr>
            <th class="one wide"><div class="ui fitted checkbox"><input type="checkbox" class="check-all" data-list="admin_selected" /><label></label></div></th>
            <th>{{ trans('messages.registered') }}</th>
            <th class="two wide">Name <div class="arrow sorter" data-name="country" data-trigger="click" data-target="admin-list" data-value="asc"><span></span><span></span></div></th>
            <th class="two wide">Office <div class="arrow sorter" data-name="country" data-trigger="click" data-target="admin-list" data-value="asc"><span></span><span></span></div></th>
            <th class="notclient-only">Customers <div class="arrow sorter" data-name="country" data-trigger="click" data-target="admin-list" data-value="asc"><span></span><span></span></div></th>
            <th>Rights <div class="arrow sorter" data-name="country" data-trigger="click" data-target="admin-list" data-value="asc"><span></span><span></span></div></th>
            <th>Administrator/Office <div class="arrow sorter" data-name="country" data-trigger="click" data-target="admin-list" data-value="asc"><span></span><span></span></div></th>
            <th>Activity <div class="arrow sorter" data-name="last_ip" data-trigger="click" data-target="admin-list" data-value="asc"><span></span><span></span></div></th>
        </tr>
    </thead>
    <tbody id="admin_list" data-name="admin-list" class="loadering" data-action="/json/user?admins=1" data-function="crm.user.admins" data-autostart="true" data-trigger="" data-need-loader="true"></tbody>
</table>
