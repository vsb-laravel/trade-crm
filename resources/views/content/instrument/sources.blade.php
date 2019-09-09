<div class="ui header">{{ trans('messages.sources') }}</div>
<table class="ui table padded attached">
    <thead>
        <tr>
            <th class="one wide">ID <div class="arrow sorter" data-name="id" data-trigger="click" data-target="instrument-list" data-value="asc"><span></span><span></span></div></th>
            <th>Name <div class="arrow sorter" data-name="updated_at" data-trigger="click" data-target="instrument-list" data-value="asc"><span></span><span></span></div></th>
            <th>Url <div class="arrow sorter" data-name="created_at" data-trigger="click" data-target="instrument-list" data-value="asc"><span></span><span></span></div></th>
        </tr>
    </thead>
    <tbody>
        @foreach($sources as $source)
        <tr>
            <td>{{$source->id}}</td>
            <td>{{$source->name}}</td>
            <td>{{$source->url}}</td>
        </tr>
        @endforeach
    </tbody>
</table>
