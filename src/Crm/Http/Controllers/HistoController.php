<?php

namespace Vsb\Crm\Http\Controllers;

use DB;
use Log;
use App\Histo;
use App\Price;
use App\User;
use App\UserTuneHisto;
use App\UserTunePrice;
use App\Instrument;
use cryptofx\DataTune;
use Illuminate\Http\Request;

class HistoController extends Controller{
    public function __construct(){
        // $this->middleware('auth');
        $this->middleware('cors');
    }
    public function histo(Request $rq,$type="histominute",$agre=1){
        $histo =[];
        $arge = ($agre=='NaN')?5:intval($agre);
        $prec = 60;
        $table = 'histo';
        $objectType = 'minute';
        $class = "\App\Histo";
        $timeDiff = 0; //3*60*60;
        switch($type){
            case "histohour":{
                $prec *=60;
                $table = 'histo_hour';
                $objectType = 'hour';
                $class = "\App\HistoHour";
                break;
            }
            case "histoday":{
                $prec *=60*24;
                $table = 'histo_day';
                $objectType = 'day';
                $class = "\App\HistoDay";
                break;
            }
        }
        $dateFrom = $rq->input("date_from",false);
        $dateTo = $rq->input("date_to",false);
        $instid = $rq->input("instrument_id",1);
        // $pair = Instrument::find($instid);
        $limit = intval($rq->input("limit","144"));
        $user = ($rq->input("user_id",false)!==false)?User::find($rq->input("user_id")):$rq->user();
        $query = $class::where('instrument_id',$instid)->limit($limit*$arge)->orderBy('time','desc')->get();
        $pp = $prec*$arge;
        $tuneQuery = UserTuneHisto::where('user_id',$user->id)->where('instrument_id',$instid)->where('time','>',time()-$arge*$prec)->get();
        $tuned=[];
        foreach ($tuneQuery as $row) {
            $ohlcTime = $row->time - $row->time%$pp -$timeDiff;
            $tuned[$ohlcTime] = isset($histo[$ohlcTime])?$histo[$ohlcTime]:[
                "date"=>date('Y-m-d H:i:s',$ohlcTime),
                "time"=>$row->time,
                "low"=>$row->low,
                "high"=>$row->high,
                "open"=>$row->open,
                "close"=>$row->close,
                "value"=>$row->close,
                "volumefrom"=>0,
                "volumeto"=>0,
                "volume"=>$row->volume
            ];
            $tuned[$ohlcTime]["low"] = ($tuned[$ohlcTime]["low"] > $row->low )?$row->low:$tuned[$ohlcTime]["low"];
            $tuned[$ohlcTime]["high"] = ($tuned[$ohlcTime]["high"] < $row->high )?$row->high:$tuned[$ohlcTime]["high"];
            $tuned[$ohlcTime]["close"] = $row->close;
            $tuned[$ohlcTime]["value"] = $row->close;
            $tuned[$ohlcTime]["volume"]+= $row->volume;
        }
        foreach ($query->reverse() as $row) {
            $ohlcTime = $row->time - $row->time%$pp -$timeDiff;
            if(isset($tuned[$ohlcTime])){
                $histo[$ohlcTime] = $tuned[$ohlcTime];
                continue;
            }
            $histo[$ohlcTime] = isset($histo[$ohlcTime])?$histo[$ohlcTime]:[
                "date"=>date('Y-m-d H:i:s',$ohlcTime),
                "time"=>$row->time,
                "low"=>$row->low,
                "high"=>$row->high,
                "open"=>$row->open,
                "close"=>$row->close,
                "value"=>$row->close,
                "volumefrom"=>$row->volumefrom,
                "volumeto"=>$row->volumeto,
                "volume"=>$row->volumeto-$row->volumefrom
            ];
            $histo[$ohlcTime]["low"]= ($histo[$ohlcTime]["low"] > $row->low )?$row->low:$histo[$ohlcTime]["low"];
            $histo[$ohlcTime]["high"]= ($histo[$ohlcTime]["high"] < $row->high )?$row->high:$histo[$ohlcTime]["high"];
            $histo[$ohlcTime]["close"]= $row->close;
            $histo[$ohlcTime]["value"]= $row->close;
            $histo[$ohlcTime]["volumefrom"]+=$row->volumefrom;
            $histo[$ohlcTime]["volumeto"]+=$row->volumeto;
            $histo[$ohlcTime]["volume"]=$histo[$ohlcTime]["volumeto"]-$histo[$ohlcTime]["volumefrom"];
        }
        return response()->json(array_values($histo),200,['Content-Type' => 'application/json; charset=utf-8']);
    }
    public function histoOld(Request $rq,$type="histominute",$agre=1){
        $res =[];
        $arge = ($agre=='NaN')?5:intval($agre);
        $prec = 60;
        $table = 'histo';
        $objectType = 'minute';
        switch($type){
            case "histohour":{
                $prec *=60;
                $table = 'histo_hour';
                $objectType = 'hour';
                break;
            }
            case "histoday":{
                $prec *=60*24;
                $table = 'histo_day';
                $objectType = 'day';
                break;
            }
        }
        $dateFrom = $rq->input("date_from",false);
        $dateTo = $rq->input("date_to",false);
        $instid = $rq->input("instrument_id",1);
        $pair = Instrument::find($instid);
        $limit = intval($rq->input("limit","144"));
        $user = ($rq->input("user_id",false)!==false)?User::find($rq->input("user_id")):$rq->user();
        // $follower = $user->meta()->where('meta_name','can_follow')->first();
        // if(!is_null($follower)){
        //     $cf = json_decode($follower->meta_value);
        //     if($cf->can)$user = User::find($cf->partner);
        // }
        // $histo = DB::connection('trade_center')->select("select
        $histo = DB::select("select
                    date,
                    time,
                    min(low) as low,
                    max(high) as high,
                    SUBSTRING_INDEX(GROUP_CONCAT(open order by time),',',1) as open,
                    SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as close,
                    SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as value,
                    sum(volumefrom) as volumefrom,
                    sum(volumeto) as volumeto,
                    sum(volumeto)-sum(volumefrom) as volume
                from (select
                    from_unixtime(((time-mod(time,{$prec}*{$agre})))) as date,
                    ((time-mod(time,{$prec}*{$agre}))) as time,
                    min(low) as low,
                    max(high) as high,
                    SUBSTRING_INDEX(GROUP_CONCAT(open order by time),',',1) as open,
                    SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as close,
                    SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as value,
                    sum(volumefrom) as volumefrom,
                    sum(volumeto) as volumeto,
                    sum(volumeto)-sum(volumefrom) as volume
                from (select
                    {$table}.time-10800 as time,
                    ifnull(user_tune_histo.low,{$table}.low) as low,
                    ifnull(user_tune_histo.high,{$table}.high) as high,
                    ifnull(user_tune_histo.open,{$table}.open) as open,
                    ifnull(user_tune_histo.close,{$table}.close) as close,
                    ifnull(user_tune_histo.close,{$table}.close) as value,
                    {$table}.volumefrom as volumefrom,
                    {$table}.volumeto as volumeto
                    from {$table}
                        left outer join user_tune_histo on {$table}.time = user_tune_histo.time and user_tune_histo.user_id={$user->id} and user_tune_histo.instrument_id = {$table}.instrument_id
                    where {$table}.instrument_id = {$instid} and {$table}.source_id = {$pair->source_id}
                ) agre_histo
                group by time,date
            ) s
            group by time,date
            order by time desc
            limit {$limit}
        ");
        return response()->json($histo,200,['Content-Type' => 'application/json; charset=utf-8']);

    }
    protected $previouse=null;

    protected function makeFrameArray($agre,$limit){
        $ret = [];
        $i = $limit;
        $date = time();
        $date = $date - $date%($agre);
        $date = $date - $agre;
        $frame = $agre;
        while($i>0){
            $ret[] = $date - $frame*$i;
            // $ret[] = date('Y-m-d H:i:s',$date - $frame*$i);
            --$i;
        }
        return $ret;
    }
    protected function getDataInFrame($raw,$frame){
        $this->previouse = is_null($this->previouse)?$raw[0]:$this->previouse;
        foreach($raw as $data){
            if($data->time == $frame ){
                return json_decode(json_encode($data));
            }
        }
        $ret = $this->previouse;
        $ret = [
            "date"=>date('Y-m-d H:i:s',$frame),
            "time"=>$frame,

            "low"=>$this->previouse->low,
            "high"=>$this->previouse->high,
            "open"=>$this->previouse->open,
            "close"=>$this->previouse->close,
            "volumefrom"=>$this->previouse->volumefrom,
            "volumeto"=>$this->previouse->volumeto,
            "volume"=>$this->previouse->volume
        ];
        return $ret;
    }

    protected function getDataInFrame_bak($raw,$frame,$agre){
        $ret = is_null($this->previouse)?[
            "time"=>$frame,
            "date"=>date('Y-m-d H:i:s',$frame),
            "low"=>null,
            "high"=>0,
            "open"=>null,
            "close"=>0,
            "volumefrom"=>0,
            "volumeto"=>0,
            "volume"=>0
        ]:$this->previouse;
        $ret["time"] = $frame;
        $ret["date"] = date('Y-m-d H:i:s',$frame);
        foreach($raw as $data){
            if($data->time >=$frame && $data->time<=($frame+$agre)){
                $ret["low"] = ($ret["low"] > $data->low || is_null($ret['low']))?$data->low:$ret["low"];;
                $ret["high"] =  ($ret["high"] < $data->high )?$data->high:$ret["high"];
                $ret["open"] =is_null($ret["open"])? $data->open :$ret["open"];
                $ret["close"] = $data->close;
                $ret["volumefrom"] += $data->volumefrom;
                $ret["volumeto"] += $data->volumeto;
                $ret["volume"] += $data->volume;
                break;
            }

        }
        $this->previouse = $ret;
        return json_decode(json_encode($ret));
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $rq,$type="histoday"){
        $tq=[
            "fsym" => $rq->input("fsym","BTC"),
            "tsym" => $rq->input("tsym","BCH"),
            "limit" => $rq->input("limit","1440"),
        ];
        $dateFrom = $rq->input("date_from",false);
        $dateTo = $rq->input("date_to",false);
        $instid = $rq->input("instrument_id",1);
        $instrument = Instrument::find($instid);
        $res = [];
        $histo = Histo::where('instrument_id',$instid);
        if($dateFrom!==false)$histo=$histo->where("time",">=",intval($dateFrom/1000));
        if($dateTo!==false)$histo=$histo->where("time","<=",intval($dateTo/1000));
        // Log::debug($histo->toSql());
        $histo = $histo->limit($tq["limit"])->orderBy('id','desc')->get();

        $coef = 1;
        if($rq->input("user_id",false)!==false){
            $user = User::find($rq->input("user_id"));
            $coef = DataTune::fork2($user,$instrument);
        }
        $coef = $coef*floatval($instrument->multiplex);
        foreach ($histo as $row) {
            $tores = [
                "date" => gmdate("Y-m-d H:i:s",$row->time),
                "open"=>floatval($row->open)*$coef,
                "low"=>floatval($row->low)*$coef,
                "high"=>floatval($row->high)*$coef,
                "close"=>floatval($row->close)*$coef,
                "value"=>floatval($row->close)*$coef,
                "volumefrom"=> floatval($row->volumefrom),
                "volumeto"=> floatval($row->volumeto),
                "volume"=> floatval($row->volumeto)-floatval($row->volumefrom)
            ];
            $res[]=$tores;
        }
        // $res = $histo;
        // $type="histominute";
        // $url ="https://min-api.cryptocompare.com/data/".$type."?fsym=".$tq["fsym"]."&tsym=".$tq['tsym']."&limit=".$tq['limit']."&aggregate=1&e=CCCAGG";
        // $res = $this->_fetchJSON($url);
        // $res = $this->_amchartFormat($res);
        // return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_PRESERVE_ZERO_FRACTION)->header('Access-Control-Allow-Origin', '*')
        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'])->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Histo  $histo
     * @return \Illuminate\Http\Response
     */
    public function show(Histo $histo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Histo  $histo
     * @return \Illuminate\Http\Response
     */
    public function edit(Histo $histo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Histo  $histo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Histo $histo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Histo  $histo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Histo $histo)
    {
        //
    }

    public function price(Request $rq,$format="json",$inst){
        $price = Price::where('instrument_id','=',$inst)->orderBy('id','desc')->first();
        $utp = UserTunePrice::where('price_id',$price->id)->first();
        $price = is_null($utp)?$price:$utp;
        $price = $price->toArray();
        $price["date"] = gmdate("Y-m-d H:i:s",$price["time"]);
        return response()->json($price,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }
    public function prices(Request $rq,$format="json",$id="1"){
        $default = true;
        $res = [];
        $instrument = Instrument::find($id);
        $user = UserController::getUser($rq);
        if($rq->input("user_id",false)!==false){
            $cu = User::find($rq->input("user_id"));
            if(!is_null($cu))$user=$cu;
        }
        $res = DB::connection('trade_center')->table('prices')
                ->leftJoin('user_tune_price',function($q)use($user){
                    $q->on('user_tune_price.price_id','prices.id')
                        ->whereRaw('user_tune_price.user_id = '.$user->id);
                })
                ->select(DB::connection('trade_center')->raw("
                        ifnull(user_tune_price.price,prices.price) as price,
                        prices.time-10800 as time,
                        ifnull(CONCAT('t',cast(user_tune_price.id as char(10))),prices.id) as id,
                        from_unixtime(prices.time-10800) as date,
                        prices.created_at,
                        prices.instrument_id,
                        prices.volation
                    "))
                ->whereRaw('prices.instrument_id = '.$id)
                ->whereRaw('prices.source_id = '.$instrument->source_id)
                ->orderBy('prices.time','desc');
        if( $rq->input("date_from","false")!="false" || $rq->input("date_to","false")!="false" ) {
            if( $rq->input("date_from","false")!="false") {$default=false;$res=$res->where("prices.time",">=",intval($rq->input("date_from"))/1000);}
            if($rq->input("date_to","false")!="false") {$default=false;$res=$res->where("prices.time","<=",intval($rq->input("date_to"))/1000);}
        }
        else {
            $histo = Histo::where('instrument_id',$instrument->id)->where('source_id',$instrument->source_id)->orderBy('time','desc')->first();
            $time = (!is_null($histo))
                ?$histo->time
                :time();
            $time = $time - $time%60;
            $res=$res->whereRaw("prices.time>={$time}");
            // Log::debug("HistoController::prices at {$time}: ".date('Y-m-d H:i:s',$time) );
        }
        $res = $res->get();
        if( false && !count($res->toArray())){ //need some random
            $histo = Histo::where('instrument_id','=',$id)->orderBy('id','desc')->first();
            if(!is_null($histo)){
                $uth = UserTuneHisto::where('object_id',$histo->id)->where('object_type','minute')->first();
                $histo = is_null($uth)?$histo:$uth;
                if($default) {
                    $currMinute = ceil($histo->time/60)*60+60;
                    $res=$res->whereRaw("ceil(prices.time/60)*60 = ".$currMinute);
                }
            }
            if(!is_null($histo))
            $time = ceil(time()/60)*60 ;
            $res=[
                [
                    'price'=>$histo->close,
                    'volation' =>$histo->volation,
                    'date'=>gmdate("Y-m-d H:i:s",$time+45),
                    'time'=>$time+rand(40,59),
                    'created_at'=>$time+rand(40,59),
                    'updated_at'=>$time+rand(40,59),
                    'instrument_id'=>$id
                ],
                [
                    'price'=>$histo->high,
                    'volation' =>$histo->volation,
                    'date'=>gmdate("Y-m-d H:i:s",$time+30),
                    'time'=>$time+rand(20,39),
                    'created_at'=>$time+rand(20,39),
                    'updated_at'=>$time+rand(20,39),
                    'instrument_id'=>$id
                ],

                [
                    'price'=>$histo->low,
                    'volation' =>$histo->volation,
                    'date'=>gmdate("Y-m-d H:i:s",$time+15),
                    'time'=>$time+rand(1,19),
                    'created_at'=>$time+rand(1,19),
                    'updated_at'=>$time+rand(1,19),
                    'instrument_id'=>$id
                ],
                [
                    'price'=>$histo->open,
                    'volation' =>$histo->volation,
                    'date'=>gmdate("Y-m-d H:i:s",$time),
                    'time'=>$time,
                    'created_at'=>$time,
                    'updated_at'=>$time,
                    'instrument_id'=>$id
                ]
            ];
        }
        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }
}
/*
SELECT from_unixtime(min(time)),min(time),min(low),max(high),
	SUBSTRING_INDEX(GROUP_CONCAT(open order by time),',',1) as open,
    SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as close
   FROM  (
    select
        concat(year(from_unixtime(time)),'-',month(from_unixtime(time)),'-',day(from_unixtime(time)),' ',hour(from_unixtime(time)),' ',hour(from_unixtime(time))) as trunc_date,
        time,low,high,open,close from histo where instrument_id = 1
) qt
GROUP by trunc_date
order by min(time) desc;


SELECT from_unixtime(min(time)),min(time),min(low),max(high),
	SUBSTRING_INDEX(GROUP_CONCAT(open order by time),',',1) as open,
    SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as close
   FROM  (
    select
        (time-mod(time,60*15))/(60*15) as trunc_date,
        min(time),
        min(low),
        max(high),
        SUBSTRING_INDEX(GROUP_CONCAT(open order by time),',',1) as open,
        SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as close
        from histo
        where instrument_id = 1
        GROUP by (time-mod(time,60*15))/(60*15)
        order by min(time) desc
) qt
GROUP by trunc_date
order by min(time) desc




SELECT min(from_unixtime(time)),max(from_unixtime(time)),source_id,count(*)
FROM `prices`
where instrument_id = 2
group by source_id
ORDER by source_id

CHECK cnadles

SELECT
	from_unixtime(p.time-mod(p.time,60)),
	SUBSTRING_INDEX(GROUP_CONCAT(p.price order by p.time),',',1) as raw_open,h.open,
    case when 	SUBSTRING_INDEX(GROUP_CONCAT(p.price order by p.time),',',1) != h.open then 'FAIL' else 'MATCH' end as OPENED,
    SUBSTRING_INDEX(GROUP_CONCAT(p.price order by p.time desc),',',1) as raw_close,h.close,
    case when 	SUBSTRING_INDEX(GROUP_CONCAT(p.price order by p.time desc),',',1) != h.close then 'FAIL' else 'MATCH' end as CLOSED,
    min(p.price) as raw_min,h.low,
    case when 	min(p.price) != h.low then 'FAIL' else 'MATCH' end as LOWED,
    max(p.price) as row_max,h.high,
    case when 	max(p.price) != h.high then 'FAIL' else 'MATCH' end as HIGHED
FROM prices p
	left outer join histo h on h.time = p.time-mod(p.time,60) and p.instrument_id = h.instrument_id
where p.instrument_id = 2 and p.source_id=2
group by p.source_id,    h.open,h.close,h.low,h.high
order by h.time desc

*/
