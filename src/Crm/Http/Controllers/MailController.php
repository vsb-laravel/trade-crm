<?php

namespace Vsb\Crm\Http\Controllers;

use Illuminate\Http\Request;
use App\Account;
use App\User;
use App\CustomerMail;
use App\CustomerMailHistory;
use App\Comment;
use App\UserMeta;
use App\UserRights;
use App\UserStatus;
use App\UserDocument;
use App\UserHierarchy;
use App\UserHistory;
use App\Currency;
use App\Instrument;
use App\Deal;
use App\Mail\TemplatedMails;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

use cryptofx\DataArray;
// use App\Http\Controllers\Auth\RegisterController;
use Log;
use DB;
class MailController extends Controller{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(){
        $this->middleware('auth');
    }
    public function mail(Request $rq){
        $sender = $rq->user();
        $user = User::find($rq->input('user_id'));
        $mail = CustomerMail::find($rq->input('mail_id'));
        $text = $rq->input('text','');
        $resp = Mail::send( new TemplatedMails(json_decode(json_encode([
            "user"=>$user,
            "mail"=>$mail,
            "text"=>$text
        ]))));
        $user->mails()->create([
            'text'=>$text,
            'sender_id'=>$sender->id,
            'mail_id'=>$mail->id
        ]);
        return response()->json($resp,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function add(Request $rq){
        $mail = CustomerMail::create($rq->all());
        return response()->json($mail,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function lists(Request $rq){
        $q = CustomerMailHistory::with(['sender','user','mail'])->where('user_id',$rq->input('user_id','0'))->orderBy('id','desc')->limit(256)->get();
        return response()->json($q,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function index(Request $rq){
        return response()->json(CustomerMail::all(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function update(Request $rq,CustomerMail $mail){
        $mail->update($rq->all());
        return response()->json($mail,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function delete(Request $rq,CustomerMail $mail){
        $mail->delete();
        return response()->json($mail,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
}
