<div class="ui horizontal divider">{{ trans('crm.customers.comments') }}</div>

<div class="ui clearing">
<div class="ui comments">
    <div class="ui form submiter" data-action="/lead/{{$lead->id}}/comment" data-name="lead-comment" data-callback="crm.comments.added">
        <div class="field">
            <textarea name="comment" data-name="comment" id="comment" placeholder="Enter comment text"></textarea>
        </div>
        <div class="ui blue labeled submit icon button">
            <i class="icon edit"></i> {{ trans('crm.customers.addcomment') }}
        </div>
    </div>
    @if(count($lead->comments))
        @foreach($lead->comments as $comment)
        <div class="comment">
            <a class="avatar">
                <img src="/vendor/crm/images/avatar/{{$comment->author->id%5}}.jpg">
            </a>
            <div class="content">
                <a class="author">{{$comment->author->name}} {{$comment->author->surname}}</a>
                <div class="metadata">
                    <span class="date">{{$comment->created_at}}</span>
                </div>
                <div class="text">
                    {{$comment->comment ?? ''}}
                </div>
                <!-- <div class="actions">
                    <a class="reply">Reply</a>
                </div> -->
            </div>
        </div>
        @endforeach
    @else
        <div class="comment empty">No Comments</div>
    @endif
    <script>
        // $(document).ready(()=>{
            $('#comment:not(.comment-assigned)')
                .on('keyup change',function(e){
                    const $btn = $(this).parents('.submiter').find('.submit');
                    if($(this).val().length) $btn.removeClass('disabled');
                    else $btn.addClass('disabled');

                })
                .addClass('comment-assigned')
        // });

    </script>
</div>
</div>
