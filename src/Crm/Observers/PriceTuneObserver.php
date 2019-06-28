<?php

namespace Vsb\Crm\Observers;

use App\UserTunePrice;
use Vsb\Crm\Events\PriceTuneEvent;

class PriceTuneObserver
{
    /**
     * Handle the price "created" event.
     *
     * @param  \Vsb\Crm\Price  $price
     * @return void
     */
    public function created(UserTunePrice $price)
    {

        // event(new PriceTuneEvent($price));
    }
}
