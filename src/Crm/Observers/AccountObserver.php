<?php

namespace Vsb\Crm\Observers;

use Vsb\Model\Account;
use Vsb\Crm\Events\UserStateEvent;

class AccountObserver
{
    /**
     * Handle the account "created" event.
     *
     * @param  \Vsb\Crm\Account  $account
     * @return void
     */
    public function created(Account $account)
    {
        //
    }

    /**
     * Handle the account "updated" event.
     *
     * @param  \Vsb\Crm\Account  $account
     * @return void
     */
    public function updated(Account $account)
    {
        event(new UserStateEvent($account->user_id));
    }

    /**
     * Handle the account "deleted" event.
     *
     * @param  \Vsb\Crm\Account  $account
     * @return void
     */
    public function deleted(Account $account)
    {
        //
    }

    /**
     * Handle the account "restored" event.
     *
     * @param  \Vsb\Crm\Account  $account
     * @return void
     */
    public function restored(Account $account)
    {
        //
    }

    /**
     * Handle the account "force deleted" event.
     *
     * @param  \Vsb\Crm\Account  $account
     * @return void
     */
    public function forceDeleted(Account $account)
    {
        //
    }
}
