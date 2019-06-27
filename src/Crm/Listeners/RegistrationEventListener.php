<?php

namespace Vsb\Crm\Listeners;

use Vsb\Crm\Model\UserMeta;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class RegistrationEventListener
{
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
     * @param  object  $event
     * @return void
     */
    public function handle($event){
        foreach (UserMeta::meta('registration_event_handler')->get() as $reh) {
            try{
                if( $event->customer->affilate_id == $reh->user_id ){
                    $executorClass = $reh->meta_value;
                    $executor = new $executorClass($event);
                    $executor->handle();
                }
            }
            catch(\Exception $e){
                Log::error($e);
            }
        }
    }
}
