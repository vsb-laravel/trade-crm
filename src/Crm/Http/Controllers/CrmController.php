<?php

namespace Vsb\Crm\Http\Controllers;
use App\Http\Controllers\UserController;
use DB;
use Log;
use Request as RQ;
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
use Carbon\Carbon;

use App\Source;
use App\Lead;
use App\LeadStatus;
use App\LeadHistory;
use Illuminate\Support\Facades\Auth;

class CrmController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(['auth', '2fa','online']);
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $rq){
        if(Auth::guest())return route('home');
        $start = time();
        $ustart = microtime(true);
        $uid = str_random(8);
        Log::debug("{$uid}\t".'Load start IP:['.RQ::ip().'] at '.date('H:i:s.u',$start));
        $user = $rq->user();
        if($user->rights_id<=1)return route('home');
        $childs = $user->childs;
        $admincode = UserMeta::byUser($user)->meta('admincode')->first();
        $admincode = (is_null($admincode))?'':$admincode->meta_value;
        $detect = new \Detection\MobileDetect;
        Log::debug("{$uid}\t".'Load start view render at '.date('H:i:s.u'));
        Log::debug("{$uid}\t".(time()-$start));

        $listTasks = Task::select('tasks.user_id', 'tasks.object_id', 'tasks.start_date', 'tasks.object_type', 'tasks.title',
                                  'tasks.text', 'tasks.end_date',
                                   DB::raw('HOUR(DATE_SUB(tasks.start_date, INTERVAL 5 MINUTE)) as start_hour'),
                                   DB::raw('MINUTE(DATE_SUB(tasks.start_date, INTERVAL 5 MINUTE)) as start_minute'))
                         ->join('task_statuses', 'tasks.status_id', 'task_statuses.id')
                         ->whereIn('tasks.user_id', $childs)
                         ->whereIn('task_statuses.id', [1,3])
                         ->whereDate('tasks.start_date', '=', Carbon::now())
                         ->get()
                         ->toJson();
        // $childs = $user->childs;

        return view('crm.home',[
            "mobile"=>( $detect->isMobile() || $detect->isTablet() ),
            "users"=>User::where(function($q)use($childs){$q->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);})->where('rights_id',1)->get(),
            "leads"=>Lead::whereIn('affilate_id',$childs)->orWhereIn('manager_id',$childs)->get(),
            'currencies'=>Currency::all(),
            "instruments"=>Instrument::with(['to','from','source'])->where('enabled',1)->get(),
            // "deals"=>Deal::whereIn('user_id',$childs)->get(),
            "sources"=>Source::all(),
            "employees" => $user->isSuperadmin()
                ?User::with(['rights'])->where('rights_id','>','1')->get()
                :User::with(['rights'])->where('rights_id','>','1')->whereIn('id',$childs)->get(),
            "managers" => $user->isSuperadmin()
                ?User::with(['rights'])->where('rights_id','>','2')->get()
                :User::with(['rights'])->where('rights_id','>','2')->whereIn('id',$childs)->get(),
            "affilates" => $user->isSuperadmin()
                ?User::with(['rights'])->where('rights_id','2')->orWhere('id',$user->id)->get()
                :User::with(['rights'])->where('rights_id','2')->whereIn('id',$childs)->get(),
            "admincode"=>$admincode,
            "rights"=>[
                "list"=>UserRights::byUser($rq->user())->get(),
                "admins"=>User::where("rights_id",7)->get(),
                "managers"=>User::whereIn("rights_id",[4,5,6])->get(),
                "selected"=>$rq->input('rights_id',false)
            ],
            "tasks"=>Task::where('user_id',$user->id)->whereRaw('start_date>=NOW() and start_date<=DATE_SUB(NOW(),INTERVAL -3 DAY)')->get(),
            'listTasks' => $listTasks,
            "messages"=>Message::with(['author'=>function($q){$q->with('manager');},'manager','parent'])->where('status','new')->where(function($q)use($user){$q->where('author_id',$user->id)->orWhere('user_id',$user->id);})->get(),
            "events"=>Event::with([
                'object',
                'user'
            ])->where('status','new')->get(),
            "countries"=>UserController::$countries,
            'statuses'=>[
                'user'=>UserStatus::all(),
                'lead'=>LeadStatus::all()
            ],
            "options"=>Option::all(),
            "telephony"=>Telephony::all(),
            "_loaded_data_in"=>(microtime(true)-$ustart),
            "_load_stated_at"=>($ustart),
            "git_version"=>$this->getVersion(),
        ]);
    }
    public function affilates(Request $rq){

    }
    public function openuser(Request $rq,$id){

    }
    public function room(Request $rq){
        $res = '';
        $host = 'https://web.windigoarena.gg';
        try{
            $http = new \GuzzleHttp\Client([
                'verify' => false,
                'base_uri' => $host
            ]);
            $response = $http->get($host.'/php/crm_brana.php', [
                'form_params' => [
                    'print_karta_crm'=>5
                ],
            ]);
            $res = (string) $response->getBody();
            Log::debug('CrmController@room: '.$res);
        }
        catch(\Exception $e){}
        return $res;
    }
    public function getVersion(){
        $ret = "3.2";
        // Log::debug(shell_exec('pwd 2>&1'));
        $gitBranch = shell_exec('git -C .. branch -v | grep \* 2>&1');
        // Log::debug('gitBranch raw: <'.$gitBranch.'>');
        $gitBranch = preg_replace('/\s*\*\s*(\S+).+\r?\n?/i','$1',$gitBranch);
        // Log::debug('gitBranch: <'.$gitBranch.'>');
        $version = shell_exec('git -C .. rev-list --count '.$gitBranch.' 2>&1');
        // Log::debug('gitVersion raw: <'.$version.'>');
        $version = preg_replace('/\s*(\d+)\s*\r?\n?/','$1',$version);
        Log::debug('gitVersion: <'.$version.'>');
        return $ret.' b'.$version;
    }
}
//INSERT INTO `crmdiamands`.`options` (`id`, `created_at`, `updated_at`, `user_id`, `name`, `value`, `type`) VALUES (NULL, '1518169429', '1518169429', '1', 'show_email_2_affilate', '0', 'boolean');
