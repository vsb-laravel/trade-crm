<?php

namespace Vsb\Crm\Observers;

use Vsb\Model\Account;
use App\User;
use App\UserHistory;

class UserHistoryObserver
{
    /**
     * Handle the deal "created" event.
     *
     * @param  \Vsb\Crm\Deal  $deal
     * @return void
     */
    public function created(UserHistory $userHistory)
    {
        $userHistory->update(['description'=>$userHistory->description]);
        $user = $userHistory->user;
        if(is_null($user))return;
        $account = $user->accounts()->where('type','real')->where('status','open')->first();
        if(is_null($account))return;
        $userHistory->update(['description'=>$userHistory->description.'  IP<'.$user->ip.'>  Balance#'.$account->id.': '.number_format($account->amount,2,'.',' ').'$']);
        // $userHistory->update(['description'=>$userHistory->description.'    Balance#'.$account->id.': '.number_format($account->amount,2,'.',' ').'$']);
    }
}
