<?php

namespace Vsb\Crm\Observers;

use App\User;
use Vsb\Crm\Events\UserStateEvent;

class UserObserver
{
    /**
     * Handle the account "created" event.
     *
     * @param  \Vsb\Crm\User  $user
     * @return void
     */
    public function created(User $user)
    {
        //
    }

    /**
     * Handle the account "updated" event.
     *
     * @param  \Vsb\Crm\User  $user
     * @return void
     */
    public function updated(User $user)
    {
        event(new UserStateEvent($user->id));
    }

    /**
     * Handle the account "deleted" event.
     *
     * @param  \Vsb\Crm\User  $user
     * @return void
     */
    public function deleted(User $user)
    {
        //
    }

    /**
     * Handle the account "restored" event.
     *
     * @param  \Vsb\Crm\User  $user
     * @return void
     */
    public function restored(User $user)
    {
        //
    }

    /**
     * Handle the account "force deleted" event.
     *
     * @param  \Vsb\Crm\User  $user
     * @return void
     */
    public function forceDeleted(User $user)
    {
        //
    }
}
