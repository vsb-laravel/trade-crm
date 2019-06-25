<div class="ui header">{{ trans('crm.newsfeed.header') }}</div>
<div class="ui form">
    @csrf
    <div class="fields">
        <div class="four wide field">
            <div class="ui icon input">
                <input placeholder="Поиск" class="requester search" data-name="search" data-trigger="keyup" data-target="newsfeed-list"><i class="search icon"></i>
            </div>
        </div>
        <div class="field">
            <div class="ui search selection dropdown loadering requester" data-id="user-list" data-title="Все авторы" data-name="user_id" data-action="/json/user?assigner=1" data-autostart="true" data-trigger="change" data-target="newsfeed-list"></div>
        </div>
        <div class="field">
            <div class="ui icon labeled calendar-notime input" >
                <div class="ui label"  onclick="$(this).next().val('').change();"><i class="ui refresh icon"></i></div>
                <input type="text" class="-ui-calendar requester" placeholder="Дата(от)" data-name="date_from" data-target="newsfeed-list"  data-trigger="change"/>
                <i class="calendar icon"></i>
            </div>
        </div>
        <div class="field">
            <div class="ui icon labeled calendar-notime input" >
                <div class="ui label"  onclick="$(this).next().val('').change();"><i class="ui refresh icon"></i></div>
                <input type="text" class="-ui-calendar requester" placeholder="Дата(до)" data-name="date_to" data-target="newsfeed-list"  data-trigger="change"/>
                <i class="calendar icon"></i>
            </div>
        </div>
        <div class="field">
            <button onclick="crm.newsfeed.add()" class="icon ui primary button"><i class="icon plus"></i>{{ trans('crm.table.add') }}</button>
        </div>
    </div>
</div>
<table class="ui table padded attached selectable sortable">
    <thead>
        <tr>
            <th class="two wide">Дата <div class="arrow sorter" data-name="created_at" data-trigger="click" data-target="newsfeed-list" data-value="asc"><span></span><span></span></div></th>
            <!-- <th class="four wide">Author<div class="arrow sorter" data-name="user_id" data-trigger="click" data-target="newsfeed-list" data-value="asc"><span></span><span></span></div></th> -->
            <th class="twelve wide">Новость<div class="arrow sorter" data-name="title" data-trigger="click" data-target="newsfeed-list" data-value="asc"><span></span><span></span></div></th>
            <th class="two wide">Публикация<div class="arrow sorter" data-name="published" data-trigger="click" data-target="newsfeed-list" data-value="asc"><span></span><span></span></div></th>
        </tr>
    </thead>
    <tbody class="loadering" data-name="newsfeed-list" data-action="/newsfeed" data-function="crm.newsfeed.render" data-need-loader="true" data-autostart="true"></tbody>
</table>
