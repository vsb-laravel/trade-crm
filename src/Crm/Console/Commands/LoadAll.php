<?php

namespace Vsb\Crm\Console\Commands;

use Illuminate\Console\Command;
//local classes
use Vsb\Model\HistoDay;
use Vsb\Model\HistoHour;
use Vsb\Model\Histo;
use Vsb\Model\Instrument;
use Vsb\Model\Currency;
use Vsb\Model\Source;
use cryptofx\CryptoCompareApi;

class LoadAll extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:histo_all';

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

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(){
        $crapi = new CryptoCompareApi;
        $source = Source::where('name','CryptoCompare')->first();
        $ins = Instrument::get();
        // echo $this->signature." loaded as ".date("Y-m-d H:i:s")."\n";
        foreach ($ins as $i=>$instrument) {
            $fsym = Currency::find($instrument->from_currency_id);
            $tsym = Currency::find($instrument->to_currency_id);
            $rq= [
                "fsym"=>$fsym->code,
                "tsym"=>$tsym->code,
                "limit"=>2048
            ];

            echo "Instrument:".$instrument->id." multiplex:".$instrument->multiplex."\n";
            $hists = $crapi->histoday($rq);
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
                echo "hist:".json_encode($hist)." udata:".json_encode($udata)."\n";
                if(is_null($repeat))HistoDay::create($udata);
            }
            $hists = $crapi->histohour($rq);
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
                echo "hist:".json_encode($hist)." udata:".json_encode($udata)."\n";
                if(is_null($repeat))HistoHour::create($udata);
                // else $repeat->update($udata);
            }
            $hists = $crapi->histominute($rq);
            foreach ($hists->Data as $i => $hist) {
                $repeat = Histo::where("time",$hist->time)->where('instrument_id',$instrument->id)->first();
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
                echo "hist:".json_encode($hist)." udata:".json_encode($udata)."\n";
                if(is_null($repeat))Histo::create($udata);
                // else $repeat->update($udata);
            }
        }
    }
}
