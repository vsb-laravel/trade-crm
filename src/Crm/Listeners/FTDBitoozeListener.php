<?php

namespace Vsb\Crm\Listeners;

use Log;
use Vsb\Crm\Model\Account;
use Vsb\Crm\Model\User;
use Vsb\Crm\Model\UserHistory;
use Vsb\Crm\Model\UserMeta;
use Vsb\Crm\Model\Invoice;
use Vsb\Crm\Model\Merchant;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class FTDBitoozeListener
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
    public function handle($event){
        $affilate_id = [
            3554,
            3956,
            3974
        ];

        Log::debug('DepositEvent Bitooze: '.json_encode($event));
        try{
            if( isset($event->payment->merchant) && isset($event->payment->merchant->name) && preg_match('/(demo|bonus)/i',$event->payment->merchant->name) ) return;
            $user = User::find($event->payment->account->user_id);
            if(is_null($user))return;
            $um = UserMeta::where('user_id',$user->id)->where('meta_name','bitooze_aff_postbacked')->first();
            if(!is_null($um)) return;
            if(!in_array($user->affilate_id,$affilate_id))return;
            $dd = Invoice::whereIn('account_id',Account::where('user_id',$user->id)->where('type','real')->pluck('id'))
                ->whereIn('merchant_id',Merchant::where('enabled','!=',2)->pluck('id'))
                ->where('error',0)
                ->sum('amount');

            $campaign = $user->campaign;
            if(is_null($campaign))return;
            if(!isset($campaign->utm_clickid))return;
            $host = 'http://admin.f5stat.com/postback';
            $query = [
                'goal'=>2,
                'clickid' => isset($campaign->utm_clickid)?$campaign->utm_clickid:""
            ];
            if($user->affilate_id == 3956){
                if(floatval($dd)+floatval($event->payment->amount) <150) return;
                $host = 'http://offers.3snet.ru/postback';
                $query = [
                    'goal'=>2,
                    'status'=>2,
                    'clickid' => isset($campaign->utm_clickid)?$campaign->utm_clickid:""
                    ];
            }
            else if($user->affilate_id == 3974){
                if(floatval($dd)+floatval($event->payment->amount) <50) return;
                $host = 'https://admin.cpa-binary.com/postback';
                $query = [
                    'goal'=>2,
                    'status'=>1,
                    'clickid' => isset($campaign->utm_clickid)?$campaign->utm_clickid:""
                    ];
            }
            else if($user->affilate_id == 3554){
                if(floatval($dd)+floatval($event->payment->amount) <150) return;
            }

            $response = file_get_contents($host.'?'.http_build_query($query));
            Log::debug('FTDBitoozeListener handled on ['.json_encode($query).'] : '.$response);
            $um = UserMeta::create(['user_id'=>$user->id,'meta_name'=>'bitooze_aff_postbacked','meta_value'=>1]);
            UserHistory::create(['type'=>'postback','description'=>'Postback deposit ['.json_encode($query).'] : '.$response,'user_id'=>$user->id]);
         }
         catch(\Exception $e){
             Log::error($e);
         }
    }
}
