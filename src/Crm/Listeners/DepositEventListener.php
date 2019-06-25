<?php

namespace App\Listeners;

use Log;
use App\User;
use App\UserMeta;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class DepositEventListener implements ShouldQueue
{
    public $queue = "deposits";
    public $connection ="redis";
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
        // Log::debug('DepositEvent: '.json_encode($event));
        try{
            if( isset($event->payment->merchant) && isset($event->payment->merchant->name) && preg_match('/(demo|bonus)/i',$event->payment->merchant->name) ) return;
            $user = User::find($event->payment->account->user_id);
            if(is_null($user))return;
            $umd = $user->meta()->where('meta_name','ftd')->first();

            if( is_null($umd) ){
                $manager = is_null($user->manager)?$user:$user->manager;
                $user->meta()->create([
                    'meta_name'=>'ftd',
                    'meta_value'=>json_encode([
                        'customer' => $user->toArray(),
                        'manager' => $manager->toArray(),
                        'amount' =>$event->payment->amount
                    ])
                ]);
            }
        }
        catch(\Exception $e){
            Log::error($e);
        }
        foreach (UserMeta::meta('deposit_event_handler')->get() as $reh) {
            try{
                $customer = User::find($event->payment->account->user_id);
                if( $customer->affilate_id == $reh->user_id ){
                    $executorClass = $reh->meta_value;
                    $executor = new $executorClass($event);
                    $executor->handle();
                }
            }
            catch(\Exception $e){
                Log::error('deposit_event_handler error');
                Log::error($e);
            }
        }
        $merchant = isset($event->payment->merchant)?$event->payment->merchant:Merchant::find($event->payment->merchant_id);
        if( isset($merchant->enabled) && $merchant->enabled==3 )return;
        $olapd = UserMeta::where('user_id',$event->payment->user_id)->where('meta_name','olap')->first();
        if(is_null($olapd))$olapd = UserMeta::create(['user_id'=>$event->payment->user_id,'meta_name'=>'olap','meta_value'=>json_encode([])]);
        $olap = json_decode($olapd->meta_value,true);
        if( isset($merchant->enabled) && $merchant->enabled==2) $olap['bonus'] = floatval(isset($olap['bonus'])?$olap['bonus']:0)+floatval($event->payment->amount);
        else $olap['deposit'] = floatval(isset($olap['deposit'])?$olap['deposit']:0)+floatval($event->payment->amount);
        $olapd->update(['meta_value'=>json_encode($olap)]);
    }
}

/*
http://chat.xcryptex.com/php/crm_brana.php
запрос GET
параметры
tranz =md5('ogogo:$castka:$id_u_from:$id_u_to')   - проверочный код  генерится на стороне  СРМ , на стороне кллуба -проверяется
внимание на двоеточия ))))
$my_cod=md5('ogogo:'.$_GET['castka'].':'.$_GET['id_u_from'].':'.$_GET['id_u_to']);

castka- сумма перевода в ВИНДИГО
id_u_from - ИД юзера СРМ отправитель
id_u_to -  ИД юзера СРМ получатель

при id_u_from ==0  - это ввод денег на счет
при id_u_to ==0 - это вывод денег со счета

ошибки выпонения
0 - все в порядке
- 3 не найдены юзеры в базе КЛУБА
- 2 неправильный проверочный код tranz
- 1 у отправителя не хватает денег на счете


сейчас в CРМ есть юзер ИД 17 Boris Sim - на нем можно пробовать

 */
