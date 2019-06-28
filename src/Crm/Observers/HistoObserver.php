<?php

namespace Vsb\Crm\Observers;

use Vsb\Model\Histo;
use Vsb\Crm\Events\OhlcEvent;

class HistoObserver
{
    /**
     * Handle the histo "created" event.
     *
     * @param  \Vsb\Crm\Histo  $histo
     * @return void
     */
    public function created(Histo $histo)
    {
        event(new OhlcEvent($histo));
    }

    /**
     * Handle the histo "updated" event.
     *
     * @param  \Vsb\Crm\Histo  $histo
     * @return void
     */
    public function updated(Histo $histo)
    {
        event(new OhlcEvent($histo));
    }

    /**
     * Handle the histo "deleted" event.
     *
     * @param  \Vsb\Crm\Histo  $histo
     * @return void
     */
    public function deleted(Histo $histo)
    {
        //
    }

    /**
     * Handle the histo "restored" event.
     *
     * @param  \Vsb\Crm\Histo  $histo
     * @return void
     */
    public function restored(Histo $histo)
    {
        //
    }

    /**
     * Handle the histo "force deleted" event.
     *
     * @param  \Vsb\Crm\Histo  $histo
     * @return void
     */
    public function forceDeleted(Histo $histo)
    {
        //
    }
}
