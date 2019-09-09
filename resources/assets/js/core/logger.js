export class Logger{
    constructor(){
        this.level='';
        this.class = this.constructor.name;
        this.print=this.print.bind(this);
        this.log=this.log.bind(this);
        this.getTime=this.getTime.bind(this);

        console.log(`new Logger initilized`,this.constructor.name,new.target.name);
    }
    print(level,args){
        const time = this.getTime();
        let data = [];
        for(let i in args){
            const  a = args[i];
            data.push(a);
        };
        console.log(`${time} ${level}`,data);
    }
    log(){
        this.print('LOG',arguments);
    }
    getTime(){
        const d = new Date();
        return `${d.getHours().leftPad()}:${d.getMinutes().leftPad()}:${d.getSeconds().leftPad()}.${d.getMilliseconds().leftPad({maxLength:4})}`;
    }
}
