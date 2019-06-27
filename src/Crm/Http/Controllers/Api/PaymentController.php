<?php

namespace Vsb\Crm\Http\Controllers\Api;
use Log;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Vsb\Crm\Model\User;
use Vsb\Crm\Model\Account;

class PaymentController extends Controller
{
    protected $trx;
    public function __construct(){
        $this->trx = new \App\Http\Controllers\TransactionController();
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            "account_id" => 'required|exists:accounts,id',
            "amount" => 'required',
            "type" => 'required|in:debit,credit,transfer_debit,transfer_credit',
            "from_account_id" => "exists:accounts,id"
        ]);
        if ($validator->fails()) {
            response()->json($validator->errors(), 422,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        }
        $user = null;
        if($request->has('from_account_id')) $user = User::find(Account::find($request->from_account_id)->user_id);
        else $user = User::find(Account::find($request->account_id)->user_id);
        $creditData = [
            'account'=>$request->account_id,
            'type'=>$request->type,
            'user' => $user,
            'merchant'=>'1',
            'amount'=>$request->amount,
        ];
        // return response()->json($creditData,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        $trx = $this->trx->makeTransaction($creditData,false);
        Log::debug('Out api payment',$creditData);
        return response()->json($trx,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
