<div class="ui grid">
    <div class="ui row">
        <div class="eight wide column">
            <div class="ui form">
                <div class="ui field">
                    <label>{{ trans('crm.partner.admincode') }}</label>
                    <div class="ui action input">
                        <input type="text" readonly value="{{$admincode ?? ''}}" id="admincode" />
                        <button class="ui teal right labeled icon button" onclick="copyValue(this,'#admincode')">
                            <i class="copy icon"></i>
                        </button>
                    </div>
                </div>

            </div>

        </div>
    </div>
</div>

<div class="ui grid">
    <div class="sixteen wide column">
        <div class="ui header">{{ trans('crm.dashboard.customers') }}</div>
        <div class="ui form attached">
            <div class="fields">
                <div class="six wide field">
                    <div class="ui icon input">
                        <input placeholder="{{ trans('crm.dashboard.search') }}..." class="requester search" data-name="search" data-trigger="keyup" data-target="partner-user-list"><i class="search icon"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui horizontal divider">list</div>
        <table class="ui padded attached table selectable sortable" id="users">
            <tbody id="partner_user_list" data-name="partner-user-list" class="loadering" data-action="/json/user?affilate_id={{Auth::id()}}" data-function="crm.partner.list" data-autostart="true" data-need-loader="true"></tbody>
        </table>
    </div>
</div>
