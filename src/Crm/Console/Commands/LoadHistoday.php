<?php

namespace Vsb\Crm\Console\Commands;

use DB;
use Log;
use Illuminate\Console\Command;
//local classes
use Vsb\Model\HistoDay;
use Vsb\Model\Instrument;
use Vsb\Model\Currency;
use Vsb\Model\Source;
use cryptofx\CryptoCompareApi;

class LoadHistoday extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:histo_days';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Histrical data by days loading';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }
    public function handle(){
        $instruments = Instrument::with(['from','to'])->where('enabled',1)->orderBy('source_id','desc')->get();
        foreach($instruments as $pair){
            $source = Source::find($pair->source_id);
            $res = DB::table('histo_hour')
                ->where('instrument_id',$pair->id)
                ->where('source_id',$source->id)
                ->whereRaw("not exists  (select id from histo_day where histo_day.instrument_id = histo_hour.instrument_id and histo_day.time = (histo_hour.time  - mod(histo_hour.time,60*60*24)))")
                ->select(DB::raw("
                    time - mod(time,60*60*24) as time,
                    from_unixtime(time - mod(time,60*60*24)) as date,
                    min(low) as low,
                    max(high) as high,
                    SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as close,
                    SUBSTRING_INDEX(GROUP_CONCAT(open order by time),',',1) as open,
                    sum(volumefrom) as volumefrom,
                    sum(volumeto) as volumeto
                "))
                ->groupBy('time')
                ->get();
            $last = count($res);
            $i = 0;
            foreach ($res as $row) {
                if($i++ >= $last)break;
                try{

                    echo "New candle: ".json_encode($row)."\n";
                    $histo = HistoDay::create([
                        'instrument_id'=>$pair->id,
                        'source_id'=>$source->id,
                        'open'=>floatval($row->open)*floatval($pair->multiplex),
                        'close'=>floatval($row->close)*floatval($pair->multiplex),
                        'low'=>floatval($row->low)*floatval($pair->multiplex),
                        'high'=>floatval($row->high)*floatval($pair->multiplex),
                        'volumefrom'=>$row->volumefrom,
                        'volumeto'=>$row->volumeto,
                        'time'=>$row->time,
                        'volation'=>($row->open<$row->close)?1:-1,
                        'exchange' => $source->name
                    ]);
                }
                catch(\Exception $e){
                    Log::debug($e);
                }
            }
        }
    }
    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle2(){
        $crapi = new CryptoCompareApi;
        $source = Source::where('name','CryptoCompare')->first();
        $ins = Instrument::where('enabled',1)->get();
        // echo $this->signature." loaded as ".date("Y-m-d H:i:s")."\n";
        foreach ($ins as $i=>$instrument) {
            $fsym = Currency::find($instrument->from_currency_id);
            $tsym = Currency::find($instrument->to_currency_id);
            $rq= [
                "fsym"=>$fsym->code,
                "tsym"=>$tsym->code,
                "limit"=>10
            ];
            $hists = $crapi->histoday($rq);
            echo "Instrument:".$instrument->id." multiplex:".$instrument->multiplex."\n";
            foreach ($hists->Data as $i => $hist) {
                $repeat = HistoDay::where("time",$hist->time)->where('instrument_id',$instrument->id)->first();
                $udata = [
                    'instrument_id'=>$instrument->id,
                    'source_id'=>$source->id,
                    'open'=>floatval($hist->open)*floatval($instrument->multiplex),
                    'close'=>floatval($hist->close)*floatval($instrument->multiplex),
                    'low'=>floatval($hist->low)*floatval($instrument->multiplex),
                    'high'=>floatval($hist->high)*floatval($instrument->multiplex),
                    'volumefrom'=>$hist->volumefrom,
                    'volumeto'=>$hist->volumeto,
                    'time'=>$hist->time
                ];
                if(is_null($repeat))HistoDay::create($udata);
                // else $repeat->update($udata);
            }
        }
    }
}
