
<!-- Calendar theme -->
<link href="{{ asset('css/font-awesome.css') }}" rel="stylesheet">
<link href="{{ asset('css/fullcalendar.css') }}" rel="stylesheet">
<!-- end -->

<div class="ui modal fullscreen" id="lead_{{$lead->id}}_dashboard">
    <i class="close icon"></i>
    <div class="header">
        <i class="icon user"></i><code>#{{$lead->id}}</code> {{$lead->name}} {{$lead->surname}}
    </div>
    <div class="content scrolling">
        <div class="ui stackable grid">
            <div class="column six wide">

                <p>Created: <span class="lead-created">{{date("Y-m-d H:i:s",time($lead->created_at))}}</span></p>
                <div class="ui form submiter globe" data-action="/lead/{{$lead->id}}/update" data-callback="crm.lead.touch">
                    <div class="field">
                        <label>{{ trans('crm.leads.name') }}</label>
                        <div class="ui input">

                            <input data-name="name" value="{{$lead->name}}"/>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{ trans('crm.leads.surname') }}</label>
                        <div class="ui input">

                            <input data-name="surname" value="{{$lead->surname}}"/>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{ trans('crm.leads.email') }}</label>
                        <div class="ui input">
                            <input data-name="email" value="{{$lead->email}}" id="lead_email{{$lead->id}}"/>
                            <button class="ui basic right icon button" onclick="copyValue(this,'#lead_email{{$lead->id}}')"><i class="copy icon"></i></button>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{ trans('crm.leads.phone') }}</label>
                        <div class="ui input">
                            <input data-name="phone" value="{{$lead->phone}}" id="lead_phone{{$lead->id}}"/>
                            <button class="ui basic right icon button" onclick="copyValue(this,'#lead_phone{{$lead->id}}')"><i class="copy icon"></i></button>
                        </div>
                    </div>
                    <div class="field">
                        <label for="country">{{ trans('crm.leads.country') }}</label>
                        <select data-name="country" class="ui search fulltext dropdown">
                            @foreach($countries as $country)
                                <option value="{{$country["id"]}}" @if($lead->country==$country["id"]) selected="selected" @endif>{{$country["title"]}}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="field">
                        <label>{{ trans('crm.leads.manager') }}</label>
                        <select class="ui dropdown" data-name="manager_id">
                            @foreach($managers as $row)
                                <option value="{{$row->id}}" @if(!is_null($lead->manager) && $row->id==$lead->manager->id) selected="selected" @endif>
                                    {{$row->name}} {{$row->surname}}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="field">
                        <label>{{ trans('crm.leads.status') }}</label>
                        <select class="ui dropdown" data-name="status_id">
                            @foreach($statuses as $row)
                                <option value="{{$row->id}}"
                                    @if($lead->status_id == $row->id)
                                        selected="selected"
                                    @endif
                                    >{{$row->title}}</option>
                            @endforeach
                        </select>
                    </div>
                    <button class="ui button green submit">{{ trans('crm.save') }}</button>
                </div>
                @include('crm.content.lead.comments')
            </div>
            <div class="column ten wide">
                <div>
                    <input type="hidden" data-name="user_id" value="{{Auth::id()}}" />
                    <input type="hidden" id="object_id" data-name="object_id" value="{{$lead->id}}">
                    <input type="hidden" id="object_type" data-name="object_type" value="lead">
                    <input type="hidden" data-name="type_id" value="1">
                    <input type="hidden" data-name="status_id" value="1">
                    <input type="hidden" data-name="start_date">
                    <input  id ='taskIdAct' type="hidden">
                </div>
                <div class="ui column centered grid">
                    <div class="ui card">
                        <div class="content">
                            <h4 class="ui sub header">Task settings <i class="fa fa-question-circle-o fa-1x info-task" aria-hidden="true"></i></h4>
                            <div class="ui small feed">
                                <div class="event">
                                    <div class="content">
                                        <div class="ui grid">
                                            <div class="sixteen wide column">
                                                <div class="ui checkbox eight wide column">
                                                    <input type="checkbox" id="checkClosedTask">
                                                    <label>Show/Hide Closed Task</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="celendar_lead" style="margin-top: 25px;"></div>

            </div>
        </div>
    </div>
    <div class="actions">
        <div class="ui black deny button">
            {{ trans('crm.close') }}
        </div>
        <div class="ui positive right labeled icon button okclose">
            Ok
            <i class="checkmark icon"></i>
        </div>
    </div>
</div>
<script>
    page.modal("#lead_{{$lead->id}}_dashboard");
</script>

@include('crm.content.calendar_main.schedule_modal')
<script src="{{ asset('crm.3.0/js/scheduler/card_calendar.js') }}"></script>
<script src="{{ asset('crm.3.0/js/scheduler/func_calendar.js') }}"></script>
<script src="{{ asset('crm.3.0/js/scheduler/func_users_avalible_table.js') }}"></script>

<script type="text/javascript">

    $(".info-task").popup({
        html: $('#infoContent').html(),
        position: 'bottom left',
        inline: true,
    });

    calendarCard('#celendar_lead', $('#object_id').val(), $('#object_type').val());

</script>
