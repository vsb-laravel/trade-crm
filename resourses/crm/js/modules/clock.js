export class Clock {
    constructor(selector,utc = true){
        this.container = $(selector);
        this.date = new Date();
        this.utc = utc;
        if(this.container.length==0)console.error(`Clock.constructor: Wrong selector $('${selector}'). No container found.`);

        this.weekDays = ['Sun','Mon','Tue','Wen','Thu','Fri','Sat'];
        this.months= ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        this.render = this.render.bind(this);
    };
    render(){
        // console.debug('Clock.render',this);
        const dt = new Date(),
            str = dt.toUTCString(),//dt.getFullYear()+(dt.getMonth()+1).leftPad()+dt.getDate().leftPad(),
            year = dt.getFullYear(),
            month = this.months[dt.getMonth()],
            day = dt.getDate().leftPad(),
            week = this.weekDays[dt.getDay()],
            hour = dt.getHours().leftPad(),
            minute = dt.getMinutes().leftPad(),
            delim = `<span class="delimeter">:</span>`;
        this.container.html(`<div class="ui mini inverted statistic">
            <div class="value">${hour}${delim}${minute}</div>
            <div class="label">${week}, ${day} of ${month}'${year}</div>
        </div>`);
    }
};
export default Clock;
