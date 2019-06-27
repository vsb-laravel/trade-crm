<?php

namespace Vsb\Crm\Http\Controllers\Auth;

use Log;
use Vsb\Crm\Model\User;
use Vsb\Crm\Model\Error;
use Vsb\Crm\Model\UserStatus;
use Vsb\Crm\Model\UserRights;
use Vsb\Crm\Model\UserHistory;
use Vsb\Crm\Model\UserMeta;
use Vsb\Crm\Model\Account;
use Vsb\Crm\Model\Currency;
use Vsb\Crm\Model\Lead;
use Vsb\Crm\Model\Event;
use App\Events\RegistrationEvent;
use Vsb\Crm\Model\Option;
use cryptocx\Callback;
use Redirect;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/register/needverify';
    protected $needDemo=null;
    protected $needVerification=null;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
        $this->needVerification = Option::where('name','use_email_verification')->first();
        $this->needDemo = Option::where('name','use_demo')->first();
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {

        return Validator::make($data, [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'g-recaptcha-response' => 'recaptcha',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    public function create(array $data){
        if(!isset($data['rights_id']))$data['rights_id']=UserRights::where('name','=','client')->first()->id;
        if(!isset($data['status_id']))$data['status_id']=UserStatus::where('code','=','newclient')->first()->id;
        $needDemo = Option::where('name','use_demo')->first();
        $defaultAdmin = Option::where('name','default_admin')->first();
        $data["parent_user_id"] = $defaultAdmin->value;

        $country = (isset($data['country']))?$data['country']:false;
        $data['email_verification_token'] = str_random(44);
        $data['real_password'] = $data['password'];
        $data['password'] = bcrypt($data['password']);

        $foundAffiliate = false;
        //asign customer by admincode
        if(isset($data['admincode']) && strlen(trim($data['admincode'])) >0){
            $um = UserMeta::where('meta_name','admincode')->where('meta_value',$data['admincode'])->first();
            if(!is_null($um) && $um != false){ //admincode exists
                $data["parent_user_id"] =$um->user->parent_user_id;
                $data["affilate_id"] = $um->user_id;
                $foundAffiliate = true;
            }
        }
        if(!$foundAffiliate && isset($data["affilate_id"])){
            $affiliate = User::find($data["affilate_id"]);
            if(!is_null($affiliate)){
                $data["affilate_id"]=$affiliate->id;
                $data["parent_user_id"]=$affiliate->parent_user_id;
                $foundAffiliate = true;
            }
        }
        if(!$foundAffiliate){
            $data["affilate_id"] = $defaultAdmin->value;
        }
        if(!is_null($this->needVerification) && !$this->needVerification->is_set()){
            $data['email_verified']=1;
            $this->redirectTo = '/';
        }
        $user = User::create($data);
        try{
            Mail::send('email.registration', $data, function($message) use($data){
                $message->to($data['email'], $data['name']." ".$data['surname'])
                    ->subject(env('APP_NAME'));
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
    public function resendVerificationCode(Request $rq){
        $user = User::where('email',$rq->input('email'))->first();
        if(! $user ) return;
        $data= $user->toArray();
        $data['email_verification_token'] = str_random(44);
        $user->update(['email_verification_token' => $data['email_verification_token']]);

        Mail::send('email.verification', $data, function($message) use($data){
            $message->to($data['email'], $data['name']." ".$data['surname'])
                ->subject('Verify your email address');
        });
        return Redirect::route('login');
    }
    public function needverify(Request $rq){
        return view('auth.needverify');
    }
    public function confirm(Request $rq,$confirmationCode){
        if( ! $confirmationCode)
        {
            throw new \Exception('Wrong confirmation code');
        }

        $user = User::where('email_verification_token',$confirmationCode)->first();

        if ( ! $user){
            throw new \Exception('Wrong confirmation code');
        }

        $user->email_verified = 1;
        $user->email_verification_token = null;
        $user->save();

        return Redirect::route('login');
    }
    public function register(Request $request)
    {
        $validator = $this->validator($request->all())->validate();
        event(new Registered($user = $this->create($request->all())));
        if(!is_null($this->needVerification) && !$this->needVerification->is_set()){
            $ll = UserMeta::byUser($user)->where('meta_name','=','last_login')->first();
            if(is_null($ll))$user->meta()->create(['meta_name'=>'last_login','meta_value'=>time()]); else $ll->update(['meta_value'=>time()]);
            $this->guard()->login($user);
        }
        return $this->registered($request, $user)
            ?: redirect($this->redirectPath());
    }
    protected function getIp(){
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
            if (array_key_exists($key, $_SERVER) === true){
                foreach (explode(',', $_SERVER[$key]) as $ip){
                    $ip = trim($ip); // just to be safe
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
                        return $ip;
                    }
                }
            }
        }
        return Request::ip();
    }
}
