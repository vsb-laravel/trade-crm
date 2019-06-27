<?php

namespace Vsb\Crm\Observers;

use Vsb\Crm\Model\UserTuneHisto;
use App\Events\OhlcTuneEvent;
class HistoTuneObserver
{
    public function created(UserTuneHisto $histo)
    {
        event(new OhlcTuneEvent($histo));
    }

    /**
     * Handle the histo "updated" event.
     *
     * @param  \App\Histo  $histo
     * @return void
     */
    public function updated(UserTuneHisto $histo)
    {
        event(new OhlcTuneEvent($histo));
    }
}
