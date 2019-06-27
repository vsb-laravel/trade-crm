<?php

namespace Vsb\Crm\Http\Controllers;

use Response;
use Illuminate\Http\Request;
use App\Account;
use App\User;
use App\UserDocument;
use App\Currency;
use App\Instrument;
use App\Histo;
use App\Mail\SupportRequest;
use App\Mail\ApplyDemoRequest;
use App\Mail\TestMails;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Detection\MobileDetect;
class AngularController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('online');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function user(Request $rq){
        if(Auth::guest()) return response()->json([]);
        $user = User::with(['meta','country','manager','accounts','deal','documents'])->find(Auth::id());
        return response()->json($user,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function account(Request $rq){
        if(Auth::guest()) return response()->json([]);
        $accounts = Account::with(['currency'])->where('user_id',Auth::id())->orderBy('type')->get();
        return response()->json($accounts,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function prices(Request $rq){
        if(Auth::guest()) return response()->json([]);
        $pairs = Instrument::where('enabled',1)->get();
        $res = [];
        foreach($pairs as $pair){
            $row = $pair->toArray();
            $price= Histo::where('instrument_id',$pair->id)->orderBy('time','desc')->first();
            $row['price']=is_null($price)?null:$price->toArray();
            $res[]=$row;
        }

        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
}
