<?php

namespace Vsb\Crm\Http\Middleware;

use Log;
use Closure;
use App\User;
use App\Option;
use App\UserMeta;
use App\UserHistory;
use Request;
use Illuminate\Support\Facades\Auth;

class UserOnline
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next){
        $user = $request->user();
        if ($user!=false && !is_null($user) && $user->rights_id < 10 ){
            $rip = $this->getIp();
            if($user->ip!=$rip)$user->ip=$rip;
            // $ll = UserMeta::byUser($user)->where('meta_name','=','last_login')->first();
            // if(is_null($ll))$user->meta()->create(['meta_name'=>'last_login','meta_value'=>time()]); else $ll->update(['meta_value'=>time()]);
            // $li = UserMeta::byUser($user)->where('meta_name','=','last_login_ip')->first();
            // if(is_null($li))$user->meta()->create(['meta_name'=>'last_login_ip','meta_value'=>$rip]);else $li->update(['meta_value'=>$rip]);

            $can = true;
            $canoption = Option::where('name','can_use_crm')->first();
            $can = (!is_null($canoption) && $canoption->value!=1 )?false:true;
            if(!$can && $user->rights_id>2){
                Auth::logout();
                return $next($request);
            }
            $allow = $user->meta()->where('meta_name','ip_allow')->select('meta_value')->first();
            $deny = $user->meta()->where('meta_name','ip_deny')->select('meta_value')->first();
            if(!is_null($deny)){
                foreach (preg_split('/,/',$deny->meta_value) as $ip) {
                    // Log::debug('UserOnline deny: '.$ip);
                    if($ip == $rip){
                        Log::warn('UserOnline #'.$user->id.' '.$user->title.' ['.$rip.'] deny from '.$ip);
                        UserHistory::create(['user_id'=>$user->id,'type'=>'login','description'=>'Login is denied by IP restricts for '.$rip ]);
                        Auth::logout();
                        return $next($request);
                    }
                }
            }

            if(!is_null($allow)){
                if( !in_array($rip,preg_split('/\s*,\s*/',$allow->meta_value)) && $rip != $_SERVER['SERVER_ADDR'] && $rip != env('DB_HOST','127.0.0.1')){
                    Log::debug('UserOnline #'.$user->id.' '.$user->title.' ['.$rip.'] allow only '.$allow->meta_value);
                    UserHistory::create(['user_id'=>$user->id,'type'=>'login','description'=>'Login is not allowed from  ['.$rip.'] allow only from ['.$allow->meta_value.'] ServerIP: '.$_SERVER['SERVER_ADDR'] ]);
                    Auth::logout();return $next($request);
                }
            }
        }

        return $next($request);
    }
    protected function getIp(){
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
            if (array_key_exists($key, $_SERVER) === true){
                foreach (explode(',', $_SERVER[$key]) as $ip){
                    $ip = trim($ip); // just to be safe
                    // Log::debug('OnlineUser middleware getting IP['.$key.' = '.$_SERVER[$key].']');
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
                        return $ip;
                    }
                }
            }
        }
        return Request::ip();
    }
}
