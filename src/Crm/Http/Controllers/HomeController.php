<?php

namespace Vsb\Crm\Http\Controllers;

use Log;
use Response;
use Illuminate\Http\Request;
use App\Account;
use App\User;
use App\UserDocument;
use App\Currency;
use App\Mail\SupportRequest;
use App\Mail\ApplyDemoRequest;
use App\Mail\TestMails;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Detection\MobileDetect;
class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
        // $this->middleware('online');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $rq){
        $detect = new MobileDetect;
        // Log::debug('Detect: ['.($detect->isMobile()?'mobile':'browser').']'.json_encode($detect->getHttpHeaders()) );
        $user=[];
        $accounts=[];
        $user_count=500;
        // if ( $detect->isMobile() || $detect->isTablet() ) {
        //     return view('mobile.welcome',["user"=>$user,"accounts"=>$accounts,'currencies'=>Currency::all(),'online'=>rand($user_count,$user_count*3)]);
        // }
        if(Auth::guest()) return view('welcome');
        else {//return view('app.guest');
            $userAuth = $rq->user();
            $user = User::with(['meta','country','manager','accounts','deal'])->find(Auth::id())->toArray();
            foreach($user["meta"] as $meta){
                if($meta["meta_name"] == "country") $user["country"] = $meta["meta_value"];
                if($meta["meta_name"] == "address") $user["address"] = json_decode($meta["meta_value"],true);
                if($meta["meta_name"] == "passport") $user["passport"] = json_decode($meta["meta_value"],true);
                if($meta["meta_name"] == "birthday") $user["birthday"] = $meta["meta_value"];
            }

            $user["documents"] = UserDocument::where('user_id',Auth::id())->get()->toArray();
            $user = json_decode(json_encode($user));
            $user_count = User::all()->count();
            $accounts = Account::where('user_id',Auth::id())->get();
        }
        return view('layouts.home',["user"=>$user,"accounts"=>$accounts,'currencies'=>Currency::all(),'online'=>rand($user_count,$user_count*3)]);
    }
    public function fastlogin(Request $rq,$id){
        $s = Auth::onceUsingId($id);
        if($s){
            $user = User::with(['meta','country','manager','accounts','deal'])->find($id)->toArray();
            foreach($user["meta"] as $meta){
                if($meta["meta_name"] == "country") $user["country"] = $meta["meta_value"];
                if($meta["meta_name"] == "address") $user["address"] = json_decode($meta["meta_value"],true);
                if($meta["meta_name"] == "passport") $user["passport"] = json_decode($meta["meta_value"],true);
                if($meta["meta_name"] == "birthday") $user["birthday"] = $meta["meta_value"];
            }
            $user["documents"] = UserDocument::where('user_id',$id)->get()->toArray();
            $user = json_decode(json_encode($user));
            $user_count = User::all()->count();
            $accounts = Account::where('user_id',$id)->get();
            return view('home',["user"=>$user,"accounts"=>$accounts,'currencies'=>Currency::all(),'online'=>rand($user_count,$user_count*3)]);
        }
        return back();
    }
    /**
     * Show the application page.
     *
     * @return \Illuminate\Http\Response
     */
    public function page(Request $rq,$page){
        $user_count = User::all()->count();
        return view('page.'.$page,['accounts'=>$rq->user()->accounts(),'online'=>rand($user_count,$user_count*3)]);
    }
    public function page2(Request $rq,$page){
        return view('page_home.'.$page,['subject'=>$page]);
    }
    public function mobile(Request $rq,$page){
        return view('mobile.page.'.$page);
    }
    public function support(Request $rq){
        $mail = [
            "from"=>$rq->input('from'),
            "country"=>$rq->input('country','no set'),
            "subject"=>$rq->input('subject','welcome'),
            "email"=>$rq->input('email'),
            "phone"=>$rq->input('phone'),
            "text"=>$rq->input('text'),
        ];
        $validator = Validator::make($mail, [
            'from' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:16'
        ]);
        if ($validator->fails()) {
            Log::debug('manual generate: '.json_encode($validator) );
            return Redirect::back()
                        ->withErrors($validator)
                        ->withInput();
        }
        $sp = new SupportRequest(json_decode(json_encode($mail)));
        Mail::send($sp);
        return back();
    }
    public function test(Request $rq){
        Mail::send(new TestMails());
        return back();
    }
    public function applydemo(Request $rq){
        $mail = [
            "name"=>$rq->input('name'),
            "surname"=>$rq->input('surname'),
            "email"=>$rq->input('email'),
            "phone"=>$rq->input('phone'),
            "country"=>$rq->input('country','not set'),
        ];
        $sp = new ApplyDemoRequest(json_decode(json_encode($mail)));
        Mail::send($sp);
        return back();
    }
    public function email(Request $rq, $template){
        $d = $rq->user()->toArray();
        $d['password']="[some password]";
        return view('email.'.$template,$d);
    }
}
