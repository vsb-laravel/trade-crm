
<!-- Calendar theme -->
<link href="{{ asset('css/font-awesome.css') }}" rel="stylesheet">
<link href="{{ asset('css/fullcalendar.css') }}" rel="stylesheet">
<!-- end -->

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

<div class="submiter ui form list-group-item">
    <input type="hidden" data-name="user_id" value="{{Auth::id()}}" />
    <input type="hidden" id="object_id" data-name="object_id" value="{{$user->id}}">
    <input type="hidden" id="object_type" data-name="object_type" value="user">
    <input type="hidden" data-name="type_id" value="1">
    <input type="hidden" data-name="status_id" value="1">
    <input type="hidden" data-name="start_date">
    <input  id ='taskIdAct' type="hidden">
</div>

<div id='calendar_user'  class="user-card" style="margin-top: 25px;"></div>

@include('crm.content.calendar_main.schedule_modal')

<script src="{{ asset('crm.3.0/js/scheduler/card_calendar.js') }}"></script>
    <!-- Calendar -->
<script src="{{ asset('crm.3.0/js/scheduler/func_calendar.js') }}"></script>
<script src="{{ asset('crm.3.0/js/scheduler/func_users_avalible_table.js') }}"></script>
    <!-- End Calendar -->

<script type="text/javascript">

    $('.task-user-item').on('click', function() {

        $(".info-task").popup({
            html: $('#infoContent').html(),
            position: 'bottom left',
            inline: true,
        });

        calendarCard('#calendar_user', $('#object_id').val(), $('#object_type').val());
    })


</script>
