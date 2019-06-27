<?php

namespace Vsb\Crm\Observers;

use Vsb\Crm\Model\Option;
use App\Events\OptionEvent;
class OptionObserver
{
    public function updated(Option $option)
    {
        event(new OptionEvent($option));
    }
}
