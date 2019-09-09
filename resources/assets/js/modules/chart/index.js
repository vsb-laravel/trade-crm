if(window.charts == undefined)window.charts=[];
export const SUPPORT_LINE_RANGE = 0.001
export class VUIChart{
    constructor(uid,opts={}){
        Chart.defaults.global.elements.point.radius = 0;
        Chart.defaults.global.elements.point.borderWidth = 0;
        this.uid = uid;
        this.opts = $.extend({
            ctx:null,
            type:'line',
            uid:'chart',
            maxDataLength:144,
            timeDiff:60000,
            borderColor:'rgba(33,187,149,1)',
            pointBorderWidth:0,
            pointBorderColor:'rgba(255,255,255,0)',
            pointBackgroundColor:'rgba(255,255,255,0)',
            pointHitRadius:0,
            data:{
                label:'Line',
                keys:[],
                values:[]
            },
            onUpdate:function(p){}
        },opts);
        this.chart = null;
        this.supports = [];
        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
        this.setSupport = this.setSupport.bind(this);
        this.removeSupports = this.removeSupports.bind(this);
        this.handlerData = this.handlerData.bind(this);
        this.render();
    }
    render(){
        console.debug( 'VUIChart render', this.opts.ctx, this.opts.ctx.get(0));
        this.chart = new Chart(this.opts.ctx.get(0).getContext('2d'), {
            type: this.opts.type,
            data: {
                labels:[], //this.opts.data.keys,
                datasets: [
                    {
                        label: this.opts.data.label,
                        borderColor: this.opts.borderColor,
                        data: this.opts.data.values
                    }
                ]
            },

            options: {
                scales: {
                    // xAxes: [{
                    //     type: 'time',
                    //     time: {
                    //         displayFormats: {
                    //             quarter: 'hh:mm:ss'
                    //         }
                    //     }
                    // }]

                    xAxes: [{
                       type: 'time',
                       distribution: 'series'
                   }]
                },
                zoom: {
                    enabled: true,
                    // drag: true,
                    mode: 'y',
		            // rangeMin: {x: null,y: null},
		            // rangeMax: {x: null,y: null},
		            onZoom: function() { console.log('I was zoomed!!!'); }
                },
                pan: {
            		// Boolean to enable panning
            		enabled: true,

            		// Panning directions. Remove the appropriate direction to disable
            		// Eg. 'y' would only allow panning in the y direction
            		mode: 'xy',
            		// Function called once panning is completed
            		// Useful for dynamic data loading
            		onPan: function() { console.log('I was panned!!!'); }
            	},
            }
        });
    }
    setSupport(l){
        var range = (arguments.length>1)?arguments[1]:SUPPORT_LINE_RANGE;
        var callbackf = (arguments.length>2 && typeof(arguments[2])==="function")?arguments[2]:function(h,l){console.debug('fake callback function',h,l)};

        if(!this.supports.length){
            var thatChart = this.chart,wasLevel = l,wasRange = l*0.001,
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
                        let nlevel = event.subject.config.value, newLine = this;
                        rangeDownLine.value=nlevel-nlevel*range;
                        rangeUpLine.value=nlevel+nlevel*range;
                        newLine.value=nlevel;
                        newLine.label.content = nlevel.toFixed(0);
                        callbackf(nlevel,(100*wasRange/nlevel).toFixed(2));
                        thatChart.update();
                    },
                    onDragEnd: function(event){ wasLevel = event.subject.config.value; }
                },
                rangeDownLine = {
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    value: l-l*range,
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
                    value: l+l*range,
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
    removeSupports(){
        this.supports.pop();
        this.supports.pop();
        this.supports.pop();
        this.chart.update();
    };
    update(data){
        if(!this.chart)return;
        time = new Date(data.created_at*1000);
        val = parseFloat(data.price)
        this.opt.data.keys.push(time.getTime());
        this.opt.data.keys.push(time.getTime());
        for(var i in this.opt.data.keys){
            if(  $.inArray(d.keys[i].getTime(),this.opts.data.keys) == -1 && d.keys[i]>td ) {
                if( d.keys[i].getTime()-td>0) {
                    setTimeout(timedUpdate,d.keys[i].getTime()-td,this,d.keys[i],d.values[i]);
                    console.debug('next price in '+(d.keys[i].getTime()-td));
                }

                this.opts.data.keys.push(d.keys[i].getTime());
                this.opts.data.values.push(d.values[i]);
            }
            else if(this.first) this.set(d.keys[i],d.values[i]);
        }
    }
    set(l,d,datasetNum=0){
        if(!this.chart)return;
        if(!this.chart.data.datasets[datasetNum])return;
        const last = this.chart.data.datasets[datasetNum].data[ this.chart.data.datasets[datasetNum].data.length-1 ];
        // console.debug('chart add tick to rerender()',datasetNum,last)
        if(last.x >= l ) {
            l = last.x;
            l.setMilliseconds(l.getMilliseconds()+10);
        }
        this.chart.data.datasets[datasetNum].data.push({
            x: l,
            y: d
        });
        this.chart.update();
    }
    handlerData(uid,l,d){
        if(this.uid == uid){
            this.set(l,d);
        }
    }
    getDataset(datasetNum=0){
        let nds = {...this.chart.data.datasets[datasetNum]};
        nds.data = this.chart.data.datasets[datasetNum].data.slice();
        return nds;
    }
    removeDataset(datasetNum=0){
        if( this.chart.data.datasets.length-1 < datasetNum )return;
        this.chart.data.datasets.pop();// = this.chart.data.datasets[datasetNum]=null;
        this.chart.update();
        // console.debug('removeDataset',this.chart.data.datasets)
    }
    addDataset(ds){
        // this.chart.data.datasets[this.chart.data.datasets.length-1].borderColor='rgba(33,187,149,.2)';
        const newDataset = $.extend({
            label: "Second",
            data: [],
            borderColor: '#1e2535',
            pointBorderWidth:0
        },ds)
        this.chart.data.datasets.push(newDataset);
        this.chart.update();
        // console.debug('addDataset',ds,this.chart.data.datasets)
    }
}
