<!-- <div class="right ui rail">
    <div class="ui menu vertical sticky" data-context="#page__imap">
        <a class="ui item" onclick="crm.brands.byperiod(this,'q')">{{ trans('crm.periods.this_quarter') }}</a>
        <a class="ui item" onclick="crm.brands.byperiod(this,'2lm')">{{ trans('crm.periods.2last_month') }}</a>
        <a class="ui item" onclick="crm.brands.byperiod(this,'lm')">{{ trans('crm.periods.last_month') }}</a>
    </div>
</div> -->
<div class="loadering" id="page__imap" data-name="imap-list" data-action="/imap" data-autostart="true" data-trigger="show" data-refresh="300000" data-function="crm.imap.render">
    <div class="ui secondary menu">
        <div class="right menu">
            <div class="item bulk-actions" style="display:none">
                <button class="ui icon circular large blue button helper" data-content="Mark all selected as viewed" onclick="crm.imap.update()">
                    <i class="eye icon"></i>
                </button>
            </div>
            <div class="item bulk-actions" style="display:none">
                <button class="ui icon circular large blue button helper" data-content="Delete all selected" onclick="crm.imap.delete()">
                    <i class="trash icon"></i>
                </button>
            </div>
            <div class="item">
                <button class="ui icon circular large blue button helper" data-content="Write new mail" onclick="new MailMessage()">
                    <i class="plus icon"></i>
                </button>
            </div>
        </div>
    </div>
    <div class="ui tabular attached menu wide">
        <a class="item active" data-tab="inbox">{{ trans('crm.imap.inbox') }}</a>
        <a class="item" data-tab="sent">{{ trans('crm.imap.sent') }}</a>
    </div>
    <div class="ui tab imap attached active" data-tab="inbox">
        <div class="ui loader active"></div>
    </div>
    <div class="ui tab smtp attached" data-tab="sent">
        <!-- <div class="ui loader active"></div> -->
    </div>

</div>
