<table class="ui attached padded selectable stackable table">
    <thead>
        <th>Date</th>
        <th>Event</th>
    </thead>
    <tbody class="loadering" data-name="user-log" data-action="/json/user/{{$user->id}}/history" data-function="crm.user.log" data-autostart="true"></tbody>
</table>
