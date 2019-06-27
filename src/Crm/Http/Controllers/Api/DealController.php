<?php

namespace Vsb\Crm\Http\Controllers\Api;

use Log;
use Vsb\Crm\Model\Deal;
use Vsb\Crm\Model\Merchant;
use Vsb\Crm\Model\User;
use Vsb\Crm\Model\UserHistory;
use Vsb\Crm\Model\Account;
use Vsb\Crm\Model\Currency;
use Vsb\Crm\Model\Option;
use cryptofx\payments\Exception as PayException;
use cryptofx\payments\Gateway;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DealController extends Controller
{
    protected $dealContoller;
    public function __construct(){
        $this->dealContoller = new \App\Http\Controllers\DealController();
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if($request->has('user_id') && !empty($request->user_id) && $user->id!=$request->user_id){
            $childs = $user->childs;
            $user = User::where(function($q)use($childs){
                $q->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);
            })->where('id',$request->user_id)->first();
        }
        if(is_null($user))return response()->json(['message'=>"user not found"],404,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        $deals = Deal::with(['instrument'])->where('user_id',$user->id)->orderBy('id','desc')->limit(2048)->get();
        return response()->json($deals,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request){

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return $this->dealContoller->store($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Deal  $deal
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Deal $deal)
    {
        $deal->load(['instrument']);
        return response()->json($deal,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Deal  $deal
     * @return \Illuminate\Http\Response
     */
    public function edit(Deal $deal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Deal  $deal
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Deal $deal)
    {
        //
        return $this->dealContoller->update($request,$deal);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Deal  $deal
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request,Deal $deal)
    {
        return $this->dealContoller->destroy($request,$deal);
    }
}
