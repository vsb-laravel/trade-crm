<div class="ui header">{{ trans('crm.options.merchants') }}</div>
<table class="ui table padded attached">
    <thead>
        <tr>
            <th class="one wide">ID <div class="arrow sorter" data-name="id" data-trigger="click" data-target="instrument-list" data-value="asc"><span></span><span></span></div></th>
            <th>Enabled <div class="arrow sorter" data-name="enabled" data-trigger="click" data-target="instrument-list" data-value="asc"><span></span><span></span></div></th>
            <th>Name <div class="arrow sorter" data-name="name" data-trigger="click" data-target="instrument-list" data-value="asc"><span></span><span></span></div></th>
            <th>Default <div class="arrow sorter" data-name="default" data-trigger="click" data-target="instrument-list" data-value="asc"><span></span><span></span></div></th>
        </tr>
    </thead>
    <tbody class="loadering" data-action="/json/merchant?enabled=0,1" data-name="merchants-list" data-function="crm.merchant.list" data-autostart="true" data-need-loader="true"></tbody>
</table>
