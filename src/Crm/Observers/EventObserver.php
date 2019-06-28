<?php

namespace Vsb\Crm\Observers;

use Vsb\Model\Event;
use Vsb\Crm\Events\EventEvent;

class EventObserver
{
    /**
     * Handle the event "created" event.
     *
     * @param  \Vsb\Crm\Event  $event
     * @return void
     */
    public function created(Event $event)
    {
        event(new EventEvent($event));
    }

    /**
     * Handle the event "updated" event.
     *
     * @param  \Vsb\Crm\Event  $event
     * @return void
     */
    public function updated(Event $event)
    {
        //
    }

    /**
     * Handle the event "deleted" event.
     *
     * @param  \Vsb\Crm\Event  $event
     * @return void
     */
    public function deleted(Event $event)
    {
        //
    }

    /**
     * Handle the event "restored" event.
     *
     * @param  \Vsb\Crm\Event  $event
     * @return void
     */
    public function restored(Event $event)
    {
        //
    }

    /**
     * Handle the event "force deleted" event.
     *
     * @param  \Vsb\Crm\Event  $event
     * @return void
     */
    public function forceDeleted(Event $event)
    {
        //
    }
}
