<?php

namespace App\Observers;

use App\Option;
use App\Events\OptionEvent;
class OptionObserver
{
    public function updated(Option $option)
    {
        event(new OptionEvent($option));
    }
}
