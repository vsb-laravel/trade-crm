import { VUISubmiter } from './core/submiter';
import { VUIPaginate } from './core/pagination';
var debugEscape = false;
$( document ).ajaxComplete(function( event, request, settings ) {
    $('div.ui.dropdown:not(.dropdown-assigned),select.ui.dropdown:not(.dropdown-assigned)').addClass('dropdown-assigned').dropdown({
        clearable: true
    });
    $('.ui.dropdown input.search').attr('autocomplete','off').prop('readonly',true).on('focus',function(){this.removeAttribute('readonly');});
    // $('.helper:not(.helper-assigned)').popup({hoverable:true}).addClass('helper-assigned');
});
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    statusCode: {
        401: function() {
            console.debug('Session timeout');
            document.location.reload();
        }
    }
});
$('body').on('crm.loaded',function(e,crm){
    let acceptedUrlAction = false;
    const re = /^.+#(\S+)=(\d+)$/ig,urlAction = re.exec(document.location.href);
    if(urlAction && !acceptedUrlAction){
        const act = crm;
        const module = urlAction[1];
        const id = urlAction[2];
        try{
            act[module].info(id);
            document.title = `#${id} CRM ${system.app}`
        }catch(e){console.error(e)}
        acceptedUrlAction = true;
        // console.debug('urlAction',module,id,act, act[module] );
    }
});
const timestamp = new Date();
window.skymechanics={
    jobj:{
        toJsonObjs: function($c){
            let ret={},args = {};
            $c.find("input,select,textarea").each(function(){
                let n,v;
                n = $(this).attr("name");
                v = $(this).val();
                if($(this).attr('type')=='checkbox')v=$(this).is(':checked')?"1":'0';
                // n = (n==undefined)?$(this).attr("name"):undefined;
                if(n!=undefined && n.length){
                    let nn = n.split(/\./), argss = args;
                    if(nn.length>1){
                        args[nn[0]] = (args[nn[0]])?args[nn[0]]:{};
                        args[nn[0]][nn[1]] = v;
                    }
                    else args[n]=v;
                }
            });
            ret[$c.attr('data-name')]=JSON.stringify(args);
            return ret;
        },
        toFormFields:function(s,name){
            let ret='<div class="fields json-field" data-name="'+name+'">';
            try{
                let j = JSON.parse(s);
                for(let i in j){
                    ret += '<div class="four wide field">'
                            +'<label>'+i+'</label>'
                            +'<div class="ui input">'
                                +'<input name="'+i+'" value="'+j[i]+'"/>'
                            +'</div>'
                        +'</div>';
                }
            }
            catch(e){
                console.warn(e);
            }
            return ret+'</div>';
        }
    },
    __charts:{},
    removeChart:function(uid){
        if(skymechanics.__charts[uid])delete skymechanics.__charts[uid];
    },
    chart:function(uid){
        this.first=(typeof(skymechanics.__charts[uid])=="undefined");
        var that = (this.first)? this:skymechanics.__charts[uid];
        // default values
        that.opts = $.extend({
            ctx:null,
            type:'line',
            uid:'chart',
            maxDataLength:144,
            timeDiff:60000,
            borderColor:'rgba(33,187,149,1)',
            // backgroundColor: 'rgb(33,133,208)',
            data:{
                label:'Line',
                keys:[],
                values:[]
            },
            onUpdate:function(p){}
        },(arguments.length>1)?arguments[1]:{});
        if(!that.opts.ctx.length) return;
        if(that.first){
            that.opts.ctx.parents('.ui.modal').attr('data-charts',uid);
        }
        that.chart = (that.chart == undefined)? new Chart(that.opts.ctx.get(0).getContext('2d'), {
            type: that.opts.type,
            data: {
                labels:[], //that.opts.data.keys,
                datasets: [
                    {
                        label: that.opts.data.label,
                        borderColor: that.opts.borderColor,
                        data: [],//that.opts.data.values
                    }
                ]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            displayFormats: {
                                quarter: 'hh:mm:ss'
                            }
                        }
                    }]
                },
                zoom: {
                    enabled: true,
                    mode: 'y'
                    // limits: {
                    //     max: 10,
                    //     min: 0.5
                    // }
                }
            }
        }):that.chart;
        that.supports = [];
        that.setLine=function(l,r){
            var callbackf = (arguments.length>2 && typeof(arguments[2])==="function")?arguments[2]:function(h,l){console.debug('fake callback function',h,l)};
            if(!this.supports.length){
                var thatChart = this.chart,wasLevel = l,wasRange = l*0.005,
                    levelLine = {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: l,
                        borderColor: '#2185d0',
                        borderWidth: 4,
                        label: {
                            enabled: true,
                            position: 'right',
                            backgroundColor: '#2185d0',
                            content: l
                        },
                        draggable: true,
                        onDragStart: function(event){
                            wasLevel = event.subject.config.value;
                            // console.debug(this);
                        },
                        onDrag: function(event) {
                            let nlevel = event.subject.config.value,
                                newLine = this;
                            rangeDownLine.value=nlevel-nlevel*0.005;
                            rangeUpLine.value=nlevel+nlevel*0.005;
                            newLine.value=nlevel;
                            newLine.label.content = nlevel.toFixed(0);
                            callbackf(nlevel,(100*wasRange/nlevel).toFixed(2));
                            thatChart.update();
                        },
                        onDragEnd: function(event){
                            wasLevel = event.subject.config.value;
                        }
                    },
                    rangeDownLine = {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: l-l*0.005,
                        borderWidth: 6,
                        borderColor: '#ccc',
                        label: {
                            enabled: false,
                            position: 'right',
                            backgroundColor:'#aaa',
                            content: "<<"
                        },
                        draggable: false,
                        onDragStart: function(event){
                            wasRange = wasLevel-event.subject.config.value;
                        },
                        onDrag: function(event) {
                            let nlevel = event.subject.config.value,
                                newLine = this;
                            // if(firstDrag){console.debug(event,this);firstDrag=false;}
                            newLine.value=nlevel;
                            wasRange = wasLevel-event.subject.config.value;
                            rangeUpLine.value=wasLevel+wasRange;
                            callbackf(wasLevel,100*wasRange/wasLevel);
                            thatChart.update();
                        },
                        onDragEnd: function(event){
                            // wasRange = wasLevel-event.subject.config.value;
                        }
                    },
                    rangeUpLine = {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: l+l*.005,
                        borderWidth: 6,
                        borderColor: '#ccc',
                        label: {
                            enabled: false,
                            position: 'right',
                            backgroundColor:'#ccc',
                            content: "<<"
                        },
                        draggable: false,
                        onDragStart: function(event){
                            wasRange = event.subject.config.value-wasLevel;
                        },
                        onDrag: function(event) {
                            let nlevel = event.subject.config.value,
                                newLine = this;
                            newLine.value=nlevel;
                            wasRange = event.subject.config.value-wasLevel;
                            rangeDownLine.value=wasLevel-wasRange;
                            callbackf(wasLevel,100*wasRange/wasLevel);
                            thatChart.update();
                        }
                    };

                this.supports.push(rangeUpLine);
                this.supports.push(rangeDownLine);
                this.supports.push(levelLine);
                this.chart.options.annotation= {
                    events: ['click'],
                    annotations: this.supports
                };
                this.chart.update();
            }
        };
        that.removeSupports=function(){
            this.supports.pop();
            this.supports.pop();
            this.supports.pop();
            this.chart.update();
        };
        that.setLineOld=function(l,r){
            if(this.supports.length<2){
                this.chart.data.datasets.push({
                    label:'Level tune',
                    type:'line',
                    fill:false,
                    pointRadius:0,
                    borderWidth:3,
                    borderColor:'rgba(187,33,149,1)',
                    data:[]
                });
                this.chart.data.datasets.push({
                    label:'High range',
                    type:'line',
                    fill:false,
                    pointRadius:0,
                    data:[]
                });
                this.chart.data.datasets.push({
                    label:'Low range',
                    type:'line',
                    fill:false,
                    pointRadius:0,
                    data:[]
                });
            }else {
                this.chart.data.datasets[1].data = [];
                this.chart.data.datasets[2].data = [];
                this.chart.data.datasets[3].data = [];
            }
            for(var i in this.chart.data.datasets[0].data) {
                this.chart.data.datasets[1].data.push(l);
                this.chart.data.datasets[2].data.push(l+r);
                this.chart.data.datasets[3].data.push(l-r);
            }
            this.chart.update();
        };
        that.removeSupportsOld=function(){
            for(var i=1;i<this.chart.data.datasets;++i) this.removeDataset(i);
        }
        that.removeDataset=function(i){
            delete this.chart.data.datasets[i];
            this.chart.update();
        };
        that.set=function(l,d){
            // console.debug('set data',l,d);
            l.setTime(l.getTime()-this.opts.timeDiff);
            if(!this.chart)return;
            if(this.chart.data.labels.length>=this.opts.maxDataLength){
                this.chart.data.labels.shift();
                for(var i in this.chart.data.datasets){
                    this.chart.data.datasets[i].data.shift();
                }
            }
            this.chart.data.labels.push(l);
            this.chart.data.datasets[0].data.push(d);
            for(var i=1;i<this.chart.data.datasets.length;++i){
                this.chart.data.datasets[i].data.push(this.chart.data.datasets[i].data[0]);
            }
            this.chart.update();
            this.opts.onUpdate(d);
        };
        that.update=function(d){
            if(!this.chart)return;
            var td = new Date(), timedUpdate = function (that,l,d){that.set(l,d);};
            td = td.getTime()+td.getTimezoneOffset()*1000*60-this.opts.timeDiff;
            td = td-td%60000;

            for(var i in d.keys){
                if(  $.inArray(d.keys[i].getTime(),that.opts.data.keys) == -1 && d.keys[i]>td ) {
                    if( d.keys[i].getTime()-td>0) {
                        setTimeout(timedUpdate,d.keys[i].getTime()-td,this,d.keys[i],d.values[i]);
                        console.debug('next price in '+(d.keys[i].getTime()-td));
                    }

                    that.opts.data.keys.push(d.keys[i].getTime());
                    that.opts.data.values.push(d.values[i]);
                }
                else if(this.first) this.set(d.keys[i],d.values[i]);
            }

        };
        that.update(that.opts.data);
        skymechanics.__charts[uid] = that;
        that.first=false;
        $(document).trigger('skymechanics:chartLoaded',[uid]);
        return that;
    },
    _statdata:{},
    getDataByField:function(s,field,v){
        if(this._statdata[s]==undefined)return undefined;
        if(this._statdata[s][0]==undefined)return undefined;
        if(this._statdata[s][0][field]==undefined)return undefined;
        for(var i in this._statdata[s]){
            if(this._statdata[s][i][field] == v)return this._statdata[s][i];
        }
        return undefined;
    },
    getDataById:function(s,id){
        return skymechanics.getDataByField(s,"id",id);
    },
    getDataByName:function(s,name){
        return skymechanics.getDataByField(s,"name",id);
    },
    getDataByTitle:function(s,name){
        return skymechanics.getDataByField(s,"title",id);
    },
    reload:function(){
        $('.ui.input.calendar:not(.calendar-assigned)').calendar({
            firstDayOfWeek: 1,
            monthFirst:false,
            ampm:false,
            formatter:{
                datetime:function(date,settings){
                    if(!date)return;
                    return date.getFullYear()+'-'+(1+date.getMonth()).leftPad()+'-'+date.getDate().leftPad()+' '+date.getHours().leftPad()+':'+date.getMinutes().leftPad()+":"+date.getSeconds().leftPad();
                }
            }
        }).addClass('calendar-assigned');
        $('.ui.input.calendar-notime:not(.calendar-assigned)').calendar({
            type: 'date',
            firstDayOfWeek: 1,
            monthFirst:false,
            ampm:false,
            formatter:{
                datetime:function(date,settings){
                    if(!date)return;
                    return date.getFullYear()+'-'+(1+date.getMonth()).leftPad()+'-'+date.getDate().leftPad()
                }
            },
            onChange:function(d,t,m){
                $(this).find('.requester').val(t).change();
            }
        }).addClass('calendar-assigned');
        $(".loadering:visible.priorited:not(.loadering-assigned)").each(function(){ new skymechanics.loader(this,Fresher); }).addClass('loadering-assigned');
        $(".loadering:visible:not(.loadering-assigned)").each(function(){new skymechanics.loader(this,Fresher); }).addClass('loadering-assigned');
        $('div.ui.dropdown:not(.dropdown-assigned),select.ui.dropdown:not(.dropdown-assigned)').addClass('dropdown-assigned').dropdown({
            clearable: true
        });
        $('.ui.dropdown input.search').attr('autocomplete','off').prop('readonly',true).on('focus',function(){this.removeAttribute('readonly');});

        // $(".submiter:not(.submiter-assigned)").each(function(e){ skymechanics.submiter(this); }).addClass('submiter-assigned');
        $(".submiter:not(.submiter-assigned)").each(function(e){ new VUISubmiter(this); }).addClass('submiter-assigned');
        $(".switcher-a:not(.switcher-a-assgined)").each(function(){
            $(this).checkbox({
                onChange:function(e){
                    // if(e)e.preventDefault();
                    // if(e)e.stopPropagation();
                    const $checker = $(this);
                    const $that = $checker.parent('.switcher-a')
                    const $submit = $that.parent('.submiter').find('.submit');
                    let val = $that.checkbox('is checked')?1:0;
                    $that.data('rollback-value',(val==1)?0:1);
                    $that.addClass('need-rollback');
                    // $checker.val(val);
                    // $checker.data("value",val);
                    $submit.trigger("click",[e]);
                    console.debug('Switcher-a changed',$that,$checker,$submit);
                }
            });
        }).addClass("switcher-a-assgined");
        $(".switcher:not(.switcher-assgined)").addClass("switcher-assgined").on('change',function(e){
            const $that = $(this);
            const $submitter = $that.parent('.submiter');

            // console.debug('switcher',$that,$submitter);
            if(!$submitter.length)return;
            let val = $that.is(':checked')?1:0;
            $that.addClass('changed');
            $that.data('rollback-value',(val==1)?0:1);
            $that.val(val);
            $that.data("value",val);
            $submitter.find('.submit').trigger("click",[e]);
        });
        $(".check-all").prop("checked",false).next('label').html('');
        $(".check-all:not(.checkall-assigned)").on("change",function(e){
            e.preventDefault();
            console.log('check-all change',$(this).parent());
            var v = $(this).is(':checked')?true:false, list = $(this).attr("data-list");
            $('[data-name='+list+']').prop("checked",v).change();
            // $(this).next('label').html(v?`${$('[data-name='+list+']').length}`:'');
            $(this).parent().find('label').html(v?`${$('[data-name='+list+']').length}`:'');
            // $(this).parent().checkbox($(this).is(':checked')?`set unchecked`:'set checked');

        }).addClass('checkall-assigned');
        $(".requester:not(.requester-assigned)").each(function(){
            new skymechanics.requester($(this));
        }).addClass('requester-assigned');
        $('.okclose:not(.okclose-assigned)').addClass('okclose-assigned').on('click',function(e){
            e.preventDefault();
            $(this).parents('.modal').find('.globe.submiter .submit:not(.clicked)').click().addClass('clicked').delay(800).removeClass('clicked');
        });
        $('.bulker:not(.bulker-assigned)').addClass('bulker-assigned').each(function(){
            skymechanics.bulk(this);
        })

        $('.richtext-editor:not(.richtext-editor-assigned)').each(function(){
            const element_id = $(this).attr('id');
            const outer = $(this).attr('data-id');
            const size = $(this).attr('data-size');
            if(element_id){
                const editor = pell.init({
                    element: document.getElementById(element_id),
                    onChange: html => {
                        // document.getElementById('html-output').textContent = html
                        const $outer = $(`#${outer}`)
                        if($outer.val)$outer.val(html);
                        if($outer.html)$outer.html(html);
                    },
                    defaultParagraphSeparator: 'p',
                    styleWithCSS: true,
                    actions: [
                        'bold', 'italic', 'underline', 'heading1', 'heading2', 'olist', 'ulist',
                        {
                            name: 'justerfy',
                            icon: '<i class="ui align left icon"></i>',
                            title: 'Custom Action',
                            result: () => pell.exec('justifyLeft')
                        },
                        {
                            name: 'center',
                            icon: '<i class="ui align center icon"></i>',
                            title: 'Custom Action',
                            result: () => pell.exec('justifyCenter')
                        },
                        {
                            name: 'justerfy',
                            icon: '<i class="ui align justify icon"></i>',
                            title: 'Custom Action',
                            result: () => pell.exec('justifyFull')
                        },

                        {
                            name: 'justerfy',
                            icon: '<i class="ui align right icon"></i>',
                            title: 'Custom Action',
                            result: () => pell.exec('justifyRight')
                        },
                        {
                            name: 'image',
                            result: () => {
                                const url = window.prompt('Enter the image URL')
                                if (url) pell.exec('insertImage', url)
                            }
                        },
                        {
                            name: 'link',
                            result: () => {
                                const url = window.prompt('Enter the link URL')
                                if (url) pell.exec('createLink', url)
                            }
                        }
                    ],
                    classes: {
                        actionbar: 'ui secondary top attached menu',
                        button: 'ui item',
                        content: `ui segment bottom attached ${size} contenteditable`,
                        selected: 'active'
                    }
                })
            }
        }).addClass('richtext-editor-assigned');
        $(".ui.tabular:not(.tab-assigned)").addClass("tab-assigned").find(".item").tab({
            onVisible:function(){
                console.debug('Tab onVisible',arguments,$(".loadering:visible:not(.loadering-assigned)"));
                skymechanics.reload()
            }
        });
        // $('.google2fa-otp:not(.masked)').addClass('masked').inputmask("999 999");
    },
    countdown_element:undefined,
    countdown_si:undefined,
    countdown:function(){
        var $that = arguments.length?arguments[0]:$(this),
            f = function(){
                if(!(skymechanics.countdown_element))return;
                let $that = skymechanics.countdown_element,
                v = parseInt($that.prop('value'))-1,
                p = {
                    h:parseInt(v/3600),
                    m:parseInt((v%3600)/60),
                    s:parseInt(v%60),
                };
                if(v<0){
                    (skymechanics.si)?clearInterval(skymechanics.si):{};
                    return;
                }
                $that.text( p.h+':'+leftZeroPad(p.m)+':'+leftZeroPad(p.s) );
                $that.prop('value',v);
            };
        (skymechanics.si)?clearInterval(skymechanics.si):{};
        skymechanics.countdown_element = $that;
        skymechanics.si = setInterval(f,1000);
    },
    _actions:{},
    _loaders:[],
    _requests:[],
    _needCached:['country'],
    _cached:{},
    _type:"get",
    _switchOff:false,
    refresher:function(){
        skymechanics._actions=[];
        // skymechanics._switchOff = ("undefined"!=typeof(useFresher))?!useFresher:skymechanics._switchOff;
        this.tick=0;
        this.bind=function(){
            var bnd = $.extend({
                refresh:1,
                last:new Date().getTime(),
                run:function(){}
            },arguments.length?arguments[0]:{});
            skymechanics._actions[bnd.guid]=bnd;
            // skymechanics._actions.push(bnd);
        };
        this.unbind=function(uid){
            if(skymechanics._actions[uid])delete skymechanics._actions[uid];
        };
        this.execute=function(){
            if(skymechanics._switchOff)return;
            // if(skymechanics._actions.length==0)return;
            var dt = new Date().getTime();
            for(var i in skymechanics._actions){
                if(skymechanics._actions[i].refresh==0)continue;
                // console.debug("refresher #"+i,(dt-skymechanics._actions[i].last),'>',skymechanics._actions[i].refresh);
                if((dt-skymechanics._actions[i].last)>skymechanics._actions[i].refresh){
                    var args = (skymechanics._actions[i].arguments == undefined)?null:skymechanics._actions[i].arguments;
                    // console.debug("refresher executing...",skymechanics._actions[i].run,args);
                    skymechanics._actions[i].run(args);
                    skymechanics._actions[i].last = dt;
                }
                // skymechanics._switchOff=true;
            }
        };
        setInterval(this.execute,1000);
        if(skymechanics._switchOff){
            // console.clear();
            console.info('Manual refresher is in work');
            var currentRefresher = this;
            $('<button style="position:fixed;display:block;z-index:10000;top:0;height:36px;width:88px;right:0;line-height:36px;padding:0 4px;background-color:rgba(0,0,0,.5);color:rgba(255,255,255,.6);">On</button>').appendTo('body').on('click',function(){
                console.clear();
                skymechanics._switchOff=!skymechanics._switchOff;
                $(this).text(skymechanics._switchOff?'On':'Off');
            });
        }
    },
    touch:function(uid){
        return new Promise( (resolve,reject) => {
            try{
                var obj = (arguments.length>1)?arguments[1]:'loader';
                switch(obj){
                    case 'loader':
                        // if(skymechanics._loaders[uid] && !skymechanics._loaders[uid].opts.fetching)skymechanics._loaders[uid].execute().then(()=>{ resolve(); });
                        if(skymechanics._loaders[uid] )skymechanics._loaders[uid].execute().then(()=>{ resolve(); });
                        break;
                    default: reject("No loader found",uid);break;
                }
            }
            catch(e){
                reject(e);
            }
        })

    },
    loader:function(){
        var container=arguments.length?$(arguments[0]):null;
        var _frshr = arguments.length?$(arguments[1]):new skymechanics.refresher();
        this.opts = {
            container:container,
            autostart: false,
            fetching: false,
            refresh:0
        };
        if(container == null) return;

        var attrs = {
            uid:(container.attr("data-id")==undefined)?container.attr("data-name"):container.attr("data-id"),
            func:container.attr("data-function"),
            autostart:(container.attr("data-autostart")=="true"),
            needLoader:(container.attr("data-need-loader")=="true"),
            action:container.attr("data-action"),
            refresh:(container.attr("data-refresh")!=undefined)?container.attr("data-refresh"):0,
            trigger:(container.attr("data-trigger")!=undefined)?container.attr("data-trigger"):false,
            onchange:(container.attr("data-onchange")!=undefined)?container.attr("data-onchange"):false,
            request:(container.attr("data-request")!=undefined)?container.attr("data-request"):false,
            sort:(container.attr("data-sort")!=undefined)?container.attr("data-sort"):false,
            callback:(container.attr("data-request-function")!=undefined)?container.attr("data-request-function"):false,
            callbackOnChange:(container.attr("data-function-change")!=undefined)?container.attr("data-function-change"):false,
            data:{}
        };
        this.opts = $.extend(this.opts,attrs);
        this.opts = $.extend(this.opts,((arguments.length>1)?arguments[1]:null));
        const isDropdown = (this.opts.container.hasClass('ui') && this.opts.container.hasClass('dropdown'));
        const execChange = (f) => {
            console.debug('execChange',f)
            try{
                eval(f);
            }
            catch(e){
                console.warn('error eval callbackOnChange',f,e);
            }
        }
        // console.debug(this.opts);
        this.currentRequest = null;
        let that = this;

        this.execute = function(){
            // return new Promise( (resolve,reject) => {
                const that = this;
                if(that.currentRequest != null) {
                    that.currentRequest.abort();
                    // console.debug('loader previouse execute aborted',that.currentRequest);
                    that.currentRequest = null;

                }
                try{
                    let opts = (arguments.length)?arguments[0]:this.opts,rdata = null;
                    if(opts==undefined || opts.container == undefined )return;
                    if(opts.fetching && opts.fetching == true )return;
                    const successCallback = function(d,opts,name){
                        if(opts.container.prop('tagName')=='SELECT'){
                            var $c=opts.container, title = (opts.container.attr('data-title')!=undefined)?opts.container.attr('data-title'):'Lists';
                            opts.container.html('');
                            opts.container.append('<option value="false">'+title+'</option>');
                            for(var i in (d.data!=undefined)?d.data:d){
                                var row = (d.data!=undefined)?d.data[i]:d[i];
                                var name=(row.title)?row.title:((row.name)?row.name:''),
                                    value = (row.id==undefined)?name:row.id;
                                name = (row.surname)?name+' '+row.surname:name;
                                // console.debug(title,name,value);
                                opts.container.append('<option value="'+value+'">'+name+'</option>');
                            }
                            skymechanics._statdata[opts.container.attr("data-name")] = d;
                            if(opts.callbackOnChange!==false){
                                opts.container.on('change keyup',function(){
                                    eval(opts.callbackOnChange);
                                })
                            }
                        }
                        else if(opts.container.prop('tagName')=='DIV' && opts.container.hasClass('ui') && opts.container.hasClass('selection') && opts.container.hasClass('dropdown')){
                            var $c=opts.container, title = ($c.attr('data-title')!=undefined)?$c.attr('data-title'):'Lists',
                                name = $c.attr('data-name'),
                                selected = $c.attr('data-value');
                            // var $e = $('<input class="requester" type="hidden" name="'+name+'" data-name="'+name+'">').appendTo($c);
                            $c.text('');
                            var $e = $('<input type="hidden" name="'+name+'" data-name="'+name+'">').appendTo($c);
                            if($c.attr('data-trigger') && $c.attr('data-trigger')){
                                $e.attr('data-trigger',$c.attr('data-trigger'))
                                    .attr('data-target',$c.attr('data-target'));
                            }
                            if(title!="false")$c.append('<i class="dropdown icon"></i><div class="default text">'+title+'</div>');
                            var $m = $('<div class="menu"></div>').appendTo($c);
                            if(title!="false")$m.append('<div class="item" data-value="false">'+title+'</div>');
                            for(var i in (d.data!=undefined)?d.data:d){
                                var row = (d.data!=undefined)?d.data[i]:d[i];
                                var code = row.code;
                                var name=(row.title)?row.title:((row.name)?row.name:''),
                                    value = (row.id==undefined)?name:row.id;
                                let disabled = false;
                                if(row.enabled!=undefined){
                                    disabled = (row.enabled==0);
                                }
                                // name = (row.surname)?name+' '+row.surname:name;
                                var $item = $(`<div class="${disabled?'disabled ':''}item" data-value="${value}"></div>`).appendTo($m);
                                $item.append('<span class="text">'+((code)?code:name)+'</span>')
                                if(code)$item.append('<div class="description">'+name+'</div>')
                                else if(row.rights)$item.append('<span class="description">'+row.rights.name+'</span>')
                                else if(row.title && row.name)$item.append('<div class="description">'+row.name+'</div>')
                            }
                            // console.debug("loadering::dropdown.onChange",opts.callbackOnChange);
                            const onChange = (opts.callbackOnChange!==false)? (v,t,$choice) => {
                                execChange(opts.callbackOnChange);
                            } : ()=>{};
                            opts.container.dropdown({
                                onChange: onChange
                            });
                            opts.container.dropdown('set selected',selected);
                            skymechanics._statdata[$c.attr("data-name")] = d;
                        }
                        const callbackf = getFunctionByName(opts.func);
                        callbackf(opts.container,d,name);
                    };
                    opts.action = opts.container.attr('data-action');
                    if(opts.sort!==false){
                        rdata["sort"]={};
                        var srt =opts.sort.split(/\,/g);
                        for(var i in srt){
                            var a = srt[i].split(/\s/g);
                            rdata["sort"][a[0]]=a[1];
                        }
                    }
                    rdata = $.extend(rdata,opts.data);
                    $(`[data-target=${that.opts.uid}].requester.dynamic`).each(function(){
                        const name  = $(this).data('name');
                        const value = $(this).val();
                        if((value=="undefined" || value==null || value.length == 0 ) && rdata[name]) delete rdata[name];
                        else rdata[name] = value;
                    });
                    var urlAction = opts.action;
                    urlAction = urlAction.replace(/=\{([^\}]+)\}/g,function(m,p,o,s){
                        if($(p).length){
                            return '='+$(p).val();
                        }
                        else if(p=="data-id") return '='+$(that).attr("data-id");
                        else if(p.match(/timestamp_.+/i)){//timestamps
                            var now = new Date(), now=now.getTime() ,matches = p.match(/timestamp_(\d+)(\w+)/i);
                            if(p=='timestamp_now') return '='+now;
                            else if(p=='timestamp_today'){
                                now -= now%(24*60*60*1000);
                                return '='+now;
                            }
                            else if(matches && matches.length>2){
                                var c = parseInt(matches[1]),t=matches[2],d=1000;
                                switch(t){
                                    case 'minute':d*=60;break;
                                    case 'hour':d*=60*60;break;
                                    case 'day':d*=60*60*24;break;
                                }
                                console.debug('timestamp',new Date(now-c*d));
                                return '='+(now-c*d);
                            }
                        }
                        else{
                            if(p.match(/\./ig)){
                                let f =p.split(/\./g),v=window;
                                // if(p=='crm.finance.__currentPeriod')console.debug(f);
                                for(var i in f){
                                    v=v[f[i]];
                                    if(v==undefined) break;
                                }
                                if(v){
                                    return '='+v;
                                }
                            }
                            return '='+$('[data-name="'+p+'"]').val();
                        }
                    });
                    var $loader = $('.progress-loader');
                    // aditional rdata checks
                    if(rdata){
                        rdata['per_page'] = rdata.per_page || $.cookie('per_page');
                        rdata['per_page'] = (rdata['per_page'])?rdata['per_page'].replace(/^(\d+).*/,"$1"):15;
                    }
                    if(rdata && rdata.excel && rdata.excel=="1"){
                        let udata = urlAction.match(/\?/)?"&":'?';
                        Object.keys(rdata).map( (k) => {
                            udata+=`${k}=${encodeURI(rdata[k])}&`
                        });
                        document.location.href = urlAction+udata;
                    }
                    else {
                        let precontainer = opts.container.parents('.for-loadering');
                        if(opts.needLoader){
                            if(precontainer.length==0){
                                precontainer = $(`<div class="for-loadering"><div class="ui inverted dimmer" ><div class="ui indeterminate text loader" style="position:absolute;top:2em;">${__('crm.fetching')}</div></div></div>`);
                                let $prnt = (opts.container.prop('tagName') == 'TBODY')?opts.container.parent():opts.container;
                                console.debug('Loader added', opts.container.prop('tagName'),$prnt);
                                precontainer = precontainer.insertAfter($prnt);
                                precontainer.append($prnt.detach());
                            }

                        }
                        let dropdownLoaderingIcon = null;
                        that.currentRequest = $.ajax({
                            url:urlAction,
                            type:skymechanics._type,
                            data:rdata,
                            beforeSend:function(){
                                opts.fetching = true;
                                precontainer.find('.dimmer').addClass('active');
                                if(isDropdown){
                                    opts.container.addClass('loading').html(`<i class="ui dropdown icon"></i>`);
                                }
                            },
                            complete:function(){
                                opts.fetching = false;
                                if(opts.needLoader){
                                    console.debug('Loader removed');
                                    precontainer.find('.dimmer').removeClass('active');//.find('.text.loadoer').remove();
                                }
                                if($loader.length)$loader.fadeOut().progress({percent: 0}).removeClass('inuse');

                                if(isDropdown){
                                    if(dropdownLoaderingIcon)dropdownLoaderingIcon.remove();
                                    opts.container.removeClass('loading');
                                }
                                // if(dropdownLoaderingIcon){
                                //     dropdownLoaderingIcon.remove();
                                //     dropdownLoaderingIcon = $(`<i class="ui green checkmark icon"></i>`).insertAfter(opts.container);
                                // }

                            },
                            success:function(d,x,s){
                                skymechanics._requests[opts.action]=d;
                                try{
                                    successCallback(d,opts,opts.uid);
                                }
                                catch(e){console.error(opts,e);}
                                if(isDropdown){
                                    opts.container.removeClass('loading').addClass('success');
                                }
                            },
                            error: () => {
                                if(isDropdown){
                                    opts.container.removeClass('loading').addClass('error');
                                }
                            }
                        });
                    }

                }
                catch(e){
                    console.error(e);
                }
            // });
            return new Promise( (resolve,reject) => { resolve(); });
        };
        this.execute = this.execute.bind(this);
        if( this.opts.autostart ){
            let that = this;
            that.execute(that.opts);
            $('#body_event_trigger').on('page:show',function(e,$p){
                e.preventDefault();
                // console.debug('page showed',$.contains($p.page,that.opts.container),$p.page.find(that.opts.container).length,that.opts.func);
                // console.debug('page showed',e,$p.page,that.opts.func);
                if( $.contains($p.page,that.opts.container) || ($p.page.find(that.opts.container).length && that.opts.func) ){
                    // console.debug('page showed', that.opts.func,$p);
                    that.execute(that.opts);
                }
            })
            $('#body_event_trigger').on('page:noactivity',function(){
                if(that.opts.container.is(':visible')) {
                    console.debug('container is visible',that.opts.func);
                    that.execute(that.opts);
                }
            })
            // if(container.is(':visible')) {
            //     that.execute(that.opts);
            // }
        }
        skymechanics._loaders[this.opts.uid]= this;
        return this;
    },
    requester:function(){
        const $that = arguments.length?arguments[0]:$(this);
        const trigger = $that.attr("data-trigger");
        let initHandler = false;
        const getRequesterValue = ($that)=> {
            let val = ($that.attr('type')=="checkbox")?($that.is(':checked')?1:0):(($that.attr("data-value")!=undefined)?$that.attr("data-value"):$that.val());
            if($that.attr('type') == 'date'){
                val = Date.parse(val);
                val = parseInt(val/1000);
            }
            if($that.hasClass('dropdown')){
                val = $that.dropdown('get value');
            }
            return val;
        };
        const handler = function() {
            const act_uids = $that.attr("data-target").split(/,/);
            const name = $that.attr("data-name");
            const val = getRequesterValue($that);
            const depends = $that.data('depends')?$that.data('depends').split(/\s*,\s*/):[];
            for(var i in act_uids){
                const act_uid = act_uids[i];
                let ld = skymechanics._loaders[act_uid].opts.data;
                if(val.length==0) delete ld[name]; else ld[name]=val;
                depends.map( (depend,i) => {
                    const $depend = $(`${depend}`);
                    const dname = $depend.data('name');
                    const value = getRequesterValue($depend);
                    if(value.length==0) delete ld[dname]; else ld[dname]=value;
                })
                skymechanics._loaders[act_uid].execute();
                if($that.attr('data-name')=='excel'){
                    $that.val('false');
                    skymechanics._loaders[act_uid].opts.data.excel="false";
                }
            }
        };
        if($that.val()!=undefined){
            if( trigger=="keyup" ){
                $that.on(trigger,(e)=>{
                    e.preventDefault();
                    if( !((e.keyCode>=48 & e.keyCode<=90) || (e.keyCode >=96 & e.keyCode<=105) || $.inArray(e.keyCode,[188,189,110, 111, 8,46])!=-1 )) return false;
                    if(initHandler) clearTimeout(initHandler);
                    initHandler = setTimeout(function(){
                        // console.debug('Requester triggered with delay',handler);
                        handler();
                    },600);
                });
            }
            else if( trigger=="enter" ){
                $that.on('keyup',(e)=>{
                    e.preventDefault();
                    if( e.keyCode== 13 ) handler();
                });
            }
            else $that.on(trigger,function(e){
                e.preventDefault();
                handler();
            });
        }
    },
    submiterHandler:function(that){
        console.log('submiterHandler',that);
        $(that).data('autostart',true);
        return new VUISubmiter(that);
    },
    submiter:function(){
        const container = arguments.length?$(arguments[0]):null;
        const checkvals=function($c){
                var ret = true;
                $c.find('input,textarea,select').filter('[required]:visible').each(function(){
                    if(!ret)return;
                    if($(this).val().length==0){
                        $(this).addClass('value-empty').focus();
                        ret = false;
                    }else $(this).removeClass('value-empty');
                });
                $c.find('input').each(function(){
                    if(!ret)return;
                    var min = parseFloat($(this).attr('min')),max = parseFloat($(this).attr('max')), val = parseFloat($(this).val()),$that = $(this),$alerter = $that.next('.alerter'),popup = $(this).attr('data-validate-text');
                    if(!$alerter.length)$alerter = $('<span class="red alerter" style="display:none;"></span>').insertAfter($that);
                    if(popup==undefined)popup = 'Value should be from '+min;
                    popup = popup.replace(/\{([^\}]+)\}/g,function(m,p,o,s){
                        if(p=='min')return min;
                        if(p=='max')return max;
                    });
                    if(min){
                        if(val<min){
                            ret = false;
                            $alerter.text(popup);
                            $alerter.fadeIn();
                        }
                        else $alerter.fadeOut();
                    }
                    if(max){
                        if(val>max){
                            ret = false;
                            $alerter.text(popup);
                            $alerter.fadeIn();
                        }
                        else $alerter.fadeOut();
                    }
                });
                return ret;
            };
        const getargs = function($c){
                if(debugEscape)return;
                let args = {};
                $c.find("input,select,textarea").each(function(){
                    let n = $(this).attr("data-name"),v = ($(this).attr('type')=='checkbox')?($(this).is(':checked')?"1":'0'):$(this).val();
                    if($(this).hasClass('-ui-calendar')){

                        const date = $(this).parents('.ui.calendar').calendar('get date');
                        v = date.getFullYear()+'-'+(1+date.getMonth()).leftPad()+'-'+date.getDate().leftPad()+' '+date.getHours().leftPad()+':'+date.getMinutes().leftPad()+":"+date.getSeconds().leftPad();
                    }
                    if(n!=undefined && n.length){
                        let nn = n.split(/\./),argss = args;
                        if(nn.length>1){
                            for(let i = 0; i<nn.length-1;++i){
                                argss[nn[i]] = (argss[nn[i]])?argss[nn[i]]:{};
                                argss = argss[nn[i]];
                            }
                            n= nn[nn.length-1];
                            // console.debug(n,v,JSON.stringify(args));
                        }
                        argss[n]=v;
                    }
                });
                // $c.find('.json-field').each(function(){args = $.extend(args,skymechanics.jobj.toJsonObjs($(this)));});
                return args;
            };
        const clickfn=function(e){
                if(e)e.preventDefault();
                if(e)e.stopPropagation();
                if(!checkvals(container))return false;
                const before = container.data("confirm");
                const confirm = (before) ? getFunctionByName(before):false;
                console.log('submiter confirm function name',before,confirm);
                var action = container.attr("data-action"),
                    args = getargs(container),
                    callback = container.attr("data-callback"),
                    error = container.attr("data-callback-error"),
                    $btn = $(this),
                    btnText = $btn.html(),
                    ftype = container.attr("data-method");
                if(confirm) confirm({},container,args);

                ftype = (ftype)?ftype:skymechanics._type;
                callback = getFunctionByName(callback);
                // console.debug('submiter',action,args,callback,error);
                $.ajax({
                    url:action,
                    data:args,
                    type:ftype,
                    beforeSend:function(){
                        $btn.html('<i class="cf-loader fa fa-spin fa-fw fa-circle-o-notch"></i>');
                    },
                    success:function(d){
                        callback(d,container,args);
                        if(d.redirect){
                            if(d.redirect.form){
                                $(d.redirect.form).appendTo('body').submit();
                            }
                            else if(d.redirect.url){
                                document.location.href = d.redirect.url;
                            }
                        }
                        else if(d.append){
                            if(d.append.view){
                                $(d.append.view).appendTo('body');
                            }
                        }
                    },
                    error:function(x,s){
                        try{
                            if(error){
                                error = getFunctionByName(error);
                                error(x.responseJSON,container,args);

                            }
                            else callback(x.responseJSON,container,args);
                        }
                        catch(e){
                            console.error(e);
                        }
                        console.error(x.responseJSON,args);
                    },
                    complete:function(){
                        $btn.html(btnText);
                    }
                });
                return false;
            };

        if(container.attr("data-autostart")=="true")clickfn();
        else{
            let trigger = container.find('.submit').attr('data-trigger');
            trigger=(trigger!=undefined && trigger !=false )?trigger:'click';
            container.find('.submit').on(trigger,clickfn);
        }
        container.find('.cancel').on('click',function(){});

        return this;
    },
    bulk:function(){
        var $that = $(arguments.length?arguments[0]:this),
            trigger = $that.attr("data-bulk-trigger"),
            selector = $that.attr('data-bulk-selector'),
            action = $that.attr('data-bulk-action'),
            param = $that.attr('data-bulk-name'),
            toucher = $that.attr('data-bulk-target');
        if(!selector)return;
        if($.inArray(trigger,['click','change','keyup'])==-1)return;
        $that.on(trigger,function(){
            var val = ($that.prop('tagName')=='DIV' && $that.hasClass('dropdown'))?$that.dropdown('get value'):$that.val();

            if($that.prop('tagName') == 'BUTTON' || $that.hasClass('button'))val='b';
            if(val){
                $(selector).each(function(){
                    var id = $(this).attr('data-id'),
                        $itrChecker = $(this).parent(),
                        $itr=$(this),
                        url = action.replace(/\{([^\}]+)\}/g,function(m,p,o,s){
                            if(p=="data-id") return $itr.attr("data-id");
                            else if(p=="bulk-param-name") return param;
                            else if(p=="bulk-param-value") return val;
                            else if($(p).length)return '='+$(p).val();
                            else{
                                if(p.match(/\./ig)){
                                    var f =p.split(/\./g),v=window;
                                    for(var i in f){
                                        v=v[f[i]];
                                        if(v==undefined) break;
                                    }
                                    if(v){
                                        return '='+v;
                                    }
                                }
                                return '='+$('[data-name='+p+']').val();
                            }
                        });
                    if($itrChecker.checkbox('is checked')){
                        $.ajax({
                            url:url,
                            success:function(){
                                $itrChecker.checkbox('set unchecked');
                            }
                        });
                    }
                }).promise().done(function(){
                    if(trigger=='buttonClick')return;
                    cf.touch(toucher);
                    if($that.hasClass('dropdown')) $that.dropdown('restore defaults');
                    else if($that.parent().hasClass('dropdown')) $that.parent().dropdown('restore defaults');
                    else if($that.hasClass('input')) $that.val('');
                    else if($that.prop('tagName')=='INPUT') $that.val('');
                });
            }
        });

    },
    bulkButton:function(button){
        const $button = $(button);
        const selector = $button.attr('data-bulk-selector');
        const action = $button.attr('data-bulk-action');
        const toucher = $button.attr('data-bulk-target');
        const $assigners = $('.bulk .bulker[data-bulk-trigger=buttonClick]');
        const textBackup = $button.html();
        let params = {};
        $assigners.each(function(){
            const val = ($(this).prop('tagName')=='DIV' && $(this).hasClass('dropdown'))?$(this).find('input[type="hidden"]').val():$(this).val();
            const param = $(this).attr('data-bulk-param');
            const name = $(this).attr('data-bulk-name');
            const $that = $(this);
            let urlParam = param.replace(/\{([^\}]+)\}/g,function(m,p,o,s){
                if(p=="bulk-param-name") return name;
                else if(p=="bulk-param-value") return val;
                else if($(p).length)return '='+$(p).val();
                else{
                    if(p.match(/\./ig)){
                        var f =p.split(/\./g),v=window;
                        for(var i in f){
                            v=v[f[i]];
                            if(v==undefined) break;
                        }
                        if(v){
                            return '='+v;
                        }
                    }
                    return '='+$('[data-name='+p+']').val();
                }
            });
            const pp = urlParam.split(/=/);
            if(pp.length==2 && pp[1] && pp[1].length && pp[1]!=undefined && pp[1]!="undefined")params[pp[0]]=pp[1];

            if($that.hasClass('dropdown')) $that.dropdown('restore defaults');
            else if($that.parent().hasClass('dropdown')) $that.parent().dropdown('restore defaults');
            else if($that.hasClass('input')) $that.val('');
            else if($that.prop('tagName')=='INPUT') $that.val('');
        });
        const toCheckLength = $(selector).length;
        let checkedLength = toCheckLength;
        $button.html(`<i class="ui notched circle loading icon"></i> ${toCheckLength-checkedLength}/${toCheckLength} ${__('crm.done')}`).addClass('disabled');
        (new Promise((resolve,reject) => {

            $(selector).each(function(){
                var id = $(this).attr('data-id'),
                    $itrChecker = $(this).parent(),
                    $itr=$(this);
                const val = ($(this).prop('tagName')=='DIV' && $(this).hasClass('dropdown'))?$(this).find('input[type="hidden"]').val():$(this).val();
                const param = $(this).attr('data-bulk-param');
                const name = $(this).attr('data-bulk-name');
                const $that = $(this);
                // console.debug('bulkButton',name,val)
                let url = action.replace(/\{([^\}]+)\}/g,function(m,p,o,s){
                    if(p=="data-id") return $itr.attr("data-id");
                    else if(p=="bulk-param-name") return param;
                    else if(p=="bulk-param-value") return val;
                    else if($(p).length)return '='+$(p).val();
                    else{
                        if(p.match(/\./ig)){
                            var f =p.split(/\./g),v=window;
                            for(var i in f){
                                v=v[f[i]];
                                if(v==undefined) break;
                            }
                            if(v){
                                return '='+v;
                            }
                        }
                        return '='+$('[data-name='+p+']').val();
                    }
                });
                if($itrChecker.checkbox('is checked')){
                    $.ajax({
                        url:url,
                        data: params,
                        success:function(){
                            $itrChecker.checkbox('set unchecked');
                            checkedLength--;
                            $button.html(`<i class="ui notched circle loading icon"></i> ${toCheckLength-checkedLength}/${toCheckLength} ${__('crm.done')}`);
                            if(checkedLength<=0)resolve();
                        }
                    });
                }
            }
        )})).then(function(){
            $('.bulk').hide();
            cf.touch(toucher);
            $button.html(textBackup).removeClass('disabled');

        });

    },
    guid:function(){ // Public Domain/MIT
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
};
window.cf = skymechanics;
window.Fresher = new skymechanics.refresher();
window.page={
    activity: timestamp.getTime(),
    current:false,
    notitication: (n)=>{
        $('.sidebar#notificationBar')
            .sidebar({
                dimPage: false,
                mobileTransition:'overlay',
                duration: 128,
                closable: false
            }).sidebar('show');
    },
    dashboard:{
        __currentPeriod:'7d',
        byperiod:function(that,p){
            $('.byperiod .active').removeClass('active');
            $('.date').fadeOut(function(){
                $('.date.'+p).fadeIn();
            });
            $(that).addClass('active');
            page.dashboard.__currentPeriod = p;
            $('#page__dashboard .loadering').each(function(){
                var loadering = $(this).attr('data-name');
                if(loadering)skymechanics.touch(loadering);
            });
        },
        options:{
            chart:{
                backgroundColors: ['rgba(33,187,149,.8)','rgba(33,133,208,.8)','rgba(204, 104, 104,.8)','rgba( 104, 204,104,.8)','rgba(104, 104, 104,.8)','rgba(104, 104, 204,.8)'],
                borderColors: ['rgba(33,187,149,1)','rgba(33,133,208,1)','rgba(204, 104, 104,1)','rgba( 104, 204,104,1)','rgba(104, 104, 104,1)','rgba(104, 104, 204,1)']
            }
        },
        events:{},
        deals:function($c,d){
            var raw={},
                profits = {total:0,today:0,previous:0,volation:0},
                invested = {total:0,today:0,previous:0,volation:0},
                today = new Date(),today = new Date(today - (today.getTime()%(24*60*60*1000))),today=today.getTime(),
                $t = $('#deal_total');
            for(var i in d){
                var r = d[i];
                raw[r.pair]=(raw[r.pair])?raw[r.pair]:0;
                raw[r.pair]+=parseInt(r.total);

                profits.total+=parseFloat(r.profit);
                if(r.date*1000 == today){
                    profits.today=parseFloat(r.profit);
                    profits.volation=(profits.previous==0)?100:100*((parseFloat(r.profit)/profits.previous)-1);
                }
                profits.previous=parseFloat(r.profit);

                invested.total+=parseFloat(r.amount);
                if(r.date*1000 == today){
                    invested.today=parseFloat(r.amount);
                    invested.volation=(invested.previous==0)?100:100*((parseFloat(r.amount)/invested.previous)-1);
                }
                invested.previous=parseFloat(r.amount);
            }
            $t.find('tbody tr:eq(0) td:eq(1)').html(invested.total.currency('$',2));
            $t.find('tbody tr:eq(0) td:eq(2)').html(invested.today.currency('$')
                +'<br/><small><i class="ui icon arrow '+((invested.volation>=0)?'up':'down')+'"></i>'+invested.volation.toFixed(2)+'%</small>'
            ).addClass(((invested.volation>=0)?'green':'red'));
            $t.find('tbody tr:eq(1) td:eq(1)').html(profits.total.currency('$',2));
            $t.find('tbody tr:eq(1) td:eq(2)').html(profits.today.currency('$')
                +'<br/><small><i class="ui icon arrow '+((profits.volation>=0)?'up':'down')+'"></i>'+profits.volation.toFixed(2)+'%</small>'
            ).addClass(((profits.volation>=0)?'green':'red'));
            var splited = splitObjectKeys(raw),ctx = document.getElementById('chart__deals').getContext('2d'), chart = new Chart(ctx, {
                type: 'horizontalBar',
                data: {
                    labels: splited.keys,
                    datasets: [
                        {
                            label: __('crm.trades.title')+": ",
                            backgroundColor: page.dashboard.options.chart.backgroundColors,
                            borderColor:  page.dashboard.options.chart.borderColors,
                            data: splited.values
                        }
                    ]
                },
                // Configuration options go here
                options: {}
            });
        },
        customers:function($c,d){
            var labels = [],cals=[],
                data={
                    clients:[],
                    leads:[]
                },td=new Date(),
                today = new Date(td - (td%(24*60*60*1000))),
                totals={previous:0,total:0,today:0,volation:0},
                leads={previous:0,total:0,today:0,volation:0},
                $t = $('#lead_total');
            for(var i in d){
                var r = d[i], dtd = new Date(r.date*1000),dt = system.months[dtd.getMonth()]+' '+dtd.getDate() ;
                labels[dt]=(labels[dt])?labels[dt]:{};
                labels[dt]["clients"] = r.newcustomers;
                labels[dt]["leads"] = r.newlead;
                labels[dt]["total"] = r.total;
                leads.total+=parseInt(r.newlead);
                leads.today=parseInt(r.newlead);
                leads.volation=(leads.previous==0)?0:leads.today/leads.previous;
                leads.previous=parseInt(r.newcustomers);

                totals.total+=parseInt(r.newcustomers);
                totals.today=parseInt(r.newcustomers);
                totals.volation=(totals.previous==0)?0:totals.today/totals.previous;
                totals.previous=parseInt(r.newcustomers);
            }

            let tt = {newlead:0,newcustomers:0}
            d.map( (item) => {
                tt.newlead+=parseFloat(item.newlead);
                tt.newcustomers+=parseFloat(item.newcustomers);
            });
            $c.html('');
            $c.append(`<div class="statistic">
                    <div class="value"><i class="outline user icon"></i> ${tt.newlead.digit(0)}</div>
                    <div class="label">${__('crm.dashboard.new_leads')}</div>
                </div>`)
            $c.append(`<div class="statistic">
                    <div class="value"><i class="user icon"></i> ${tt.newcustomers.digit(0)}</div>
                    <div class="label">${__('crm.dashboard.new_customers')}</div>
                </div>`)
            $t.html('');
            $t.append(`<thead><tr><th class="four wide">&nbsp;</th><th class="right aligned">${__('crm.dashboard.totals')}</th><th class="right aligned">${__('crm.dashboard.today')}</th></tr></thead>`);
            $t.append(`<tr><th class=" six wide ui right aligned">${__('crm.dashboard.new_customers')}</th><td class="ui header right aligned">${totals.total}</td><td class="ui header color right aligned ${((totals.volation<0)?"red":"green")}">${totals.today}<br><small>${totals.volation.toFixed(2)}%</small></td></tr>`);
            $t.append(`<tr><th class="right aligned">${__('crm.dashboard.new_leads')}</th>'+'<td class="ui header right aligned">${leads.total}</td><td class="ui header color right aligned ${((leads.volation<0)?"red":"green")}">${leads.today}<br><small>${leads.volation.toFixed(2)}%</small></td></tr>`);
            // for(var i=0;i<7;++i){
            //     var c = new Date();
            //     c.setDate(td.getDate()-i);
            //     c = system.months[c.getMonth()]+' '+c.getDate();
            //     cals.push(c);
            //     data.clients.push((labels[c])?labels[c].clients:0);
            //     data.leads.push((labels[c])?labels[c].leads:0);
            // }
            // var chart = new Chart(ctx, {
            //     // The type of chart we want to create
            //     type: 'line',
            //     // The data for our dataset
            //     data: {
            //         labels: cals.reverse(),//["January", "February", "March", "April", "May", "June", "July"],
            //         datasets: [
            //             {
            //                 label: "New customers",
            //                 backgroundColor: 'rgb(33,133,208)',
            //                 borderColor: 'rgb(33,133,208)',
            //                 data: data.clients.reverse()
            //             },
            //             {
            //                 label: "New leads",
            //                 backgroundColor: 'rgb(255, 10, 10)',
            //                 borderColor: 'rgb(255, 10, 10)',
            //                 data: data.leads.reverse()
            //             },
            //         ]
            //     },
            //     // Configuration options go here
            //     options: {}
            // });
        },
        money:function($c,d,x,s){
            var //ctx = document.getElementById('chart__money_report').getContext('2d'),
                labels = [],cals=[],
                data={
                    deposits:[],
                    bonuses:[],
                    withdrawals:[]
                },td=new Date(),
                today = new Date(td - (td%(24*60*60*1000))),
                totals={previous:0,total:0,today:0,volation:0},
                $t = $('#withdrawal_total');
            for(var i in d){
                var r = d[i], dtd = new Date(r.date*1000),dt = system.months[dtd.getMonth()]+' '+dtd.getDate() ;
                labels[dt]=(labels[dt])?labels[dt]:{};
                labels[dt]["deposits"] = 0;
                labels[dt]["bonuses"] = 0;
                labels[dt]["withdrawals"] = 0;
                if(r.type=='deposit')labels[dt].deposits=r.amount;
                else if(r.type=='bonus')labels[dt].bonuses=r.amount;
                else if(r.type=='withdraw'){
                    labels[dt].withdrawals=r.amount;
                    totals.total++;
                    totals.previous+=parseFloat(r.amount);
                    totals.today+=(today==dtd)?parseFloat(r.amount):0;
                    totals.volation=(totals.previous==0)?0:100*((totals.today/totals.previous)-1);
                    // console.debug(totals);
                }
            }
            let dd = { deposit: 0, withdraw: 0, bonus: 0};
            d.map( (item) => {
                dd[item.type]+= parseFloat(item.amount)
            })
            $c.html('');
            if(dd.withdraw>0) $c.append(`<div class="statistic">
                    <div class="value"><i class="dollar icon"></i> ${dd.withdraw.digit(2)}</div>
                    <div class="label">${__('crm.dashboard.withdrawals')}</div>
                </div>`);
            if(dd.deposit>0) $c.append(`<div class="statistic">
                    <div class="value"><i class="dollar icon"></i> ${dd.deposit.digit(2)}</div>
                    <div class="label">${__('crm.dashboard.deposits')}</div>
                </div>`);
            if(dd.bonus>0) $c.append(`<div class="statistic">
                    <div class="value"><i class="dollar icon"></i> ${dd.bonus.digit(2)}</div>
                    <div class="label">${__('crm.dashboard.bonus')}</div>
                </div>`);

            $t.html('');
            $t.append(`<thead><tr><th>&nbsp;</th><th class="right aligned">${__('crm.dashboard.totals')}</th><th class="right aligned">${__('crm.dashboard.today')}</th></tr></thead>`);
            $t.append('<tbody><tr><th>Withdrawal</th>'
                +'<th class="ui header right aligned">'+totals.total+'</td>'
                +'<td class="ui color right aligned '+((totals.volation>0)?"red":"green")+'">'+totals.today+'<br><small>'+totals.volation.toFixed(2)+'%</small></td>'
                +'</tr></tbody>');
            for(var i=0;i<7;++i){
                var c = new Date();
                c.setDate(td.getDate()-i);
                c = system.months[c.getMonth()]+' '+c.getDate();
                cals.push(c);
                data.deposits.push((labels[c])?labels[c].deposits:0);
                data.withdrawals.push((labels[c])?labels[c].withdrawals:0);
            }
            // var chart = new Chart(ctx, {
            //     // The type of chart we want to create
            //     type: 'bar',
            //     // The data for our dataset
            //     data: {
            //         labels: cals.reverse(),//["January", "February", "March", "April", "May", "June", "July"],
            //         datasets: [
            //             {
            //                 label: __('crm.dashboard.deposits'),
            //                 backgroundColor: 'rgb(33,133,208)',
            //                 borderColor: 'rgb(33,133,208)',
            //                 data: data.deposits.reverse()
            //             },
            //             {
            //                 label: __('crm.dashboard.totals'),
            //                 backgroundColor: 'rgb(255, 10, 10)',
            //                 borderColor: 'rgb(255, 10, 10)',
            //                 data: data.withdrawals.reverse()
            //             },
            //         ]
            //     },
            //     // Configuration options go here
            //     options: {}
            // });

        },
        deposits:function($c,d){
            var //ctx = document.getElementById('chart__deposit_report').getContext('2d'),
                labels=[],data=[],
                raw={},
                totals = {
                    total:0,
                    today:0,
                    previous:0,
                    volation:0
                },
                today = new Date(),today = new Date(today - (today%(24*60*60*1000))),
                $t = $('#deposit_total');

            for(var i in d){
                var r = d[i],merchant = r.title;
                raw[merchant]=(raw[merchant])?raw[merchant]:0;
                raw[merchant]+=parseFloat(r.amount);
                totals.total+=parseInt(r.total);
                totals.volation=(totals.previous==0)?100:100*((parseFloat(r.amount)/(parseFloat(r.amount)+totals.previous))-1);
                totals.previous+=parseFloat(r.amount);
                if(r.trunc_date == today)total.today=parseFloat(r.total);
                totals[merchant]=(totals[merchant])?totals[merchant]:{previous:0,volation:0,total:0};
                totals[merchant].total+=parseInt(r.total);
                totals[merchant].volation=(totals[merchant].previous==0)?100:100*((parseFloat(r.amount)/(parseFloat(r.amount)+totals[merchant].previous))-1);
                totals[merchant].previous+=parseFloat(r.amount);
                totals[merchant].today=(r.trunc_date == today)?r.total:0;
            }
            $c.html('');
            Object.keys(raw).map( (merchant) => {
                const item = raw[merchant];
                $c.append(`<div class="statistic">
                    <div class="value"><i class="dollar icon"></i> ${item.digit(2)}</div>
                    <div class="label">${merchant}</div>
                </div>`)
            })
            $t.html('');
            $t.append(`<thead><tr><th>&nbsp;</th><th class="right aligned">${__('crm.dashboard.totals')}</th><th class="right aligned">${__('crm.dashboard.today')}</th></tr></thead>`);

            $t.append('<tbody><tr>'
                +`<td><b>${__('crm.dashboard.deposits')}</b></td>`
                +'<td class="right aligned"><b>'+totals.total+'</b></td>'
                +'<td class="color right aligned '+((totals.volation>0)?"green":"red")+'"><b>'+totals.today+'</b><br><small>'+totals.volation.toFixed(2)+'%</small></td>'
            +'</tr></tbody>');
            for(var i in totals){
                if($.inArray(i,['total','volation','previous','today'])<0){
                    $t.append('<tr>'
                        +`<td>${i}</td>`
                        +`<td class="right aligned">${totals[i].total}</td>`
                        +`<td class="right aligned color ${((totals[i].volation>0)?"green":"red")}">${totals[i].today}<br><small>${totals[i].volation.digit(2)}%</small></td>`
                    +'</tr>');
                }
            }
        }
    },
    image:{
        view:function(that){
            var $img = $(that).find('img:first'),
                $iframe = $(that).find('iframe:first'),
                id ="img"+skymechanics.guid(),
                $m=$('<div class="ui page dimmer" id="'+id+'"></div>').appendTo($('body')),
                actions = (arguments.length>1)?arguments[1]:{},
                $c = $('<div class="content"></div>').appendTo($m),
                buttonColor=['green','red'],j=0;
            $c = $('<div class="center"></div>').appendTo($c);
            $(`<div style="cursor:pointer;position:fixed;right:2em;top:2em;"><i class="ui big close icon"></i></div>`).appendTo($c).on('click',function(){
                $(this).closest('.dimmer').dimmer('hide');
                $(this).closest('.dimmer').remove();
            })
            if($img.length)$c.append('<img clas="ui image" src="'+$img.attr('src')+'" style="max-width:640px;"/><br/><br/>');
            else if($iframe.length)$c.append($iframe);
            // $m.append('');
            // $ac = $('<div class="ui buttons"></div>').appendTo($c);

            for(var i in actions){
                $('<button class="ui button basic circular icon inverted '+buttonColor[j++]+'" style="margin-left:2rem" onclick="'+actions[i]+'">'+i+'</button>')
                    .appendTo($c).on('click',function(){
                        $(this).closest('.dimmer').dimmer('hide');
                        $(this).closest('.dimmer').remove();
                    });
            }
            $m.dimmer({
                closeable:'',
                onHide:($e)=>{
                    $(`#${id}`).remove();
                }
            }).dimmer('show');
            console.debug(id,$m);
        }
    },
    show:function(){
        var p, subpage;
        if(page.current!==false){
            page.current.menu.removeClass('active');
            page.current.page.transition('fly right')
            if(page.current.subpage!==false)page.current.subpage.hide();
            // page.current.page.hide();
            // if(page.current.subpage!==false)page.current.subpage.hide();
        }
        const that = arguments.length?arguments[0]:'body';

        if(arguments.length>1){
            p = arguments[1];
            $.cookie('page.current',p);
        }
        else{
            p = $.cookie('page.current');
            // console.debug('cookie undefined value',p);
            p =(!p)?'dashboard':p;
        }
        if(arguments.length>2){
            subpage = arguments[2];
            $.cookie('page.current.sub',subpage);
        }
        else {
            subpage = $.cookie('page.current.sub');
            subpage =(!subpage)?false:subpage;
        }
        page.current = {
            name: '',
            menu: $(that),
            page: $('#page__'+p),
            subpage: false
        };
        page.current.page.transition('fly left');
        page.current.page.show();
        if(subpage){
            page.current.subpage = $('#page__'+p+'_'+subpage);
            page.current.subpage.show();
        }

        page.current.menu.addClass('active');
        page.current.name = page.current.page.attr('name');
        // console.debug(page.current);

        // $('#page__'+p+' .left .menu .item').removeClass('active');
        // $('#page__'+p+' .left .menu .item[data-href='+dhref+']').addClass('active');

        // $('#body_event_trigger').trigger('page:show',{page:$('#page__'+p)})
        skymechanics.reload();
        if(window.cardContainer)window.cardContainer.hide();
        $('#main_dimmer').fadeOut();
    },
    showHref:function(t,p,a){
        var p, subpage, dhref='page__';
        if(arguments.length>1){
            p = arguments[1];
            $.cookie('page.current',p);
        }
        else{
            p = $.cookie('page.current');
            // console.debug('cookie undefined value',p);
            p =(!p)?'dashboard':p;
        }
        dhref+=p;
        if(arguments.length>2){
            subpage = arguments[2];
            $.cookie('page.current.sub',subpage);
        }
        else {
            subpage = $.cookie('page.current.sub');
            subpage =(!subpage)?false:subpage;
        }
        $('#body_event_trigger').trigger('page:show',{page:$('#page__'+p)})


        if(subpage){
            page.current.push(subpage);
            dhref+='_'+subpage;
            $('#page__'+p+'_'+subpage).show();
        }
        // console.debug('show page universal navigation',document.location);
        // document.location.href=`?page=${p}&subpage=${subpage}`;
        document.location.href=document.location.origin+document.location.pathname+`?page=${p}&subpage=${subpage}`;
        // console.debug($(t).attr('data-href'));
        $('#page__'+p+' .left .menu .item').removeClass('active');
        // console.debug(dhref,'#page__'+p+' .left.menu .item[data-href='+dhref+']','#page__'+p+' .left.menu .item');
        $('#page__'+p+' .left .menu .item[data-href='+dhref+']').addClass('active');
        return;
    },
    modalPreloaderStart:(id)=>{
        const $dash = $(`<div class="ui mini basic modal" id="${id}"><div class="ui active dimmer content" style="height:20vh;"><div class="ui text loader">Getting data</div></div></div>`).appendTo('#modals');
        page.modal(`#${id}`);
        return $dash;
    },
    modalPreloaderEnd:($dash,d,reload=false)=>{
        $dash.removeClass('basic mini').addClass('fullscreen');
        $dash.html(d);
        if(reload)skymechanics.reload();
    },
    modal:function(id){
        var $id = (id instanceof jQuery)?id:$(id);
        const cfReload = (arguments.length>1)?arguments[1]:true;
        const settings = {
                transition: 'fade',
                allowMultiple:true,
                centered: false,
                observeChanges: true,
                onHidden:function(e){
                    var ch=$(this).attr('data-charts');
                    skymechanics.removeChart(ch);
                    $(this).remove();
                    $id.remove();
                }
            };
        console.debug('Modal.settings',settings)
        $id.modal(settings).modal('show');
        if(cfReload)skymechanics.reload();
        // $('#body_event_trigger').trigger('page:show',{page:$id});
    },
    paginate:function(){
        return new VUIPaginate(...arguments);
    }
};

