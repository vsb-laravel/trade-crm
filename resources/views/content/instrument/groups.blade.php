<div class="ui header">{{ trans('crm.instruments.groups.title') }}</div>
<div style="display:none">
<table  style="display:none">
    <tbody class="loadering dropdown" data-name="instrument-list" data-action="/instrument" data-function="crm.instrument.list" data-autostart="true" data-trigger=""></tbody>
</table>
</div>
<div class="ui form">
    <div class="tree fields">
        <div class="four wide field">
            <div class="ui icon input">
                <input placeholder="{{ trans('messages.search') }}..." class="requester search" data-name="search" data-trigger="keyup paste" data-target="instrument-group-list"><i class="search icon"></i>
            </div>
        </div>
        <div class="field">
            <div class="ui selection dropdown  requester loadering" data-action="/currency" data-title="Currency" data-autostart="true" data-name="currency_id" data-trigger="change" data-target="instrument-group-list">
            </div>
        </div>
        <!-- <div class="field">
            <div class="ui selection dropdown requester loadering" data-action="/instrument" data-title="Pair" data-autostart="true" data-name="instrument_id" data-trigger="change" data-target="instrument-group-list"></div>
        </div> -->
    <!-- </div>
    <div class="fields floated right"> -->
        <div class="ten wide field">
            <button onclick="crm.instrument.groups.add()" class="icon ui primary button right floated"><i class="icon plus"></i>{{ trans('crm.instruments.groups.add') }}</button>
        </div>
    </div>

</div>
<table class="ui table padded attached sortable">
    <thead>
        <tr>
            <th class="one wide">ID</th>
            <th>Title</th>
            <th class="two wide">Fee</th>
            <th class="two wide">Spread</th>
            <th class="two wide">Forex</th>
            <th class="one wide">Instruments</th>
            <th class="tree wide">&nbsp;</th>
        </tr>
    </thead>
    <tbody class="loadering" data-name="instrument-group-list" data-action="/pairgroup" data-function="crm.instrument.groups.list" data-autostart="true" data-trigger="show"></tbody>
</table>
