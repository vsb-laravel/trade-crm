<?php

namespace Vsb\Crm\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\UserMeta;
use Illuminate\Support\Facades\Auth;

class AffiliateController extends Controller
{
    public function once(Request $rq,$uid){
        $onceLoginUserMeta = UserMeta::where('meta_name','once_login_link')->where('meta_value',$uid)->first();
        if(!is_null($onceLoginUserMeta)){
            $user = $onceLoginUserMeta->user;
            Auth::login($user);
            // $onceLoginUserMeta->delete();
            return redirect()->route('trader');
        }
        return back();
    }
}
