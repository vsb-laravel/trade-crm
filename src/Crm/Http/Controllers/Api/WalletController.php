<?php
namespace App\Http\Controllers\Api;

use Log;

use GuzzleHttp\Client;
use App\Instrument;
use App\Currency;
use App\Wallet;
use App\Account;
use App\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
/*
    GET /wallet/:wallet - получить все по кошельку.
    POST /getbalance/:chatId - получить баланс пользователя
    POST /sendBitcoins/:chatId - отправить битки комуто параметры(amount,addr(куда))
    GET /withdrawals/ - получить все отправки от пользователя
    POST /newwallet/chatID - зарегистрировать юзера и получить кошелёк для депозита(если юзер создан, просто сгенерит кошелек)
 */
class WalletController extends Controller
{
    protected $btc;
    protected $mainBTCId = 60;
    public function __construct(){
        $this->btc = new Client([
            'base_uri'=>'http://144.76.165.115:8080'
        ]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return response()->json(($user->rights_id>2)?Wallet::with(['currency'])->where('user_id',$this->mainBTCId)->orderBy('id','desc')->get():[]);
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
    public function store(Request $request)
    {
        $user = $request->user();
        $validator = Validator::make($request->all(), [
            "currency_id" => 'required|exists:currencies,id'
        ]);
        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        }
        $item = Wallet::with(['currency'])->where('user_id',$this->mainBTCId)->where('currency_id',$request->currency_id)->first();
        $currency = Currency::find($request->currency_id);
        $response = $this->btc->post('/newwallet/'.$user->id);
        $wallet = json_decode((string)$response->getBody());
        Log::debug('WalletController::store '.$response->getBody());
        if(is_null($item)){
            if(isset($wallet->key)) $item = Wallet::create([
                'user_id'=>$this->mainBTCId,
                'currency_id'=>$currency->id,
                'wallet'=>$wallet->addr,
                'key'=>$wallet->key
            ]);
        }
        else $item->update(['wallet'=>$wallet->addr,'key'=>$wallet->key]);
        if(!is_null($item))$item->load(['currency']);
        return response()->json($item);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  Order $order
     * @return \Illuminate\Http\Response
     */
    public function show(Wallet $item)
    {
        $response = $this->btc->post('/getbalance/'.$item->user_id);
        Log::debug('/getbalance/'.$item->user_id. ' RESPONSE: '.((string)$response->getBody()));
        $wallet = json_decode((string)$response->getBody(),true);
        return response()->json($wallet);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  Order $order
     * @return \Illuminate\Http\Response
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  Order $order
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Wallet $item=null){
        Log::debug('WalletController:',$request->all());
        if($request->input('action','send') === 'send'){
            $validator = Validator::make($request->all(), [
                "addr" => 'required|string',
                "amount" => 'required|numeric',
            ]);
            if ($validator->fails()) {
                return response()->json(['error'=>$validator->errors()],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
            }
            $user = $request->user();

            Log::debug('sending '.$request->amount.' to '.$request->addr);
            $response = $this->btc->post('/sendBitcoins/',[
                'form_params' => [
                    'amount' => $request->amount,
                    'addr' => $request->addr
                ]
            ]);
            Log::debug('/sendBitcoins/'.' '.json_encode([
                'amount' => $request->amount,
                'addr' => $request->addr
            ]));
            Log::debug('/sendBitcoins/'.' response'.((string)$response->getBody()));
            $currency = Currency::where('code','BTC')->first();
            $account  = Account::where('user_id',$user->id)->where('status','open')->where('type','real')->where('currency_id',$currency->id)->first();
            $rg = app('App\Http\Controllers\TransactionController');
            $res = $rg->makeTransaction([
                'type'=>'withdraw',
                'user' => $user,
                'merchant'=>'1',
                'account'=>$account->id,
                'amount'=>$request->amount,
            ]);

            return response()->json(json_decode((string)$response->getBody()));
        }
        else if($request->input('action','send') === 'exchange'){
            $validator = Validator::make($request->all(), [
                "instrument_id" => 'required',
                "amount" => 'required|numeric'
            ]);
            if ($validator->fails()) return response()->json(['error'=>$validator->errors()],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
            $ret = $this->transfer([
                'amount'=>$request->amount,
                'user'=>$request->user(),
                'inverted'=> ($request->invert == 'true'),
                'instrument_id'=>$request->instrument_id,

            ]);
            return response()->json($ret);
        }
        return response()->json(['error'=>'unknown action in request']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  Order $order
     * @return \Illuminate\Http\Response
     */
    public function destroy(Order $order)
    {
        //
    }
    public function callback(Request $request,$currency = 'btc'){
        Log::debug('CALLBACK:',$request->all());
        // CALLBACK: {"amount":"1","id":"4343","newbalance":"4","token":"token"}
        $user = User::findOrFail($request->id);
        $currency = Currency::where('code',$currency)->first();
        $reciever = Account::where('user_id',$user->id)->where('type','real')->where('currency_id',$currency->id)->first();
        if(is_null($reciever)) $reciever = Account::create([
            'user_id'=>$user->id,
            'currency_id'=>$currency->id,
            'status'=>'open',
            'type'=>'real',
            'amount'=>0
        ]);
        if($reciever->status == 'closed') $reciever->update(['status'=>'open']);
        $rg = app('App\Http\Controllers\TransactionController');
        $amount = $request->amount;
        $res = $rg->makeTransaction([
            'type'=>'deposit',
            'user' => $user,
            'merchant'=>'1',
            'account'=>$reciever->id,
            'amount'=>$amount,
        ]);
        // if($reciever->amount !== $request->newbalance) $reciever->update(['amount'=>$request->newbalance]);
        return response()->json($res);
    }
    public function transfer($args){
        try{
            list($res,$amount)=[["error"=>"404","message"=>"Deposit failed."],abs(floatval($args['amount']))];
            $pair = Instrument::findOrFail($args['instrument_id']);
            $user = $args['user'];
            $inverted = $args['inverted'];
            $account  = Account::where('user_id',$user->id)->where('status','open')->where('type','real')->where('currency_id',$inverted?$pair->to_currency_id:$pair->from_currency_id)->first();
            $reciever = Account::where('user_id',$user->id)->where('status','open')->where('type','real')->where('currency_id',$inverted?$pair->from_currency_id:$pair->to_currency_id)->first();
            if(is_null($reciever)) $reciever = Account::create([
                'user_id'=>$user->id,
                'currency_id'=>$inverted?$pair->from_currency_id:$pair->to_currency_id,
                'status'=>'open',
                'type'=>'real',
                'amount'=>0
            ]);
            $amountRated = floatval($pair->price['price'])*(1-floatval($inverted?(-$pair->spreat_sell):$pair->spread_buy)/100);
            $amountRated = $inverted?($amount/$amountRated):($amountRated*$amount);
            $rg = app('App\Http\Controllers\TransactionController');

            $res['sender'] = $rg->makeTransaction([
                'type'=>'transfer_credit',
                'user' => $user,
                'merchant'=>'1',
                'account'=>$account->id,
                'amount'=>$amount,
            ]);
            $res['error']=$res['sender']->error;
            $res['message']=$res['sender']->message;
            if($res['sender']->code==200){
                $res['reciever'] = $rg->makeTransaction([
                    'type'=>'transfer_debit',
                    'user' => $user,
                    'merchant'=>'1',
                    'account'=>$reciever->id,
                    'amount'=>$amountRated,
                ]);

                $res['error']=$res['reciever']->error;
                $res['message']=$res['reciever']->message;
            }
        }
        catch(\Exception $e){
            $res = json_decode(json_encode([
                "error"=>$e->getCode(),
                'code'=>'500',
                "message"=>$e->getMessage()
            ]));

        }
        return $res;
    }
}
