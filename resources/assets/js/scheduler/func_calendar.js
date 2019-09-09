$( document ).ready(function() {

    if($('.container').is('.calendar'))
    {
        console.log('calendar_main');

        $(".info-task").popup({
            html: $('#infoContent').html(),
            inline: true,
        });

        $('.calendar-picker').calendar();

        $('body').on('click', '.hide-popup', function() {
            $(this).parent().removeClass('popup');
        });

        $(function() {
            var todayDate = moment().startOf('day');
            var YM = todayDate.format('YYYY-MM');
            var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
            var TODAY = todayDate.format('YYYY-MM-DD');
            var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');
            var dataEvents = $('#dataEvents').text();


            $('#calendar_scheduler').fullCalendar({
                defaultView: 'agendaWeek',
                navLinks: true,
                selectable: true,
                nowIndicator: true,
                businessHours: true,
            // themeSystem: 'pulse',
            allDaySlot:false,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listWeek'
            },
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            navLinks: true,
            viewRender: function(view) {
               // $('.popover').not(this).removeClass('show');

            },
            events: function(start, end, timezone, callback) {
               // $('.popover').not(this).removeClass('show');

               let viewDate = DateDiff(new Date(end.format()), new Date(start.format()));
               let checkClosedTask = $('#checkClosedTask').prop('checked');
               switch(viewDate)
               {
                    case 1:
                    scaleDate = 'day';
                    break;
                    case 7:
                    scaleDate = 'week';
                    break;
                    case 42:
                    scaleDate = 'month';
                    break;
                    default:
                    scaleDate = '';
                    break;
                }

                $.ajax({
                    type: 'POST',
                    url:'/get_tasks',
                    data: {
                        start_date:start.format(),
                        end_date:end.format(),
                        scaleDate:scaleDate,
                        checkClosedTask:checkClosedTask,
                        _token: $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function (data)
                    {
                        var events = [];

                        $.each(data.tasks, function(i, val) {
                            switch (val.status_id)
                            {
                                case 1:
                                color = '#3a87ad';
                                break;
                                case 2:
                                color = '#d64518';
                                break;
                                case 3:
                                color = '#43d60d';
                                break;
                                default:
                                classTask = '';
                                break;
                            }

                            events.push({
                                id: val.id,
                                title: val.title,
                                start: val.start_date,
                                end: val.end_date,
                                status: val.status_id,
                                color:color
                            });
                        });

                        callback(events);
                    }
                });
            },
            eventResize:function(event, delta, revertFunc, jsEvent, ui, view ) {
               // $('.popover').not(this).removeClass('show');

                data = {start_date:event.start.format(), end_date:event.end.format(), id:event.id};

                dragResizeTask(data,event,revertFunc, view);
            },

            eventDrop:function(event, delta, revertFunc, jsEvent, ui, view ) {
               // $('.popover').not(this).removeClass('show');

               if(event.status == 3 || event.status == 2)
               {
                    revertFunc();

                    return false;
                }

                data = {start_date:event.start.format(), end_date:event.end.format(), id:event.id};

                dragResizeTask(data,event,revertFunc, view);
            },
            eventRender: function(event, element){
                //$('.popover').not(this).removeClass('show');

                let buttons = "<button data-toggle='tooltip' title='Edit Task' type ='button' id-task='"+event.id+"'' class='btn hide-popup btn-default  fa fa-pencil fa-2x edit-task'>"
                              + "</button>&nbsp;<button type ='button' data-toggle='tooltip' title='Delete Task' id-task='"+event.id+"'' class='btn hide-popup btn-danger fa fa-trash fa-2x delete-task'></button>"
                              + "&nbsp<button type ='button' data-toggle='tooltip' title='Closed Task' id-task='"+event.id+"'' class='btn hide-popup btn-dark fa fa-times fa-2x closed-task'></button>";

                switch (event.status)
                {
                    case 1:
                    // buttons +=  "&nbsp;</button>&nbsp;<button type ='button' data-toggle='tooltip' title='Start Task' id-task='"+event.id+"'' class='btn hide-popup btn-success  fa fa-caret-square-o-right fa-2x start-task'></button>";
                    break;
                    case 2:
                    // buttons =  "</button>&nbsp;<button type ='button' data-toggle='tooltip' title='Delete Task' id-task='"+event.id+"'' class='btn hide-popup btn-danger fa fa-trash fa-2x delete-task'></button>"
                    // + "&nbsp;<button data-toggle='tooltip' title='Refresh Task' type ='button' id-task='"+event.id+"'' class='btn hide-popup btn-info  fa fa-repeat fa-2x renew-task'>"
                    // + "&nbsp;</button>&nbsp;<button type ='button' data-toggle='tooltip' title='Closed Task' id-task='"+event.id+"'' class='btn hide-popup btn-dark fa fa-times fa-2x closed-task'></button>"

                    // classTask = 'progress-bar-striped';
                    break;
                    case 3:
                    buttons = "</button>&nbsp;<button type ='button' data-toggle='tooltip' title='Delete Task' id-task='"+event.id+"'' class='btn hide-popup btn-danger fa fa-trash fa-2x delete-task'></button>";
                    break;
                    default:
                    classTask = '';
                    break;
                }

                if(typeof event.title === 'undefined')
                {
                    event.title = '';
                }

                element.popup({
                    on:'click',
                    html:buttons,
                    title:event.title,
                });

            },
            eventClick: function(event, jsEvent, view) {
                // $('.popover').not(this).removeClass('show');
                // $(this).popover ('toggle').attr('data-trigger', 'focus');
            },
            select: function(startDate, endDate) {

                clearModalInput();

                $('.modal-input').removeClass('ui input error').val('');
                $('#addTaskModal').modal('show');
                $('#startTime').val(startDate.format('llll'));
                $('#endTime').val(endDate.format('llll'));
                },
            });
        });

        $('#checkClosedTask').on('click', function () {

            if($(this).prop('checked') == true)
            {
                $('.closed-info').removeClass('d-none');
            }
            else
            {
                $('.closed-info').addClass('d-none');
            }

                // $('#calendar_scheduler').fullCalendar('removeEventSources');

                $('#calendar_scheduler').fullCalendar('rerenderEvents');
                $('#calendar_scheduler').fullCalendar('refetchEvents');

        });

        $('body').on("click", '.closed-task', function() {
            //$('.popover').not(this).removeClass('show');

            let taskId = $(this).attr('id-task');

            swal({
                title: 'Are you sure you want to close this task?',
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, closed it!'
            }).then((result) => {
                if (result.value) {
                    $.ajax({
                        type: 'PUT',
                        url: '/edit_task',
                        data: {
                            id: taskId,
                            type: 'closed_status',
                            _token: $('meta[name="csrf-token"]').attr('content')
                        },
                        error: function () {
                            swal({
                                type: 'error',
                                title: 'Oops...',
                                text: 'An error has occurred. Please reload the page and try again!',
                            });
                        },
                        success: function (data) {
                            if (data.success == true)
                            {

                                if($('#checkClosedTask').prop('checked') == true)
                                {
                                    thisEvent = $("#calendar_scheduler").fullCalendar('clientEvents', taskId);

                                    eventData = {
                                        id:thisEvent[0].id,
                                        title: thisEvent[0].title,
                                        start: thisEvent[0].start.format(),
                                        end: thisEvent[0].end.format(),
                                        status:3,
                                        color: '#43d60d',
                                        // fromSelect: true,
                                    };
                                    $("#calendar_scheduler").fullCalendar('removeEvents', taskId);
                                    $('#calendar_scheduler').fullCalendar('renderEvent', eventData);
                                }
                                else
                                {
                                    $("#calendar_scheduler").fullCalendar('removeEvents', taskId);
                                }

                            }
                        }
                    });
                }
            });
        });


        $('body').on("click", '.edit-task, .renew-task', function() {
            $('.modal-input').removeClass('ui input error').val('');
            $('.edit-role').removeClass('active selected');

            taskId = $(this).attr('id-task');

            $.ajax({
                type: 'POST',
                url:'/show_task',
                data: {
                    id:taskId,
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                error: function ()
                {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'An error has occurred. Please reload the page and try again!',
                    });
                },
                success: function (data)
                {
                    if(data.task)
                    {
                        //$('.popover').removeClass('show');
                        $('.modal span.invalid-feedback').remove();
                        $('.modal-input').removeClass('ui input error').val('');
                        $('#userRoleEdit').dropdown('set selected', data.task['object_type']);
                        $('#noticeTaskEdit').val(data.task['text']);
                        $('#titleTaskEdit').val(data.task['title']);
                        $('#taskId').val(data.task['id']);
                        $('.startTimeEdit').calendar("set date", new Date(data.task['start_date']));
                        $('.endTimeEdit').calendar("set date", new Date(data.task['end_date']));

                        if(data.task['email'])
                        {
                            userInfo = data.task['name'] + ' ' + data.task['surname'] + ' ' + data.task['email'];

                            $('#searchUserEdit').attr('id-user', data.task['id-user']);
                        }
                        else
                        {
                            userInfo = "";
                        }

                        $('#searchUserEdit').val(userInfo);
                        $('#updateTaskModal').modal('show');
                    }
                }
            });
        });

        $('#updateTask').on("click", function() {
            clearModalInput();

            startTime = $('#startTimeEdit').val();
            endTime = $('#endTimeEdit').val();
            notice = $('#noticeTaskEdit').val();
            title = $('#titleTaskEdit').val();
            userId = $('#searchUser').attr('id-user');
            id = $('#taskId').val();
            objectType = $('#userRoleEdit').val();

            $.ajax({
                type: 'PUT',
                url:'/edit_task',
                data: {
                    id:id,
                    start_date:startTime,
                    end_date:endTime,
                    object_type:objectType,
                    object_id:userId,
                    text:notice,
                    type: 'new_status',
                    title:title,
                    _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function (data)
            {
                flagError = false;

                if(data.object_id)
                {
                    $('#searchUserEdit').addClass('ui input error');
                    $('#searchUserEditDiv').append("<div class='ui basic red pointing prompt label transition visible'>This user does not exist</div>");

                    flagError = true;
                }

                if(data.object_type)
                {
                    $('#userRoleEdit').addClass('ui input error');
                    $('#userRoleEditDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.object_type + "</div>");

                    flagError = true;
                }


                if(data.start_date)
                {
                    $('#startTimeEdit').addClass('ui input error');
                    $('#startTimeEditDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.start_date + "</div>");

                    flagError = true;
                }

                if(data.end_date)
                {
                    $('#endTimeEdit').addClass('ui input error');
                    $('#endTimeEditDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.end_date + "</div>");

                    flagError = true;
                }

                if(data.text)
                {
                    $('#noticeTaskEdit').addClass('ui input error');
                    $('#noticeTaskEditDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.text + "</div>");

                    flagError = true;
                }

                if(data.title)
                {
                    $('#titleTaskEdit').addClass('ui input error');
                    $('#titleTaskEditDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.title + "</div>");

                    flagError = true;
                }

                if(flagError == false && data.success == true)
                {
                    $("#calendar_scheduler").fullCalendar('removeEvents', taskId);

                    eventData = {
                        id:taskId,
                        title: data.task['title'],
                        start: startTime,
                        status:data.task['status_id'],
                        end: endTime,
                        };

                        $('#calendar_scheduler').fullCalendar('renderEvent', eventData);
                        $('#updateTaskModal').modal('hide');

                        notificationTasks(startTime,data.task['title'], userId, notice);
                    }
                }
            });
        });

        $('body').on("click", '.delete-task', function() {
               // $('.popover').not(this).removeClass('show');

               let taskId = $(this).attr('id-task');

               swal({
                title: 'Are you sure you want to delete this task?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value)
                {
                    $.ajax({
                        type: 'DELETE',
                        url:'/delete_task',
                        data: {
                            id:taskId,

                            _token: $('meta[name="csrf-token"]').attr('content')
                        },
                        error: function ()
                        {
                            swal({
                                type: 'error',
                                title: 'Oops...',
                                text: 'An error has occurred. Please reload the page and try again!',
                            });
                        },
                        success: function (data)
                        {
                            if(data.success == true)
                            {
                                $("#calendar_scheduler").fullCalendar('removeEvents', taskId);
                                swal(
                                    'Deleted!',
                                    'You have disabled this use',
                                    'success'
                                    );
                            }

                        }
                    });
                }
            });
        });

        $('#createTask').on("click", function() {
            clearModalInput();
            let startTime = $('#startTime').val();
            let endTime = $('#endTime').val();
            let notice = $('#noticeTask').val();
            let title = $('#titleTask').val();
            let objectType = $('#userRole').val();
            let userId = $('#searchUser').attr('id-user');

            $.ajax({
                type: 'POST',
                url: '/task_add',
                data: {
                    start_date: startTime,
                    object_id: userId,
                    end_date: endTime,
                    object_type:objectType,
                    text: notice,
                    title: title,
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                error: function ()
                {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'An error has occurred. Please reload the page and try again!',
                    });
                },
                success: function (data) {
                    flagError = false;

                    if(data.object_id)
                    {
                        $('#searchUser').addClass('ui input error');
                        $('#searchUserDiv').append("<div class='ui basic red pointing prompt label transition visible'>This user does not exist</div>");

                        flagError = true;
                    }

                    if(data.object_type)
                    {
                        $('#userRole').addClass('ui input error');
                        $('#userRoleDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.object_type + "</div>");

                        flagError = true;
                    }

                    if(data.start_date)
                    {
                        $('#startTime').addClass('ui input error');
                        $('#startTimeDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.start_date + "</div>");

                        flagError = true;
                    }

                    if(data.end_date)
                    {
                        $('#endTime').addClass('ui input error');
                        $('#endTimeDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.end_date + "</div>");

                        flagError = true;
                    }

                    if(data.text)
                    {
                        $('#noticeTask').addClass('ui input error');
                        $('#noticeTaskDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.text + "</div>");

                        flagError = true;
                    }

                    if(data.title)
                    {
                        $('#titleTask').addClass('ui input error');
                        $('#titleTaskDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.title + "</div>");

                        flagError = true;
                    }


                    if(flagError == false && data.newTask) {
                        eventData = {
                            id: data.newTask['id'],
                            title: data.newTask['title'],
                            start: startTime,
                            end: endTime,
                            status:data.newTask['status_id'],
                            fromSelect: true
                        };

                        $('#calendar_scheduler').fullCalendar('renderEvent', eventData);
                        $('#addTaskModal').modal('hide');

                        console.log(startTime);
                        notificationTasks(startTime,data.newTask['title'], userId, notice);
                    }
                }
            });
        });
    }
});

function dragResizeTask (data,event,revertFunc,view) {
    data._token = $('meta[name="csrf-token"]').attr('content');

    $.ajax({
        type: 'PUT',
        url:'/edit_task',
        data: data,
        success: function (data)
        {
            if(data.start_date)
            {
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: data.start_date,
                });
            }

            if(data.success == true)
            {
                $('#calendar_scheduler').fullCalendar('updateEvent', event);
                notificationTasks(data.task['start_date'], data.title_task, data.object_id_task, data.notice_task);

                return true;
            }

            revertFunc();
        }
    });
}

function clearModalInput () {
    $('.ui.basic.red').remove();
    $('.modal-input').removeClass('ui input error');

    return true;
}

function DateDiff(date1, date2) {
    var datediff = date1.getTime() - date2.getTime();

    return (datediff / (24*60*60*1000));
}

function changeEvent(taskId, color) {
    thisEvent = $("#calendar_scheduler").fullCalendar('clientEvents', taskId);

    eventData = {
        id:thisEvent[0].id,
        title: thisEvent[0].title,
        start: thisEvent[0].start.format(),
        end: thisEvent[0].end.format(),
        status:2,
        color: color,
        // fromSelect: true,
    };

    $("#calendar_scheduler").fullCalendar('removeEvents', taskId);
    $('#calendar_scheduler').fullCalendar('renderEvent', eventData);
}

function notificationTasks(startDate,title,object_id,text)
{
    let startNotif = new Date(startDate);
    startNotif = startNotif.getTime() - 5*60*1000;
    startNotif = new Date(startNotif);

    setInterval(function () {
        let date = new Date();

        if (date.getDate() == startNotif.getDate() &&
            date.getHours() == startNotif.getHours() &&
            (date.getMinutes() - startNotif.getMinutes() <= 5) &&
            (date.getMinutes() - startNotif.getMinutes() >=0)
            )
        {
            $().toastmessage('showToast', {
                 text     : `${title}<br>${text}<br><a onclick="crm.user.info(${object_id})">Просмотреть</a>`,
                 sticky   : true,
                 position : 'top-right',
                 type     : 'notice',
                 closeText: '',
            });
        }
    }, 60000);
}
