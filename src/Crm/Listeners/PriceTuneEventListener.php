<?php

namespace Vsb\Crm\Listeners;

use Log;
use Vsb\Model\Instrument;
use App\UserTuneHisto;
use App\User;
use Vsb\Model\Deal;
use App\UserMeta;
use cryptofx\DealMechanic;
use Vsb\Crm\Events\PriceTuneEvent;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class PriceTuneEventListener implements ShouldQueue
{
    public $queue = "pricesTune";
    public $connection ="redis";
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  PriceEvent  $event
     * @return void
     */
    public function handle(PriceTuneEvent $event)
    {

        $price = json_decode(json_encode($event->price));
        // Log::debug('PriceTuneEventListener handle',$price);
        $this->deal($price,$price->user_id);
        $this->histo($price);
    }
    public function histo($price){
        try{
            $tm = $price->time - ($price->time%60);
            $time=[
                "minute" => [
                    $tm,
                    60+$tm,
                ]
            ];
            $pair = Instrument::find($price->instrument_id);
            $h = UserTuneHisto::where('instrument_id',$price->instrument_id)->where('user_id',$price->user_id)->whereBetween('time',$time["minute"])->first();
            if(is_null($h)) UserTuneHisto::create([
                'user_id'=>$price->user_id,
                'instrument_id'=>$price->instrument_id,
                'open'=>floatval($price->price)*floatval($pair->multiplex),
                'close'=>floatval($price->price)*floatval($pair->multiplex),
                'low'=>floatval($price->price)*floatval($pair->multiplex),
                'high'=>floatval($price->price)*floatval($pair->multiplex),
                'time'=>$tm,
                'volation'=>0
            ]);
            else{
                if(floatval($price->price)>floatval($h->high)){$h->high=$price->price;$h->volation=1;}
                if(floatval($price->price)<floatval($h->low)){$h->low=$price->price;$h->volation=-1;}
                $h->close=$price->price;
                $h->save();
            }
        }
        catch(\Exception $e){
            Log::error($e);
        }
    }
    public function deal($price,$userId){
        $trades = Deal::with(['instrument','account','user'])
            ->whereIn('status_id',[10,30])
            ->whereIn('user_id',UserMeta::where('meta_name','user_tune_corida_#'.$price->instrument_id)->pluck('user_id'))
            ->where('instrument_id',$price->instrument_id)
            ->where('user_id',$userId)
            ->orderBy('id')->get();
        foreach ($trades as $deal) {
            try{
                DealMechanic::fork($deal,$price);
            }
            catch(\Exception $e){
                Log::error($e);
            }
        }
    }
}
