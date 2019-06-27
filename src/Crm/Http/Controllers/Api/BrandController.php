<?php

namespace Vsb\Crm\Http\Controllers\Api;

use DB;
use Log;
use Vsb\Crm\Model\User;
use Vsb\Crm\Model\Brand;
use Vsb\Crm\Model\Invoice;
use Vsb\Crm\Model\BrandInvoice;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $brands = [];
        $now = time();
        $today = strtotime(date('Y-m-').'01');
        if($request->has('period') && !empty($request->period)){
            switch($request->period){
                case 'm'://this month
                    $now = time();
                    $today = strtotime(date('Y-m-').'01');
                break;
                case 'lm'://last month
                    $today = strtotime("first day of -1 month");
                    $now = strtotime("last day of -1 month");
                break;
                case '2lm'://2 last month
                    $today = strtotime("first day of -2 month");
                    $now = strtotime("last day of -2 month");
                break;
                case 'q'://this quarter
                    $today = strtotime("first day of -3 month");
                    $now = strtotime(date('Y-m-').'01');
                break;
                case 'jan'://jan year
                    $today = strtotime(date('Y-01-01 00:00:00'));
                    $now = strtotime(date('Y-01-31 23:59:59'));
                break;
                case 'feb'://jan year
                    $today = strtotime(date('Y-02-01 00:00:00'));
                    $now = strtotime(date('Y-02-28 23:59:59'));
                break;
                case 'mar'://jan year
                    $today = strtotime(date('Y-03-01 00:00:00'));
                    $now = strtotime(date('Y-03-31 23:59:59'));
                break;
                case 'apr'://jan year
                    $today = strtotime(date('Y-04-01 00:00:00'));
                    $now = strtotime(date('Y-04-30 23:59:59'));
                break;
                case 'may'://jan year
                    $today = strtotime(date('Y-05-01 00:00:00'));
                    $now = strtotime(date('Y-05-31 23:59:59'));
                break;
                case 'jun'://jan year
                    $today = strtotime(date('Y-06-01 00:00:00'));
                    $now = strtotime(date('Y-06-30 23:59:59'));
                break;
                case 'jul'://jan year
                    $today = strtotime(date('Y-07-01 00:00:00'));
                    $now = strtotime(date('Y-07-31 23:59:59'));
                break;
                case 'aug'://jan year
                    $today = strtotime(date('Y-08-01 00:00:00'));
                    $now = strtotime(date('Y-08-31 23:59:59'));
                break;
                case 'sep'://jan year
                    $today = strtotime(date('Y-09-01 00:00:00'));
                    $now = strtotime(date('Y-09-30 23:59:59'));
                break;
                case 'oct'://jan year
                    $today = strtotime(date('Y-10-01 00:00:00'));
                    $now = strtotime(date('Y-10-31 23:59:59'));
                break;
                case 'nov'://jan year
                    $today = strtotime(date('Y-11-01 00:00:00'));
                    $now = strtotime(date('Y-11-30 23:59:59'));
                break;
                case 'dec'://jan year
                    $today = strtotime(date('Y-12-01 00:00:00'));
                    $now = strtotime(date('Y-12-31 23:59:59'));
                break;
                case 'aug'://jan year
                    $today = strtotime(date('Y-08-01 00:00:00'));
                    $now = strtotime(date('Y-08-31 23:59:59'));
                break;
                case 'y'://this year
                    $today = strtotime(date('Y-01-01 00:00:00'));
                    $now = time();
                break;
            }
        }
        $olap = Brand::with(['invoices'=>function($query)use($today,$now){
            $query->where('created_at','>=',$today)
                ->where('created_at','<=',$now);
        }])->orderBy('id')->get();

        return response()->json($olap,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);

        foreach (Brand::all() as $brand) {
            $data = $brand->toArray();
            try{
                $can_use_crm = DB::connection($brand['name']."_db")->table('options')->where('name','can_use_crm')->first();
                if(!is_null($can_use_crm))$brand['can_use_crm']=json_decode(json_encode($can_use_crm),true);
                $brand['invoices']=DB::connection($brand['name']."_db")
                    ->table('transactions')
                        ->join('merchants','merchants.id','=','transactions.merchant_id')
                        ->join('accounts','transactions.account_id','=','accounts.id')
                    ->where('accounts.type','real')
                    ->where('transactions.code',200)
                    ->where('transactions.created_at','>=',$today)
                    ->where('transactions.created_at','<=',$now)
                    ->whereNotIn('transactions.merchant_id',[1,3])
                    ->where('transactions.type','deposit')
                    ->select(DB::raw('merchants.name,merchants.title,from_unixtime(transactions.created_at) as time,transactions.created_at,transactions.user_id,transactions.amount'))
                    ->orderBy('created_at','desc')
                    ->get()->toArray();
            }
            catch(\Exception $e){
                Log::error($e);
            }
            $brands[]=$brand;
        }
        return response()->json($brands,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
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

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    // public function show(User $user)
    public function show(Brand $brand)
    {
        $brand->load(['invoices'=>function($query){
            $query->where('created_at','>=',strtotime(date('Y-m').'-01'));
        }]);
        $res = $brand->toArray();
        $res['active']=$brand->active;
        // $res['invoices']=
        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
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
    public function update(Request $request, Brand $brand)
    {
        $db = DB::connection($brand->name.'_db');
        if($request->has('action')){
            switch($request->action){
                case 'option':{
                    if($request->has('option') && $request->has('value')){
                        $option = $db->table('options')->where('name',$request->option)->first();
                        if(is_null($option)){
                            $db->table('options')->insert([
                                'created_at'=>time(),
                                'updated_at'=>time(),
                                'user_id'=>1,
                                'name'=>$request->option,
                                'value'=>$request->value,
                                'type'=>'boolean'
                            ]);
                        }
                        $db->table('options')->where('name',$request->option)->update(['value'=>$request->value,'updated_at'=>time(),'type'=>'boolean']);
                    }
                    break;
                }
            }
        }
        return response()->json($brand,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }
}