// $(document).ready(function(){

    // fixed tasks header
    $('#listTasks').html($('#listTasksHidden').clone().html());
    // $('.ui.sidebar').sidebar();
    $('.sidebar#menuBar')
        .sidebar({
            // transition:'overlay',
            mobileTransition:'overlay',
            duration: 256
        })
        .sidebar('attach events', '.toggler', 'toggle');
    $('.datetask').on('change keyup blur',function(){
        var $d = $(this).parents('.form').find('.datetask.date'),$t = $(this).parents('.form').find('.datetask.time'),$r = $(this).parents('.form').find('[data-name=start_date]');
        // console.debug($d.val(),$t.val());
        $r.val($d.val()+' '+$t.val());
    });
    $('select.ui.dropdown:not(.dropdown-assigned),div.ui.dropdown:not(.dropdown-assigned)').addClass('dropdown-assigned').dropdown();
    $('.helper:not(.helper-assigned)').addClass('helper-assigned').popup({hoverable:true});

    $('[data-name=search]').on('focus',function(){
        // $(this).closest('.form').find('input').val('');
        $(this).closest('.form').find('.dropdown').dropdown('restore defaults');
    });
    $(".ui.tabular:not(.tab-assigned)").addClass("tab-assigned").find(".item").tab({
        onVisible:function(){
            console.debug('Tab onVisible',arguments,$(".loadering:visible:not(.loadering-assigned)"));
            skymechanics.reload()
        },
        onLoad:function(){
            console.debug('Tab loaded',arguments,$(".loadering:visible:not(.loadering-assigned)"));
            skymechanics.reload()
        }
    });
    if(typeof(PAGE_TAB)!="undefined"){
        $.tab('change tab',PAGE_TAB);
    }
    $('.ui.sticky:visible:not(.assigned)').each(function(){
        var tcontext = $(this).attr('data-context'),
            opts = {
                observeChanges:true,
                pushing:true,
                offset:120,
            };
        if(tcontext)opts['context']=tcontext;
        $(this).sticky(opts).addClass('assigned');
    });
    $('body').on('mousemove click keyup',function(e){
        const timestamp = new Date();
        page.activity = timestamp.getTime();
    })
    const timeCheck = 60000;
    setInterval(function(){
        const timestamp = new Date();
        const diff = timestamp.getTime()-page.activity
        if(diff>timeCheck){
            $('body').trigger('page:noactivity');
            page.activity = timestamp.getTime();
        }
    },timeCheck);


    skymechanics.reload();
    page.show();
// });
