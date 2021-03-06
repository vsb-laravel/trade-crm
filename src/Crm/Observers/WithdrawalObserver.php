<?php

namespace Vsb\Crm\Observers;

use Vsb\Model\Withdrawal;

class WithdrawalObserver
{
    /**
     * Handle the withdrawal "created" event.
     *
     * @param  \Vsb\Crm\Withdrawal  $withdrawal
     * @return void
     */
    public function created(Withdrawal $withdrawal)
    {
        if($withdrawal->status!='approved')return;
        $olapd = UserMeta::where('user_id',$withdrawal->user_id)->where('meta_name','olap')->first();
        if(is_null($olapd))$olapd = UserMeta::create(['user_id'=>$withdrawal->user_id,'meta_name'=>'olap','meta_value'=>json_encode([])]);
        $olap = json_decode($olapd->meta_value,true);
        $olap['withdrawal'] = floatval(isset($olap['withdrawal'])?$olap['withdrawal']:0)+floatval($withdrawal->profit);
        $olapd->update(['meta_value'=>json_encode($olap)]);
    }

    /**
     * Handle the withdrawal "updated" event.
     *
     * @param  \Vsb\Crm\Withdrawal  $withdrawal
     * @return void
     */
    public function updated(Withdrawal $withdrawal)
    {
        if($withdrawal->status!='approved')return;
        $olapd = UserMeta::where('user_id',$withdrawal->user_id)->where('meta_name','olap')->first();
        if(is_null($olapd))$olapd = UserMeta::create(['user_id'=>$withdrawal->user_id,'meta_name'=>'olap','meta_value'=>json_encode([])]);
        $olap = json_decode($olapd->meta_value,true);
        $olap['withdrawal'] = floatval(isset($olap['withdrawal'])?$olap['withdrawal']:0)+floatval($withdrawal->profit);
        $olapd->update(['meta_value'=>json_encode($olap)]);
    }

    /**
     * Handle the withdrawal "deleted" event.
     *
     * @param  \Vsb\Crm\Withdrawal  $withdrawal
     * @return void
     */
    public function deleted(Withdrawal $withdrawal)
    {
        //
    }

    /**
     * Handle the withdrawal "restored" event.
     *
     * @param  \Vsb\Crm\Withdrawal  $withdrawal
     * @return void
     */
    public function restored(Withdrawal $withdrawal)
    {
        //
    }

    /**
     * Handle the withdrawal "force deleted" event.
     *
     * @param  \Vsb\Crm\Withdrawal  $withdrawal
     * @return void
     */
    public function forceDeleted(Withdrawal $withdrawal)
    {
        //
    }
}
