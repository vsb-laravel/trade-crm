{{--Bootstrap 4--}}
   <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"> -->
    <link href="{{ asset('css/font-awesome.css') }}" rel="stylesheet">
    <link href="{{ asset('css/fullcalendar.css') }}" rel="stylesheet">
    
<!--     <link href="{{ asset('css/dataTables.1.10.16.bootstrap4.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/dataTables.1.10.15.bootstrap4.media.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/dataTables.1.10.15.extensions.bootstrap4.css') }}" rel="stylesheet"> -->
{{--End--}}

<div class="container calendar" style="position:sticky">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <div class="ui column centered grid">
        <div class="ui card">
            <div class="content">
                <h4 class="ui sub header">Task info</h4>
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
                   <div class="event">
                        <div class="content">
                            <div class="ui form">
                                <div class="inline fields">
                                    <div class="eight wide column  field">
                                        <input type="text" style="background: #3a87ad;">
                                    </div>
                                    <div class="eight wide column">
                                        <label>New Task</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="event">
                        <div class="content">
                            <div class="ui form">
                                <div class="inline fields">
                                    <div class="eight wide column  field">
                                        <input type="text" style="background: #d64518;">
                                    </div>
                                    <div class="eight wide column">
                                        <label>Open Task</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="event">
                        <div class="content">
                            <div class="ui form">
                                <div class="inline fields">
                                    <div class="eight wide column  field">
                                        <input type="text" style="background: #43d60d;">
                                    </div>
                                    <div class="eight wide column">
                                        <label>Closed Task</label>
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

@include('crm.content.scheduler.schedule_modal')
