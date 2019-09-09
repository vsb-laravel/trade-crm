
Number.prototype.decimal=function(){ return this};
Number.prototype.integer=function(){ return this};

String.prototype.decimal=function(){ return parseFloat(this)};
String.prototype.integer=function(){ return parseInt(this)};
Number.prototype.timestamp=function(){
    const date = new Date(this*1000);
    let res = `${date.getSMYear().leftPad()}-${(date.getSMMonth()+1).leftPad()}-${date.getSMDate().leftPad()} ${date.getSMHours().leftPad()}:${date.getSMMinutes().leftPad()}:${date.getSMSeconds().leftPad()}`;
    return res;
}
String.prototype.timestamp=function(){
    return this.integer().timestamp();
};

Date.prototype.getSMYear=function(){
    return (USE_UTC)?this.getUTCFullYear():this.getFullYear();
}
Date.prototype.getSMMonth=function(){
    return (USE_UTC)?this.getUTCMonth():this.getMonth();
}
Date.prototype.getSMDate=function(){
    return (USE_UTC)?this.getUTCDate():this.getDate();
}
Date.prototype.getSMHours=function(){
    return (USE_UTC)?this.getUTCHours():this.getHours();
}
Date.prototype.getSMMinutes=function(){
    return (USE_UTC)?this.getUTCMinutes():this.getMinutes();
}
Date.prototype.getSMSeconds=function(){
    return (USE_UTC)?this.getUTCSeconds():this.getSeconds();
}

window.truncDay = function(d){
    let r = parseInt(d);
    return (r - r%(1000*60*60*24));
}
window.leftZeroPad = function(s){
   var ret=s.toString(),
       length = ret.length,
       defaults={
           symbol:'0',
           maxLength:2
       },
       opts = $.extend(defaults,(arguments.length>1)?arguments[1]:{});
   for(var i=0;i<(opts.maxLength-length);++i)ret=opts.symbol+ret;
   return ret;
}
// window.amountFormat = function(d){
//     var s = parseFloat(d);
//     if(isNaN(s))return 0;
//     return s.toLocaleString();
// }
window.dateFormat = function(d){
    if(d==null || d == '' || typeof(d)=="undefined" ) return '';
    var date = new Date(d*1000),
       withTime = (arguments.length>1)?arguments[1]:true,
       style = (arguments.length>2)?arguments[2]:'new',
       res = '<small>'+date.getSMYear()+'</small><br>';
    if(isNaN(date.getSMYear()))return '';
    if(style=='simple')res = date.getSMYear()+'-'+(date.getSMMonth()+1).leftPad()+'-'+date.getSMDate().leftPad()+' ';
    else {
       res+= '<span class="ui basic circular label huge">'+leftZeroPad(date.getSMDate())+'</span><br/>';
       res+= '<small>'+system.months[date.getSMMonth()]+'</small>';
    }
    if(withTime){
       res+= '<br><small>'+leftZeroPad(date.getSMHours());
       res+= ':'+leftZeroPad(date.getSMMinutes());
       res+= ':'+leftZeroPad(date.getSMSeconds())+'</small>';
    }
   return res;
}


window.splitObjectKeys = function(o){
    var k=[],v=[];
    for(var i in o){
        k.push(i);
        v.push(o[i]);
    }
    return {keys:k,values:v};
}
window.splitObject2XY = function(o){
    let ret=[];
    for(var i in o){
        let key = i;
        try{
            key = new Date(key);
        }catch(e){}
        ret.push({x:key,y:o[i]});
    }
    return ret;
}
String.prototype.datetime=function(){
    return  parseInt(this).datetime(arguments[0]||{});
};
Number.prototype.datetime=function(){
    var date = new Date(this*1000),
        opts = $.extend({
            show:{
                time:true,
                date:true
            },
            style:'cool'
        },arguments.length?arguments[0]:{}),res='';
    if(isNaN(date.getSMYear()))return '';
    if(opts.style=='simple') {
        if(opts.show.date)res+= date.getSMYear()+'-'+leftZeroPad(date.getSMMonth()+1)+'-'+leftZeroPad(date.getSMDate())+' ';
        if(opts.show.time){
           res+= '<small>'+leftZeroPad(date.getSMHours());
           res+= ':'+leftZeroPad(date.getSMMinutes());
           res+= ':'+leftZeroPad(date.getSMSeconds())+'</small>';
        }
    }
    else if(opts.style=='cool'){
        res = '<small>'+date.getSMYear()+'</small><br>';
        res+= '<span class="ui basic circular label huge">'+leftZeroPad(date.getSMDate())+'</span><br/>';
        res+= '<small>'+system.months[date.getSMMonth()]+'</small>';
        if(opts.show.time){
           res+= '<br/>';
           res+= '<small>'+leftZeroPad(date.getSMHours());
           res+= ':'+leftZeroPad(date.getSMMinutes());
           res+= ':'+leftZeroPad(date.getSMSeconds())+'</small>';
        }
    }
    else if(opts.style=='time'){
        res+= leftZeroPad(date.getSMHours());
        res+= ':'+leftZeroPad(date.getSMMinutes());
        res+= ':'+leftZeroPad(date.getSMSeconds());
    }

    return res;
}
String.prototype.currency=function(){
    var p = arguments[1] || 2, s = arguments[0] || '';//,v = parseFloat(this).toFixed(p),sp = v.split(/\./);
    return parseFloat(this).currency(s,p);
    if(sp.length>1){
        var d = sp[0],r=d.split('').reverse().join('');
        r = r.replace(/(\d{3})/g,'$1 ');
        v = r.split('').reverse().join('').replace(/^\s/,'') +'.'+sp[1];
    }
    return s+v;
}
Number.prototype.currency=function(){
    var p = arguments[1] || 2, s = arguments[0] || '',
        v = Math.abs(this).toFixed(p),sp = v.split(/\./), sign = (this<0)?'-':'';
    if(sp.length>1){
        var d = sp[0],r=d.split('').reverse().join('');
        r = r.replace(/(\d{3})/g,'$1 ');
        v = r.split('').reverse().join('').replace(/^\s/,'') +'.'+sp[1];
    }
    return sign+s.replace(/\s/ig,'')+v.replace(/^\s*/ig,'');
}
String.prototype.digit=function(){
    parseFloat(this).digit(arguments.length?arguments[0]:2);
}
Number.prototype.digit=function(){
    const p = arguments[0] || getPointPosition(this);

    let v = this.toFixed(p);
    let sp = v.split(/\./);
    if(sp.length>1){
        let d = sp[0],r=d.split('').reverse().join('');
        r = r.replace(/(\d{3})/g,'$1 ');
        v = r.split('').reverse().join('').replace(/^\s/,'') +'.'+sp[1];
    }
    return v;
}
Number.prototype.dollars=function(){
    let cur = '$';
    if(document.location.href.match(/windigoarena/))cur='W';
    return this.currency(cur,2);
}
String.prototype.dollars=function(){
    let cur = '$';
    if(document.location.href.match(/windigoarena/))cur='W';
    return this.currency(cur,2);
}
Number.prototype.percent=function(){
    let ret = this*100;
    return ret.currency('',2)+'%';
}
String.prototype.percent=function(){
    let ret = parseFloat(this)*100;
    return ret.currency('',2)+'%';
}
String.prototype.leftPad=function(){
    var ret=this,
        length = ret.length,
        defaults={
            symbol:'0',
            maxLength:2
        },
        opts = $.extend(defaults,(arguments.length>1)?arguments[0]:{});
    for(var i=0;i<(opts.maxLength-length);++i)ret=opts.symbol+ret;
    return ret;
}

