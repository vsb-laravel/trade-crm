<?php

namespace Vsb\Crm\Http\Controllers;

use Log;
use Illuminate\Http\Request;
use Vsb\Model\Instrument;
use Vsb\Model\Currency;
use Vsb\Model\Histo;

class DataController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function test(Request $rq,$type="histominute"){
        $tqx = $rq->input("tqx","reqId:0");
        $zx = $rq->input("zx","");
        // $type="histominute";
        $tq = $this->_googleQuery($rq->input("tq",""));
        $url ="https://min-api.cryptocompare.com/data/histominute?fsym=".$tq["fsym"]."&tsym=".$tq['tsym']."&limit=".$tq['limit']."&aggregate=1&e=CCCAGG";
        $res = $this->_fetchJSON($url);
        $res = $this->_googleFormat($res,$tq,$tqx);
        return response()->json($res);
    }
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function amcharts(Request $rq,$type="histoday"){
        $tq=[
            "fsym" => $rq->input("fsym","BTC"),
            "tsym" => $rq->input("tsym","BCH"),
            "limit" => $rq->input("limit","100"),
        ];
        $instid = $rq->input("instrument_id",1);
        $res = [];
        $histo = Histo::where('instrument_id',$instid)->limit($tq["limit"])->orderBy('id','desc')->get();
        foreach ($histo as $row) {
            $tores = [
                "date" => date("Y-m-d H:i:s",$row->time),
                "open"=>floatval($row->open),
                "low"=>floatval($row->low),
                "high"=>floatval($row->high),
                "close"=>floatval($row->close),
                "value"=>floatval($row->close),
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
        return response()->json($res);
    }
    protected function _amchartFormat($data){
        $res = [];
        foreach ($data->Data as $row) {
            // print_r($row->volumefrom);exit;
            $volume = floatval($row->volumeto)-floatval($row->volumefrom);
            $res[]=[
              "date"=>date("Y-m-d H:i:s",$row->time),
              "open"=>$row->open,
              "low"=>$row->low,
              "high"=>$row->high,
              "close"=>$row->close,
              "value"=>$row->close,
              "volumefrom"=> $row->volumefrom,
              "volumeto"=> $row->volumeto,
              "volume"=> $volume
          ];
        }
        return $res;
    }
    protected $_defaultColumns = [
        ["id"=>'A', "label"=> 'time', "type"=> 'datetime'],
        ["id"=>'B', "label"=> 'open', "type"=> 'number'],
        ["id"=>'C', "label"=> 'low', "type"=> 'number'],
        ["id"=>'D', "label"=> 'high', "type"=> 'number'],
        ["id"=>'E', "label"=> 'close', "type"=> 'number']
    ];
    protected function _googleQuery($tq){
        $res = [
            "fsym"=>"BTC",
            "tsym"=>"BCH",
            "limit"=>20,
            "cols"=>$this->_defaultColumns
        ];
        if(preg_match('/limit\s+(\d+)/i',$tq,$m)){
            $res["limit"]=intval($m[1]);
        }
        if(preg_match('/select\s(.+?)(?=limit)/i',$tq,$m)){
            if(!preg_match('/\s*\*\s*/i',$m[1])){
                $cols = preg_split('/\s*,\s*/',trim($m[1]));
                foreach ($res["cols"] as $i=>$column) {
                    // Log::debug($i." => ".$column['label']." quered: ".json_encode($cols));
                    // if(!in_array($column["label"],$cols)) array_splice($res['cols'],$i,1);
                    if(!in_array($column["label"],$cols)) unset($res['cols'][$i]);
                }
                $res['cols'] = array_values($res['cols']);
                // Log::debug("Query Columns: ".json_encode($res['cols']));
            }
        }
        return $res;
    }
    protected function _googleFormat($data,$tq,$tqx){
        $reqId = "0";
        if(preg_match('/reqId:(\S+)/',$tqx,$mri))$reqId=$mri[1];
        $res = [
            "version"=>"0.6",
            "reqId"=>$reqId,
            "status"=>"ok",
            "sig"=>"12125123524534634",
            "table"=>[
                "cols"=>$tq['cols'],
                // "cols"=>[
                //     ["id"=>'A', "label"=> 'time', "type"=> 'datetime'],
                //     ["id"=>'B', "label"=> 'open', "type"=> 'number'],
                //     ["id"=>'C', "label"=> 'low', "type"=> 'number'],
                //     ["id"=>'D', "label"=> 'high', "type"=> 'number'],
                //     ["id"=>'E', "label"=> 'close', "type"=> 'number'],
                // ],
                "rows"=>[]
            ]
        ];
        foreach ($data->Data as $row) {
            $otrow = ["c"=>[]];
            foreach ($tq['cols'] as $col) {
                $key = $col['label'];
                $value = $row->$key;
                if($key=='time'){
                    $value = "Date(".date("Y",$row->time).","
                                    .intval(date("m",$row->time)).","
                                    .intval(date("d",$row->time)).","
                                    .intval(date("H",$row->time)).","
                                    .intval(date("i",$row->time)).","
                                    .intval(date("s",$row->time)).")";
                }
                $otrow["c"][]=["v"=>$value];
            }
            $res["table"]["rows"][]=$otrow;
            // $datetimeStr = "Date("  .date("Y",$row->time).","
            //                             .intval(date("m",$row->time)).","
            //                             .intval(date("d",$row->time)).","
            //                             .intval(date("H",$row->time)).","
            //                             .intval(date("i",$row->time)).","
            //                             .intval(date("s",$row->time)).")";
            // $res["table"]["rows"][] = [ "c"=>[
            //     // ["v"=>date('Y-m-d H:i',$row->time)],
            //     // ["v"=>date('Y-m-d\TG:i:s.000+0000',$row->time)],
            //     ["v"=>$datetimeStr],
            //     ["v"=>$row->low],
            //     ["v"=>$row->open],
            //     ["v"=>$row->close],
            //     ["v"=>$row->high]
            // ]];
        }
        $res["sig"]=md5(json_encode($res["table"]));
        return $res;
    }
    protected function _fetchJSON($url,$array=false) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_REFERER, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        $result = curl_exec($ch);
        curl_close($ch);
        $result = json_decode($result,$array);
        return $result;
    }
}
