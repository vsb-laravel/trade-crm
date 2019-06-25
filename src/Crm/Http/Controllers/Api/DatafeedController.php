<?php

namespace App\Http\Controllers\Api;

use DB;
use Log;
use App\User;
use App\Source;
use App\Currency;
use App\Instrument;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DatafeedController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request,$method){
        return $this->$method($request);
    }
    public function time(Request $request){
        return time();
    }
    public function search(Request $request){
        $pairs = Instrument::with(['from','to','source'])
            // ->where('enabled',1)
            ->limit($request->input('limit',256))
            ->get();
        $pairs = $pairs->filter(function($value,$key)use($request){
            return preg_match('/.*'.preg_quote($request->input('query',''),'/').'.*/i',$value->title);
        });
        $pairs = $pairs->filter(function($value,$key)use($request){
            return preg_match('/.*'.preg_quote($request->input('exchange','')).'.*/i',$value->source);
        });
        $pp = [];
        foreach ($pairs as $key=>$item) {
            $pp[] =[
                    'symbol'=>$item->title,
                    'description'=>$item->from->name.' and '.$item->to->name.' pair. '.$item->source->name,
                    'exchange'=>$item->title,
                    'full_name'=>$item->title,
                    'type'=>'stock'
                ];
        }
        return response()->json($pp);
    }
    public function marks(Request $request){
        return response()->json([]);
    }
    public function timescale_marks(Request $request){
        // /timescale_marks?symbol=<ticker_name>&from=<unix_timestamp>&to=<unix_timestamp>&resolution=<resolution>
        return response()->json([]);
    }
    public function symbols(Request $request){
        $response = [];
        $symbol = $request->input("symbol","5");
        $ss = preg_split('/\//',$symbol);
        $scale = 1;
        $pointvalue=0;
        $pricescale = 1;
        if(count($ss)>1){
            $pair = Instrument::with(['from','to','source'])->whereIn('from_currency_id',Currency::where('code',$ss[0])->pluck('id'))
                ->whereIn('to_currency_id',Currency::where('code',preg_replace('/usdt/i','usd',$ss[1]))->pluck('id'))
                ->orderBy('id','desc')
                ->first();
            if(!is_null($pair)){
                $pp = floatval($pair->pips ?? 1);
                while($pp != intval($pp) && $pointvalue<6){
                    $pp=$pp*10;
                    $scale=$scale/10;
                    $pointvalue++;
                    $pricescale*=10;
                }
                $response = [
                    "name" => $pair->title,
                    "exchange-traded" => $pair->source->name,
                    "exchange-listed" => $pair->from->name.' to '.$pair->to->name,
                    "timezone" => "Europe/London",
                    "minmov" => 1,
                    "minmov2" => 1,
                    "pointvalue" => $pointvalue,
                    "session" => "0930-1630",
                    "has_intraday" => true,
                    "has_no_volume" => true,
                    "description" =>  $pair->title,
                    "type" => "stock",
                    "supported_resolutions" => [
                        "5",
                        "15",
                        "30",
                        "60",
                        "D",
                        "M"
                    ],
                    "pricescale" => $pricescale,
                    "ticker" => $pair->id
                ];
            }

        }
        else {
            $pair = Source::where('name','like','%'.$symbol.'%')
                ->orderBy('id','desc')
                ->first();
            if(!is_null($pair)){
                $response = [
                    "name" => $pair->name,
                    "exchange-traded" => $pair->name,
                    "exchange-listed" => $pair->name,
                    "timezone" => "Europe/London",
                    "minmov" => $scale,
                    "minmov2" => 0,
                    "pointvalue" => $scale,
                    "session" => "0930-1630",
                    "has_intraday" => true,
                    "has_no_volume" => false,
                    "description" =>  $pair->name,
                    "type" => "stock",
                    "supported_resolutions" => [
                        "5",
                        "15",
                        "30",
                        "60",
                        "D",
                        "M"
                    ],
                    "pricescale" => 1,
                    "ticker" => $pair->name
                ];
            }
        }
        return response()->json($response);
    }
    public function history(Request $request){
        $user = $request->user();
        $user_id = is_null($user)?'0':$user->id;
        $response = [
            "t"=>[],
            "o"=>[],
            "c"=>[],
            "h"=>[],
            "l"=>[],
            "v"=>[],
            "s"=>"ok"
        ];
        $agre = 5;
        $prec = 60;
        $table="histo";
        $objectType = 'minute';
        $resolution = $request->input("resolution","5");
        switch($resolution){
            case "1":
                $table = 'histo';
                $agre = 1;
                break;
            case "5":
                $table = 'histo';
                $agre = 5;
                break;
            case "10":
                $table = 'histo';
                $agre = 10;
                break;
            case "15":
                $table = 'histo';
                $agre = 15;
                break;
            case "30":
                $table = 'histo';
                $agre = 30;
                break;
            case "60":
                $prec *=60;
                $table = 'histo_hour';
                $objectType = 'hour';
                $agre = 1;
                break;
            case "H":
                $prec *=60;
                $table = 'histo_hour';
                $objectType = 'hour';
                $agre = 1;
                break;
            case "1H":
                $prec *=60;
                $table = 'histo_hour';
                $objectType = 'hour';
                $agre = 1;
                break;
            case "D":
                $table = 'histo_days';
                $prec *=60*24;
                $table = 'histo_day';
                $agre = 1;
                break;
            case "1D":
                $table = 'histo_days';
                $prec *=60*24;
                $table = 'histo_day';
                $agre = 1;
                break;
            case "2D":
                $table = 'histo_days';
                $prec *=60*24;
                $table = 'histo_day';
                $agre = 2;
                break;
            case "3D":
                $table = 'histo_days';
                $prec *=60*24;
                $table = 'histo_day';
                $agre = 3;
                break;
            case "W":
                $table = 'histo_days';
                $prec *=60*24;
                $table = 'histo_day';
                $agre = 7;
                break;
            case "3W":
                $table = 'histo_days';
                $prec *=60*24;
                $table = 'histo_day';
                $agre = 21;
                break;
            case "M":
                $table = 'histo_days';
                $prec *=60*24;
                $table = 'histo_day';
                $agre = 30;
                break;
            case "6M":
                $table = 'histo_days';
                $prec *=60*24;
                $table = 'histo_day';
                $agre = 30*6;
                break;

        }
        $symbol = $request->input("symbol","2");
        $from = $request->input("from",time()-10800);
        $to = $request->input("to",time());
        $pair = Instrument::find($symbol);
        if(!is_null($pair)){
            $instid = $pair->id;
            $histo = DB::connection('trade_center')->table(DB::connection('trade_center')->raw("(select
                {$table}.time-10800 as time,
                ifnull(user_tune_histo.low,{$table}.low) as low,
                ifnull(user_tune_histo.high,{$table}.high) as high,
                ifnull(user_tune_histo.open,{$table}.open) as open,
                ifnull(user_tune_histo.close,{$table}.close) as close,
                ifnull(user_tune_histo.close,{$table}.close) as value,
                {$table}.volumefrom as volumefrom,
                {$table}.volumeto as volumeto
                from {$table}
                    left outer join user_tune_histo on {$table}.time = user_tune_histo.time and user_tune_histo.user_id={$user_id} and user_tune_histo.instrument_id = {$table}.instrument_id
                where {$table}.instrument_id = {$instid}
            ) agre_histo"))
                ->select(DB::connection('trade_center')->raw("from_unixtime(((time-mod(time,".$prec."*".$agre.")))) as date,
                    min((time-mod(time,".$prec."*".$agre."))) as time,
                    min(low) as low,
                    max(high) as high,
                    SUBSTRING_INDEX(GROUP_CONCAT(open order by time),',',1) as open,
                    SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as close,
                    SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as value,
                    sum(volumefrom) as volumefrom,
                    sum(volumeto) as volumeto,
                    sum(volumeto)-sum(volumefrom) as volume"))
                // ->groupBy(['((time-mod(time,60*5)))'])
                // ->where("time",">=",intval($from))
                // ->where("time","<=",intval($to))
                ->groupBy(['date'])
                ->orderBy('date');

            // Log::debug('Datefeed sql: '.$histo->toSql());
            $res = $histo->get();
            foreach ($res as $row) {
                $response["t"][] = floatval($row->time);
                $response["o"][] = floatval($row->open);
                $response["c"][] = floatval($row->close);
                $response["h"][] = floatval($row->high);
                $response["l"][] = floatval($row->low);
                $response["v"][] = floatval($row->volume);
            }
        }

        return response()->json($response);
    }
    public function config(Request $request){
        return response()->json([
                "supports_search" => true,
                "supports_group_request" => false,
                "supports_marks" => false,
                "supports_timescale_marks" => false,
                "supports_time" => true,
                "exchanges" => Source::select(DB::raw('name as value,name,name as `desc`'))->orderBy("id")->get(),
                "symbols_types" => [
                    [
                        "name" => "All types",
                        "value" => ""
                    ],
                    [
                        "name" => "Stock",
                        "value" => "stock"
                    ],
                    [
                        "name" => "Index",
                        "value" => "index"
                    ]
                ],
                "supported_resolutions" => [
                    "5",
                    "15",
                    "30",
                    "60",
                    "D",
                    "2D",
                    "3D",
                    "W",
                    "3W",
                    "M",
                    "6M"
                ]
        ]);
    }

}
