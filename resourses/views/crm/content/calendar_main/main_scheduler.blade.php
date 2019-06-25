

<link href="{{ asset('css/font-awesome.css') }}" rel="stylesheet">
<link href="{{ asset('css/fullcalendar.css') }}" rel="stylesheet">

<div class="container calendar" style="position:sticky;width: 100%;">
    <meta name="csrf-token" content="{{ csrf_token() }}">

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


    <div id='calendar_scheduler' style="margin-top: 25px;"></div>

</div>

@include('crm.content.calendar_main.schedule_modal')
