<?php

namespace Vsb\Crm\Observers;

use Vsb\Model\Option;
use Vsb\Crm\Events\OptionEvent;
class OptionObserver
{
    public function updated(Option $option)
    {
        event(new OptionEvent($option));
    }
}
