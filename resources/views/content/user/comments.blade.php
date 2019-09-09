<div class="ui horizontal divider">{{ trans('crm.customers.comments') }}</div>
<div class="ui clearing">
    <div class="ui comments">
        <div class="ui form submiter" data-action="/user/{{$user->id}}/comment" data-name="user-comment" data-callback="crm.comments.added">
            <div class="field">
                <textarea name="comment" data-name="comment" id="comment" placeholder="Enter comment text" required style="height:2rem;"></textarea>
            </div>
            <div class="field right aligned">
                <div class="ui blue labeled submit icon button disabled">
                    <i class="icon edit"></i> {{ trans('crm.customers.addcomment') }}
                </div>
            </div>

        </div>
        <div id="comment_list" style="max-height:24em;overflow-y: auto;margin-top:1em;position:relative;">
        @if(count($user->comments))

            @foreach($user->comments as $comment)
            <div class="comment">
                <a class="avatar">
                    <img src="/vendor/crm/images/avatar/{{$comment->author->id%5}}.jpg">
                </a>
                <div class="content">
                    <a class="author">{{$comment->author->name}} {{$comment->author->surname}}</a>
                    <div class="metadata">
                        <span class="date">{!! preg_replace('/(\d+\-\d+-\d+)\s(.+)/','$1<br/><small>$2</small>',$comment->created_at) !!}</span>
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
        </div>
    </div>
    <script>
        $('#comment:not(.comment-assigned)')
                .on('keyup change',function(e){
                    const $btn = $(this).parents('.submiter').find('.submit');
                    if($(this).val().length) $btn.removeClass('disabled');
                    else $btn.addClass('disabled');

                })
                .addClass('comment-assigned')
    </script>
</div>
