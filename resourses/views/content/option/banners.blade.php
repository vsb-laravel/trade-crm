<div class="ui header">{{ trans('crm.options.banners') }}</div>
<div class="field">
    <button onclick="crm.banners.add(this)" class="add ui primary button labeled icon"><i class="plus icon"></i>{{ trans('crm.add') }}</button>
</div>
<table class="ui table padded attached">
    <thead>
        <tr>
            <th class="one wide">ID <div class="arrow sorter" data-name="id" data-trigger="click" data-target="instrument-list" data-value="asc"><span></span><span></span></div></th>
            <th>{{ trans('crm.data') }}<div class="arrow sorter" data-name="updated_at" data-trigger="click" data-target="instrument-list" data-value="asc"><span></span><span></span></div></th>
            <th>{{ trans('crm.url') }}<div class="arrow sorter" data-name="created_at" data-trigger="click" data-target="instrument-list" data-value="asc"><span></span><span></span></div></th>
        </tr>
    </thead>
    <tbody class="loadering" data-action="/banner" data-name="banners-list" data-function="crm.banners.index" data-autostart="true" data-need-loader="true"></tbody>
</table>
