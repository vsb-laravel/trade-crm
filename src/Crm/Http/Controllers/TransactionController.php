<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;

use DB;
use Log;
use App\Transaction;
use App\Invoice;
use App\Withdrawal;
use App\Merchant;
use App\Instrument;
use App\Deal;
use App\Event;
use App\User;
use App\UserMeta;
use App\UserHistory;
use App\Account;
use App\Currency;
use App\Comment;
use App\Option;
use App\Price;
use App\Events\DepositEvent;
use cryptofx\DataArray;
use cryptofx\payments\gateway\PayBoutique;
use cryptofx\PayException;
use cryptofx\payments\Exception;
use cryptofx\payments\Gateway;
use Illuminate\Http\Request;

use App\Notifications\Withdrawal as WithdrawalNotification;

class TransactionController extends Controller{

    public function __construct(){
        // $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $rq, $format='json',$id=false){
        $user = UserController::getUser($rq);
        $res = Transaction::with([
                'account'=>function($query){
                    return $query->with([
                        'user'=>function($q){$q->with(['manager']);},
                        'currency'
                    ]);},
                'merchant',
                'invoice',
                'withdrawal',
                'comments'
            ])
            ->byId($id)
            ->whereIn('type',['withdraw','deposit'])
            ->where(function($query)use($user){
                if(is_object($user) && !is_null($user) && $user->rights_id<10) $query->whereIn('user_id',User::where('parent_user_id',$user->id)->select('id')->get())->orWhere('user_id',$user->id);
            })
            ->byType($rq->input('type',false))

            ->orderBy('id','desc');
        return response()->json($res->paginate($rq->input('per_page',15)),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function createTransaction($args=false){
        list($res,$amount)=[["error"=>"404","message"=>"Deposit failed."],abs(floatval($args['amount']))];
        $account = Account::findOrFail($args['account']);
        $merchant = Merchant::findOrFail($args['merchant']);
        $type = $args['type'];
        $uid = isset($args['uid'])?$args['uid']:('trx'.time().$account->id.$args['user']->id);
        if(!is_null(Transaction::where('uid',$uid)->first())) return null;
        $trx = Transaction::create([
                'type'=>$type,
                'user_id'=>$args["user"]->id,
                'account_id'=>$account->id,
                'amount'=>$amount,
                'merchant_id'=>$merchant->id,
                'code'=>'0',
                'uid'=>$uid
        ]);
        return $trx;
    }
    public function makeBalance(Account $account,$amount,$type,$merchant=null,$event=true){
        $account->amount=(in_array($type,['deposit','debit','transfer_debit','rollback','return']))?$account->amount+abs($amount):$account->amount-abs($amount);
        if($account->amount<0)throw new \Exception(trans('messages.not_enough_balance'),1);
        if( $type === 'deposit' )$account->user()->update(['deposited'=>1]);
        $account->save();
        if( $event && $type === 'deposit' ){
            $object = json_decode(json_encode([
                'amount'=>$amount,
                'account'=>$account->toArray(),
                'merchant'=>is_null($merchant)?[]:$merchant->toArray()
            ]));
            if(in_array($type,['deposit','debit','transfer_debit'])) event(new DepositEvent($object));
        }
    }
    public function makeTransaction($args=false,$event=true){
        try{
            list($res,$amount)=[["error"=>"404","message"=>"Deposit failed."],abs(floatval($args['amount']))];
            $account = Account::findOrFail($args['account']);
            $merchant = Merchant::findOrFail($args['merchant']);
            $type = $args['type'];
            $trx = null;
            if(isset($args['trx_id'])) $trx = Transaction::find($args['trx_id']);
            if(is_null($trx)) $trx = $this->createTransaction($args); else return false;
            if(!is_null($trx)) {
                $this->makeBalance($account,$amount,$type,$merchant,$event);
                $trx->update(["code"=>"200"]);
            }
            return $trx;
        }
        catch(\Exception $e){

            $res = json_decode(json_encode([
                "error"=>$e->getCode(),
                'code'=>'500',
                "message"=>$e->getMessage(),
                "trace"=>$e->getTrace()
            ]));
            Log::error('makeTransaction error: '.json_encode($res));
        }
        return $res;
    }
    public function rollback($args=false){
        $type = $args['type'];
        $account = Account::findOrFail($args['account']);
        $amount=abs(floatval($args['amount']));
        $this->makeBalance($account,$amount,'rollback');
    }
    public function deposit(Request $rq,$format='json'){
        $res = $this->makeTransaction([
            'type'=>'debit',
            'user' => $rq->user(),
            'merchant'=>$rq->input('merchant_id'),
            'account'=>$rq->input('account_id'),
            'amount'=>$rq->input('amount'),
        ]);
        return response()->json($res,$res->code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function makeWithdrawal(Request $rq){
        list($res,$code) = [[],200];
        // try{
            $hold_on_withdrawal = Option::where('name','hold_on_withdrawal')->first();

            $user = UserController::getUser($rq);
            $account = Account::where('user_id',$user->id)->where('type',$rq->input('type','real'))->first();
            $amount = $rq->input("amount");
            $method = $rq->input("method");
            $merchant = Merchant::find(2);
            $trxArgs = [
                    'type'=>'withdraw',
                    'user' => $rq->user(),
                    'merchant'=>$merchant->id,
                    'account'=>$account->id,
                    'amount'=>$amount,
                ];
            $trx = $this->makeTransaction($trxArgs);

            Log::debug('withdrawal makeTransaction: '.json_encode($trx));
            if($trx->code!="200")return response()->json($trx,$trx->code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
            if($hold_on_withdrawal->value==0 || $trx->code!="200"){
                $this->rollback($trxArgs);
            }
            if($trx->code!="200")return response()->json($trx,$trx->code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
            $res = Withdrawal::create([
                'status' => 'request',
                'user_id'=>$user->id,
                'account_id'=>$account->id,
                'amount'=>$amount,
                'transaction_id' => $trx->id
            ]);
            $user->notify(new WithdrawalNotification($user,$res));
            $res->events()->create(['type'=>'request','user_id'=>$user->id]);
        // }
        // catch(\Exception $e){
        //     $code = 500;
        //     $res = [
        //         "error"=>$e->getCode(),
        //         "message"=>$e->getMessage()
        //     ];
        // }
        UserHistory::create(['user_id'=>$user->id,'type'=>'withdrawal','object_id'=>$res->id,'object_type'=>'withdrawal','description'=>'Make withdrawal' ]);
        return response()->json($res,$code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function demodeposit(Request $rq){
        list($res,$code) = [[],200];
        try{
            $user = UserController::getUser($rq);
            $account = Account::where('user_id',$user->id)->where('type','demo')->first();
            $amount = 10000-floatval($account->amount);
            $res = $this->makeTransaction([
                'type'=>'debit',
                'user' => $user,
                'merchant'=>'1',
                'account'=>$account->id,
                'amount'=>$amount,
            ]);
        }
        catch(\Exception $e){
            $code = 500;
            $res = [
                "error"=>$e->getCode(),
                "message"=>$e->getMessage()
            ];
        }
        return response()->json($res,$code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function withdrawal(Request $rq,$format='json',$id=false){
        $user = UserController::getUser($rq);
        if(is_null($user)) return response()->json([],403,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        $childs = $user->childs;
        $res = Withdrawal::with(['comments','account'=>function($query){return $query->with(['user','currency']);},'merchant','manager'])
            ->byId($id)
            ->byUserId($rq->input("user_id",false))
            ->orderBy('id','desc');
        if($user->rights_id<8){
            $res->whereIn('user_id',User::where(function($uq)use($childs){
                    $uq->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);
                })->pluck('id'));
        }
        if($rq->input('status',"false")!=="false") $res->where('status',$rq->status);
        if($rq->input('date_from',"false")!=="false") $res->where('created_at','>=',strtotime($rq->date_from));
        if($rq->input('date_to',"false")!=="false") $res->where('created_at','<=',strtotime($rq->date_to));
        if($rq->input('manager_id',"false")!=="false"){
            $res->whereIn('user_id',User::where(function($uq)use($rq){
                    $uq->where('parent_user_id',$rq->manager_id);
                })->pluck('id'));
        }
        if($rq->input('affilate_id',"false")!=="false"){
            $res->whereIn('user_id',User::where(function($uq)use($rq){
                    $uq->where('affilate_id',$rq->affilate_id);
                })->pluck('id'));
        }
        if($rq->input('search',"false")!=="false"){
            $se = $rq->input('search','%');
            if(preg_match('/^#(\d+)/',$se,$m)){
                $res->where('user_id',$m[1]);
            }
            else {
                // $res->whereRaw("(users.name like '%".$se."%' or users.surname like '%".$se."%' or users.email like '%".$se."%' or users.phone like '%".$se."%' or users.id like '%".$se."%' or users.source like '%".$se."%')");
                ## У меня не видит почему то поле
                #Column not found: 1054 Unknown column 'users.sdsa' in 'where clause'
                #Поэтому я пока что бы не тратить время написал такой вариант.
                #
                $res->whereRaw(" user_id in (select id from users where users.name like '%".$se."%' or users.surname like '%".$se."%' or users.email like '%".$se."%' or
                                users.phone like '%".$se."%' or amount like '%{$se}%' or CONCAT(users.name, ' ', users.surname) like '%" . $se . "%'
                                or CONCAT(users.surname, ' ', users.name) like '%" . $se . "%'  or users.id like '%".$se."%')");
            }
        }
        return response()->json($res->paginate($rq->input('per_page',15)),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function balance(Request $rq,$format='json'){
        $user = UserController::getUser($rq);
        $res = DB::table('accounts')
            ->join('currencies','currencies.id','=','accounts.currency_id')
            ->join('users','users.id','=','accounts.user_id')
            ->leftJoin('users as manager','users.parent_user_id','=','manager.id')
            ->join('deals',function($join){
                $join->on('deals.account_id','=','accounts.id');
            })
            ->where('deals.status_id','=','10')
            ->where('accounts.type','demo')
            ->where(function($query)use($user){if($user->rights_id<10)$query->whereIn('accounts.user_id',User::where('parent_user_id',$user->id)->select('id')->get())->orWhere('accounts.user_id',$user->id);})
            // ->where('accounts.type','real')
            ->select(
                'users.id as id','users.name','users.surname','accounts.amount as balance','currencies.code as currency','manager.id as manager_id',
                DB::raw("concat(manager.name,' ',manager.surname) as manager,sum(deals.amount) as amounts,sum(deals.profit) as profit")
            )
            ->groupBy('users.id','users.name','users.surname','manager.id','manager.name','manager.surname','accounts.amount','currencies.code');
        if(false!==$rq->input('sort',false)){
            foreach($rq->input('sort') as $sort=>$asc) $res= $res->orderBy($sort,$asc);
        }
        // Log::debug($res->toSql());
        return response()->json($res->paginate($rq->input('per_page',15)),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);

        $res = User::with([
                'manager',
                'accounts'=>function($query){
                    return $query->with('currency');
                },
                'activedeals'
            ]);//->addSelect("(select sum(deals.amount) as deal from deals where user_id=users.id)");

        Log::debug($res->toSql());
        return response()->json($res->paginate($rq->input('per_page',15)),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        $res = [];
        $users= User::with(['manager'])->get();
        foreach($users as $user){
            $row = $user->toArray();
            $acc = Account::where('user_id','=',$user->id)->where('type','=','demo')->first();
            $row['currency'] = ($acc!=false && !is_null($acc))?Currency::find($acc->currency_id):['code'=>'USD'];
            $row['deal'] = Deal::where('user_id','=',$user->id)->sum('amount');
            $row['profit'] = Deal::where('user_id','=',$user->id)->sum('profit');
            $row['balance'] = Account::where('user_id','=',$user->id)->where('type','=','demo')->sum('amount');
            $res[]=$row;
        }
        $res = DataArray::sort($res,$rq->input('sort',false));
        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function invoicesForm(Request $rq){
        return view('crm.finance.list');
    }
    public function invoices(Request $rq){
        $user = UserController::getUser($rq);
        $res = Invoice::with([
            'merchant',
            'account'=>function($q){$q->with('currency');},
            'transaction',
            'user'=>function($q)use($rq,$user){
                $q->with(['manager','affilate']);
            }
        ]);
        if($user->rights_id<8){
            $childs = $user->childs;
            $res->whereIn('user_id',User::where(function($q2)use($childs){
                $q2->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);
            })->pluck('id'));
        }
        if($rq->has('search_id') && $rq->search_id!=''){
            $res->where('user_id',$rq->search_id);
        }
        if($rq->input('search',"false")!=="false"){
            $se = $rq->input('search','%');
            if(preg_match('/^#(\d+)/',$se,$m))$res->where('user_id',$m[1]);
            else $res->whereRaw("(transaction_id like '%{$se}%' or amount like '%{$se}%' or raw like '%{$se}%') or user_id like '%{$se}%' or user_id in (select id from users where email like '%{$se}%') or id like '%{$se}%'");
            // else $res->where(function($query)use($se){
            //     $query"(transaction_id like '%{$se}%' or amount like '%{$se}%' or raw like '%{$se}%')"
            // });
        }
        if($rq->has('merchant_id') && $rq->merchant_id!=='false')$res->where('merchant_id',$rq->merchant_id);
        if($rq->has('date_from') && $rq->date_from!=='false'){
            $dt = strtotime($rq->date_from);
            $dt = strtotime(date("Y-m-d 00:00:00",$dt));
            $res->where('created_at','>=',$dt);
        }
        if($rq->has('date_to') && $rq->date_to!=='false'){
            $dt = strtotime($rq->date_to);
            $dt = strtotime(date("Y-m-d 23:59:59",$dt));
            $res->where('created_at','<=',$dt);
        }
        if($rq->has('office') && $rq->office!=='false') $res->whereIn('user_id',User::where(function($q3)use($rq){
            $office = UserMeta::where('meta_name','office')->where('meta_value',$rq->office)->pluck('user_id');
            $q3->whereIn('parent_user_id',$office)->orWhereIn('affilate_id',$office);
        })->pluck('id'));
        if($rq->has('method') && $rq->method!=='false')$res->where('method',$rq->method);
        if($rq->has('affilate_id') && $rq->affilate_id!=='false')$res->whereIn('user_id',User::where('affilate_id',$rq->affilate_id)->pluck('id'));
        if($rq->has('bonus') && $rq->bonus=='1')$res->where('merchant_id',3);
        if($rq->has('notbonus') && $rq->notbonus=='1')$res->whereNotIn('merchant_id',[1,3])->whereRaw("transaction_id in (select id from transactions where type='deposit')");
        if($rq->has('success') && $rq->success=='1')$res->where('error',0);
        if($rq->has('manager_id') && $rq->manager_id!=='false'){
            $parent = User::find($rq->manager_id);
            if(!is_null($parent)){
                $childs = $parent->childs;
                $res->whereIn('user_id',User::where(function($q2)use($childs){
                    $q2->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);
                })->pluck('id'));
            }
        }
        if(false!==$rq->input('sort',false))foreach($rq->input('sort') as $sort=>$asc) $res->orderBy($sort,$asc); else $res= $res->orderBy('id','desc');
        Log::debug('TransactionController@invoices: '.$res->toSql());
        return response()->json($res->paginate($rq->input('per_page',15)),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function withdrawalUpdate(Request $rq,$format,$id,$status){
        $w = Withdrawal::find($id);
        $hold_on_withdrawal = Option::where('name','hold_on_withdrawal')->first();
        if(is_null($w)) return response()->json([
            "error"=>'-1',
            'code'=>'500',
            "message"=>"Withdrawal not found"
        ],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        // 'request','approved','declined'
        // $status = $rq->input('status',$w->status);
        $w->status = $status;

        if($hold_on_withdrawal->value==1){
            if($status == 'declined'){
                try{
                    $a = Account::find($w->account_id);
                    $this->makeBalance($a,$w->amount,'rollback');
                    // $a->update(['amount'=>$a->amount+abs($w->amount)]);
                }
                catch(\Exception $e){
                    return response()->json([
                        "error"=>$e->getCode(),
                        'code'=>'500',
                        "message"=>$e->getMessage()
                    ],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
                }
            }
        }
        else{
            if($status == 'approved'){
                try{
                    $a = Account::find($w->account_id);
                    $this->makeBalance($a,$w->amount,'withdrawal');
                    // $a->update(['amount'=>$a->amount-abs($w->amount)]);
                }
                catch(\Exception $e){
                    return response()->json([
                        "error"=>$e->getCode(),
                        'code'=>'500',
                        "message"=>$e->getMessage()
                    ],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
                }
            }
        }
        $w->save();
        if($rq->has('comment')){
            $user = $rq->user();
            $w->comments()->create(['author_user_id'=>$user->id,'comment'=>$rq->comment]);
            $trx = Transaction::find($w->transaction_id);
            if(!is_null($trx)) $trx->comments()->create(['author_user_id'=>$user->id,'comment'=>$rq->comment]);
        }
        return response()->json($w,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function makeDeposit(Request $rq){
        list($res,$code) = [[],200];
        try{
            $user = UserController::getUser($rq);
            // $user = ($rq->input('user_id',false)!=false)?User::find($rq->user_id):$rq->user();
            $account = //($rq->input('account_id',false)!=false)?Account::find($rq->account_id):
            Account::with(['currency'])->where('user_id',$user->id)->where('type','real')->first();
            $merchant = Merchant::where('name',$rq->merchant)->first();
            if(is_null($merchant)) $merchant = Merchant::find($rq->input("merchant_id",-1));
            $amount = $rq->input("amount");
            $trx = ($rq->input("order_id",false)==false)
                ?$this->createTransaction([
                    'type'=>'deposit',
                    'user' => $user,
                    'merchant'=>$merchant->id,
                    'account'=>$account->id,
                    'amount'=>$amount,
                ])
                :Transaction::find($rq->input("order_id"));
            $res = $trx;
            $trx->events()->create(['type'=>'request','user_id'=>$trx->user_id]);
            if($merchant->name=='payboutique'){
                $pb = new PayBoutique();
                $pbResponse = $pb->deposit([
                    "method" =>preg_replace('/\s*\(.+?\)/uim','',$rq->input('method','CreditCard')),
                    "amount"=>$amount,
                    "user"=>$user,
                    "account"=>$account
                ]);
                if(isset($pbResponse["RedirectURL"])) {
                    $i = Invoice::create([
                        'merchant_id'=>$merchant->id,
                        'transaction_id'=>$res->id,
                        'user_id'=>$user->id,
                        'account_id'=>$account->id,
                        'order_id'=>$pbResponse["OrderID"],
                        'reference_id'=>$pbResponse["ReferenceID"],
                        'amount'=>$amount,
                        'currency'=>$pbResponse["BuyerCurrency"],
                        'raw'=>json_encode($pbResponse)
                    ]);
                    $res = $pbResponse;
                }
            }
            else if($merchant->name=='megatransfer'){
                //RedirectURL
                $pb = new MegaTransfer();
                $pbResponse = $pb->deposit([
                    "amount"=>$amount,
                    "user"=>$user,
                    "account"=>$account,
                    "order_id"=>$res->id
                ]);
                if(isset($pbResponse["RedirectURL"])) {
                    $i = Invoice::create([
                        'merchant_id'=>$merchant->id,
                        'method'=>$rq->input('method','notset'),
                        'transaction_id'=>$res->id,
                        'user_id'=>$user->id,
                        'account_id'=>$account->id,
                        'order_id'=>$pbResponse["OrderID"],
                        'reference_id'=>$pbResponse["ReferenceID"],
                        'amount'=>$amount,
                        'currency'=>$pbResponse["BuyerCurrency"],
                        'raw'=>json_encode($pbResponse)
                    ]);
                    $res = $pbResponse;
                }
            }
            else if ($merchant->name=='paylane'){
                $args = $rq->all();
                $args["user"] = $user;

                $args["description"]=$res->id;
                $res = Gateway::sale($merchant->name,$args);
            }
            else if ($merchant->name=='bonus'){
                $trx->update(['code'=>200]);
                $this->makeBalance($account,$amount,'deposit');
            }
            else if ($merchant->name=='pbs'){
                $args = $rq->all();
                $args["user"] = $user;
                $args["order_id"]=$trx->id;
                $args["ip"]=$rq->ip();
                $res = Gateway::sale($merchant->name,$args);
                if(is_object($res)){
                    $i = Invoice::create([
                        'merchant_id'=>$trx->merchant_id,
                        'transaction_id'=>$trx->id,
                        'user_id'=>$trx->user_id,
                        'account_id'=>$trx->account_id,
                        'order_id'=>$res->tradeNo,
                        'reference_id'=>$res->tradeNo,
                        'amount'=>$trx->amount,
                        'currency'=>$account->currency->code,
                        'error'=>0,
                        'raw'=>json_encode($res)
                    ]);
                    $ret = [
                        "redirect"=>[
                            "url"=>($res->status==='success')?'/pay/pbs/success?'.$res->toUri():'/pay/pbs/fail'
                            // "url"=>'/pay/pbs/success?'.$res->toUri()
                        ]
                    ];
                    if($res->status==='success'){
                        $res = $ret;
                        $code = 200;
                        $trx->code = 200;
                        $i->error= 0;
                        $this->makeBalance($account,$trx->amount,'deposit');

                        $i->events()->create(['type'=>'success','user_id'=>$trx->user_id]);
                    }
                    else{
                        $trx->code = 500;
                        $i->error= 500;
                        $i->events()->create(['type'=>'failed','user_id'=>$trx->user_id]);
                    }
                    $trx->save();
                    $i->save();
                    $res = $ret;
                }
            }
            else if($merchant->name=='payeer'){
                $args = $rq->all();
                $args["user"] = $user;
                $args["order_id"]=$res->id;
                $args["amount"]=$amount;
                $res = Gateway::sale($merchant->name,$args);
                $i = Invoice::create([
                    'merchant_id'=>$trx->merchant_id,
                    'transaction_id'=>$trx->id,
                    'user_id'=>$trx->user_id,
                    'account_id'=>$trx->account_id,
                    'order_id'=>$trx->id,
                    'reference_id'=>$trx->id,
                    'amount'=>$amount,
                    'currency'=>$account->currency->code,
                    'raw'=>'{"status":"Payment request"}',
                    'error'=>504
                ]);
            }
            else {
                $args = $rq->all();
                $args["user"] = $user;
                $args["order_id"]=$res->id;
                $args["amount"]=$amount;
                $args["ip"]=$rq->ip();
                $res = Gateway::sale($merchant->name,$args);
                $raw = [
                    "status"=>"Payment request",
                ];
                if(isset($res['data']))$raw=array_merge($raw,$res['data']);
                $i = Invoice::create([
                    'merchant_id'=>$trx->merchant_id,
                    'transaction_id'=>$trx->id,
                    'user_id'=>$trx->user_id,
                    'account_id'=>$trx->account_id,
                    'order_id'=>$trx->id,
                    'reference_id'=>$trx->id,
                    'amount'=>$amount,
                    'currency'=>$account->currency->code,
                    'raw'=>json_encode($raw),
                    'error'=>504
                ]);
            }
            UserHistory::create(['user_id'=>$user->id,'type'=>'deposit','object_id'=>$trx->id,'object_type'=>'transaction','description'=>'Make deposit' ]);
        }
        catch(PayException $e){
            $code = 500;
            $res = json_decode(json_encode([
                "error"=>$e->getCode(),
                "message"=>$e->getMessage(),
                "code"=>500
            ]));
        }
        return response()->json($res,$code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function paySuccess(Request $rq,$merchant='payboutique'){
        $data = $rq->all();
        Log::debug("pay success data: ".json_encode($data));
        $trx = null;
        try{
            if($merchant=="paylane"){
                //status=PERFORMED&amount=200&currency=USD&description=CD1&hash=580629a5dec9012f182b62a263daf94b8f5ca0e8&id_sale=11131015
                //$i = Invoice::where("order_id",$data["merchant_order"])->first();
                $trx = Transaction::find($data['description']);
                $i = Invoice::create([
                    'merchant_id'=>$trx->merchant_id,
                    'transaction_id'=>$trx->id,
                    'user_id'=>$trx->user_id,
                    'account_id'=>$trx->account_id,
                    'order_id'=>$data["id_sale"],
                    'reference_id'=>$data["id_sale"],
                    'amount'=>$data["amount"],
                    'currency'=>$data["currency"],
                    'error'=>0,
                    'raw'=>json_encode($data)
                ]);

                switch($data['status']){
                    case 'PENDING':// – sale is waiting to be performed (in progress or not completed);'
                        break;
                    case 'PERFORMED':// – sale has been successfully performed;
                        $account = Account::findOrFail($i->account_id);

                        $this->makeBalance($account,$trx->amount,'deposit');
                        $trx->code=200;
                        $i->events()->create(['type'=>'success','user_id'=>$trx->user_id]);
                        break;
                    case 'CLEARED':// – sale has been cleared (confirmation from a bank was received);
                    case 'ERROR':// – sale unsuccessful.
                        $trx->code=500;
                        $i->events()->create(['type'=>'failed','user_id'=>$trx->user_id]);
                        break;
                }
                $trx->save();
            }
            else if($merchant=="netpay"){
                $res = Gateway::response($merchant,$data);
                Log::debug('Netpay response obj:'.$res->toJson());
                $trx = Transaction::find($res->orderId);
            }

        }
        catch(\Exception $e){
            Log::error($e);
            return redirect()->route('home')->with('failedPayment','payment');
        }
        if(!is_null($trx)){
            try{

                $user = User::find($trx->user_id);
                Log::debug('Sending deposit email of '.json_encode($trx));
                Log::debug('Sending deposit email of '.json_encode($user));
                Mail::send('email.deposit', ["user"=>$user], function($message) use($user){
                    $message->to('v.bushuev@gmail.com', $user->name." ".$user->surname)
                    // $message->to($user->email, $user->name." ".$user->surname)
                        ->subject('Success deposit');
                });
                $user->update(['deposited'=>1]);
            }
            catch(\RuntimeException $e){
                Log::error($e);
                Event::create(['object_type'=>'error','object_id'=>0,'user_id'=>$user->id,'type'=>'error']);
            }
            catch(\Exception $e){
                Log::error($e);
                Event::create(['object_type'=>'error','object_id'=>0,'user_id'=>$user->id,'type'=>'error']);
            }
        }
        return redirect()->route('home')->with('successPayment','payment');
    }
    public function payFail(Request $rq){
        $data = $rq->all();
        Log::debug("pay fail data: ".json_encode($data));
        try{
            $i = Invoice::where("order_id",$data["merchant_order"])->first();
            $raw = json_decode($i->raw,true);
            $raw["response"] = $data;
            $i->update(['raw'=>json_encode($raw),'error'=>1]);
            $i->events()->create(['type'=>'failed','user_id'=>$trx->user_id]);
        }
        catch(\Exception $e){

        }
        return redirect()->route('home')->with('failedPayment','payment');
    }
    public function payForm(Request $rq,$merchant){
        $user= user::find($rq->user_id);
        return view('app.form.'.$merchant,['user'=>$user,'amount'=>$rq->has('amount')?$rq->amount:false]);
    }
    public function payBack(Request $rq,$merchant='payboutique'){
        $resp = 'Ok';
        $data = $rq->all();
        Log::debug('pay postback data:',$data);
        switch($merchant){
            case 'payboutique':
                // $data = file_get_contents('php://input');//$rq->input('xml','<xml></xml>');
                $data = $rq->input('xml','<xml></xml>');
                $res = Gateway::response($merchant,$data);
                $i = Invoice::where('reference_id',$res->reference_id)->first();
                Log::debug('pay postback data[response]:'.$res->toJson());
                Log::debug('pay postback data[ivoice]:'.json_encode($i));
                if(!is_null($i)){
                    $trx = Transaction::find($i->transaction_id);
                    Log::debug('pay postback data[trx]:'.json_encode($trx));
                    if(!is_null($trx)){
                        $trxCode = 500;
                        $i->method = $res->method;
                        $raw = [];
                        try{
                            $raw = json_decode($i->raw,true);
                        }
                        catch(\Exception $e){
                            $raw['__data']=$i->raw;
                            Log::warn('Error in trx->raw: '.$i->raw);
                            Log::error($e);
                        }
                        $raw["postback"] = $data;
                        $i->raw = json_encode($raw);
                        if($res->success){
                            $amount = $res->merchantAmount;
                            $i->amount = $res->merchantAmount;
                            $i->currency = $res->merchantCurrency;

                            // $this->makeTransaction([
                            //     'trx_id'=>$trx->id,
                            //     'account'=>$trx->account_id,
                            //     'type'=>$trx->type,
                            //     'user' => User::find($trx->user_id),
                            //     'merchant'=>$trx->merchant_id,
                            //     'amount'=>-$amount,
                            // ]);

                            $account = Account::findOrFail($i->account_id);
                            if($i->error!=0){

                                $this->makeBalance($account,$amount,'deposit');
                                $i->error = 0;
                            }
                            $trxCode=200;
                            $i->events()->create(['type'=>'success','user_id'=>$trx->user_id]);
                        }
                        else{
                            $i->error = ($res->error=='declined')?'500':'403';
                            $i->events()->create(['type'=>'failed','user_id'=>$trx->user_id]);
                        }
                        $trx->update(['code'=>$trxCode]);
                        $i->save();
                    }

                }
            break;
            case 'netpay':
                $res = Gateway::response($merchant,$data);
                $trx = Transaction::find($res->orderId);
                Log::debug('Response: '.json_encode($res));
                if(!is_null($trx)){
                    $i = Invoice::create([
                        'merchant_id'=>$trx->merchant_id,
                        'transaction_id'=>$trx->id,
                        'user_id'=>$trx->user_id,
                        'account_id'=>$trx->account_id,
                        'order_id'=>$res->reference,
                        'reference_id'=>$res->reference,
                        'amount'=>$res->amount,
                        'currency'=>$res->currency,
                        'raw'=>json_encode($data)
                    ]);
                    if($res->success){
                        $account = Account::findOrFail($trx->account_id);
                        $this->makeBalance($account,$trx->amount,'deposit');
                        $trx->code=200;
                        $i->error=0;
                        $i->events()->create(['type'=>'success','user_id'=>$trx->user_id]);
                    }
                    else{
                        $trx->code=500;
                        $i->events()->create(['type'=>'failed','user_id'=>$trx->user_id]);
                    }
                    $i->save();
                    $trx->save();
                }
            break;
            default:
                $res = Gateway::response($merchant,$data);
                $resp = isset($res->answer)&($res->answer!==false)?$res->answer:$resp;
                $trx = Transaction::find($res->orderId);
                Log::debug('Response: '.$res->__toString());
                if(!is_null($trx)){
                    $i = Invoice::where('transaction_id', $trx->id)->first();
                    if(is_null($i))$i = Invoice::create([
                        'merchant_id'=>$trx->merchant_id,
                        'transaction_id'=>$trx->id,
                        'user_id'=>$trx->user_id,
                        'account_id'=>$trx->account_id,
                        'order_id'=>$res->reference,
                        'method'=>isset($resp['method'])?$resp['method']:'',
                        'reference_id'=>$res->reference,
                        'amount'=>$trx->amount,
                        'currency'=>$res->currency,
                        'raw'=>json_encode($data)
                    ]);
                    else $i->raw = json_encode($data);
                    if($res->success){
                        $account = Account::findOrFail($trx->account_id);
                        if($i->error!=0){ //payment request
                            $amount = ($res->amount!==false)?$res->amount:$i->amount;
                            $opt = Option::where('name','deposit_need_convertion')->first();
                            if(!is_null($opt) && $opt->is_set() and class_exists('\\App\\WindigoSettings')){
                                $ws = \App\WindigoSettings::find(1);
                                if(!is_null($ws) && !is_null($ws->val_int)) $amount = $ws->val_int*$mount;
                            }
                            if($res->currency!="USD"){
                                $usd = Currency::where('code','USD')->first();
                                $cur = Currency::where('code',$res->currency)->first();
                                if(is_null($cur))$amount=0;
                                else{
                                    $ex = Instrument::where('from_currency_id',$cur->id)->where('to_currency_id',$usd->id)->first();
                                    if(isset($ex->price['price'])){
                                        $new_amount = floatval($ex->price['price'])*$amount;
                                        Log::debug('Payment postback convertion ['.$cur->code.'/'.$usd->code.' - '.$ex->price['price'].']  amount = '.$amount.' => '.$new_amount);
                                        $amount = $new_amount;
                                        $i->amount = $amount;
                                        $trx->amount = $amount;

                                    }else $amount=0;
                                }

                            }
                            $this->makeBalance($account,$amount,'deposit');
                            $trx->code=200;
                            $i->events()->create(['type'=>'success','user_id'=>$trx->user_id]);
                            $i->error=0;
                        }
                    }
                    else{
                        $trx->code=500;
                        $i->error=500;
                        $i->events()->create(['type'=>'failed','user_id'=>$trx->user_id]);
                    }
                    $i->save();
                    $trx->save();
                }
            break;
        }

        return $resp;
    }
    public function payApprove(Request $rq,$merchant,$trxId){
        $user = $rq->user();
        Log::debug('pay manual approve');
        $merchant = Merchant::where('name',$merchant)->first();
        $transaction = Transaction::find($trxId);
        if(!is_null($transaction)){
            $amount = $rq->input('amount',$transaction->amount);
            $invoice = Invoice::where('transaction_id', $transaction->id)->first();
            if( is_null($invoice) ) $invoice = Invoice::create([
                'merchant_id'=>$transaction->merchant_id,
                'transaction_id'=>$transaction->id,
                'user_id'=>$transaction->user_id,
                'account_id'=>$transaction->account_id,
                'order_id'=>$res->reference,
                'method'=>isset($resp['method'])?$resp['method']:'',
                'reference_id'=>$res->reference,
                'amount'=>$amount,
                'currency'=>$res->currency,
                'raw'=>json_encode($data)
            ]);
            else $invoice->raw = json_encode([
                'reason'=>'manual',
                'user'=>'#'.$user->id.' '.$user->title,
                'ip'=>$user->ip,
                'time'=>date('Y-m-d H:i:s')
            ]);
            $invoice->amount = $amount;
            $transaction->amount = $amount;
            $account = Account::findOrFail($transaction->account_id);
            if($invoice->error!=0){ //payment request
                $amount = $amount;
                $this->makeBalance($account,$amount,'deposit');
                $transaction->code=200;
                $invoice->events()->create(['type'=>'success','user_id'=>$transaction->user_id]);
                $invoice->error=0;
            }
            $invoice->save();
            $transaction->save();
        }
        return response()->json([
            'success'=>true,
            'type'=>$transaction->type,
            'merchant'=>$merchant,
            'invoice'=>$invoice,
            'transaction'=>$transaction
        ],200,['Content-Type' => 'application/json; charset=utf-8'],JSON_PRETTY_PRINT);
    }
    public function merchants(Request $rq){
        return response()->json(Merchant::whereIn('enabled',(($rq->input('enabled',false)!=false)?preg_split('/,/m',$rq->enabled):['1']) )->get(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function merchantupdate(Request $rq,$format, Merchant $merchant){
        $data = $rq->all();
        $merchant->update($data);
        // only one default
        if(isset($data['default'])){
            if($data['default'] == '1'){
                Merchant::where('id','!=',$merchant->id)->update(['default'=>0]);
            }
            else {
                if(Merchant::where('default','1')->where('id','!=',$merchant->id)->count() == 0){
                    $def = Merchant::where('enabled','1')->first();
                    if(!is_null($def))$def->update(['default'=>'1']);
                    else  Merchant::where('enabled','0')->first()->update(['default'=>'1']);
                }
            }
        }
        if(Merchant::where('enabled','1')->count()==0){
            Merchant::where('enabled','0')->first()->update(['default'=>'1']);
        }
        // if(Merchant::where('default','1')->count()>1){
        //     Merchant::update(['default'=>'0']);
        // }
        return response()->json($merchant,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function addTransaction(Request $rq){
        $manager = $rq->user();
        if($manager->rights_id<7)return null;
        $trx = null;
        if($manager->rights_id<3)return response()->json(['message'=>'no access'],401,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        try{
            $this->checkRequiredFields($rq,['type','user_id','merchant_id','account_id','amount','currency']);
            $user = User::find($rq->user_id);
            if(is_null($user))throw new \Exception("no user id assigned");
            $trx = $this->makeTransaction([
                'type'=>$rq->type,
                'user' => $user,
                'merchant'=>$rq->merchant_id,
                'account'=>$rq->account_id,
                'amount'=>$rq->amount,
            ]);
            if(isset($trx->code) && $trx->code!=200){
                throw new \Exception('Error in transaction '.$trx->message);
            }
            UserHistory::create(['user_id'=>$user->id,
                'type'=>$rq->type,
                'object_id'=>$trx->id,
                'object_type'=>'transaction',
                'description'=>'Manual transaction by #'.$manager->id.' '.$manager->title
            ]);
            if($trx->code==200){
                $i = Invoice::create([
                    'merchant_id'=>$rq->merchant_id,
                    'transaction_id'=>$trx->id,
                    'user_id'=>$user->id,
                    'account_id'=>$rq->account_id,
                    'order_id'=>'manual_#'.$trx->id,
                    'reference_id'=>'manual_#'.$trx->id,
                    'amount'=>(($rq->type=='credit')?(-1):1)*$rq->amount,
                    'currency'=>$rq->currency,
                    'method'=>$rq->input("method","manual"),
                    'error'=>0,
                    'raw'=>json_encode($rq->all())
                ]);
                $user->update(['status_id'=>300,'deposited'=>1]);
                $i->events()->create(['type'=>'success','user_id'=>$user->id]);

            }
        }
        catch(\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'trace'=>$e->getTraceAsString()],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        }
        if(!is_null($trx)){
            UserHistory::create(['user_id'=>$manager->id,'type'=>$rq->input('type','notset'),'object_id'=>$trx->id, 'object_type'=>'transaction', 'description'=>json_encode($rq->all())]);
            $trx->load(['merchant','user']);
        }
        return response()->json($trx,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function usedComments(Request $rq){
        $q = DB::table('comments')->where('object_type',$rq->has('type')?$rq->type:'withdrawal')->where('comment','like','%'.($rq->has('search')?$rq->search:'').'%')->select(DB::raw('distinct comment as comment'));
        return response()->json($q->get(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    protected function checkRequiredFields(Request $rq,$needle){
        foreach($needle as $field) if($rq->input($field,false)==false)throw new \Exception("no {$field} assigned");
        return true;
    }
    public function destroy(Transaction $trx){
        $type = 'credit';
        if(!is_null($trx)){
            $invoice = null;
            $withdrawal = null;
            if($trx->type=='fee') return response()->json($trx,400);
            try{
                DB::beginTransaction();
                $invoice = Invoice::where('transaction_id',$trx->id)->first();
                $withdrawal = Withdrawal::where('transaction_id',$trx->id)->first();
                if(!in_array($trx->type,['deposit','debit','transfer_debit','rollback','return'])){
                    $type = 'debit';
                }
                $this->makeBalance($trx->account,$trx->amount,$type);
                Log::debug('destroy trx <'.(is_null($trx)?'null':$trx->id).'> <'.(is_null($invoice)?'null':$invoice->id).'> <'.(is_null($withdrawal)?'null':$withdrawal->id).'>');
                if(!is_null($invoice))$invoice->delete();
                if(!is_null($withdrawal))$withdrawal->delete();

                $trx->delete();
                DB::commit();
            }
            catch(\Exception $e){
                DB::rollback();
                return response()->json($e,500);
            }
        }
        $trx->load(['account']);
        return response()->json($trx);
    }
}
