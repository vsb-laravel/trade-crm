<div class="ui form">

        @foreach($options as $option)
            <div class="fields left aligned">
                <div class="field submiter loadering" data-action="/option/{{$option->id}}" data-method="put" data-name="option-{{$option->id}}">
                    @if ($option->type=="boolean")
                        <div class="ui slider checkbox resource">
                            <input  data-name="value" type="checkbox" @if($option->value=="1") checked="checked" @endif name="{{$option->name}}" onchange="$(this).closest('.submiter').find('.submit').click()"/>
                            <label>@lang('crm.option.'.$option->name)</label>
                        </div>
                    @elseif($option->type=="select")
                        <label>@lang('crm.option.'.$option->name)</label>
                        <div class="ui search selection dropdown loadering resource" data-value="{{$option->value}}" data-title="Default admin" data-name="value" data-action="/json/user?admins=1&per_page=256" data-autostart="true" onchange="$(this).closest('.submiter').find('.submit').click()"></div>
                    @else
                        <label>@lang('crm.option.'.$option->name)</label>
                        <input class="ui input resource" data-name="value" type="text" name="{{$option->name}}" value="{{$option->value}}" onchange="$(this).closest('.submiter').find('.submit').click()"/>
                    @endif
                    <input type="hidden" data-name="user_id" value="{{Auth::id()}}" />
                    <input type="hidden" data-name="_token" value="{{ csrf_token() }}" />

                    <input type="hidden" class="submit" />
                </div>
                <br />
            </div>
        @endforeach

    <!-- </div> -->
    <!-- <div class="row">
        <div class="column">
            <button class="submit ui button green labeled icon right floated"><i class="save icon"></i> Save</button>
        </div>
    </div> -->

</div>
