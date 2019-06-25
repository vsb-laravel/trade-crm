<?php

namespace App\Http\Controllers\Auth;

use Log;
use Request;
use Redirect;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request as HttpRequest;
use App\Option;
use App\UserMeta;
use App\UserHistory;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers{
        logout as performLogout;
    }
    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    // protected $redirectTo = '/lk';
    // protected $redirectAfterLogout = 'http://cryptogriff.com';
    public function logout(HttpRequest $request){
        $this->performLogout($request);
        // return redirect()->away('http://cryptocx.net');
        return redirect('/');
    }
    /**
     * The user has been authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function authenticated(HttpRequest $request, $user)
    {

        if($user->rights_id == 0){
            $this->performLogout($request);
            return Redirect::back()->withInput()->withErrors(['verification'=>'Your login are banned']);
        }
        if( $user->rights_id!=3 && $user->rights_id>2 && $user->rights_id<20 && preg_match('/:\/\/trade\./i',Request::url()) ) {
            $this->performLogout($request);
            return redirect()->route('crm');
        }
        else if($user->rights_id==1 && preg_match('/:\/\/crm\./i',Request::url()) ) {
            $this->performLogout($request);
            return redirect()->route('trade');
        }
        if($user->rights_id>2 &&$user->rights_id<9) {
            $can = true;
            $canoption = Option::where('name','can_use_crm')->first();

            $can = (!is_null($canoption) && $canoption->value!=1 )?false:true;
            if(!$can) {
                $this->performLogout($request);
                return Redirect::back()->withInput()->withErrors(['verification'=>'Your system lincese is expired']);
            }
        }else{
            if($user->email_verified != 1){
                $this->performLogout($request);
                return Redirect::back()->withInput()->withErrors(['verification'=>'Email should be verified']);
            }
        }
        $rip = $this->getIp();
        UserHistory::create(['user_id'=>$user->id,
            'type'=>'login',
            'description'=>'Login at '.date('Y-m-d H:i:s').' from '.$rip ]);
        $ll = UserMeta::byUser($user)->where('meta_name','=','last_login')->first();
        if(is_null($ll))$user->meta()->create(['meta_name'=>'last_login','meta_value'=>time()]); else $ll->update(['meta_value'=>time()]);
        $li = UserMeta::byUser($user)->where('meta_name','=','last_login_ip')->first();
        if(is_null($li))$user->meta()->create(['meta_name'=>'last_login_ip','meta_value'=>$rip]);else $li->update(['meta_value'=>$rip]);
    }
    protected function redirectTo(){
        $user = Auth::user();
        if($user->rights_id>1) {
            $can = true;
            $canoption = Option::where('name','can_use_crm')->first();
            $can = (!is_null($canoption) && !$canoption->is_set() )?false:true;

            return '/';
        }
        return '/';
    }

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }
    // public function signout(Request $rq){
    //     return redirect()->away('http://cryptogriff.com');
    // }
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
