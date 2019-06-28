<?php

namespace Vsb\Crm\Console\Commands;

use Illuminate\Console\Command;

//local classes
use Log;
use Vsb\Model\Price;
use Vsb\Model\Instrument;
use App\User;
use Vsb\Model\Currency;
use Vsb\Model\Source;
use App\UserMeta;
use Vsb\Crm\Events\PriceEvent;
use cryptofx\CryptoCompareApi;
use cryptofx\DataTune;
use cryptofx\api\Bitfinex;
use cryptofx\api\Exmo;
use cryptofx\api\Exx;

class LoadPrices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:prices';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get current prices';

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
        // Log::debug('cryptofx:prices started');
        $crapi = new CryptoCompareApi;
        $time = time();
        $pairs = [];
        $ins = Instrument::with(['from','to'])->where('enabled',1)->orderBy('source_id','desc')->get();
        $instruments = [];
        $pairss = [];
        foreach ($ins as $instrument) {
            $fsym = Currency::find($instrument->from_currency_id);
            $tsym = Currency::find($instrument->to_currency_id);
            $instruments[$instrument->id]=$instrument;
            $pairs[$instrument->id] = [
                "fsym"=>$fsym->code,
                "tsyms"=>$tsym->code,
            ];
            $pairss[$instrument->id] = $instrument;
        }
        // print_r($pairss);exit;
        while((time()-$time)<58){
            $this->fromall($pairss);
            $crapi->prices($pairs,function($callback)use($instruments){
                $instrument = $instruments[$callback["id"]];
                $rawpr = json_decode($callback["response"]);
                $tosymCode = $callback["request"]["tsyms"];
                $volation = 0;
                $oldprice = Price::where('instrument_id',$callback["id"])->orderBy('id','desc')->first();
                if(isset($rawpr->$tosymCode)){
                    $currentPrice = floatval($rawpr->$tosymCode)*floatval($instrument->multiplex);
                    if(is_null($oldprice) || $oldprice === false ||  floatval($oldprice->price) != $currentPrice){
                        if(!is_null($oldprice)){
                            if(floatval($oldprice->price) < $currentPrice) $volation =1;
                            else if(floatval($oldprice->price) > $currentPrice)  $volation=-1;
                        }
                        $tickTime = time();
                        try{
                            $price = Price::create([
                                'time'=>$tickTime+60,
                                'price'=>$currentPrice,
                                'instrument_id'=>$callback["id"],
                                'source_id'=>"1",
                                'volation' => $volation
                            ]);
                            $umcs = UserMeta::where('meta_name','user_tune_corida_#'.$callback['id'])->get();
                            foreach ($umcs as $umc) {
                                $pair = Instrument::find($callback["id"]);
                                $user = User::find($umc->user_id);
                                DataTune::corrida($user,$pair,$price);
                            }
                        }
                        catch(\Exception $e){}
                        // $ret = DataTune::risk($instrument,$price);
                        // echo "!!! CHANGED\t";
                        // echo "Cryptocompare pair[".$callback["id"]."] ".$callback["request"]["fsym"]."/".$callback["request"]["tsyms"]." : was ".(is_null($oldprice)?'-':floatval($oldprice->price))." - now ".$currentPrice."\n";

                    }
                }
            });
            echo "in ".(time()-$time)." {$time}:".time()."\n";

            usleep(400);
            // sleep(10);
        }
        // Log::debug('cryptofx:prices stoped');
    }
    protected $sources = [
        // '1'=>'cryptofx\api\Cryptocompare',
        '2'=>'cryptofx\api\Exmo',
        '3'=>'cryptofx\api\Exx',
        '4'=>'cryptofx\api\Bitfinex',
        '5'=>'cryptofx\api\Investing'
    ];
    protected function fromall($pps){
        echo date('Y-m-d H:i:s')." load from all\n";
        foreach ($this->sources as $i=>$sourcer) {
            $source = Source::find($i);
            if(is_null($source))continue;
            $trader = new $this->sources[$i];
            $trader->histominute($pps,function($args)use($i,$trader,$source){
                $pair = $args['request'];


                $candles = [];
                $key=false;

                $lastPrice = Price::where('instrument_id',$pair->id)->where('source_id',$pair->source_id)->orderBy('time','desc')->first();
                if(is_null($args['response']) || !isset($args['response'])) return;
                foreach($args['response'] as $trade){
                    // if(!is_null($lastPrice) && !is_null($trade) && isset($trade->price)) $volation = ($lastPrice->price<=$trade->price)?1:-1;
                    if(!is_object($trade))continue;

                    // echo $source->name.".type: ".$trade->type."\n";
                    $volation = ($trade->type=="buy")?1:-1;
                    if(is_null($lastPrice) || $lastPrice->time<$trade->date) {
                        echo $source->name." pair[".$pair->id."]:".$pair->title." price:".$trade->price."\n";
                        Log::debug( $source->name." pair[".$pair->id."]:".$pair->title." price:".$trade->price );
                        $lastPrice = Price::create([
                            'time'=>$trade->date+60,
                            'price'=>$trade->price*$pair->multiplex,
                            'instrument_id'=>$pair->id,
                            'source_id'=>$source->id,
                            'volation' => $volation
                        ]);
                        // event(new PriceEvent($lastPrice));
                        // broadcast(new PriceEvent($lastPrice));
                        // if($i == $pair->source_id) $this->checkTune($pair,$lastPrice);
                    }
                }
            });
        }
    }
    protected function checkTune(Instrument $pair, $data){
        // echo "check tuning:\n";
        $umcs = UserMeta::where('meta_name','user_tune_corida_#'.$pair->id)->get();
        foreach ($umcs as $umc) {
            $pair = Instrument::find($pair->id);
            $user = User::find($umc->user_id);
            DataTune::corrida($user,$pair,$data);
        }
        // $umcs = UserMeta::where('meta_name','user_tune_#'.$pair->id)->get();
        // foreach ($umcs as $umc) {
        //     $user = User::find($umc->user_id);
        //     DataTune::flocky($user,$pair,$data);
        // }
    }
}
/*
insert into prices_arc
	select * from prices WHERE created_at < unix_timestamp(DATE_SUB(NOW(),INTERVAL 60 MINUTE));
delete from prices WHERE created_at < unix_timestamp(DATE_SUB(NOW(),INTERVAL 60 MINUTE));
*/
