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
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
class ExchangeController extends Controller
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
    public function exchange(Request $rq){
        $validator = Validator::make($request->all(), [
            "send.amount" => 'numeric|required',
            "send.currency" => 'required|exists',
            "name"=>'required',
            "surname"=>'required'
        ]);
        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }
        return redirect()->back();
    }

}
