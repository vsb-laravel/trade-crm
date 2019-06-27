<?php

namespace Vsb\Crm\Http\Middleware;

use Log;
use Closure;
use PragmaRX\Google2FALaravel\Middleware as Google2FALaravelMiddleware;
use PragmaRX\Google2FALaravel\Support\Authenticator;

class Google2FA extends Google2FALaravelMiddleware
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
        if( is_null($user) ) return $next($request);
        if( !$user->google2fa ) return $next($request);
        if( in_array($request->route()->getName(),["logout","user.google2fa"]) ) return $next($request);
        $authenticator = app(Authenticator::class)->boot($request);
        $_g2fa = $request->input('__g2fa',false);
        Log::debug('Google2FA middleware <'.$user->title.'[google2fa='.$user->google2fa.']> <__g2fa='.$_g2fa.'>'.($authenticator->isAuthenticated()?'Authenticated':'No auth on google2fa'));
        if($_g2fa!=false){
            $google2fa = app('pragmarx.google2fa');
            $valid = $google2fa->verifyKey($user->google2fa_secret, $_g2fa);
            Log::debug('Google2FA middleware __g2fa validation = <'.$valid.'> '.($valid?'true':'false'));
            if(!$valid) return response()->json([
                "request"=>$request->all(),
                "error"=>0x2fa,
                "message"=>trans('crm.private.google2fa.wrong_otp')
            ],403,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE);
            $request->request->remove('__g2fa');
            return $next($request);
        }
        if ($authenticator->isAuthenticated()) {
            return $next($request);
        }
        return $authenticator->makeRequestOneTimePasswordResponse();
     }
}