Number.prototype.leftPad=function(){
    var ret=this.toString(),
        length = ret.length,
        defaults={
            symbol:'0',
            maxLength:2
        },
        opts = $.extend(defaults,(arguments.length>1)?arguments[0]:{});
    for(var i=0;i<(opts.maxLength-length);++i)ret=opts.symbol+ret;
    return ret;
}
window.copyValue = function(that,t){
    console.debug('copyValue',that,t);
    // const copyText = document.querySelector(`${t}`);
    const copyText = $(`${t}`).get(0);

    copyText.select();
    const exec = document.execCommand("copy");
    if(exec)$(that).html('Copied');
}
window.getFunctionByName = function (func){
    const fakeFunc = (a,b,c)=>{};
    let f=window;
    if(!func)f=fakeFunc;
    else if(func.match(/\./)){
        const ff = func.split(/\./g);
        for(let i in ff){
            f = (f[ff[i]]!=undefined)?f[ff[i]]:fakeFunc;
            if(f==fakeFunc)break;
        }
    }else{
        f=window[func];
        if(!f)f=fakeFunc;
    }
    return f;
}
window.getObjectByPath = function(obj,path){
    var fakeFunc = false,f=obj;
    if(!path)f=obj;
    else if(path.match(/\./)){
        var ff = path.split(/\./g);
        for(var i in ff){
            f = (f[ff[i]]!=undefined)?f[ff[i]]:fakeFunc;
            if(f==fakeFunc)break;
        }
    }else{
        f=obj[path];
        if(!f)f=fakeFunc;
    }
    return f;
}
window.http_params = function(d){
    let ret = '';
    if(!d) return ret;
    Object.keys(d).map( (i) => {
        ret = ret+(ret.length?'&':'')+`${i}=${d[i]}`;
    });
    return ret;
}
window.getPointPosition = function(v){
    let n = v;
    let p = 0;
    while(parseInt(n) !== n){
        ++p;
        n*=10;
    }
    return p;
}
var TITLE_BLINK = false;
var TITLE_TEXT = $('title');
var timer,
    title = $('title'),
    title_text = '';
function blinkTitle(text){
    title_text = text;
    TITLE_BLINK = true;
    timer = setInterval(function() {
        title.text(title.text().length == 0 ? title_text : '');
        console.debug('blinking',title,title_text);
        if(!TITLE_BLINK){
            clearInterval(timer);
            title.text(TITLE_TEXT);
        }
    }, title.text().length == 0 ? 300 : 1800);
    $(window).focus(function() {
        TITLE_BLINK=false;
    });
}
// blinkTitle('new event')
// Object.prototype.pipsPrice=() => {
//     if(typeof(this.price) == "undefined")return;
//     if(isNaN(this.price.price))return;
//     const price = parseFloat(this.price.price)
//     let toFixed = 0, pp = parseFloat(this.pips);
//     while( (pp*10)%10 > 0 && toFixed<5 ){
//         pp=10*pp;
//         toFixed++;
//     }
//     return price.currency('',toFixed);
// }
window.getMeta = (arr,name)=>{
    for(let i in arr){
        const m = arr[i];
        if(m.meta_name==name)return m;
    }
    return false;
}
window.guid=function(length=8){
    return Math.random().toString(36).substr(2, length-2);
}
