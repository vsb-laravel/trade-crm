<?php

namespace Vsb\Crm\Http\Controllers;


use Illuminate\Http\Request;
use Vsb\Crm\Model\Account;
use Vsb\Crm\Model\User;
use Vsb\Crm\Model\Mail;
use Vsb\Crm\Model\Comment;
use Vsb\Crm\Model\Telephony;
use Vsb\Crm\Model\UserMeta;
use Vsb\Crm\Model\UserRights;
use Vsb\Crm\Model\UserStatus;
use Vsb\Crm\Model\UserDocument;
use Vsb\Crm\Model\UserHierarchy;
use Vsb\Crm\Model\UserHistory;
use Vsb\Crm\Model\Currency;
use Vsb\Crm\Model\Instrument;
use Vsb\Crm\Model\InstrumentGroup;
use Vsb\Crm\Model\Mailbox;
use Vsb\Crm\Model\Deal;
use Vsb\Crm\Model\Option;
use Vsb\Crm\Model\DealHistory;
use Vsb\Crm\Model\Withdrawal;
use Vsb\Crm\Model\Invoice;
use Vsb\Crm\Model\Transaction;
use Vsb\Crm\Model\Message;
use Vsb\Crm\Model\CustomerMail;
use Vsb\Crm\Model\CustomerMailHistory;
use Vsb\Crm\Model\UserTune;
use Vsb\Crm\Model\Task;
use Vsb\Crm\Model\Lead;
use Vsb\Crm\Model\Event;
use Vsb\Crm\Model\UserTunePrice;
use Vsb\Crm\Model\UserTuneHisto;

use App\Mail\TemplatedMails;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use cryptofx\DataArray;
use cryptofx\Export;

use Excel;
use App\Exports\CustomerExport;

// use App\Http\Controllers\Auth\RegisterController;

