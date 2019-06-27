<?php

namespace Vsb\Crm\Listeners;

use Log;
use App\User;
use App\UserHistory;
use App\Events\RegistrationEvent;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class RegisterBitoozeListener
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
         $affilate_id = 3554;

         Log::debug('RegistrationEventBitooze: '.json_encode($event));
         try{
             $user = User::find($event->customer->id);
             if(is_null($user))return;
             if($user->affilate_id == $affilate_id){
                 $host = 'http://admin.f5stat.com/postback';
                 $campaign = $user->campaign;
                 if(is_null($campaign))return;
                 if(!isset($campaign->utm_clickid))return;
                 $query = [
                     'goal'=>1,
                     'clickid' => isset($user->campaign->utm_clickid)?$user->campaign->utm_clickid:""
                 ];
                 $response = file_get_contents($host.'?'.http_build_query($query));
                 UserHistory::create(['type'=>'postback','description'=>'Postback ['.json_encode($query).'] : '.$response,'user_id'=>$user->id]);
                 Log::debug('RegisterBitoozeListener handled on ['.json_encode($query).'] : '.$response);
            }
            else if($user->affilate_id == 3956) $this->post3snet($user);
            else if($user->affilate_id == 3974) $this->initum($user);
         }
         catch(\Exception $e){
             Log::error($e);
         }

    }
    protected function post3snet($user){
        // http://offers.3snet.ru/postback?clickid={clickid}&goal=1&status=2
        // http://offers.3snet.ru/postback?clickid={clickid}&goal=2&status=2
        $host = 'http://offers.3snet.ru/postback';
        $campaign = $user->campaign;
        if(is_null($campaign))return;
        if(!isset($campaign->utm_clickid))return;
        $query = [
            'goal'=>1,
            'status'=>2,
            'clickid' => isset($user->campaign->utm_clickid)?$user->campaign->utm_clickid:""
        ];
        $response = file_get_contents($host.'?'.http_build_query($query));
        UserHistory::create(['type'=>'postback','description'=>'Postback ['.json_encode($query).'] : '.$response,'user_id'=>$user->id]);
    }
    protected function initum($user){
        // https://admin.cpa-binary.com/postback?clickid={кликайди}&goal=1&status=2 - рега
        $host = 'https://admin.cpa-binary.com/postback';
        $campaign = $user->campaign;
        if(is_null($campaign))return;
        if(!isset($campaign->utm_clickid))return;
        $query = [
            'goal'=>1,
            'status'=>2,
            'clickid' => isset($user->campaign->utm_clickid)?$user->campaign->utm_clickid:""
        ];
        $response = file_get_contents($host.'?'.http_build_query($query));
        UserHistory::create(['type'=>'postback','description'=>'Postback ['.json_encode($query).'] : '.$response,'user_id'=>$user->id]);
    }
}
