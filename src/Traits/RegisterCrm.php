<?php namespace Vsb\Traits;
use App\User;
use App\UserHistory;
use App\UserMeta;
use Vsb\Model\Account;
use Vsb\Model\Currency;
use Vsb\Model\Lead;
use Vsb\Model\Message;
use Vsb\Model\Option;
use Vsb\Crm\Events\RegistrationEvent;
trait RegisterCrm{
    protected $needVerification;
    protected $needDemo;
    public function regsterCrm(User $user){
        $this->needVerification = Option::where('name','use_email_verification')->first();
        $this->needDemo = Option::where('name','use_demo')->first();
        if($this->needVerification->is_set()){
            try{
                Mail::send('email.verification', $data, function($message) use($data){
                    $message->to($data['email'], $data['name']." ".$data['surname'])->subject('Verify your email address');
                });
            }
            catch(\RuntimeException $e){
                Log::error($e);
                Event::create(['object_type'=>'error','object_id'=>0,'user_id'=>$user->id,'type'=>'error']);
            }
            catch(\Exception $e){
                Log::error($e);
                Event::create(['object_type'=>'error','object_id'=>0,'user_id'=>$user->id,'type'=>'error']);
            }
        }
        else if (method_exists('Auth','login') ) Auth::login($user);

        $user->events()->create(['type'=>'new','user_id'=>$user->id]);


        $lead = Lead::where('email',$data['email'])->first();
        if(!is_null($lead) && $lead !=false){
            $lead->update(['client_id'=>$user->id]);
            $lead->comments()->update(['object_id'=>$user->id,'object_type'=>'user']);
            $user->update(['parent_user_id'=>$lead->manager_id,'affilate_id'=>$lead->manager_id]);
            if(isset($lead->source) && !is_null($lead->source)){
                if(!isset($user->source) || is_null($user->source) ) $user->update(['source'=>$lead->source]);
            }

        }
        $currency = Currency::where('code','USD')->first();
        if($this->needDemo->is_set()) $accountDemo = Account::create([
                'status'=>'open',
                'currency_id'=>$currency->id,
                'user_id'=>$user->id,
                'amount'=>'10000',
                'type'=>'demo'
        ]);
        $account = Account::create([
                'status'=>'open',
                'currency_id'=>$currency->id,
                'user_id'=>$user->id,
                'amount'=>'0',
                'type'=>'real'
        ]);
        if($country!==false){
            UserMeta::create([
                'meta_name'=>'country',
                'meta_value'=>$country,
                'user_id'=>$user->id
            ]);
        }
        if(isset($data['callback'])){
            try{
                Callback::post($data["callback"],[
                    "id"=>$user->id,
                    "name"=>$user->name,
                    "surname"=>$user->surname,
                    "status"=>[
                        "id"=>10,
                        "name"=>"registered"
                    ],
                    "email"=>$user->email,
                    "phone"=>$user->phone
                ]);
            }
            catch(\Exception $e){
                Log::error($e);
            }
        }
        if(isset($data['campaign']))$user->meta()->create(['meta_name'=>'campaign','meta_value'=>$data['campaign']]);
        $user->meta()->create(['meta_name'=>'once_login_link','meta_value'=>str_random(32)]);
        $user->append(['autologinlink']);
        UserHistory::create(['type'=>'register','description'=>'First registration','user_id'=>$user->id]);
        try{
            $rip = $this->getIp();
            $li = UserMeta::byUser($user)->where('meta_name','=','register_ip')->first();
            if(is_null($li))$user->meta()->create(['meta_name'=>'register_ip','meta_value'=>$rip]);else $li->update(['meta_value'=>$rip]);
        }
        catch(\Exception $e){}
        event(new RegistrationEvent($user));
        return $user;
    }
}
