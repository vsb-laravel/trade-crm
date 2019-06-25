<?php

namespace App\Observers;

use App\Price;
use App\Instrument;
use App\Events\PriceEvent;
use App\Jobs\PriceHandler;

class PriceObserver
{
    /**
     * Handle the price "created" event.
     *
     * @param  \App\Price  $price
     * @return void
     */
    public function created(Price $price)
    {
        if($price->source_id == $price->pair->source_id)
            // PriceHandler::dispatch($price)->onQueue('prices')->onConnection('redis');
            // dispatch((new PriceHandler($price))->onQueue('prices'));
            // event(new PriceEvent($price));
    }

    /**
     * Handle the price "updated" event.
     *
     * @param  \App\Price  $price
     * @return void
     */
    public function updated(Price $price)
    {
        //
    }

    /**
     * Handle the price "deleted" event.
     *
     * @param  \App\Price  $price
     * @return void
     */
    public function deleted(Price $price)
    {
        //
    }

    /**
     * Handle the price "restored" event.
     *
     * @param  \App\Price  $price
     * @return void
     */
    public function restored(Price $price)
    {
        //
    }

    /**
     * Handle the price "force deleted" event.
     *
     * @param  \App\Price  $price
     * @return void
     */
    public function forceDeleted(Price $price)
    {
        //
    }
}
