<div class="ui header">{{ trans('crm.leads.title') }}</div>
<div class="ui form">
    <div class="fields five wide">
        <div class="field">
            <div class="ui icon input">
                <input placeholder="{{ trans('crm.search') }}..." class="requester search" data-name="search" data-trigger="keyup" data-target="lead-list"><i class="search icon"></i>
            </div>
        </div>
        <div class="field">
            <div class="ui selection multiple dropdown">
                <input type="hidden" class="requester" name="{{ trans('crm.leads.status') }}" data-name="status_id" data-trigger="change" data-target="lead-list"/>
                <div class="default text">{{ trans('crm.leads.status') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" data-value="false">{{ trans('crm.leads.status') }}</div>
                    @foreach($statuses["lead"] as $row)
                        <div class="item" data-value="{{$row->id}}">{{$row->title}}</div>
                    @endforeach
                </div>
            </div>
        </div>
        <div class="field">
            <div class="ui selection dropdown loadering requester" data-name="country" data-title="Country" data-action="/json/user/countries" data-autostart="true" data-trigger="change" data-target="lead-list"></div>
        </div>
        @can('admin')
        <div class="field middle aligned center aligned">
            <div class="ui checkbox">
                <input type="checkbox" class="requester" data-name="my" data-trigger="change" data-target="lead-list"/>
                <label>{{ trans('crm.leads.my_leads') }}</label>
            </div>
            <div class="ui checkbox">
                <input type="checkbox" class="requester" data-name="comment" data-trigger="change" data-target="lead-list"/>
                <label>{{ trans('crm.sorts.last_comment') }}</label>
            </div>
        </div>
        @endcan
        <div class="field">
            <div class="ui icon labeled calendar-notime input" >
                <div class="ui label"  onclick="$(this).next().val('').change();"><i class="ui refresh icon"></i></div>
                <input type="text" class="-ui-calendar requester" placeholder="Registration date from" data-name="date_from" data-target="lead-list"  data-trigger="change"/>
                <i class="calendar icon"></i>
            </div>
        </div>
        <div class="field">
            <div class="ui icon labeled calendar-notime input" >
                <div class="ui label"  onclick="$(this).next().val('').change();"><i class="ui refresh icon"></i></div>
                <input type="text" class="-ui-calendar requester" placeholder="Registration date until" data-name="date_to" data-target="lead-list"  data-trigger="change"/>
                <i class="calendar icon"></i>
            </div>
        </div>
    </div>
    <div class="fields four wide">
        @can('superadmin')
            <div class="field">
                <!-- <select class="ui dropdown requester" data-id="user-administrators" data-title="All administrators" data-name="manager_id" data-action="/json/user?rights_id=7" data-autostart="true" data-trigger="change" data-target="lead-list">
                    <option value="false">Administrators</option>
                    @foreach($rights["admins"] as $row)
                        <option value="{{$row->id}}">
                            {{$row->name}} {{$row->surname}}
                        </option>
                    @endforeach
                </select> -->
                <div class="ui selection dropdown">
                    <input type="hidden" class="requester" data-name="manager_id" data-trigger="change" data-trigger="change" data-target="lead-list"/>
                    <div class="default text">All administrators</div>
                    <i class="dropdown icon"></i>
                    <div class="menu">
                        <div class="item" data-value="false">All administrators</div>
                        @foreach($rights["admins"] as $row)
                            <div class="item" data-value="{{$row->id}}">
                                <span class="text">{{$row->title}}</span>
                                <span class="description">{{$row->id == Auth::id()? 'me':$row->rights->name}}</span>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        @endcan
        <div class="field">
            <!-- <div class="ui selection dropdown loadering requester" data-id="lead-managers" data-title="All managers" data-trigger="change" data-name="manager_id" data-action="/json/user?rights_id[0]=4&rights_id[1]=5&rights_id[2]=6&&rights_id[2]=7" data-autostart="true" data-target="lead-list"></div> -->
            <div class="ui search selection dropdown loadering requester" data-id="lead-managers" data-title="All managers" data-name="manager_id" data-action="/json/user?assigner=1" data-autostart="true" data-trigger="change" data-target="lead-list"></div>
        </div>
        <div class="field">
            <div class="ui selection dropdown loadering requester" data-id="lead-affilates" data-title="All affilates" data-trigger="change" data-name="affilate_id" data-action="/json/user?rights_id[0]=2" data-autostart="true" data-target="lead-list"></div>
        </div>

        <div class="field">
            @can('admin')
                <button onclick="crm.lead.add()" class="add ui primary button labeled icon right floated"><i class="plus icon"></i>{{ trans('crm.leads.add') }}</button>
            @endcan
            <input type="hidden" class="requester" data-name="excel" data-trigger="change" data-target="lead-list" value="false"/>
            <button class="ui green button labeled icon  right floated" onclick="$('[data-name=excel]').val('1').change();"><i class="excel outline file icon"></i>Excel</button>
        </div>
    </div>
    <div class="ui horizontal divider">{{ trans('crm.bulk') }}</div>
    <div class="lead bulk fields" style="display:none">
        @can('kyc')
            <div class="field">
                <label>{{ trans('crm.user.assign') }}</label>
                <div class="ui search selection dropdown loadering bulker" data-title="Assign" data-name="manager_id" data-action="/json/user?assigner=1" data-autostart="true"
                    data-bulk-selector="[data-name=lead_selected]"
                    data-bulk-name="manager_id"
                    data-bulk-trigger="buttonClick"
                    data-bulk-action="/lead/{data-id}/update?{bulk-param-name}={bulk-param-value}"
                    data-bulk-param="{bulk-param-name}={bulk-param-value}"
                    data-bulk-target="lead-list"
                    ></div>

            </div>
            <div class="field">
                <label>{{ trans('crm.user.affilate') }}</label>
                <div class="ui search selection dropdown loadering bulker" data-title="Assign" data-name="manager_id" data-action="/json/user?assigner=1" data-autostart="true"
                    data-bulk-selector="[data-name=lead_selected]"
                    data-bulk-name="affilate_id"
                    data-bulk-trigger="buttonClick"
                    data-bulk-action="/lead/{data-id}/update?{bulk-param-name}={bulk-param-value}"
                    data-bulk-param="{bulk-param-name}={bulk-param-value}"
                    data-bulk-target="lead-list"
                    ></div>
            </div>
        @endcan

    <!-- </div>
    <div class="lead bulk fields" style="display:none"> -->
        <div class="field">
            <label>{{ trans('crm.leads.status') }}</label>
            <div class="ui search selection dropdown">
                <input type="hidden" class="bulker" name="{{ trans('crm.leads.status') }}"
                    data-bulk-selector="[data-name=lead_selected]"
                    data-bulk-name="status_id"
                    data-bulk-trigger="buttonClick"
                    data-bulk-action="/lead/{data-id}/update?{bulk-param-name}={bulk-param-value}"
                    data-bulk-param="{bulk-param-name}={bulk-param-value}"
                    data-bulk-target="lead-list"/>
                <div class="default text">{{ trans('crm.leads.status') }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    @foreach($statuses["lead"] as $row)
                        <div class="item" data-value="{{$row->id}}">{{$row->title}}</div>
                    @endforeach
                </div>
            </div>
        </div>
        <div class="field">
            <label>Set country</label>
            <div class="ui search selection search dropdown loadering bulker" data-name="country" data-title="Country" data-action="/json/user/countries" data-autostart="true"
                data-bulk-selector="[data-name=lead_selected]"
                data-bulk-name="country"
                data-bulk-trigger="buttonClick"
                data-bulk-action="/lead/{data-id}/update?{bulk-param-name}={bulk-param-value}"
                data-bulk-param="{bulk-param-name}={bulk-param-value}"
                data-bulk-target="lead-list"
                ></div>
        </div>
        @can('admin')
            <div class="field">
                <label>&nbsp;</label>
                <button onclick="crm.lead.delete()" class="delete ui primary button labeled icon"><i class="trash icon"></i>{{ trans('crm.leads.delete') }}</button>
            </div>
        @endcan
        <div class="field">
            <label>&nbsp;</label>
            <div class="ui primary icon button" onclick="skymechanics.bulkButton(this)"
                data-bulk-target="lead-list"
                data-bulk-action="/lead/{data-id}/update"
                data-bulk-selector="[data-name=lead_selected]"
                ><i class="check icon"></i> Done</div>
        </div>
    </div>
</div>
<!-- <div class="ui horizontal divider">list</div> -->
<table class="ui attached table selectable unstackable fixed">
    <thead>
        <tr>
            <th class="one wide"><div class="ui checkbox"><input type="checkbox" class="check-all" data-list="lead_selected" /><label></label></div></th>
            <th>Registred <div class="arrow sorter" data-name="created_at" data-trigger="click" data-target="lead-list" data-value="asc"><span></span><span></span></div></th>
            <th class="four wide">Name <div class="arrow sorter" data-name="country" data-trigger="click" data-target="lead-list" data-value="asc"><span></span><span></span></div></th>
            <!--
            <th>Email <div class="arrow sorter" data-name="email" data-trigger="click" data-target="lead-list" data-value="asc"><span></span><span></span></div></th>
            <th>Name <div class="arrow sorter" data-name="name" data-trigger="click" data-target="lead-list" data-value="asc"><span></span><span></span></div></th>
            <th>Phone <div class="arrow sorter" data-name="phone" data-trigger="click" data-target="lead-list" data-value="asc"><span></span><span></span></div></th>

            <th>Country <div class="arrow sorter" data-name="country" data-trigger="click" data-target="lead-list" data-value="asc"><span></span><span></span></div></th> -->
            <!-- <th>Office <div class="arrow sorter" data-name="office" data-trigger="click" data-target="lead-list" data-value="asc"><span></span><span></span></div></th> -->
            <th>Status <div class="arrow sorter" data-name="status_id" data-trigger="click" data-target="lead-list" data-value="asc"><span></span><span></span></div></th>
            <th>Manager <div class="arrow sorter" data-name="manager_id" data-trigger="click" data-target="lead-list" data-value="asc"><span></span><span></span></div></th>
            <!-- <th>Source <div class="arrow sorter" data-name="source" data-trigger="click" data-target="lead-list" data-value="asc"><span></span><span></span></div></th> -->
        </tr>
    </thead>
    <tbody id="lead_list" data-name="lead-list" class="loadering priorited" data-action="/lead/list/json" data-function="crm.lead.list" data-autostart="true" data-need-loader="true" data-trigger=""></tbody>
</table>