use Log;
use DB;
class UserController extends Controller{
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
    public static function getUser($rq,$id=false){
        $url = $rq->headers->get('referer');
        $user = null;
        if(preg_match('/user\/fastlogin\/(\d+)/i',$url,$m)){
            $id = $m[1];
        }
        if($id!==false){
            $user = User::find($id);
        }
        else if($rq->has('user_id')){
            $user = User::find($rq->user_id);
        }
        else $user = $rq->user();
        return $user;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $rq,$format,$id){
        if(Auth::guest())return route('home');
        $currentUser = $rq->user();
        $childs = $currentUser->childs;
        if($currentUser->rights_id<=1)return route('home');
        $user = User::with([
            'manager',
            'rights',
            'status',
            'country',
            'meta',
            'last_login',
            'last_ip',
            'kyc',
            'trades',
            'accounts'=>function($query) { $query->with(['currency']);},
            'transactions'=>function($query) { $query->with(['invoice','withdrawal','merchant','comments']); },
            'deal'=>function($query){ return $query->with(['instrument','status','account']);},
            'documents',
            'comments'=>function($query){return $query->with('author');}
        ]);
        if($currentUser->rights_id<8) $user->where(function($q)use($childs){ $q->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs); });
        $user = $user->where('id',$id)->first();
        if(is_null($user)) return response()->json(false,404,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        if($currentUser->rights_id<10 && $user->rights_id>=$currentUser->rights_id) return redirect()->back();

        // if( class_exists('\\App\\WindigoUser') && class_exists('\\App\\WindigoUserSettings')) $user->load('rang');
        $admincode = UserMeta::byUser($user)->meta('admincode')->first();
        $admincode = (is_null($admincode))?'':$admincode->meta_value;
        $totals = [
            "deposits"=>Transaction::where('merchant_id','!=',3)->where('user_id',$user->id)->where('code',200)->where('type','deposit')->sum('amount'),
            "bonus"=>Transaction::where('merchant_id',3)->where('user_id',$user->id)->sum('amount'),
            "withdraws"=>Withdrawal::where('user_id',$user->id)->sum('amount')
        ];
        $deals = Deal::with(['account'])->byUser($id);
        $ig = InstrumentGroup::find($user->pairgroup);
        if($ig->type == 'forex') $deals->where('status_id',10);
        $deals = $deals->get();
        list($pnl,$pnl_demo,$trading_volume,$trading_volume_demo,$sumProfit,$sumFee,$sumProfitDemo,$sumFeeDemo) = [0,0,0,0,0,0,0,0,0,0];
        foreach($deals as $deal){
            $trading_volume+=$deal->account->type=='demo'?0:floatval($deal->invested);
            $trading_volume_demo+=$deal->account->type=='demo'?floatval($deal->invested):0;
            $sumProfit+=$deal->account->type=='demo'?0:floatval($deal->profit);
            $sumProfitDemo+=$deal->account->type=='demo'?floatval($deal->profit):0;
            $sumFee+=$deal->account->type=='demo'?0:floatval($deal->fee);
            $sumFeeDemo+=$deal->account->type=='demo'?floatval($deal->fee):0;
        }
        $pnl = $sumProfit - $sumFee;
        $pnl_demo = $sumProfitDemo - $sumFeeDemo;
        $user->setAppends(['messages','title','pairgroup','balance','activity','campaign','office','ip']);
        return ($format=='json')
                ?response()->json($user,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)
                :view((in_array($user->rights_id,["1","3"]))?'crm.content.user.dashboard':'crm.content.option.admin',[
                    "user"=>$user,
                    "countries"=>self::$countries,
                    "deals"=>[],//Deal::byUser($id)->byStatus("open")->get(),
                    "pnl"=>$pnl,//(Deal::byUser($id)->byLive()->sum('profit') - Deal::byUser($id)->byLive()->sum('fee')),
                    "trading_volume"=>$trading_volume,//(Deal::byUser($id)->byLive()->sum('invested')),
                    "pnl_demo"=>$pnl_demo,//(Deal::byUser($id)->byDemo()->sum('profit') - Deal::byUser($id)->byDemo()->sum('fee')),
                    "trading_volume_demo"=>$trading_volume_demo,//(Deal::byUser($id)->byDemo()->sum('invested')),
                    "documents"=>UserDocument::byUser($user)->whereIn('status',['new','verified'])->orderBy('type')->get(),
                    "rights" => UserRights::byUser($rq->user())->get(),
                    "statuses" => UserStatus::all(),
                    "instruments" => Instrument::with(['from','to','source'])->get(),
                    "managers" => $currentUser->isSuperadmin()?User::where('rights_id','>','2')->get():User::whereIn('id',$currentUser->childs)->where('rights_id','>','2')->get(),
                    "affilates" => $currentUser->isSuperadmin()?User::where('rights_id','2')->get():User::whereIn('id',$currentUser->childs)->where('rights_id','2')->get(),
                    // "affilates" => User::where('rights_id','2')->get(),
                    "admincode"=>$admincode,
                    "tab"=>$rq->input("tab",($user->rights_id=="1")?'kyc':'messages'),
                    "totals"=>$totals,
                    'currencies'=>Currency::all(),
                    "telephony"=>Telephony::all()
                ]);
            ;
    }
    public function ulist(Request $rq,$format='json'){
        $perpage = $rq->input('per_page',15);
        $simple = $rq->input('_simple',false);
        $selectStr = 'distinct users.id,users.*';
        if(Auth::guest())return route('home');
        $user = $rq->user();
        if($user->rights_id<=1)return route('home');

        $res = ($simple===false)?User::with([
            'rights',
            'status',
            'documents',
            'accounts'=>function($query) { $query->with(['currency']);},
            'manager'=>function($q){$q->with(['meta']);},
            'meta',
            // 'last_login',
            // 'last_ip',
            'comments'=>function($query){return $query->with('author');},
            // 'country',
            'deposits',
            'affilate',
            // 'trades',
            'deal'=>function($query){ return $query->with(['instrument','status','account']);},
            'transactions'=>function($query) { $query->with(['invoice','withdrawal','merchant','comments']); },
            // 'deal'=>function($query){ return $query->with(['instrument','status','account']);},
            'lead'
        ]):User::with(['rights','status']);
        if($user->rights_id<8){
            $childs = $user->childs;
            $res->where(function($q)use($childs){
                $q->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);
            });

        }
        if($rq->input('search',"false")!=="false"){
            $se = $rq->input('search','%');

            if(preg_match('/^#(\d+)/',$se,$m))
            {
                $res->where('id',$m[1]);
            }
            else
            {
                $res->whereRaw("(CONCAT(users.name, ' ', users.surname) like '%" . $se . "%' or CONCAT(users.surname, ' ', users.name) like '%" . $se . "%' or users.name like '%".$se."%' or users.surname like '%".$se."%' or users.email like '%".$se."%' or users.phone like '%".$se."%' or users.id like '%".$se."%' or users.source like '%".$se."%')");
            }
        }
        if($rq->input('status_id',"false")!=="false") {
            $statuses = is_array($rq->status_id)?$rq->status_id:preg_split('/,/m',$rq->status_id);
            if(in_array(300,$statuses)) $res->where(function($q)use($statuses){$q->where("deposited",1)->orWhereIn('status_id',$statuses);});
            else $res->whereIn("status_id",$statuses);
        }
        if($rq->has('date_from')) {
            $res->whereRaw("created_at >= unix_timestamp('{$rq->date_from}')");
        }
        if($rq->has('date_to')) {
            $res->whereRaw("created_at <= unix_timestamp('{$rq->date_to}')+60*60*24");
        }
        if($rq->input('rights_id',"false")!=="false"){
            $rts = $rq->input('rights_id');
            $res=(is_array($rts))?$res->whereIn("rights_id",$rts):$res->where("rights_id",$rts);
        }
        if($rq->input('manager_id',"false")!=="false")$res=$res->where("parent_user_id",$rq->manager_id);
        if($rq->input('affilate_id',"false")!=="false")$res=$res->where("affilate_id",$rq->affilate_id);
        if($rq->input('parent_id',"false")!=="false"){
            $childs = User::find($rq->input('parent_id'))->childs;
            $res->where(function($q)use($childs){
                $q->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);
            });
        }
        if($rq->input('country',"false")!=="false") $res=$res->whereIn("id",UserMeta::where('meta_name','country')->where('meta_value',$rq->input("country"))->select('user_id')->get());
        if($rq->input('office',"false")!=="false") {
            $res=$res->where(function($q)use($rq){
                $office = UserMeta::where('meta_name','office')->where('meta_value',$rq->input("office"))->pluck('user_id');
                $q->whereIn("id",$office)
                    ->orWhereIn("parent_user_id",$office)
                    ->orWhereIn('affilate_id',$office);
            });
        }
        // if($rq->input('online',"false")=="1") $res=$res->whereIn("id",UserMeta::where('meta_name','last_login')->whereRaw('meta_value >= unix_timestamp(DATE_SUB(NOW(),INTERVAL 10 MINUTE))')->select('user_id')->get());
        if($rq->input('online',"false")=="1") {
            if($rq->has('ids') && !is_null($rq->ids) && !empty($rq->ids) ){
                $ids = preg_split('/\s*,\s*/',$rq->ids);
                if(is_array($ids)) $res->whereIn('id', $ids);
            }
            else $res->whereIn("id",UserMeta::where('meta_name','last_login')->whereRaw('meta_value >= unix_timestamp(DATE_SUB(NOW(),INTERVAL 10 MINUTE))')->select('user_id')->get());
        }
        if($rq->has('kyc')) $res=$res->whereIn("id",UserMeta::where('meta_name','kyc')->where('meta_value','>=',$rq->kyc)->pluck('user_id'));
        if($rq->input('assigner',"false")=="1"){
            $res->where('rights_id','>=','2');
            $perpage = 1024;
        }
        if($rq->input('admins',"false")=="1"){
            $res->whereIn('rights_id',[0,2,3,4,5,6,7,8,9,10,11,12,13,14]);
        }
        if($rq->input('my',"false")=="1")      $res=$res->where(function($query)use($user){$query->where('parent_user_id',$user->id)->orWhere('affilate_id',$user->id);});

        if($rq->input('comment',"false")=="1") {
            // $res->join('comments',function($join){
            $res->leftJoin(DB::raw("(select object_id,max(created_at) as created_at from comments where object_type='user' group by object_id) last_comment"),'last_comment.object_id','=','users.id')
                ->orderBy('last_comment.created_at','desc');
            $selectStr.=",last_comment.created_at as last_comment_created_at";
        }
        else if($rq->input('balance',"false")=="1") {
            $res->join('accounts as accounts_sort',function($join){
                $join->on('accounts_sort.user_id','=', 'users.id')->where('accounts_sort.type','real')->where('accounts_sort.status','open');
            })->orderBy('accounts_sort.amount','desc');
            $selectStr.=",accounts_sort.amount";
        }
        else if($rq->input('activity',"false")=="1") {
            $res->join('user_meta as activity',function($join){
                $join->on('activity.user_id','=', 'users.id')->where('activity.meta_name','last_login');
            })->orderBy('activity.updated_at','desc');
            $selectStr.=",activity.updated_at as activity_updated_at";
        }
        else if($rq->input('assigner',"false")=="1") $res->orderBy('rights_id','desc');
        else if(!($res instanceof Collection)) $res->orderBy('id','desc');

        ## Мой костыль для нужного формату в мой autocomplete
        if(!empty($rq->input('calendar'))) return response()->json($res->get()->toArray());
        if($rq->input('excel','false')=="1") {
            return Excel::download(new CustomerExport(($res instanceof Collection)?$res:$res->select(DB::raw('distinct users.id,users.*'))->get()), 'customers-'.$user->id.'-'.date('YmdHis').'.csv');
        }
        if($rq->input('export',false) == 'xlsx' )return Export::toExcel($res->select(DB::raw('distinct users.id,users.*'))->get());


        $ret = $res->select(DB::raw($selectStr))->paginate($perpage);
        return ($format=='json')
                ?response()->json($ret,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)
                :view('crm.content.user.list',["users"=>$res->paginate($perpage),
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

                    "leads"=>[],
                    // "counts"=>$aggre->get()
                ]);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(Request $rq,$format='json'){
        list($user,$data,$res,$code)=[$rq->user(),$rq->all(),false,200];
        try{
            if(!isset($data["affilate_id"]))$data["affilate_id"]=$rq->user()->id;
            $rg = app('App\Http\Controllers\Auth\RegisterController');
            $requester = $rq->user();
            if($requester->rights_id < $rq->input('rights_id',1)){
                throw new \Exception('No rights to assign that',500);
            }
            $res = $rg->create($data);
            if(isset($data['office'])){
                UserMeta::create([
                    'user_id'=>$res->id,
                    'meta_name'=>'office',
                    'meta_value'=>$data['office']
                ]);
            }
            if(isset($data['rights_id']) && $data['rights_id']>1){
                UserMeta::create([
                    'user_id'=>$res->id,
                    'meta_name'=>'admincode',
                    'meta_value'=>strtoupper(str_random(8))
                ]);
            }
        }
        catch(\Exception $e){
            $code = 500;
            $res = [
                "error"=>$e->getCode(),
                "message"=>$e->getMessage()
            ];
        }
        Auth::login($user, true);
        return response()->json($res,$code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $rq,$format='json',$id){
        list($res,$code)=[["error"=>"404","message"=>"User {$id} not found."],404];
        try{
            $requester = $rq->user();
            if($requester->rights_id < $rq->input('rights_id',1)){
                throw new \Exception('No rights to assign that');
            }
            $user = User::with(['manager','rights'])->find($id);
            $udata = $rq->all();
            if(isset($udata['rights_id']))$udata['rights_id']=($udata['rights_id']=='false' || $udata['rights_id']==false)?0:$udata['rights_id'];
            $password = trim($rq->input('password',''));
            unset($udata["password"]);
            if(isset($udata["affilate_id"])  && $user->affilate_id != $udata["affilate_id"]){
                if($udata['affilate_id']=="false") unset($udata['affilate_id']);
                else{
                    if($user->rights_id>1)unset($udata['affilate_id']);
                }
            }
            if(isset($udata["parent_user_id"]) && $user->parent_user_id != $udata["parent_user_id"]){
                if($udata['parent_user_id']=="false") unset($udata['parent_user_id']);
                else{
                    $admin = User::find($udata['parent_user_id']);
                    // dd($user->affilate);
                    if(!is_null($user->affilate) && !is_null($admin) && $user->rights_id>1 && $admin->rights_id<$user->rights_id){
                        unset($udata['parent_user_id']);

                    }
                    else if(!is_null($user->affilate) && $user->affilate->rights_id!=2 && !is_null($admin)) $udata['affilate_id'] = $admin->affilate_id;
                    // $admin = User::find($udata['parent_user_id']);
                    // if(is_null($admin) || $admin->rights_id<2 || $admin->rights_id<$user->rights_id)unset($udata['parent_user_id']);
                    // if(!is_null($admin) && $user->rights_id>1 && $admin->rights_id>$user->rights_id)unset($udata['parent_user_id']);
                    // if(!is_null($admin) && in_array($admin->id,$user->getChilds()))unset($udata['parent_user_id']);
                }
            }
            if(strlen($password) && !empty($password)){
                if(isset($udata["new_password"]) && $udata["new_password_confirm"] && ($udata["new_password"]==$udata["new_password_confirm"]) ){
                    $udata["password"]=bcrypt($udata["new_password"]);
                    $udata['secret']=encrypt(isset($udata['secret'])?$udata['secret']:$udata['new_password']);
                }
                else{
                    $udata["password"]=bcrypt($password);
                    $udata['secret']=encrypt(isset($udata['secret'])?$udata['secret']:$password);
                }

            }
            if(isset($udata['rights_id']) && $udata['rights_id']>1){

                $ac =  UserMeta::byUser($user)->meta('admincode')->first();
                if(is_null($ac) || $ac == false)UserMeta::create([
                    'user_id'=>$user->id,
                    'meta_name'=>'admincode',
                    'meta_value'=>strtoupper(str_random(8))
                ]);
            }
            if(isset($udata['status_id'])) {
                if($udata['status_id'] == 300 )$user->update(['deposited'=>1]);
            }
            if(isset($udata['birthday'])) $this->setUserMeta($user,'birthday',$udata['birthday']);
            if(isset($udata['country'])) $this->setUserMeta($user,'country',$udata['country']);
            if(isset($udata['office'])) $this->setUserMeta($user,'office',$udata['office']);
            if(isset($udata['midname'])) $this->setUserMeta($user,'midname',$udata['midname']);
            if(isset($udata['city']) || isset($udata['address1']) || isset($udata['address2']) || isset($udata['zip']) ) {
                $um = $this->getUserMeta($user,'address','json');
                $address = json_decode($um->meta_value,true);
                $address['zip'] = isset($udata['zip'])?$udata['zip']:(isset($address['zip'])?$address['zip']:'');
                $address['city'] = isset($udata['city'])?$udata['city']:(isset($address['city'])?$address['city']:'');
                $address['address1'] = isset($udata['address1'])?$udata['address1']:(isset($address['address1'])?$address['address1']:'');
                $address['address2'] = isset($udata['address2'])?$udata['address2']:(isset($address['address2'])?$address['address2']:'');
                $um->meta_value = json_encode($address);
                $um->save();
            }
            if(isset($udata['passport']) || isset($udata['num_pasport']) || isset($udata['issued']) || isset($udata['until']) ) {
                $um = $this->getUserMeta($user,'passport','json');
                $address = json_decode($um->meta_value,true);
                $address['passport'] = isset($udata['passport'])?$udata['passport']:(isset($address['passport'])?$address['passport']:'');
                $address['num_pasport'] = isset($udata['num_pasport'])?$udata['num_pasport']:(isset($address['num_pasport'])?$address['num_pasport']:'');
                $address['issued'] = isset($udata['issued'])?$udata['issued']:(isset($address['issued'])?$address['issued']:'');
                $address['until'] = isset($udata['until'])?$udata['until']:(isset($address['until'])?$address['until']:'');
                $um->meta_value = json_encode($address);
                $um->save();
            }
            if(isset($udata['mail'])){
                if(empty(trim($udata['mail']['password'])) || strlen($udata['mail']['password']) == 0 ) unset($udata['mail']);
            }
            if($user->rights_id==1){
                if( isset($udata['parent_user_id']) && $user->parent_user_id!=$udata['parent_user_id']){
                    UserHistory::create([
                        'user_id'=>$user->id,
                        'type'=>'update',
                        'object_type'=>'manager',
                        'object_id'=>$udata['parent_user_id'],
                        'description'=>'New manager assigned by #'.$requester->id.' '.$requester->title
                    ]);
                }
                if(isset($udata['affilate_id']) && $user->affilate_id!=$udata['affilate_id']){
                    UserHistory::create([
                        'user_id'=>$user->id,
                        'type'=>'update',
                        'object_type'=>'affilate',
                        'object_id'=>$udata['affilate_id'],
                        'description'=>'New affilate assigned by #'.$requester->id.' '.$requester->title
                    ]);
                }
            }
            if($rq->has('old_password')){
                if(!Hash::check($rq->old_password,$user->password))throw new \Exception("Wrong password ",500);
                if($rq->input('new_password','-1') == "-1" )throw new \Exception("Set New Password",500);
                if($rq->input('new_password_confirm','-1') == "-1" )throw new \Exception("Set New Password confirmation",500);
                if($rq->input('new_password','-1') != $rq->input('new_password_confirm','-2'))throw new \Exception("Password confirm not match",500);
                $udata["password"]=bcrypt( $rq->new_password );
            }
            $user->update($udata);

            $res=$user;
            $code=200;
            // return $this->index($rq,$format,$user->id);
        }
        catch(\Exception $e){
            $code = 500;
            $res = [
                "error"=>$e->getCode(),
                "message"=>$e->getMessage(),
                "trace"=>$e->getTrace()
            ];
        }
        return response()->json($res,$code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $defaultAdminOption = Option::where('name','default_admin')->first();
        if(is_null($defaultAdminOption)){
            return response()->json([
                "error"=>"Set default admin in Setting to reassign customers"
            ],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        }
        $defaultAdmin = User::find($defaultAdminOption->value);
        try{
            Lead::where('client_id',$user->id)->delete();
            Task::where('user_id',$user->id)->delete();
            Event::where('user_id',$user->id)->delete();
            UserTune::where('user_id',$user->id)->delete();
            UserTuneHisto::where('user_id',$user->id)->delete();
            UserTunePrice::where('user_id',$user->id)->delete();
            Message::where('user_id',$user->id)->orWhere('author_id',$user->id)->orWhere('parent_id',$user->id)->delete();
            Withdrawal::where('user_id',$user->id)->delete();
            Invoice::where('user_id',$user->id)->delete();
            Transaction::whereIn('account_id',Account::where('user_id',$user->id)->pluck('id'))->orWhere('user_id',$user->id)->delete();
            CustomerMailHistory::where('user_id',$user->id)->delete();
            DealHistory::whereIn('deal_id',Deal::whereIn('account_id',Account::where('user_id',$user->id)->pluck('id'))->orWhere('user_id',$user->id)->pluck('id'))->delete();
            Deal::whereIn('account_id',Account::where('user_id',$user->id)->pluck('id'))->orWhere('user_id',$user->id)->delete();
            UserHistory::where('user_id',$user->id)->delete();
            UserHierarchy::where('user_id',$user->id)->delete();
            UserDocument::where('user_id',$user->id)->delete();
            UserMeta::where('user_id',$user->id)->delete();
            Comment::where('author_user_id',$user->id)->delete();
            Comment::where('object_id',$user->id)->where('object_type','user')->delete();
            Account::where('user_id',$user->id)->delete();
            Mailbox::where('client_id',$user->id)->orWhere('user_id',$user->id)->delete();
            User::where('parent_user_id',$user->id)->update(['parent_user_id'=>$defaultAdmin->id]);
            User::where('affilate_id',$user->id)->update(['affilate_id'=>$defaultAdmin->id]);
            // User::where('id',$user->id)->comments()->delete();
            User::where('id',$user->id)->delete();
        }
        catch(\Exception $e){
            return response()->json([
                "code"=>$e->getCode(),
                "error"=>"Operation not permited. [".$e->getMessage()."]",
                "description"=>$e->getTraceAsString()
            ],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        }
        return response()->json($user,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    /**
     * List of user rights
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function rights(Request $rq){
        return response()->json(UserRights::byUser($rq->user())->get(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function status(){
        return response()->json(UserStatus::all(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function useraccount(Request $rq){
        $user = User::find($rq->input("user_id"));
        $account = Account::with(['currency'])->where('user_id',$user->id)->get();
        return response()->json($account);
    }
    public function metaData(Request $rq){
        $user = User::find($rq->input("user_id"));
        $ud = [
            "meta_name" =>$rq->input("meta_name"),
            "meta_value" =>$rq->input("meta_value","false"),
            "user_id" => $user->id
        ];
        // $um = UserMeta::byUser($user)->where('meta_name',$ud["meta_name"])->first();
        $um = $user->meta()->where('meta_name',$ud["meta_name"])->first();
        // if( !is_null($ud["meta_value"]) && !empty($ud["meta_value"]) ){// && $ud["meta_value"]!==false){
        if( $ud["meta_value"]!=="false" ){
        // if( !is_null($ud["meta_value"]) ){
            if( is_null($um) )
                $um=UserMeta::create($ud);
            else {
                if( $ud["meta_value"] === '' )$um->delete();
                else  $um->update([
                    "meta_value"=>$ud["meta_value"]
                ]);
            }
        }
        $res = is_null($um)?[]:$um->toArray();
        $res['debug']=[
            "input"=>$ud,
            "first"=> (!is_null($ud["meta_value"]) && !empty($ud["meta_value"]))?"true":"false",
            "um_isnull"=> is_null($um)?"true":"false",
            "ud_val"=> ( $ud["meta_value"] === '' )?"true":"false",
        ];
        return response()->json($res);
    }
    public function offices(Request $rq){
        $childs = $rq->user()->childs;
        $res=["data"=>[]];$sel = UserMeta::where('meta_name','=','office')
            // ->whereIn('user_id',User::whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs)->pluck('id'))
            ->select('meta_value')->groupBy('meta_value')->get();
        foreach ($sel as $c) {
            $res["data"][]=[
                "id"=>$c->meta_value,
                "title"=>$c->meta_value
            ];
        }
        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function countries(Request $rq){
        return response()->json(self::$countries,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function documents(Request $rq,$format,$id){
        Log::debug('Documents  '.$id.' '.$rq->user()->id);
        $res = UserDocument::where('user_id',$rq->user()->id);
        if($id != $rq->user()->id){
            $childs = $rq->user()->childs;
            $res = UserDocument::where('user_id',$id)->where(function($query)use($childs){
                $query->whereIn('user_id',User::whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs)->pluck('id'));
            });
        }else Log::debug('Documents  getting own');
        return response()->json($res->get(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function hierarchy(Request $rq,$format,$id){
        return response()->json(UserHierarchy::with(['parent','user'])->byParent($id)->get(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function ban(Request $rq,$format,$id){
        $admin = $rq->user();
        $user = User::find($id);
        if(!is_null($user)){
            $firedRight = UserRight::where('name','fired');
            UserHistory::create(['user_id'=>$user->id,'type'=>'fired','object_id'=>$admin->id,'object_type'=>'user']);
        }
        return response()->json($user,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function history(Request $rq,$format,$id){
        $admin = $rq->user();
        $uh = UserHistory::with(['object'])
            ->where('user_id',$id)
            ->orderBy('id','desc');
        if($rq->input('search',false)!==false) {
            $se = trim($rq->search);
            if(preg_match('/^#(\d+)/',$se,$m)) $uh->where('user_id',$m[1]);
            else{
                $se = '%'.$se.'%';
                $uh->where(function($query)use($se){
                    $query->where('description','like',$se)
                        ->orWhere('user_id','like',$se);
                });
            }
        }
        if($rq->input('type',"false")!="false" && $rq->type != false) $uh->where('object_type',$rq->type);
        if($rq->input('date_from',"false")!="false") $uh->whereRaw("created_at >= unix_timestamp('{$rq->date_from}')");
        if($rq->input('date_to',"false")!="false") $uh->whereRaw("created_at <= unix_timestamp('{$rq->date_to}')");
        return response()->json($uh->paginate($rq->input("per_page",15)),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE);
    }
    public function controll(Request $rq,$id){
        $admin = $rq->user();
        $user = User::where('parent_user_id',$id)->update(['parent_user_id'=>null]);
        return $this->index($rq,"html",$id);
    }
    public function comment(Request $rq,$id){
        $author = $rq->user();
        $user = User::find($id);
        $comment = $rq->input('comment','');
        $res = (!strlen(trim($comment)) || empty($comment))
        ?[]
        :(strlen($comment) && !empty($comment))
            ?Comment::with(['author'])->create([
                'author_user_id'=>$author->id,
                'object_id'=>$user->id,
                'object_type'=>'user',
                'comment'=>$comment
            ])
            :[];
        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        // return $this->index($rq,"html",$id);
    }
    public function kycList(Request $rq,$format="html"){
        if(Auth::guest())return route('home');
        $user = $rq->user();
        if($user->rights_id<=1)return route('home');
        $res=UserDocument::with(['user'=>function($query){
            $query->with(['meta','country']);
        }])->where('status','new')
            ->where(function($query)use($user){if($user->rights_id<10)$query->whereIn('user_id',User::where('parent_user_id',$user->id)->select('id')->get())->orWhere('user_id',$user->id);})
            ->orderBy('id');
        return ($format=='json')
            ?response()->json($res->paginate(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)
            :view('crm.kyc.list',[]);
    }
    public function kycInfo(Request $rq,$id,$format="html"){
        $user = $rq->user();
        if($user->rights_id<=1)return route('home');
        $res = User::with(['manager','accounts','rights','country','status','comments'=>function($query){return $query->with('author');},'meta','last_login','last_ip','documents'])
            ->find($id);
        $user = $res->toArray();
        foreach($user["meta"] as $meta){
            if($meta["meta_name"] == "country") $user["country"] = $meta["meta_value"];
            if($meta["meta_name"] == "address") $user["address"] = json_decode($meta["meta_value"],true);
            if($meta["meta_name"] == "passport") $user["passport"] = json_decode($meta["meta_value"],true);
            if($meta["meta_name"] == "birthday") $user["birthday"] = $meta["meta_value"];
            if($meta["meta_name"] == "can_trade") $user["can_trade"] = $meta["meta_value"];
            if($meta["meta_name"] == "verified") $user["verified"] = $meta["meta_value"];
        }
        return
        ($format=='json')
            ?response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)
            :view('crm.kyc.dashboard',[
                    "user"=>json_decode(json_encode($user)),
                    "countries"=>self::$countries,
                    "deals"=>Deal::byUser($id)->byStatus("open")->get(),
                    "documents"=>UserDocument::byUser($res)->get(),
                    "rights" => UserRights::byUser($rq->user())->get(),
                    "statuses" => UserStatus::all(),
                    "managers" => User::byRights($rq->user())->where('rights_id','>',$res->rights_id)->get()

                ]);
            ;
    }
    public function kycUpdate(Request $rq, $id,$status){
        $ud = UserDocument::find($id);
        $ud->update(['status'=>$status]);
        if(UserDocument::where('user_id',$ud->user_id)->where('status','verified')->count('status') == UserDocument::where('user_id',$ud->user_id)->count('status')){
            $um = UserMeta::where("user_id",$ud->user_id)->where("meta_name","verified")->first();
            if(is_null($um))UserMeta::create([
                "user_id"=>$ud->user_id,
                "meta_name"=>"verified",
                "meta_value"=>"true"
            ]);
            else $um->update(["meta_value"=>"true"]);
        }
        return response()->json($ud,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function kycDelete(Request $rq, $id){
        $ud = UserDocument::find($id);
        Storage::delete($ud->file);
        $ud->delete();
        return response()->json($ud,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function upload(Request $rq,$id){
        $user = UserController::getUser($rq,$id);
        if($rq->hasFile('upload')){

            $type = $rq->input('type','other');
            $files = (!is_array($rq->file('upload')))?[$rq->file('upload')] : $rq->file('upload');
            foreach($files as $ff){
                $validator = Validator::make([
                        "file"=>$ff,
                        'extension'=>$ff->getClientOriginalExtension()
                    ],
                    [
                        'file'          => 'required|file',
                        'extension'      => 'required|in:png,jpeg,gif,jpg',
                    ]
                );
                if($validator->validate()){
                    $file=$ff->store('kycs');
                    $extension = $ff->getClientOriginalExtension();
                    $ud = UserDocument::create([
                        'type'=>$type,
                        'user_id'=>$user->id,
                        'file'=>$file
                    ]);
                }
            }
            $user->events()->create(['type'=>'kyc','user_id'=>$user->id]);
            return response()->json($ud,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        }
        return response()->json(["error"=>"No file to upload","post"=>$rq->input('upload')],200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function online(Request $rq){
        $user = $rq->user();
        $childs = $user->childs;
        $res = User::whereIn("id",UserMeta::where('meta_name','last_login')->whereRaw('meta_value >= unix_timestamp(DATE_SUB(NOW(),INTERVAL 8 MINUTE))')->select('user_id')->get());
        if($user->rights_id<10)$res->where(function($uq)use($childs){
                $uq->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);
            });
        if($rq->has('admins')){
            $res->where('rights_id','>',1);
        }
        else $res->where('rights_id',1);
        $res = $res->get();
        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    protected function getUserMeta(User $user,$name,$type='string'){
        $um =  UserMeta::byUser($user)->meta($name)->first();
        if(is_null($um) || $um == false){
            $val = '';
            switch($type){
                case 'json':$val='{}';break;
            }
            $um=UserMeta::create([
                'user_id'=>$user->id,
                'meta_name'=>$name,
                'meta_value'=>$val
            ]);
        }
        return $um;
    }
    protected function setUserMeta(User $user,$name,$value){
        $um =  UserMeta::byUser($user)->meta($name)->first();
        if(is_null($um) || $um == false)UserMeta::create([
            'user_id'=>$user->id,
            'meta_name'=>$name,
            'meta_value'=>$value
        ]);
        else $um->update(['meta_value'=>$value]);
    }
    public function recurse(Request $rq){
        $user = User::find($rq->id);
        return response()->json($user->childs);
    }
    public function checkUserChild(Request $request,$id){
        $ret = [
            "subscribe"=>false
        ];
        $user = $request->user();
        if($user->isSuperadmin())$ret["subscribe"]=true;
        else {
            $child = User::where('id',$id)->where(function($query)use($user){
                $childs = $user->childs;
                $query->whereIn('parent_user_id',$childs)
                    ->orWhereIn('affilate_id',$childs);
            })->first();
            $ret["subscribe"]=is_null($child);
        }
        return response()->json($ret);
    }
    public function google2fa(Request $request, $id){
        $user = User::find($id);
        $google2fa = app('pragmarx.google2fa');
        if(is_null($user->google2fa_secret)){
            $user->google2fa_secret = $google2fa->generateSecretKey();
            $user->save();
        }else {Log::debug('Use old data');}
        $QR_Image = $google2fa->getQRCodeInline(
            config('app.name'),
            $user->email,
            $user->google2fa_secret
        );
        // Pass the QR barcode image to our view
        return view('crm.google2fa.register', ['QR_Image' => $QR_Image, 'secret' => $user->google2fa_secret]);

    }
    public function google2faLogin(Request $request){
        return view('crm.google2fa.login');

    }
    public static $countries=[
        ["id"=>"Afghanistan","title"=>"Afghanistan"],
        ["id"=>"Albania","title"=>"Albania"],
        ["id"=>"Algeria","title"=>"Algeria"],
        ["id"=>"Andorra","title"=>"Andorra"],
        ["id"=>"Angola","title"=>"Angola"],
        ["id"=>"Anguilla","title"=>"Anguilla"],
        ["id"=>"Antarctica","title"=>"Antarctica"],
        ["id"=>"Antigua and/or Barbuda","title"=>"Antigua and/or Barbuda"],
        ["id"=>"Argentina","title"=>"Argentina"],
        ["id"=>"Armenia","title"=>"Armenia"],
        ["id"=>"Aruba","title"=>"Aruba"],
        ["id"=>"Australia","title"=>"Australia"],
        ["id"=>"Austria","title"=>"Austria"],
        ["id"=>"Azerbaijan","title"=>"Azerbaijan"],
        ["id"=>"Bahamas","title"=>"Bahamas"],
        ["id"=>"Bahrain","title"=>"Bahrain"],
        ["id"=>"Bangladesh","title"=>"Bangladesh"],
        ["id"=>"Barbados","title"=>"Barbados"],
        ["id"=>"Belarus","title"=>"Belarus"],
        ["id"=>"Belgium","title"=>"Belgium"],
        ["id"=>"Belize","title"=>"Belize"],
        ["id"=>"Benin","title"=>"Benin"],
        ["id"=>"Bermuda","title"=>"Bermuda"],
        ["id"=>"Bhutan","title"=>"Bhutan"],
        ["id"=>"Bolivia","title"=>"Bolivia"],
        ["id"=>"Bosnia and Herzegovina","title"=>"Bosnia and Herzegovina"],
        ["id"=>"Botswana","title"=>"Botswana"],
        ["id"=>"Brazil","title"=>"Brazil"],
        ["id"=>"British lndian Ocean Territory","title"=>"British lndian Ocean Territory"],
        ["id"=>"Brunei Darussalam","title"=>"Brunei Darussalam"],
        ["id"=>"Bulgaria","title"=>"Bulgaria"],
        ["id"=>"Burkina Faso","title"=>"Burkina Faso"],
        ["id"=>"Burundi","title"=>"Burundi"],
        ["id"=>"Cambodia","title"=>"Cambodia"],
        ["id"=>"Cameroon","title"=>"Cameroon"],
        ["id"=>"Canada","title"=>"Canada"],
        ["id"=>"Cape Verde","title"=>"Cape Verde"],
        ["id"=>"Cayman Islands","title"=>"Cayman Islands"],
        ["id"=>"Central African Republic","title"=>"Central African Republic"],
        ["id"=>"Chad","title"=>"Chad"],
        ["id"=>"Chile","title"=>"Chile"],
        ["id"=>"China","title"=>"China"],
        ["id"=>"Christmas Island","title"=>"Christmas Island"],
        ["id"=>"Cocos (Keeling) Islands","title"=>"Cocos (Keeling) Islands"],
        ["id"=>"Colombia","title"=>"Colombia"],
        ["id"=>"Comoros","title"=>"Comoros"],
        ["id"=>"Congo","title"=>"Congo"],
        ["id"=>"Congo (la Rép. dém. du) (ex-Zaïre)","title"=>"Congo (la Rép. dém. du) (ex-Zaïre)"],
        ["id"=>"Cook Islands","title"=>"Cook Islands"],
        ["id"=>"Costa Rica","title"=>"Costa Rica"],
        ["id"=>"Croatia (Hrvatska)","title"=>"Croatia (Hrvatska)"],
        ["id"=>"Cuba","title"=>"Cuba"],
        ["id"=>"Cyprus","title"=>"Cyprus"],
        ["id"=>"Czech Republic","title"=>"Czech Republic"],
        ["id"=>"Denmark","title"=>"Denmark"],
        ["id"=>"Djibouti","title"=>"Djibouti"],
        ["id"=>"Dominica","title"=>"Dominica"],
        ["id"=>"Dominican Republic","title"=>"Dominican Republic"],
        ["id"=>"East Timor","title"=>"East Timor"],
        ["id"=>"Ecuador","title"=>"Ecuador"],
        ["id"=>"Egypt","title"=>"Egypt"],
        ["id"=>"El Salvador","title"=>"El Salvador"],
        ["id"=>"Equatorial Guinea","title"=>"Equatorial Guinea"],
        ["id"=>"Eritrea","title"=>"Eritrea"],
        ["id"=>"Estonia","title"=>"Estonia"],
        ["id"=>"Ethiopia","title"=>"Ethiopia"],
        ["id"=>"Falkland Islands (Malvinas)","title"=>"Falkland Islands (Malvinas)"],
        ["id"=>"Faroe Islands","title"=>"Faroe Islands"],
        ["id"=>"Fiji","title"=>"Fiji"],
        ["id"=>"Finland","title"=>"Finland"],
        ["id"=>"France","title"=>"France"],
        ["id"=>"French Guiana","title"=>"French Guiana"],
        ["id"=>"French Polynesia","title"=>"French Polynesia"],
        ["id"=>"Gabon","title"=>"Gabon"],
        ["id"=>"Gambia","title"=>"Gambia"],
        ["id"=>"Georgia","title"=>"Georgia"],
        ["id"=>"Germany","title"=>"Germany"],
        ["id"=>"Ghana","title"=>"Ghana"],
        ["id"=>"Gibraltar","title"=>"Gibraltar"],
        ["id"=>"Greece","title"=>"Greece"],
        ["id"=>"Greenland","title"=>"Greenland"],
        ["id"=>"Grenada","title"=>"Grenada"],
        ["id"=>"Guadeloupe","title"=>"Guadeloupe"],
        ["id"=>"Guam","title"=>"Guam"],
        ["id"=>"Guatemala","title"=>"Guatemala"],
        ["id"=>"Guinea","title"=>"Guinea"],
        ["id"=>"Guinea-Bissau","title"=>"Guinea-Bissau"],
        ["id"=>"Guyana","title"=>"Guyana"],
        ["id"=>"Haiti","title"=>"Haiti"],
        ["id"=>"Honduras","title"=>"Honduras"],
        ["id"=>"Hong Kong","title"=>"Hong Kong"],
        ["id"=>"Hungary","title"=>"Hungary"],
        ["id"=>"Iceland","title"=>"Iceland"],
        ["id"=>"India","title"=>"India"],
        ["id"=>"Indonesia","title"=>"Indonesia"],
        ["id"=>"Iran (Islamic Republic of)","title"=>"Iran (Islamic Republic of)"],
        ["id"=>"Iraq","title"=>"Iraq"],
        ["id"=>"Ireland","title"=>"Ireland"],
        ["id"=>"Israel","title"=>"Israel"],
        ["id"=>"Italy","title"=>"Italy"],
        ["id"=>"Ivory Coast","title"=>"Ivory Coast"],
        ["id"=>"Jamaica","title"=>"Jamaica"],
        ["id"=>"Japan","title"=>"Japan"],
        ["id"=>"Jordan","title"=>"Jordan"],
        ["id"=>"Kazakhstan","title"=>"Kazakhstan"],
        ["id"=>"Kenya","title"=>"Kenya"],
        ["id"=>"Kiribati","title"=>"Kiribati"],
        ["id"=>"Korea","title"=>"Korea"],
        ["id"=>"Democratic People\'s Republic of","title"=>"Democratic People\'s Republic of"],
        ["id"=>" Republic of","title"=>" Republic of"],
        ["id"=>"Kuwait","title"=>"Kuwait"],
        ["id"=>"Kyrgyzstan","title"=>"Kyrgyzstan"],
        ["id"=>"Lao People\'s Democratic Republic","title"=>"Lao People\'s Democratic Republic"],
        ["id"=>"Latvia","title"=>"Latvia"],
        ["id"=>"Lebanon","title"=>"Lebanon"],
        ["id"=>"les Samoa américaines","title"=>"les Samoa américaines"],
        ["id"=>"Lesotho","title"=>"Lesotho"],
        ["id"=>"Liberia","title"=>"Liberia"],
        ["id"=>"Libyan Arab Jamahiriya","title"=>"Libyan Arab Jamahiriya"],
        ["id"=>"Liechtenstein","title"=>"Liechtenstein"],
        ["id"=>"Lithuania","title"=>"Lithuania"],
        ["id"=>"Luxembourg","title"=>"Luxembourg"],
        ["id"=>"Macau","title"=>"Macau"],
        ["id"=>"Macedonia","title"=>"Macedonia"],
        ["id"=>"Madagascar","title"=>"Madagascar"],
        ["id"=>"Malawi","title"=>"Malawi"],
        ["id"=>"Malaysia","title"=>"Malaysia"],
        ["id"=>"Maldives","title"=>"Maldives"],
        ["id"=>"Mali","title"=>"Mali"],
        ["id"=>"Malta","title"=>"Malta"],
        ["id"=>"Marshall Islands","title"=>"Marshall Islands"],
        ["id"=>"Martinique","title"=>"Martinique"],
        ["id"=>"Mauritania","title"=>"Mauritania"],
        ["id"=>"Mauritius","title"=>"Mauritius"],
        ["id"=>"Mayotte","title"=>"Mayotte"],
        ["id"=>"Mexico","title"=>"Mexico"],
        ["id"=>"Micronesia","title"=>"Micronesia"],
        ["id"=>" Federated States of","title"=>" Federated States of"],
        ["id"=>"Moldova","title"=>"Moldova"],
        ["id"=>" Republic of","title"=>" Republic of"],
        ["id"=>"Monaco","title"=>"Monaco"],
        ["id"=>"Mongolia","title"=>"Mongolia"],
        ["id"=>"Montserrat","title"=>"Montserrat"],
        ["id"=>"Morocco","title"=>"Morocco"],
        ["id"=>"Mozambique","title"=>"Mozambique"],
        ["id"=>"Myanmar","title"=>"Myanmar"],
        ["id"=>"Namibia","title"=>"Namibia"],
        ["id"=>"Nauru","title"=>"Nauru"],
        ["id"=>"Nepal","title"=>"Nepal"],
        ["id"=>"Netherlands","title"=>"Netherlands"],
        ["id"=>"Netherlands Antilles","title"=>"Netherlands Antilles"],
        ["id"=>"New Caledonia","title"=>"New Caledonia"],
        ["id"=>"New Caledonia","title"=>"New Caledonia"],
        ["id"=>"New Zealand","title"=>"New Zealand"],
        ["id"=>"Nicaragua","title"=>"Nicaragua"],
        ["id"=>"Niger","title"=>"Niger"],
        ["id"=>"Nigeria","title"=>"Nigeria"],
        ["id"=>"Niue","title"=>"Niue"],
        ["id"=>"Norfork Island","title"=>"Norfork Island"],
        ["id"=>"Northern Mariana Islands","title"=>"Northern Mariana Islands"],
        ["id"=>"Norway","title"=>"Norway"],
        ["id"=>"Oman","title"=>"Oman"],
        ["id"=>"Pakistan","title"=>"Pakistan"],
        ["id"=>"Palau","title"=>"Palau"],
        ["id"=>"Panama","title"=>"Panama"],
        ["id"=>"Papua New Guinea","title"=>"Papua New Guinea"],
        ["id"=>"Paraguay","title"=>"Paraguay"],
        ["id"=>"Peru","title"=>"Peru"],
        ["id"=>"Philippines","title"=>"Philippines"],
        ["id"=>"Pitcairn","title"=>"Pitcairn"],
        ["id"=>"Poland","title"=>"Poland"],
        ["id"=>"Portugal","title"=>"Portugal"],
        ["id"=>"Qatar","title"=>"Qatar"],
        ["id"=>"Reunion","title"=>"Reunion"],
        ["id"=>"Romania","title"=>"Romania"],
        ["id"=>"Russian Federation","title"=>"Russian Federation"],
        ["id"=>"Rwanda","title"=>"Rwanda"],
        ["id"=>"Saint Kitts and Nevis","title"=>"Saint Kitts and Nevis"],
        ["id"=>"Saint Lucia","title"=>"Saint Lucia"],
        ["id"=>"Saint Vincent and the Grenadines","title"=>"Saint Vincent and the Grenadines"],
        ["id"=>"Samoa","title"=>"Samoa"],
        ["id"=>"Samoa américaine","title"=>"Samoa américaine"],
        ["id"=>"San Marino","title"=>"San Marino"],
        ["id"=>"Sao Tome and Principe","title"=>"Sao Tome and Principe"],
        ["id"=>"Saudi Arabia","title"=>"Saudi Arabia"],
        ["id"=>"Senegal","title"=>"Senegal"],
        ["id"=>"Seychelles","title"=>"Seychelles"],
        ["id"=>"Sierra Leone","title"=>"Sierra Leone"],
        ["id"=>"Singapore","title"=>"Singapore"],
        ["id"=>"Slovakia","title"=>"Slovakia"],
        ["id"=>"Slovenia","title"=>"Slovenia"],
        ["id"=>"Solomon Islands","title"=>"Solomon Islands"],
        ["id"=>"Somalia","title"=>"Somalia"],
        ["id"=>"South Africa","title"=>"South Africa"],
        ["id"=>"Spain","title"=>"Spain"],
        ["id"=>"Sri Lanka","title"=>"Sri Lanka"],
        ["id"=>"St. Helena","title"=>"St. Helena"],
        ["id"=>"St. Pierre and Miquelon","title"=>"St. Pierre and Miquelon"],
        ["id"=>"Sudan","title"=>"Sudan"],
        ["id"=>"Suriname","title"=>"Suriname"],
        ["id"=>"Svalbarn and Jan Mayen Islands","title"=>"Svalbarn and Jan Mayen Islands"],
        ["id"=>"Swaziland","title"=>"Swaziland"],
        ["id"=>"Sweden","title"=>"Sweden"],
        ["id"=>"Switzerland","title"=>"Switzerland"],
        ["id"=>"Syrian Arab Republic","title"=>"Syrian Arab Republic"],
        ["id"=>"Taiwan","title"=>"Taiwan"],
        ["id"=>"Tajikistan","title"=>"Tajikistan"],
        ["id"=>"Tanzania","title"=>"Tanzania"],
        ["id"=>" United Republic of","title"=>" United Republic of"],
        ["id"=>"Thailand","title"=>"Thailand"],
        ["id"=>"Togo","title"=>"Togo"],
        ["id"=>"Tokelau","title"=>"Tokelau"],
        ["id"=>"Tonga","title"=>"Tonga"],
        ["id"=>"Trinidad and Tobago","title"=>"Trinidad and Tobago"],
        ["id"=>"Tunisia","title"=>"Tunisia"],
        ["id"=>"Turkey","title"=>"Turkey"],
        ["id"=>"Turkmenistan","title"=>"Turkmenistan"],
        ["id"=>"Turks and Caicos Islands","title"=>"Turks and Caicos Islands"],
        ["id"=>"Tuvalu","title"=>"Tuvalu"],
        ["id"=>"Uganda","title"=>"Uganda"],
        ["id"=>"Ukraine","title"=>"Ukraine"],
        ["id"=>"United Arab Emirates","title"=>"United Arab Emirates"],
        ["id"=>"United Kingdom","title"=>"United Kingdom"],
        ["id"=>"United States","title"=>"United States"],
        ["id"=>"URSS","title"=>"URSS"],
        ["id"=>"Uruguay","title"=>"Uruguay"],
        ["id"=>"Uzbekistan","title"=>"Uzbekistan"],
        ["id"=>"Vanuatu","title"=>"Vanuatu"],
        ["id"=>"Vatican City State","title"=>"Vatican City State"],
        ["id"=>"Venezuela","title"=>"Venezuela"],
        ["id"=>"Vietnam","title"=>"Vietnam"],
        ["id"=>"Virgin Islands (British)","title"=>"Virgin Islands (British)"],
        ["id"=>"Virgin Islands (U.S.)","title"=>"Virgin Islands (U.S.)"],
        ["id"=>"Wallis and Futuna Islands","title"=>"Wallis and Futuna Islands"],
        ["id"=>"Western Sahara","title"=>"Western Sahara"],
        ["id"=>"Yemen","title"=>"Yemen"],
        ["id"=>"Yugoslavia","title"=>"Yugoslavia"],
        ["id"=>"Zaire","title"=>"Zaire"],
        ["id"=>"Zambia","title"=>"Zambia"],
        ["id"=>"Zimbabwe","title"=>"Zimbabwe"],
        ["id"=>"Zone neutre","title"=>"Zone neutre"],
    ];
}
