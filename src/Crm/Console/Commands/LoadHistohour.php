<?php

namespace Vsb\Crm\Console\Commands;

use DB;

use Illuminate\Console\Command;
//local classes
use Vsb\Model\HistoHour;
use Vsb\Model\Instrument;
use Vsb\Model\Currency;
use Vsb\Model\Source;
use cryptofx\CryptoCompareApi;

class LoadHistohour extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:histo_hours';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Histrical data by hours loading';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(){
        $instruments = Instrument::with(['from','to'])->where('enabled',1)->orderBy('source_id','desc')->get();
        foreach($instruments as $pair){
            $source = Source::find($pair->source_id);
            $res = DB::table(DB::raw("(select
                        time - mod(time,60*60) as time,
                        from_unixtime(time - mod(time,60*60)) as date,
                        low,
                        high,
                        close,
                        open,
                        volumefrom,
                        volumeto
                    from histo
                    where instrument_id = {$pair->id}
                        #and source_id = {$source->id}
                        and not exists  (select id from histo_hour where histo.instrument_id = histo_hour.instrument_id and histo_hour.time = (histo.time  - mod(histo.time,60*60)))

                ) as agre"))
                ->select(DB::raw("
                    time,date,
                    min(low) as low,
                    max(high) as high,
                    SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as close,
                    SUBSTRING_INDEX(GROUP_CONCAT(open order by time),',',1) as open,
                    sum(volumefrom) as volumefrom,
                    sum(volumeto) as volumeto
                "))
                ->groupBy(['time','date']);
            $res = $res->get();
            echo $pair->title." - ". count($res)."\n";
            $last = count($res);
            $i = 0;

            foreach ($res as $row) {
                if($i++ >= $last)break;
                print_r($row);
                $repeat = HistoHour::where("time",$row->time)->where('instrument_id',$pair->id)->first();
                try{
                    echo "New candle: ".json_encode($row)."\n";
                    $histo = HistoHour::create([
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
    public function handle2(){
        $this->fromMinutes();return;
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
            $hists = $crapi->histohour($rq);
            echo "Instrument:".$instrument->id." multiplex:".$instrument->multiplex."\n";
            foreach ($hists->Data as $i => $hist) {
                $repeat = HistoHour::where("time",$hist->time)->where('instrument_id',$instrument->id)->first();
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
                if(is_null($repeat))HistoHour::create($udata);
                // else $repeat->update($udata);
            }
        }
    }
    protected function fromMinutes(){
        $prec = 60;
        $arge = 60;
        $histo = DB::table(DB::raw("(
            select
            ((histo.time-mod(histo.time,".$prec."*".$arge."))/(".$prec."*".$arge.")) as trunc_date,
            from_unixtime(histo.time) as date,
            histo.time as time,
            histo.low as low,
            histo.high as high,
            histo.open as open,
            histo.close as close,
            histo.close as value,
            histo.volumefrom as volumefrom,
            histo.volumeto as volumeto,
            histo.instrument_id
            from histo
            #where unix_timestamp(now())-histo.time > 3888000
        ) agre_histo"))
            ->select(DB::raw("min(date) as date,
                min(time) as time,
                min(low) as low,
                max(high) as high,
                SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as value,
                SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as close,
                SUBSTRING_INDEX(GROUP_CONCAT(open order by time),',',1) as open,
                sum(volumefrom) as volumefrom,
                sum(volumeto) as volumeto,
                sum(volumeto)-sum(volumefrom) as volume,
                instrument_id"))
            ->whereRaw("mod(time,".($prec*$arge).") = 0")
            ->whereRaw("not exists(select 1 from histo_hour where histo_hour.instrument_id =agre_histo.instrument_id and histo_hour.time=agre_histo.time)")
            ->groupBy('trunc_date','instrument_id')->orderBy('date','desc');
        foreach ($histo->get() as $row) {
            echo json_encode($row)."\n";
            HistoHour::create([
                'instrument_id'=>$row->instrument_id,
                'source_id'=>'1',
                'open'=>$row->open,
                'close'=>$row->close,
                'low'=>$row->low,
                'high'=>$row->high,
                'volumefrom'=>$row->volumefrom,
                'volumeto'=>$row->volumeto,
                'time'=>$row->time
            ]);
        }

        // $histoTune = DB::table(DB::raw("(
        //         select
        //         ((user_tune_histo.time-mod(user_tune_histo.time,".$prec."*".$arge."))/(".$prec."*".$arge.")) as trunc_date,
        //         from_unixtime(user_tune_histo.time-10800) as time,
        //         user_tune_histo.low as low,
        //         user_tune_histo.high as high,
        //         user_tune_histo.open as open,
        //         user_tune_histo.close as close,
        //         user_tune_histo.close as value,
        //         from user_tune_histo on histo.id = user_tune_histo.object_id and user_tune_histo.object_type='minute'
        //         where
        //             histo.instrument_id = {$instid}
        //     ) agre_histo"))
        //         ->select(DB::raw("min(time) as date,
        //             min(low) as low,
        //             max(high) as high,
        //             SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as value,
        //             SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as close,
        //             SUBSTRING_INDEX(GROUP_CONCAT(open order by time),',',1) as open,
        //             sum(volumefrom) as volumefrom,
        //             sum(volumeto) as volumeto,
        //             sum(volumeto)-sum(volumefrom) as volume"))
        //         ->groupBy('trunc_date')->orderBy('date','desc')->limit($rq->input("limit","144"));
    }
}


//
// select
//                     time,date,
//                     min(low) as low,
//                     max(high) as high,
//                     SUBSTRING_INDEX(GROUP_CONCAT(close order by time desc),',',1) as close,
//                     SUBSTRING_INDEX(GROUP_CONCAT(open order by time),',',1) as open,
//                     sum(volumefrom) as volumefrom,
//                     sum(volumeto) as volumeto
//                  from (select
//                         time - mod(time,60*60) as time,
//                         from_unixtime(time - mod(time,60*60)) as date,
//                         low,
//                         high,
//                         close,
//                         open,
//                         volumefrom,
//                         volumeto
//                     from histo
//                     where instrument_id = 2
//                         #and source_id = 5
//                         #and not exists  (select id from histo_hour where histo.instrument_id = histo_hour.instrument_id and histo_hour.time = (histo.time  - mod(histo.time,60*60)))
//
//                 ) as agre group by `time`, `date`
