<?php

namespace Vsb\Crm\Observers;

use Vsb\Crm\Model\User;
use App\Events\UserStateEvent;

class UserObserver
{
    /**
     * Handle the account "created" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function created(User $user)
    {
        //
    }

    /**
     * Handle the account "updated" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function updated(User $user)
    {
        event(new UserStateEvent($user->id));
    }

    /**
     * Handle the account "deleted" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function deleted(User $user)
    {
        //
    }

    /**
     * Handle the account "restored" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function restored(User $user)
    {
        //
    }

    /**
     * Handle the account "force deleted" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function forceDeleted(User $user)
    {
        //
    }
}
