class Scheduler {
    constructor() {
        this.data=[];
        // const $c = $('#scheduler');
        // if($c.length && !$c.hasClass('rendered')) {
        //     this.render($c);
        //     $c.addClass('rendered');
        // }
    }
    list($c, d, x, s) {
        crm.task.data = d;
        // return;
        if($c.hasClass('rendered')){
            $('.daycell .label').remove();
            d.map( (task,i) => scheduler.setTask(task) );
        }else{
            crm.task.render($c,d);
        }

    }
    setTask(task){
        const tdate = new Date(task.start_date),
            colors = ['green','olive','yellow','blue','purple','orange'];
        let colorIndex = task.id%colors.length,
            $cell = $(`[data-year=${tdate.getFullYear()}][data-month=${tdate.getMonth()}][data-day=${tdate.getDate()}]`);
        if($.inArray(this.state.view,['month','year']) === -1){
            $cell = $(`[data-year=${tdate.getFullYear()}][data-month=${tdate.getMonth()}][data-day=${tdate.getDate()}][data-hour=${tdate.getHours()}]`);
        }
        if(this.state.view === 'year'){
            colorIndex = tdate.getDate()%colors.length;
            $cell = ($cell.find('.label').length==0) ? $(`<div class="ui label color ${(tdate.getTime()<(new Date).getTime())?'red':colors[colorIndex]}">0</div>`).appendTo($cell)
                :$cell.find('.label');

            $cell.html( parseInt($cell.html())+1);
        }
        else $(`<div class="ui label color ${(tdate.getTime()<(new Date).getTime())?'red':colors[colorIndex]}">`
            + (
                task.object
                    ? '<i class="icon ' +(
                        task.object_type == 'lead'
                            ? 'user outline'
                            : 'user'
                        ) +`"></i><a href="javascript:crm.${task.object_type}.info('${task.object_id}')">${task.object.name} ${task.object.surname}</a><br>`
                    : ''
                )
            + `${task.text}</div>`).css('cursor','pointer').appendTo($cell).on('click',function(){

                let $c = $(`<div class="ui modal small submiter" id="edit_task" data-action="/task/${task.id}/update" data-callback="crm.task.onchange">
                    <i class="close icon"></i>
                    <div class="header"><i class="icon calendar"></i>Edit task</div>
                    <div class="ui content form">
                        <input type="hidden" data-name="object_id" value="${task.object_id || ''}"/>
                        <input type="hidden" data-name="object_type" value="${task.object_type || ''}"/>
                        <input type="hidden" data-name="user_id" value="${system.user.id}"/>
                        <input type="hidden" data-name="status_id" value="${task.status_id}"/>
                        <input type="hidden" data-name="type_id" value="${task.type_id}"/>
                        <div class="field four wide">
                            <label>Datetime</label>
                            <div class="ui calendar">
                                <div class="ui left icon input">
                                    <i class="calendar icon"></i>
                                    <input type="text" class="-ui-calendar" data-name="start_date" />
                                </div>
                            </div>
                        </div>
                        <div class="ui fields two wide">
                            <div class="field">
                                <label>Customer:</label>
                                <div class="ui search user-search">
                                    <div class="ui icon input">
                                        <input class="prompt" type="text" placeholder="Customer search..." value="`+(task.object&&task.object_type==='user'?task.object.name+' '+task.object.surname:'')+`"><i class="search icon"></i>
                                    </div>
                                    <div class="results"></div>
                                </div>
                            </div>
                            <div class="field">
                                <label>Lead:</label>
                                <div class="ui search user-search">
                                    <div class="ui icon input">
                                        <input class="prompt" type="text" placeholder="Customer search..." value="`+(task.object&&task.object_type==='lead'?task.object.name+' '+task.object.surname:'')+`"><i class="search icon"></i>
                                    </div>
                                    <div class="results"></div>
                                </div>
                            </div>
                        </div>
                        <div class="ui field">
                            <textarea data-name="text">${task.text}</textarea>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="ui positive button submit">Save</button>
                    </div>
                </div>`)
                    .appendTo('#modals');
                console.debug('edit task',task);
                $('.user-search').search({
                    apiSettings: {
                        url: '/json/user?search={query}',
                        onResponse: function(result) {
                            let response = {results: []};
                            result.data.map((u,i)=>{
                                response.results.push({
                                    id: u.id,
                                    title: u.name + ' ' + u.surname,
                                    description: `#<strong><code>${u.id}</code></strong> ${u.rights.title}`
                                });
                            })
                            return response;
                        }
                    },
                    onSelect: function(result, response) {
                        // console.debug('onSelect', result, response,$modal.find('[data-name=user_id]'));
                        $c.find('[data-name=object_id]').val(result.id);
                        $c.find('[data-name=object_type]').val('user');
                    },
                    minCharacters: 3
                });
                $('.lead-search').search({
                    apiSettings: {
                        url: '/lead/list/json?search={query}',
                        onResponse: function(result) {
                            let response = {results: []};
                            result.data.map((u,i) => {
                                response.results.push({
                                    id: u.id,
                                    title: u.name + ' ' + u.surname,
                                    description: `#<strong><code>${u.id}</code></strong> Lead`
                                });
                            })
                            return response;
                        }
                    },
                    onSelect: function(result, response) {
                        // console.debug('onSelect', result, response,$modal.find('[data-name=user_id]'));
                        $c.find('[data-name=object_id]').val(result.id);
                        $c.find('[data-name=object_type]').val('lead');
                    },
                    minCharacters: 3
                });
                $('.ui.calendar').calendar('set date',new Date(task.start_date));

                page.modal('#edit_task');
            });
    }
    setDateTime(that){
        const date = $(that).attr('data-year') + '-' +(1+parseInt($(that).attr('data-month'))).leftPad()+'-'+$(that).attr('data-day').leftPad();
        const time = $(that).attr('data-hour').leftPad() + ':00:00'

        // $('[key="date"]').val(date).change();
        // $('[key="time"]').val(time).change();
        $('.daycell').removeClass('positive');
        $('#task_add').slideDown();$('#task_toggler').removeClass('plus').addClass('angle up');
        $('[data-name=start_date]').parents('.ui.calendar').calendar('set date',new Date(date+' '+time));

        $(that).addClass('positive');
    }
    reviewMonth(v){
        this.state.date.setUTCMonth(v);
        this.setState({view:'month'});
    }
    setState(newstate){
        this.state = $.extend(this.state,newstate);
        this.state.needRender=true;
        this.render();
    }
    decrease(){
        switch(this.state.view){
            case '1d': this.state.date.setUTCDate(this.state.date.getDate()-1); break;
            case '3d': this.state.date.setUTCDate(this.state.date.getDate()-3); break;
            case '5d': this.state.date.setUTCDate(this.state.date.getDate()-5); break;
            case 'week': this.state.date.setUTCDate(this.state.date.getDate()-7); break;
            case 'month':this.state.date.setUTCMonth(this.state.date.getMonth()-1);break;
            case 'year': this.state.date.setUTCFullYear(this.state.date.getFullYear()-1); break;
        }
        this.state.needRender=true;
        this.render();
    }
    increase(){
        console.debug('increase',this);
        switch(this.state.view){
            case '1d': this.state.date.setUTCDate(this.state.date.getDate()+1); break;
            case '3d': this.state.date.setUTCDate(this.state.date.getDate()+3); break;
            case '5d': this.state.date.setUTCDate(this.state.date.getDate()+5); break;
            case 'week': this.state.date.setUTCDate(this.state.date.getDate()+7); break;
            case 'month':this.state.date.setUTCMonth(this.state.date.getMonth()+1);break;
            case 'year': this.state.date.setUTCFullYear(this.state.date.getFullYear()+1); break;
        }
        this.state.needRender=true;
        this.render();
    }
    render($c = false,d=false){
        // return;
        console.debug('scheduler needRender:',this.state);
        if(!this.state.needRender)return;
        if($c === false) $c = $('#scheduler');
        // if(d===false)d=crm.task.data;
        if($c.find('.menu').length===0){
            $c.addClass('rendered');
            $c.append(`<div class="ui top attached menu">
                <div class="right menu">
                    <div class="item">
                        <div class="ui icon basic buttons">
                            <button class="ui button" onclick="scheduler.decrease()"><i class="angle left icon"></i></button>
                            <div class="ui basic disabled button viewtype"></div>
                            <button class="ui button" onclick="scheduler.increase()"><i class="angle right icon"></i></button>
                        </div>
                    </div>
                </div>
                <div class="right menu">
                    <a class="ui item"><strong>View type</strong>:</a>
                    <a class="item viewpoint 1d" onclick="scheduler.setState({view:'1d'})">Today</a>
                    <a class="item viewpoint 3d" onclick="scheduler.setState({view:'3d'})">3days</a>
                    <a class="item viewpoint week" onclick="scheduler.setState({view:'week'})">Week</a>
                    <a class="item viewpoint month" onclick="scheduler.setState({view:'month'})">Month</a>
                    <a class="item viewpoint year" onclick="scheduler.setState({view:'year'})">Year</a>
                </div>
            </div>`);

            $c = $('<table class="ui celled fixed table"></table>').appendTo($c);
        }
        else $c = $c.find('table');
        $('.viewpoint').removeClass('active');
        $(`.viewpoint.${this.state.view}`).addClass('active');
        this.draw($c,d);
    }
    draw($c,d){
        const that = this;
        $c.transition({
            animation  : 'scale',
            duration   : '400',
            onHide: function(){
                $c.html('');
            },
            onComplete : function() {
                switch(that.state.view){
                    case '1d': that.drawDays($c,1,that.state.date); break;
                    case '3d': that.drawDays($c,3,that.state.date); break;
                    case '5d': that.drawDays($c,5,that.state.date); break;
                    case 'week': that.drawWeek($c,that.state.date); break;
                    case 'month':
                        // const td = new Date();
                        that.drawMonth($c,that.state.date.getFullYear(),that.state.date.getMonth());
                    break;
                    case 'year': that.drawYear($c,that.state.date.getFullYear()); break;
                }
                if(!$c.transition('is visible')) $c.transition('scale');
                that.state.needRender = false;
                console.debug('render tasks',d);
                if(d && d.length)d.map( (task,i) => scheduler.setTask(task) );
            }
        });


    }
    drawOneDay($tr,today,hour=0,t=''){
        $tr.append(`<td class="daycell selectable" onclick="scheduler.setDateTime(this);" style="position:relative;height:6em;overflow:auto;" data-year="${today.getFullYear()}" data-month="${today.getMonth()}" data-day="${today.getDate()}" data-hour="${hour}">${t}</td>`);
    }
    drawDays($c,d=3,td = new Date()){
        let $t = $c,
            $thead = $(`<tr></tr>`).appendTo($t);
        $('.viewtype').html(`${system.weeks[td.getDay()]}, ${td.getDate().leftPad()} of ${system.months[td.getMonth()]}, ${td.getFullYear()}`);
        $thead.append(`<th class="one wide ui center aligned"><i class="icon clock"></i></th>`);
        for(let i=0;i<d;++i ){
            let today = new Date(td);
            today.setUTCDate(today.getDate() + i);
            $thead.append(`<th class="ui center aligned">${system.weeks[today.getDay()]}, ${today.getDate()}<br/><small>${system.months[today.getMonth()]}</small></th>`);
        }
        for (var j = 0; j < 24; ++j) {
            let $tr = $('<tr></tr>').appendTo($t);
            $tr.append('<td>' + leftZeroPad(j) + '</td>');
            for(let i=0;i<d;++i ){
                let today =  new Date(td);
                today.setUTCDate(today.getDate() + i);
                this.drawOneDay($tr,today,j);
            }
        }
    }
    drawWeek($c,td){
        let weekStart = td,
            day = weekStart.getDay();
        weekStart.setUTCDate(weekStart.getDate() - day + (day == 0 ? -6:1));
        this.drawDays($c,7,weekStart);
    }
    drawMonth($t,year,month){
        let today = new Date(),
            monthStartDay = new Date(Date.UTC(year, month, 1)),
            monthLastDay = new Date(Date.UTC(year, month+1, 0)),
            tableMonthStartDay = new Date(Date.UTC(year, month, 1)),
            tableMonthLastDay = new Date(Date.UTC(year, month+1, 0)),
            rows = 4
            ;

        tableMonthStartDay.setUTCDate(tableMonthStartDay.getDate() - tableMonthStartDay.getDay() + (tableMonthStartDay.getDay() === 0 ? -6: 1));
        tableMonthLastDay.setUTCDate(tableMonthLastDay.getDate() + (7-tableMonthLastDay.getDay()) );

        $('.viewtype').html(`${system.months[monthLastDay.getMonth()]}, ${monthStartDay.getFullYear()}`);
        rows = Math.ceil(Math.floor((tableMonthLastDay.getTime() - tableMonthStartDay.getTime()) / (1000*60*60*24))/7);


        $('.viewtype').html(`${system.months[monthStartDay.getMonth()]}, ${monthStartDay.getFullYear()}`);
        today = new Date(tableMonthStartDay);
        for(let i =0;i<rows;++i){
            let $tr = $('<tr></tr>').appendTo($t)
            for(let wd=0;wd<7;++wd){
                let inMonth = ( monthStartDay <= today && today <=monthLastDay )?'#888':"#ccc";
                this.drawOneDay($tr,today,0,`<sup style="position:absolute;font-size:8px;top:8px;left:4px;text-align:right;color:${inMonth.leftPad()}">${today.getDate()}</sup>`);
                today.setUTCDate(today.getDate() + 1 );
            }
        }

    }
    drawYear($c,year){
        for(let r=0;r<4;++r){
            let $tr = $('<tr></tr>').appendTo($c);
            for(let c=0;c<3;++c){
                $tr.append(`<td class="top aligned selectable" onclick="scheduler.reviewMonth(${c+r*3})"><table style="width:100%" class="ui very basic collapsing padded table"></table></td>`);
            }
        }
        const that = this;
        $c.find('table').each(function(i,e){
            $(this).append('<thead><tr><td colspan=7>'+system.months[i]+'</td></tr></thead>');
            that.drawMonth($(this),year,i);
        });
        $('.viewtype').html(`${year}`);
    }
    onchange(d, container, a) {
        // console.debug('Task changed');
        $('#texttask,#datetask').val('');
        if (cf._loaders['task-list']) cf._loaders['task-list'].execute();
        if (cf._loaders['lead-task-list']) cf._loaders['lead-task-list'].execute();
        if (cf._loaders['global-task-list']) cf._loaders['global-task-list'].execute();
        $('#edit_task').modal('hide');
        $('#task_add').slideUp();
        $('#task_toggler').removeClass('angle up').addClass('plus');
    }
};
Scheduler.prototype.state = {
    view:'month',
    // view:'year',
    date: new Date(),
    needRender:true
};
Scheduler.prototype.data = [];
if (!crm || crm == undefined || crm == null) crm = {};
const scheduler = new Scheduler;
scheduler.render($('#scheduler'));
crm['task'] = scheduler;
// scheduler.render();
// export crm.imap;
