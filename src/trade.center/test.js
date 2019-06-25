const LaravelJob = require('./services/LaravelJob');

const unitTest = "O:13:\\\"App\\\\Jobs\\\\Tick\\\":8:{s:7:\\\"\\u0000*\\u0000tick\\\";O:8:\\\"stdClass\\\":4:{s:3:\\\"ask\\\";s:4:\\\"3400\\\";s:3:\\\"bid\\\";s:4:\\\"3410\\\";s:6:\\\"symbol\\\";s:6:\\\"BTCUSD\\\";s:4:\\\"time\\\";i:1544215275;}s:6:\\\"\\u0000*\\u0000job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";s:5:\\\"ticks\\\";s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:5:\\\"delay\\\";N;s:7:\\\"chained\\\";a:0:{}}"

const time = Math.floor((new Date()).getTime()/1000);
const lj = new LaravelJob();

lj.add({price:"3402.4567",source_id:"6",instrument_id:2,time:time,volation:1});
// lj.destroy();


/*
O:13:\\\"App\\\\Jobs\\\\Tick\\\":8:{s:7:\\\"\\u0000*\\u0000tick\\\";O:8:\\\"stdClass\\\":4:{s:3:\\\"ask\\\";s:4:\\\"3400\\\";s:3:\\\"bid\\\";s:4:\\\"3410\\\";s:6:\\\"symbol\\\";s:6:\\\"BTCUSD\\\";s:4:\\\"time\\\";i:1544222326;}s:6:\\\"\\u0000*\\u0000job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";s:5:\\\"ticks\\\";s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:5:\\\"delay\\\";N;s:7:\\\"chained\\\";a:0:{}}
O:13:\\\"App\\\\Jobs\\\\Tick\\\":8:{s:7:\\\"\\u0000*\\u0000tick\\\";O:8:\\\"stdClass\\\":4:{s:3:\\\"ask\\\";s:4:\\\"3400\\\";s:3:\\\"bid\\\";s:4:\\\"3410\\\";s:6:\\\"symbol\\\";s:6:\\\"BTCUSD\\\";s:4:\\\"time\\\";i:1544215275;}s:6:\\\"\\u0000*\\u0000job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";s:5:\\\"ticks\\\";s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:5:\\\"delay\\\";N;s:7:\\\"chained\\\";a:0:{}}

\"}


"RPUSH" "queues:ticks" "{\"displayName\":\"App\\\\Jobs\\\\Tick\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"timeout\":null,\"timeoutAt\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\Tick\",\"command\":\"
O:13:\\\"App\\\\Jobs\\\\Tick\\\":8:{s:7:\\\"\\u0000*\\u0000tick\\\";O:8:\\\"stdClass\\\":4:{s:3:\\\"ask\\\";s:4:\\\"3400\\\";s:3:\\\"bid\\\";s:4:\\\"3410\\\";s:6:\\\"symbol\\\";s:6:\\\"BTCUSD\\\";s:4:\\\"time\\\";i:1544215275;}s:6:\\\"\\u0000*\\u0000job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";s:5:\\\"ticks\\\";s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:5:\\\"delay\\\";N;s:7:\\\"chained\\\";a:0:{}}\"}
,\"id\":\"23085\",\"attempts\":0,\"type\":\"job\",\"tags\":[],\"pushedAt\":1544215275.6124721}"


1544215275.610294 [0 127.0.0.1:61464] "SELECT" "0"
1544215275.611067 [0 127.0.0.1:61464] "INCR" "horizon:job_id"
1544215275.613409 [0 127.0.0.1:61465] "SELECT" "0"
1544215275.613518 [0 127.0.0.1:61465]
"RPUSH"
"queues:ticks" {
    "displayName":"App\\Jobs\\Tick",
    "job":"Illuminate\\Queue\\CallQueuedHandler@call",
    "maxTries":null,
    "timeout":null,
    "timeoutAt":null,
    "data":{
        "commandName":"App\\Jobs\\Tick",
        "command":"O:13:"App\\Jobs\\Tick":8:{
            s:7:"\u0000*\u0000tick";
            O:8:"stdClass":
                4:{
                    s:3:"ask";s:4:"3400";
                    s:3:"bid";s:4:"3410";
                    s:6:"symbol";s:6:"BTCUSD";
                    s:4:"time";i:1544215275;
                }
                s:6:"\u0000*\u0000job";N;
                s:10:"connection";N;
                s:5:"queue";s:5:"ticks";
                s:15:"chainConnection";N;
                s:10:"chainQueue";N;
                s:5:"delay";N;
                s:7:"chained";a:0:{}
        }"
    },
    "id":"23085",
    "attempts":0,
    "type":"job",
    "tags":[],
    "pushedAt":1544215275.6124721
}
1544215275.679913 [0 127.0.0.1:61464] "ZADD" "horizon:recent_jobs" "-1544215275.6492" "23085"
1544215275.679969 [0 127.0.0.1:61464] "HMSET" "horizon:23085" "id" "23085" "connection" "redis" "queue" "ticks" "name" "App\Jobs\Tick" "status" "pending" "payload" "{"displayName":"App\\Jobs\\Tick","job":"Illuminate\\Queue\\CallQueuedHandler@call","maxTries":null,"timeout":null,"timeoutAt":null,"data":{"commandName":"App\\Jobs\\Tick","command":"O:13:"App\\Jobs\\Tick":8:{s:7:"\u0000*\u0000tick";O:8:"stdClass":4:{s:3:"ask";s:4:"3400";s:3:"bid";s:4:"3410";s:6:"symbol";s:6:"BTCUSD";s:4:"time";i:1544215275;}s:6:"\u0000*\u0000job";N;s:10:"connection";N;s:5:"queue";s:5:"ticks";s:15:"chainConnection";N;s:10:"chainQueue";N;s:5:"delay";N;s:7:"chained";a:0:{}}"},"id":"23085","attempts":0,"type":"job","tags":[],"pushedAt":1544215275.6124721}" "created_at" "1544215275.6496" "updated_at" "1544215275.6496"
1544215275.680141 [0 127.0.0.1:61464] "EXPIREAT" "horizon:23085" "1544218875"
1544215275.682154 [0 127.0.0.1:61464] "SMEMBERS" "horizon:monitoring"
*/
