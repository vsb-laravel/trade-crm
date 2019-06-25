<div class="ui relaxed list">
    @foreach($user->meta as $meta)
        <div class="ui item">
            <div class="content">
                <div class="header">{{ $meta->meta_name }}</div>
                <div class="description">
                    @can('admin')
                    <a class="ui icon link editor" onclick="{$('#edit_meta_{{$meta->id}}_edit').show();$(this).next('.static').hide();$(this).hide()}"><i class="ui pencil icon"></i></a>
                    <span class="static">{!! $meta->meta_value !!}</span>
                    <div class="submiter" data-action="/json/user/meta?meta_name={{$meta->meta_name}}" style="display:none;" id="edit_meta_{{$meta->id}}_edit">
                        <div class="ui fields">
                            <div class="field">
                                <div class="ui input">
                                    <input type="number" class="" data-name="open_price" value="{{ $meta->meta_value }}" />
                                </div>
                            </div>
                            <div class="field">
                                <button class="ui primary button submit">{{ trans('crm.save') }}</button>
                            </div>
                        </div>
                    </div>
                    @else
                        {!! $meta->meta_value ?? '' !!}
                    @endcan

                </div>
            </div>
            <div class="right floated content">
                {{ date("d/m/Y H:i:s",$meta->created_at->timestamp) }}
            </div>
        </div>
    @endforeach
</div>
