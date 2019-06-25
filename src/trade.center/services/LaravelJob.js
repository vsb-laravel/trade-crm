const Serialize = require('php-serialize');
const Redis = require('ioredis');

class stdClass{
    constructor(ask,bid,symbol,time){
        this.price = ask
        this.instrument_id = bid
        this.source_id = symbol
        this.time = time

    }
}
class Tick{
    constructor(tick){
        this._private_tick = tick//new stdClass(ask,bid,symbol,time);
        this._private_job=null
        this.connection = null
        this.queue="ticks"
        this.chainConnection=null
        this.chainQueue=null
        this.delay=null
        this.chained=[]
    }
};
class LaravelJob{
    constructor(tick){
        this.tick = null;
        this.redis = new Redis({});
        this.add=this.add.bind(this);
        this.serialize=this.serialize.bind(this);
        this.inject=this.inject.bind(this);
        this.command=this.command.bind(this);

    }
    add(tick){
        this.tick = new Tick(tick);
        this.inject();
    }
    destroy(){
        this.redis.quit();
    }
    serialize(){
        let ser = Serialize.serialize( this.tick, { "App\\Jobs\\Tick" :Tick} );
        // ser = ser.replace(/([\\"])/ig,"\\$1");
        ser = ser.replace(/(\w+?):(\d+):\"_private_(.+?)\"/ig,(r0,r1,r2,r3)=>{
            const length = parseInt(r2)-6;
            return `${r1}:${length}:"\u0000*\u0000${r3}\"`;
        })
        // ser = ser.replace(/([\\"])/ig,"\\$1");

        return ser;
    }
    command(cmd,args=''){
        return new Promise( (resolve,reject) => {
            const arg = typeof(args)=="array"?args:[args];
            this.redis.sendCommand(new Redis.Command(cmd,arg,'urt8',(err, result) => {
                // console.log(cmd,args, result);
                if (err) reject(err);
                resolve(result);
            }));
        })
    }
    async inject(){

        // console.debug(this); return;
        const date = (new Date()).getTime();
        const dt = `${Math.floor(date/1000)}.${date%1000}`;
        let redisId = 1;
        await this.command("SELECT","0");

        try{
            redisId =await this.command("INCR","horizon:job_id");
        }
        catch(e){
            console.debug(e);
        }

        await this.command("SELECT","0");
        let setJson = {
            displayName:"App\\Jobs\\Tick",
            job:"Illuminate\\Queue\\CallQueuedHandler@call",
            maxTries:null,
            timeout:null,
            timeoutAt:null,
            data:{
                commandName:"App\\Jobs\\Tick",
                command: this.serialize()
            },
            id:redisId,
            attempts:0,
            type:"job",
            tags:['ticks'],
            pushedAt:parseFloat(dt)
        };
        await this.command("RPUSH",["queues:ticks",JSON.stringify(setJson)]);
        await this.command("ZADD",["horizon:recent_jobs",`-${dt}`,`${redisId}`]);
        await this.command("HMSET",[`horizon:${redisId}`,"id",`${redisId}`,"connection","redis","queue","ticks","name","App\\Jobs\\Tick","status","pending","payload",JSON.stringify(setJson), "created_at",dt,"updated_at",dt]);
        await this.command("EXPIREAT",[`horizon:${redisId}`,`${date+3600}`]);
        await this.command("SMEMBERS","horizon:monitoring");

    }
};
module.exports = LaravelJob;



