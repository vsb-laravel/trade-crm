<?php

namespace Vsb\Crm\Console\Commands;

use Illuminate\Console\Command;

//local classes
use DB;
use Log;
use Vsb\Model\Event;
use Vsb\Model\Price;
use Vsb\Model\PriceArc;
use Vsb\Model\Histo;
use Vsb\Model\HistoHour;
use Vsb\Model\HistoDay;
use Vsb\Model\Instrument;
use App\UserTuneHisto;
use App\UserMeta;
use App\UserTunePrice;

class CleanPrices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean prices table by hour ago';

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
        Log::debug('cryptofx:clean stated');
        $todel = Price::whereRaw('time < unix_timestamp(DATE_SUB(NOW(),INTERVAL 60 MINUTE))')->orderBy("id");
        $insert = $todel->get()->toArray();
        // print_r($insert);exit;
        foreach($insert as $row){
            // print_r($row);
            // PriceArc::create($row);
        }
        Event::whereRaw('created_at < unix_timestamp(DATE_SUB(NOW(),INTERVAL 7 DAY))')->orderBy('id')->delete();
        $h = Histo::whereRaw('time < unix_timestamp(DATE_SUB(NOW(),INTERVAL 64800 MINUTE))')->orderBy('id')->delete();
        $hh = HistoHour::whereRaw('time < unix_timestamp(DATE_SUB(NOW(),INTERVAL 8760 HOUR))')->orderBy('id')->delete();
        $hd = HistoDay::whereRaw('time < unix_timestamp(DATE_SUB(NOW(),INTERVAL 2048 DAY))')->orderBy('id')->delete();

        $hd = UserTuneHisto::whereRaw('time < unix_timestamp(DATE_SUB(NOW(),INTERVAL 7 DAY))')->orderBy('id')->delete();
        $hd = UserTunePrice::whereRaw('time < unix_timestamp(DATE_SUB(NOW(),INTERVAL 7 DAY))')->orderBy('id')->delete();

        try{
            $t = UserMeta::whereRaw("meta_value regexp '\"riskon\":\s*0' and meta_name like '%corida%' and updated_at<unix_timestamp(CURRENT_TIMESTAMP)-(24*3600)")->delete();
        }
        catch(\Exception $e){
            Log::warn('Clear command error '.$e->getMessage());
        }
        // echo $todel->count()." - ".$h->count()." - ".$hh->count()." - ".$hd->count()."\n";
        $todel->delete();
        Log::debug('cryptofx:clean stoped');
    }

}
/*
insert into prices_arc
	select * from prices WHERE created_at < unix_timestamp(DATE_SUB(NOW(),INTERVAL 60 MINUTE));
delete from prices WHERE created_at < unix_timestamp(DATE_SUB(NOW(),INTERVAL 60 MINUTE));
*/
