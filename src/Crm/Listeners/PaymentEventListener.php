<?php

namespace App\Listeners;
use Log;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class PaymentEventListener
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
        $host = 'http://chat.xcryptex.com';
        $salt = 'ogogo';
        $amount = abs($event->payment->amount);
        $account = $event->payment->account;
        $query = ($event->payment->amount>0)
        ?[
            'tranz'=>'',
            'castka'=>$amount,
            'id_u_from'=>0,
            'id_u_to'=>$account->user_id
        ]
        :[
            'tranz'=>'',
            'castka'=>$amount,
            'id_u_from'=>$account->user_id,
            'id_u_to'=>0
        ];
        $query['tranz'] = md5(join([$salt,$query['castka'],$query["id_u_from"],$query["id_u_to"]],':'));
        $response = file_get_contents($host.'/php/crm_brana.php?'.http_build_query($query));
        Log::debug('PaymentEventListener handled on ['.json_encode($query).'] : '.$response);
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
