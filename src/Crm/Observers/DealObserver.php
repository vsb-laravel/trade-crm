<?php

namespace Vsb\Crm\Observers;

use Auth;
use Vsb\Model\Deal;
use Vsb\Model\DealHistory;
use App\User;
use App\UserMeta;
use Vsb\Crm\Events\UserStateEvent;

class DealObserver
{
    /**
     * Handle the deal "created" event.
     *
     * @param  \Vsb\Crm\Deal  $deal
     * @return void
     */
    public function created(Deal $deal)
    {
        foreach (UserMeta::where('meta_name','can_follow')->get() as $follower){
            if(!is_null($follower))
            {
                $follower = json_decode($follower);
                $jf = json_decode($follower->meta_value);
                if($jf->partner == $deal->user_id)
                {
                    event(new UserStateEvent($follower->user_id));
                }
            }
        }

        $olapd = UserMeta::where('user_id',$deal->user_id)->where('meta_name','olap')->first();
        if(is_null($olapd))$olapd = UserMeta::create(['user_id'=>$deal->user_id,'meta_name'=>'olap','meta_value'=>json_encode([])]);
        $olap = json_decode($olapd->meta_value,true);
        $olap['tradeVolume'] = floatval(isset($olap['tradeVolume'])?$olap['tradeVolume']:0)+floatval($deal->invested);
        $olapd->update(['meta_value'=>json_encode($olap)]);
    }

    /**
     * Handle the deal "updated" event.
     *
     * @param  \Vsb\Crm\Deal  $deal
     * @return void
     */
    public function updated(Deal $deal)
    {
        event(new UserStateEvent($deal->user_id));
        foreach (UserMeta::where('meta_name','can_follow')->get() as $follower){
            if(!is_null($follower))
            {
                $follower = json_decode($follower);
                $jf = json_decode($follower->meta_value);

                if($jf->partner == $deal->user_id)
                {
                    event(new UserStateEvent($follower->user_id));
                }
            }
        }
        if($deal->status_id == 30){
            $olapd = UserMeta::where('user_id',$deal->user_id)->where('meta_name','olap')->first();
            if(is_null($olapd))$olapd = UserMeta::create(['user_id'=>$deal->user_id,'meta_name'=>'olap','meta_value'=>json_encode([])]);
            $olap = json_decode($olapd->meta_value,true);
            $olap['pnl'] = floatval(isset($olap['pnl'])?$olap['pnl']:0)+floatval($deal->profit);
            $olapd->update(['meta_value'=>json_encode($olap)]);
        }

    }

    /**
     * Handle the deal "deleted" event.
     *
     * @param  \Vsb\Crm\Deal  $deal
     * @return void
     */
    public function deleted(Deal $deal)
    {
        //
    }

    /**
     * Handle the deal "restored" event.
     *
     * @param  \Vsb\Crm\Deal  $deal
     * @return void
     */
    public function restored(Deal $deal)
    {
        //
    }

    /**
     * Handle the deal "force deleted" event.
     *
     * @param  \Vsb\Crm\Deal  $deal
     * @return void
     */
    public function forceDeleted(Deal $deal)
    {
        //
    }
}
