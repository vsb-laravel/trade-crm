<?php

namespace Vsb\Crm\Observers;

use Vsb\Model\Price;
use Vsb\Model\Instrument;
use Vsb\Crm\Events\PriceEvent;
use Vsb\Crm\Jobs\PriceHandler;

class PriceObserver
{
    /**
     * Handle the price "created" event.
     *
     * @param  \Vsb\Crm\Price  $price
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
     * @param  \Vsb\Crm\Price  $price
     * @return void
     */
    public function updated(Price $price)
    {
        //
    }

    /**
     * Handle the price "deleted" event.
     *
     * @param  \Vsb\Crm\Price  $price
     * @return void
     */
    public function deleted(Price $price)
    {
        //
    }

    /**
     * Handle the price "restored" event.
     *
     * @param  \Vsb\Crm\Price  $price
     * @return void
     */
    public function restored(Price $price)
    {
        //
    }

    /**
     * Handle the price "force deleted" event.
     *
     * @param  \Vsb\Crm\Price  $price
     * @return void
     */
    public function forceDeleted(Price $price)
    {
        //
    }
}
