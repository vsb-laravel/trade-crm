<?php

namespace App\Observers;

use App\Histo;
use App\Events\OhlcEvent;

class HistoObserver
{
    /**
     * Handle the histo "created" event.
     *
     * @param  \App\Histo  $histo
     * @return void
     */
    public function created(Histo $histo)
    {
        event(new OhlcEvent($histo));
    }

    /**
     * Handle the histo "updated" event.
     *
     * @param  \App\Histo  $histo
     * @return void
     */
    public function updated(Histo $histo)
    {
        event(new OhlcEvent($histo));
    }

    /**
     * Handle the histo "deleted" event.
     *
     * @param  \App\Histo  $histo
     * @return void
     */
    public function deleted(Histo $histo)
    {
        //
    }

    /**
     * Handle the histo "restored" event.
     *
     * @param  \App\Histo  $histo
     * @return void
     */
    public function restored(Histo $histo)
    {
        //
    }

    /**
     * Handle the histo "force deleted" event.
     *
     * @param  \App\Histo  $histo
     * @return void
     */
    public function forceDeleted(Histo $histo)
    {
        //
    }
}
