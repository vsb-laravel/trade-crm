<?php

namespace Vsb\Crm\Http\Controllers\Api;

use Log;
use App\Transaction;
use App\Merchant;
use App\User;
use App\UserHistory;
use App\Account;
use App\Currency;
use App\Option;
use cryptofx\payments\Exception as PayException;
use cryptofx\payments\Gateway;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TransactionController extends Controller
{
    public function __construct(){
        $this->trxContoller = new \App\Http\Controllers\TransactionController();
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // $user = $request->has('affilate_id')?$request->affilate_id:-1;
        $user = $request->user();
        $childs = $user->childs;
        $trx = Transaction::with(['user'])
            ->whereIn('user_id',User::where(function($query)use($childs){
                $query->whereIn('parent_user_id',$childs)
                    ->orWhereIn('affilate_id',$childs);
            })->pluck('id'));
            // ->whereIn('user_id',User::where('affilate_id',$user)->pluck('id'));
        $trx->where('code',200);
        $trx->where('type','deposit');
        $trx->whereIn('merchant_id',Merchant::where('enabled',1)->pluck('id'));
        // if($request->has('type'))$trx->where('type',$request->type);
        // if($request->has('success'))$trx->where('code',($request->success=="true" || $request->success=="1")?'=':'!=',200);
        if($request->has('date_from'))$trx->where('created_at','>=',intval($request->date_from));
        if($request->has('date_to'))$trx->where('created_at','<=',intval($request->date_to));
        $trx->orderBy('id','desc');
        $trx->limit($request->input('limit',100));
        //select * from `transactions` where `user_id` in (?, ?, ?, ?, ?) and `type` = ? and `code` = ? and `created_at` >= ? and `created_at` <= ? order by `id` desc
        // return response()->json(['hey'=>"we're in index"],200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        return response()->json($trx->get(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request){
        $res =['hey'=>"we're"];
        $code=200;
        try{
            $user = User::findOrFail($request->user_id);
            if($request->has('currency')){
                $currency = Currency::where('code',$request->currency)->first();
                $account = Account::where('user_id',$user->id)->where('type','real')->where('currency_id',$currency->id)->first();
            }
            else $account = Account::where('user_id',$user->id)->where('type','real')->first();
            $type = $request->has('type')?$request->type:'deposit';
            $merchant = Merchant::findOrFail($request->merchant_id);
            $amount = $request->amount;
            $trx = $this->trxContoller->createTransaction([
                    'type'=>$type,
                    'user' => $user,
                    'merchant'=>$merchant->id,
                    'account'=>$account->id,
                    'amount'=>$amount,
                ]);
            $args["user"] = $user;
            $args["order_id"]=$trx->id;
            $args["amount"]=$amount;
            $res = Gateway::sale($merchant->name,$args);
            $res["trx"]=[
                "id"=>$trx->id
            ];
            $user->history()->create(['user_id'=>$user->id,'type'=>$type,'object_id'=>$trx->id,'object_type'=>'transaction','description'=>'Make deposit' ]);
        }
        catch(\Exception $e){
            $code = 500;
            $res = json_decode(json_encode([
                "error"=>$e->getCode(),
                "message"=>$e->getMessage(),
                "code"=>$code
            ]));
        }
        return view('api.web',["page"=>$res['redirect']['form'].'<script>window.onload=function(){console.debug(document.getElementsByTagName("form"));document.getElementsByTagName("form")[0].submit();}</script>']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $res =['hey'=>"we're"];
        $code=200;
        // return response()->json($res,$code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        try{
            $user = User::findOrFail($request->user_id);
            if($request->has('currency')){
                $currency = Currency::where('code',$request->currency)->first();
                $account = Account::where('user_id',$user->id)->where('type','real')->where('currency_id',$currency->id)->first();
            }
            else $account = Account::where('user_id',$user->id)->where('type','real')->first();
            $type = $request->has('type')?$request->type:'deposit';
            $merchant = Merchant::findOrFail($request->merchant_id);
            $amount = $request->amount;
            $trx = $this->trxContoller->createTransaction([
                    'type'=>$type,
                    'user' => $user,
                    'merchant'=>$merchant->id,
                    'account'=>$account->id,
                    'amount'=>$amount,
                ]);
            $args["user"] = $user;
            $args["order_id"]=$trx->id;
            $args["amount"]=$amount;
            $res = Gateway::sale($merchant->name,$args,'array');
            $res["trx"]=[
                "id"=>$trx->id
            ];
            $user->history()->create(['user_id'=>$user->id,'type'=>$type,'object_id'=>$trx->id,'object_type'=>'transaction','description'=>'Make deposit' ]);
        }
        catch(\Exception $e){
            $code = 500;
            $res = json_decode(json_encode([
                "error"=>$e->getCode(),
                "message"=>$e->getMessage(),
                "code"=>$code
            ]));
        }
        return response()->json($res,$code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Transaction  $transaction
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Transaction $transaction)
    {
        Log::debug('TransactionController::show '.$transaction);
        try{
            $res = $transaction;//Transaction::findOrFail($transaction);
        }
        catch(\Exception $e){
            $code = 500;
            $res = json_decode(json_encode([
                "error"=>$e->getCode(),
                "message"=>$e->getMessage(),
                "code"=>$code,
            ]));
        }
        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Transaction  $transaction
     * @return \Illuminate\Http\Response
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Transaction  $transaction
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Transaction  $transaction
     * @return \Illuminate\Http\Response
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
