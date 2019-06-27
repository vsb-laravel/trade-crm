<?php

namespace Vsb\Crm\Http\Controllers\Partner_App;


use App\Http\Controllers\Controller;

use App\Http\Controllers\UserController;
use DB;
use Log;
use Illuminate\Http\Request;
use App\Account;
use App\User;
use App\UserMeta;
use App\UserRights;
use App\UserStatus;
use App\UserDocument;
use App\Currency;
use App\Instrument;
use App\Telephony;
use App\Deal;
use App\Event;
use App\Transaction;

use App\Option;
use App\Task;
use App\Message;

use App\Source;
use App\Lead;
use App\LeadStatus;
use App\LeadHistory;
use Illuminate\Support\Facades\Auth;

class PartnerController extends Controller
{
    public function index(Request $rq) {
        if(Auth::guest())return route('home');
        $user = $rq->user();
        if($user->rights_id<=1)return route('home');
        $childs = $user->childs;
        $aggre = DB::table('users')
            ->whereIn('users.id',$childs)
            ->join('user_rights','user_rights.id','users.rights_id')
            ->selectRaw("sum(case when user_rights.name = 'admin' then 1 else 0 end) as admin")
            ->selectRaw("sum(case when user_rights.name = 'admin' and users.updated_at>=unix_timestamp(DATE_SUB(NOW(),INTERVAL 1 DAY)) then 1 else 0 end) as admin_last")
            ->selectRaw("sum(case when user_rights.name = 'manager' then 1 else 0 end) as manager")
            ->selectRaw("sum(case when user_rights.name = 'manager' and users.updated_at>=unix_timestamp(DATE_SUB(NOW(),INTERVAL 1 DAY)) then 1 else 0 end) as manager_last")
            ->selectRaw("sum(case when user_rights.name = 'affilate' then 1 else 0 end) as affilate")
            ->selectRaw("sum(case when user_rights.name = 'affilate' and users.updated_at>=unix_timestamp(DATE_SUB(NOW(),INTERVAL 1 DAY)) then 1 else 0 end) as affilate_last")
            ->selectRaw("sum(case when user_rights.name = 'client' then 1 else 0 end) as client")
            ->selectRaw("sum(case when user_rights.name = 'client' and users.updated_at>=unix_timestamp(DATE_SUB(NOW(),INTERVAL 1 DAY)) then 1 else 0 end) as client_last")
            ->selectRaw("sum(case when user_rights.name = 'fired' then 1 else 0 end) as fired")
            ->selectRaw("sum(case when user_rights.name = 'fired' and users.updated_at>=unix_timestamp(DATE_SUB(NOW(),INTERVAL 1 DAY)) then 1 else 0 end) as fired_last")
            ;
        $admincode = UserMeta::byUser($user)->meta('admincode')->first();
        $admincode = (is_null($admincode))?'':$admincode->meta_value;

        $detect = new \Detection\MobileDetect;

        return view('partner_shop.home_partner',[
            "mobile"=>( $detect->isMobile() || $detect->isTablet() ),
            "user"=>User::with(['meta'])->find($user->id),
            "online_users"=>User::whereIn('id',$childs)->whereIn("id",UserMeta::where('meta_name','last_login')->whereRaw('meta_value >= unix_timestamp(DATE_SUB(NOW(),INTERVAL 10 MINUTE))')->select('user_id')->get())->get(),
            "users"=>User::where(function($q)use($childs){$q->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);})->where('rights_id',1)->get(),
            "leads"=>Lead::whereIn('affilate_id',$childs)->orWhereIn('manager_id',$childs)->get(),
            'kyc'=>UserDocument::whereIn('user_id',$childs)->where('status','new')->get(),
            'kyc_today'=>UserDocument::whereIn('user_id',$childs)->where('status','new')->whereDate('created_at',date('Y-m-d'))->get(),
            'currencies'=>Currency::all(),
            "instruments"=>Instrument::with(['to','from','source'])->get(),
            "deals"=>Deal::whereIn('user_id',$childs)->get(),
            "counts"=>$aggre->first(),
            "sources"=>Source::all(),
            "managers" => $user->isSuperadmin()
                ?User::with(['rights'])->where('rights_id','>','2')->get()
                :User::with(['rights'])->whereIn('id',$user->childs)->where('rights_id','>','2')->get(),
            "trades"=>Deal::with(['user'=>function($query){
                    $query->with(['manager']);
                },'currency','instrument'=>function($query){
                $query->with(['from','to']);
            },'status'])->get(),
            "admincode"=>$admincode,
            "pairs"=>Instrument::with(['from','to','history','source'])->get(),
            "rights"=>[
                "list"=>UserRights::byUser($rq->user())->get(),
                "admins"=>User::where("rights_id",7)->get(),
                "managers"=>User::where("rights_id",5)->get(),
                "selected"=>$rq->input('rights_id',false)
            ],
            "statuses"=>[
                "list"=>UserStatus::all(),
                "selected"=>$rq->input('status_id',false)
            ],
            "tasks"=>Task::where('user_id',$user->id)->whereRaw('start_date>=NOW() and start_date<=DATE_SUB(NOW(),INTERVAL -3 DAY)')->get(),
            "messages"=>Message::with(['author'=>function($q){$q->with('manager');},'manager','parent'])->where('status','new')->where(function($q)use($user){$q->where('author_id',$user->id)->orWhere('user_id',$user->id);})->get(),
            "events"=>Event::where('status','new')->limit(200)->get(),
            // "events"=>json_decode(json_encode([])),
            "counts"=>$aggre->get(),
            "countries"=>UserController::$countries,
            'statuses'=>[
                'user'=>UserStatus::all(),
                'lead'=>LeadStatus::all()
            ],
            "options"=>Option::all(),
            "telephony"=>Telephony::all()
        ]);
    }
}
//INSERT INTO `crmdiamands`.`options` (`id`, `created_at`, `updated_at`, `user_id`, `name`, `value`, `type`) VALUES (NULL, '1518169429', '1518169429', '1', 'show_email_2_affilate', '0', 'boolean');