/*

"{\"displayName\":\"App\\\\Jobs\\\\Tick\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"timeout\":null,\"timeoutAt\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\Tick\",\"command\":\"O:13:\\\"App\\\\Jobs\\\\Tick\\\":8:{s:7:\\\"\\u0000*\\u0000tick\\\";a:4:{s:3:\\\"ask\\\";s:4:\\\"3401\\\";s:3:\\\"bid\\\";s:4:\\\"3411\\\";s:6:\\\"symbol\\\";s:6:\\\"BTCUSD\\\";s:4:\\\"time\\\";i:1544231557;}s:6:\\\"\\u0000*\\u0000job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";s:5:\\\"ticks\\\";s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:5:\\\"delay\\\";N;s:7:\\\"chained\\\";a:0:{}}\"},\"id\":23103,\"attempts\":0,\"type\":\"job\",\"tags\":[\"ticks\"],\"pushedAt\":\"1544231557.6\"}"

"{\"displayName\":\"App\\\\Jobs\\\\Tick\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"timeout\":null,\"timeoutAt\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\Tick\",\"command\":\"O:13:\\\"App\\\\Jobs\\\\Tick\\\":8:{s:7:\\\"\\u0000*\\u0000tick\\\";a:4:{s:3:\\\"ask\\\";s:4:\\\"3400\\\";s:3:\\\"bid\\\";s:4:\\\"3410\\\";s:6:\\\"symbol\\\";s:6:\\\"BTCUSD\\\";s:4:\\\"time\\\";i:1544231394;}s:6:\\\"\\u0000*\\u0000job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";s:5:\\\"ticks\\\";s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:5:\\\"delay\\\";N;s:7:\\\"chained\\\";a:0:{}}\"},\"id\":\"23102\",\"attempts\":0,\"type\":\"job\",\"tags\":[],\"pushedAt\":1544231395.0565839}"



1544231557.034073 [0 127.0.0.1:53497] "HMSET" "horizon:23103" "id" "23103" "connection" "redis" "queue" "ticks" "name" "AppJobsTick" "status" "pending" "payload" "{\"displayName\":\"App\\\\Jobs\\\\Tick\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"timeout\":null,\"timeoutAt\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\Tick\",\"command\":\"O:13:\\\"App\\\\Jobs\\\\Tick\\\":8:{s:7:\\\"\\u0000*\\u0000tick\\\";a:4:{s:3:\\\"ask\\\";s:4:\\\"3401\\\";s:3:\\\"bid\\\";s:4:\\\"3411\\\";s:6:\\\"symbol\\\";s:6:\\\"BTCUSD\\\";s:4:\\\"time\\\";i:1544231557;}s:6:\\\"\\u0000*\\u0000job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";s:5:\\\"ticks\\\";s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:5:\\\"delay\\\";N;s:7:\\\"chained\\\";a:0:{}}\"},\"id\":23103,\"attempts\":0,\"type\":\"job\",\"tags\":[\"ticks\"],\"pushedAt\":\"1544231557.6\"}" "created_at" "1544231557.6" "updated_at" "1544231557.6"

1544231395.084730 [0 127.0.0.1:52629] "HMSET" "horizon:23102" "id" "23102" "connection" "redis" "queue" "ticks" "name" "App\\Jobs\\Tick" "status" "pending" "payload" "{\"displayName\":\"App\\\\Jobs\\\\Tick\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"timeout\":null,\"timeoutAt\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\Tick\",\"command\":\"O:13:\\\"App\\\\Jobs\\\\Tick\\\":8:{s:7:\\\"\\u0000*\\u0000tick\\\";a:4:{s:3:\\\"ask\\\";s:4:\\\"3400\\\";s:3:\\\"bid\\\";s:4:\\\"3410\\\";s:6:\\\"symbol\\\";s:6:\\\"BTCUSD\\\";s:4:\\\"time\\\";i:1544231394;}s:6:\\\"\\u0000*\\u0000job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";s:5:\\\"ticks\\\";s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:5:\\\"delay\\\";N;s:7:\\\"chained\\\";a:0:{}}\"},\"id\":\"23102\",\"attempts\":0,\"type\":\"job\",\"tags\":[],\"pushedAt\":1544231395.0565839}" "created_at" "1544231395.0607" "updated_at" "1544231395.0607"

*/
