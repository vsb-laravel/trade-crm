<?php

namespace Vsb\Crm\Console\Commands;

use Illuminate\Console\Command;
//local classes
use DB;
use Log;
use Vsb\Model\Histo;
use Vsb\Model\Price;
use Vsb\Model\Instrument;
use Vsb\Model\Currency;
use Vsb\Model\Source;
use App\User;
use App\UserMeta;
use App\UserTuneHisto;
use cryptofx\CryptoCompareApi;
use cryptofx\api\Exmo;
use cryptofx\api\Exx;
use cryptofx\api\Bitfinex;
use cryptofx\api\Trader;
use cryptofx\DataTune;

class LoadHistominute extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:histo';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Histrical data loading';

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
    protected $pairs = [
        '1'=>'getCryptoCompare',
        '2'=>'getExmo',
        '3'=>'getExx',
    ];
    public function handle(){
        $instruments = Instrument::with(['from','to'])->where('enabled',1)->orderBy('source_id','desc')->get();
        foreach($instruments as $pair){
            $source = Source::find($pair->source_id);
            $res = DB::table(DB::raw("(select
                    time,
                    time - mod(time,60) as trunc,
                    from_unixtime(time - mod(time,60)) as date,
                    price,
                    (case when volation=1 then 1 else 0 end) as volumefrom,
                    (case when volation=-1 then price else 0 end) as volumeto
                from prices
                where prices.instrument_id = {$pair->id} and prices.source_id = {$pair->source_id} and prices.time >  ifnull((select max(time) from histo where histo.instrument_id = prices.instrument_id),0)
                    and prices.time<unix_timestamp(DATE_SUB(NOW(),INTERVAL 1 MINUTE))
                order by `time` asc ) as agre"))
                ->select(DB::raw("trunc as time,date,
                    min(price) as low,
                    max(price) as high,
                    SUBSTRING_INDEX(GROUP_CONCAT(price order by time desc),',',1) as close,
                    SUBSTRING_INDEX(GROUP_CONCAT(price order by time),',',1) as open,
                    sum(volumefrom) as volumefrom,
                    sum(volumeto) as volumeto"))
                ->groupBy(['trunc','date']);
            $res = $res->get();
            $last = count($res);
            $i = 0;
            foreach ($res as $row) {
                if($i++ >= $last)break;
                $repeat = Histo::where("time",$row->time)->where('instrument_id',$pair->id)->first();
                if(is_null($repeat)){
                    echo "New candle: ".json_encode($row)."\n";
                    $histo = Histo::create([
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
            }
            $this->checkTune($pair);
        }
    }
    protected function checkTune(Instrument $pair){
        // echo "check tuning:\n";
        $umcs = UserMeta::where('meta_name','user_tune_corida_#'.$pair->id)->get();
        foreach ($umcs as $umc) {
            $corrida = json_decode($umc->meta_value);
            if($corrida->riskon!=1)continue;
            $res = DB::table(DB::raw("(select
                        user_tune_price.user_id,
                        prices.time,
                        prices.time - mod(prices.time,60) as trunc,
                        from_unixtime(prices.time - mod(prices.time,60)) as date,
                        ifnull(user_tune_price.price,prices.price) as price,
                        (case when volation=1 then 1 else 0 end) as volumefrom,
                        (case when volation=-1 then 1 else 0 end) as volumeto
                    from prices left outer join user_tune_price on user_tune_price.price_id = prices.id and user_tune_price.user_id = {$umc->user_id}
                    where prices.instrument_id = {$pair->id} and prices.source_id = {$pair->source_id} #and prices.time > (select max(prices.time) from histo where histo.instrument_id = prices.instrument_id)
                        and prices.time<unix_timestamp(DATE_SUB(NOW(),INTERVAL 1 MINUTE))
                    order by prices.time asc ) as agre"))
                    ->select(DB::raw("trunc as time,date,user_id,
                        min(price) as low,
                        max(price) as high,
                        SUBSTRING_INDEX(GROUP_CONCAT(price order by time desc),',',1) as close,
                        SUBSTRING_INDEX(GROUP_CONCAT(price order by time),',',1) as open,
                        sum(volumefrom) as volumefrom,
                        sum(volumeto) as volumeto"))
                    ->groupBy(['trunc','date','user_id']);
            // Log::debug('user_tune_data: '.$res->toSql());
            $res = $res->get();
            foreach ($res as $row) {
                $repeat = UserTuneHisto::where("time",$row->time)->where('instrument_id',$pair->id)->where('user_id',$umc->user_id)->first();
                if(is_null($repeat)){
                    echo "New tuned candle: ".json_encode($row)."\n";
                    $histo = UserTuneHisto::create([
                        'user_id'=>$umc->user_id,
                        'instrument_id'=>$pair->id,
                        'source_id'=>$pair->source_id,
                        'open'=>floatval($row->open)*floatval($pair->multiplex),
                        'close'=>floatval($row->close)*floatval($pair->multiplex),
                        'low'=>floatval($row->low)*floatval($pair->multiplex),
                        'high'=>floatval($row->high)*floatval($pair->multiplex),
                        'volumefrom'=>$row->volumefrom,
                        'volumeto'=>$row->volumeto,
                        'time'=>$row->time,
                        'volation'=>($row->open<$row->close)?1:-1,
                    ]);
                }
            }
        }
    }
}

/*
delete from histo_day where instrument_id in (15,16);
delete from histo_hour where instrument_id in (15,16);
delete from histo where instrument_id in (15,16);
delete from prices where instrument_id in (15,16);
delete FROM `instruments` where id in (15,16);


SELECT from_unixtime(p.time-mod(p.time,60)), SUBSTRING_INDEX(GROUP_CONCAT(p.price order by p.time),',',1) ,min(p.price),max(price), SUBSTRING_INDEX(GROUP_CONCAT(p.price order by p.time desc),',',1), h.open,h.low,h.high,h.close
FROM prices p left outer join histo h on h.instrument_id = p.instrument_id and (p.time-mod(p.time,60)) = h.time
#where p.instrument_id = 2
group by (p.time-mod(p.time,60)), h.open,h.low,h.high,h.close ORDER BY p.instrument_id

/ceching
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
