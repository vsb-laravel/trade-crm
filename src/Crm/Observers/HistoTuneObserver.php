<?php

namespace Vsb\Crm\Observers;

use App\UserTuneHisto;
use Vsb\Crm\Events\OhlcTuneEvent;
class HistoTuneObserver
{
    public function created(UserTuneHisto $histo)
    {
        event(new OhlcTuneEvent($histo));
    }

    /**
     * Handle the histo "updated" event.
     *
     * @param  \Vsb\Crm\Histo  $histo
     * @return void
     */
    public function updated(UserTuneHisto $histo)
    {
        event(new OhlcTuneEvent($histo));
    }
}
