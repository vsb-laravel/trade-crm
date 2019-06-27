<?php

namespace Vsb\Crm\Observers;

use Vsb\Crm\Model\UserTunePrice;
use App\Events\PriceTuneEvent;

class PriceTuneObserver
{
    /**
     * Handle the price "created" event.
     *
     * @param  \App\Price  $price
     * @return void
     */
    public function created(UserTunePrice $price)
    {

        // event(new PriceTuneEvent($price));
    }
}
