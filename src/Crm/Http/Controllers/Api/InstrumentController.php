<?php

namespace Vsb\Crm\Http\Controllers\Api;

use Log;
use App\Deal;
use App\Instrument;
use App\InstrumentGroup;
use App\InstrumentGroupPair;
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

class InstrumentController extends Controller
{
    public function __construct(){
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if(is_null($user))return response()->json([],403,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        $ig = InstrumentGroup::find($user->pairgroup);
        $list = Instrument::with(['from','to','source'])
            // ->where('enabled',$request->has('enabled')?$request->enabled:1)
            // ->whereIn('id',InstrumentGroupPair::where('instrument_group_id',$user->pairgroup)->pluck('instrument_id'))
            ->orderBy('ordering');
        $time = time();
        if($request->input('all',false)==false && $request->input('all','0')!='1' ) $list->where('enabled','1');
        // Log::debug('pairs select start: at ['.$time.']');

        if($request->has('search')){
            $se = $request->input('search','%');

            if(preg_match('/^#(\d+)/',$se,$m)) $list->where('id',$m[1]);
            else $list->where(function($query)use($se){
                $query->whereRaw("symbol like '%".$se."%' or id like '%".$se."%' or source_id like '%".$se."%'")
                    ->orWhereIn('from_currency_id',Currency::where('code','like','%'.$se.'%')->orWhere('name','like','%'.$se.'%')->pluck('id'))
                    ->orWhereIn('to_currency_id',Currency::where('code','like','%'.$se.'%')->orWhere('name','like','%'.$se.'%')->pluck('id'))
                ;
            });
            // $c = Currency::where('code','like','%'.$request->search.'%')->select('id')->get();
            // if(!is_null($c)){
            //     $list->where(function($q)use($c){
            //         $q->whereIn('from_currency_id',$c)
            //             ->orWhereIn('to_currency_id',$c);
            //     });
            // }
        }
        if($request->input('source_id',false)!=false)$list->whereIn('source_id',preg_split('/,/m',$request->source_id));
        if($request->input('type',false)!=false)$list->whereIn('type',preg_split('/,/m',$request->type));
        if($request->has('currency_id'))$list->where(function($q)use($request){
            $q->whereIn('from_currency_id',preg_split('/,/m',$request->currency_id))
                ->orWhereIn('to_currency_id',preg_split('/,/m',$request->currency_id));
        });

        $list = $list->get();
        // $list = $list->paginate($request->input('per_page',100));
        // Log::debug('pairs select end in ['.(time()-$time).']');
        return response()->json([
            "first_page_url" => "/instrument?page=1",
            "data" => $list,
            "current_page"=>1,
            "from" => 1,
            "last_page" => 1,
            "last_page_url" => "/instrument?page=1",
            "next_page_url" => null,
            "path" => "/instrument",
            "per_page" => $list->count(),
            "prev_page_url" => null,
            "to" => $list->count(),
            "total" => $list->count()
        ],200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
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

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Instrument  $Instrument
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Instrument $item)
    {
        $item->load(['source','from','to']);
        return response()->json($item,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Instrument  $Instrument
     * @return \Illuminate\Http\Response
     */
    public function edit(Instrument $item)
    {
        // $item->load(['source','from','to']);
        return response()->json($item,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Instrument  $Instrument
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Instrument $instrument)
    {
        $instrument->update($request->all());
        return response()->json($instrument,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Instrument  $Instrument
     * @return \Illuminate\Http\Response
     */
    public function destroy(Instrument $Instrument)
    {
        //
    }
}
