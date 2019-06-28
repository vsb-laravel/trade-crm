<?php

namespace Vsb\Crm\Listeners;

use App\UserMeta;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class OptionEventListener
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
    public function handle($event)
    {
        if($event->item->name=='dayoff'){
            if($event->item->value == "1") {
                UserMeta::where('meta_name','can_trade')->update(['meta_value'=>'false']);
            }
            else if($event->item->value == "0"){
                UserMeta::where('meta_name','can_trade')->update(['meta_value'=>'true']);
            }
        }
    }
}
