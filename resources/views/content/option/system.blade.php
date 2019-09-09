<div class="ui form">
    <div class="ui field">
        <div class="submiter" data-action="/command/reload" data-method="PUT">
            <div class="ui switcher-a slider checkbox">
                <input class="" type="checkbox" data-name="checker">
                <label>@lang('crm.option.system.reload')</label>
            </div>
            <input type="hidden" class="submit"/>
        </div>
    </div>
    <div class="ui field">
        <div class="submiter" data-action="/command/logout" data-method="PUT">
            <div class="ui switcher-a slider checkbox">
                <input class="" type="checkbox" data-name="checker">
                <label>@lang('crm.option.system.logout_all')</label>
            </div>
            <input type="hidden" class="submit"/>
        </div>
    </div>
    <div class="ui field">
        <div class="submiter" data-action="/command/redirect" data-method="PUT">
            <div class="ui switcher-a slider checkbox">
                <input class="" type="hidden" data-name="href" value="https://google.com">
                <input class="" type="checkbox" data-name="checker">
                <label>@lang('crm.option.system.redirect')</label>
            </div>
            <input type="hidden" class="submit"/>
        </div>
    </div>
    <div class="ui field">
        <div class="submiter" data-action="/command/runout" data-method="PUT">
            <div class="ui switcher-a slider checkbox">
                <input class="" type="checkbox" data-name="checker">
                <label>@lang('crm.option.system.maskshow')</label>
            </div>
            <input type="hidden" class="submit"/>
        </div>
    </div>
</div>
