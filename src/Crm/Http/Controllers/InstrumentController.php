<?php

namespace Vsb\Crm\Http\Controllers;

use Log;
use Vsb\Crm\Model\Instrument;
use Vsb\Crm\Model\InstrumentGroup;
use Vsb\Crm\Model\InstrumentGroupPair;
use Vsb\Crm\Model\InstrumentHistory;
use Vsb\Crm\Model\Currency;
use Vsb\Crm\Model\Price;
use Vsb\Crm\Model\Source;
use Vsb\Crm\Model\Histo;
use Vsb\Crm\Model\User;
use Vsb\Crm\Model\UserTuneHisto;
use Vsb\Crm\Model\UserTunePrice;
use cryptofx\DataTune;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InstrumentController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $rq, $format='json',$id=false){
        $res = Instrument::with([
            'from',
            'to',
            'history',
            'source'
            // 'histo'
        ])->find($id);
        $ret = $res->toArray();
        $ret["histo"] = Histo::where('instrument_id',$res->id)->orderBy('id','desc')->first();
        return ($format=='json')
                ?response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)
                :view('crm.content.instrument.dashboard',["row"=>$res,'sources'=>Source::all(),'histo'=>Histo::where('instrument_id',$id)->orderBy('id','desc')->first()]);
    }
    public function indexes(Request $rq, $format='json'){
        $user = UserController::getUser($rq);
        $ig = InstrumentGroup::find($user->pairgroup);

        $res = Instrument::with([
            'from','to','source'
            // 'from'=>function($q) use ($search){$q->where('code','like','%'.$search.'%');},
            // 'to'=>function($q) use ($search){$q->where('code','like','%'.$search.'%');},
            // 'source'=>function($q) use ($search){$q->where('name','like','%'.$search.'%');}
        ])->whereIn('id',InstrumentGroupPair::where('instrument_group_id',$user->pairgroup)->pluck('instrument_id'))->orderBy('ordering');
        if($rq->input('search',false)){
            $c = Currency::where('code','like','%'.$rq->search.'%')->select('id')->get();
            if(!is_null($c)){
                $res=$res->where(function($q)use($c){
                    $q->whereIn('from_currency_id',$c)
                        ->orWhereIn('to_currency_id',$c);
                });
            }
        }
        if($rq->input('all',false)==false && $rq->input('all','0')!='1' ) $res= $res->where('enabled','1');
        if($rq->input('grouping',false)!=false)$res=$res->where('grouping',$rq->grouping);
        if($rq->input('source_id',false)!=false)$res=$res->whereIn('source_id',preg_split('/,/m',$rq->source_id));
        if($rq->input('currency_id',false)!=false)$res=$res->where(function($q)use($rq){
            $q->where('from_currency_id',$rq->currency_id)
                ->orWhere('to_currency_id',$rq->currency_id);
        });
        $ret = $res->paginate($rq->input('per_page',15))->toArray();
        foreach($ret["data"] as &$row){
            // foreach (['dayswap','spread_buy','spread_sell','lot','pips','type','commission'] as $f) {
            foreach (['dayswap','spread_buy','spread_sell','type','commission'] as $f) {
                $row[$f] = $ig->$f;
            }
        }
        return ($format=='json')
                ?response()->json($ret,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)
                :view('crm.instrument.list',["rows"=>$ret]);
    }
    public function indexes2(Request $rq, $format='json',$id=false){
        $res = [];
        $selector = ($id===false)?Instrument::whereNotNull('id'):Instrument::where('id','=',$id);
        // filters {
        // }
        foreach($selector->get() as $row){
            $tsym = Currency::find($row->to_currency_id);
            $fsym = Currency::find($row->from_currency_id);
            $title = $fsym->code."/".$tsym->code;
            $prices =Price::where('instrument_id',$row->id)->orderBy('id', 'desc')->limit(2)->get();
            $histo = Histo::where('instrument_id',$row->id)->orderBy('id', 'desc')->first();
            // $diff =(!is_null($prices) && !empty($price))?(100*floatval($prices[0]->price)/floatval( $prices[1]->price) - 100):0;
            $diff =(!is_null($histo) && !empty($histo))?(100*floatval($histo->close)/floatval( $histo->open) - 100):0;
            $direction = ($diff<0)?-1:1;
            $res[] = [
                "id" => $row->id,
                'title' => $title,
                "diff" => $diff,
                "direction" => $direction,
                "price" =>  $prices[0]->price,
                "histo" =>  $histo,
                "from_currency" => $fsym,
                "to_currency" => $tsym,
                "commission" => $row->commission,
                "enabled" => $row->enabled
            ];
        }
        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
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
    public function store(Request $rq)
    {
        //
        $pair = Instrument::create($rq->all());
        return response()->json($pair,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Instrument  $instrument
     * @return \Illuminate\Http\Response
     */
    public function show(Instrument $instrument)
    {
        $instrument->load(['source','from','to']);
        return response()->json($instrument,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Instrument  $instrument
     * @return \Illuminate\Http\Response
     */
    public function edit(Instrument $instrument)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Instrument  $instrument
     * @return \Illuminate\Http\Response
     */
    public function update(Request $rq,$format='json',$id){
        list($res,$code)=[["error"=>"404","message"=>"User {$id} not found."],404];
        try{
            $code = 200;
            $instrument = Instrument::findOrFail($id);
            $ud = $rq->all();
            InstrumentHistory::create([
                'instrument_id'=>$instrument->id,
                'old_enabled'=>$instrument->enabled,
                'new_enabled'=>isset($ud['enabled'])?$ud['enabled']:$instrument->enabled,
                'old_commission'=>$instrument->commission,
                'new_commission'=>isset($ud['commission'])?$ud['commission']:$instrument->commission,
            ]);
            Log::debug('pair update data: '.json_encode($ud));
            $instrument->update($ud);
            Log::debug('pair after update: '.json_encode($instrument));
            $res = $instrument;
        }
        catch(\Exception $e){
            $code = 500;
            $res = [
                "error"=>$e->getCode(),
                "message"=>$e->getMessage()
            ];
        }
        return ($format=="json")
            ?response()->json($res,$code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)
            :$this->index($rq,$format,$id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Instrument  $instrument
     * @return \Illuminate\Http\Response
     */
    public function destroy(Instrument $instrument)
    {
        //
    }
    public function history(Request $rq,$format='json',$id){
        return response()->json(InstrumentHistory::where('instrument_id','=',$id)->orderBy('id','desc')->get(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function sources(Request $rq){
        return response()->json(Source::get(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
}
