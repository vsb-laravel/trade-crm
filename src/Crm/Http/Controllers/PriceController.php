<?php

namespace App\Http\Controllers;

use DB;
use Log;
use App\User;
use App\Price;
use App\Histo;
use App\Instrument;
use App\Source;
use App\Jobs\Pricehandler;
use cryptofx\DataTune;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PriceController extends Controller{
    protected $useRandom = 0; // 0 - if no data use random, 1-always, 2-mix data
    protected $_random = [
        "ticks"=>44
    ];
    public function __construct(){
        $this->useRandom = 0;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $rq,$format="json",$id="1"){
        $default = true;
        $res = [];
        $instrument = Instrument::find($id);
        $user = $rq->user();
        if($rq->input("user_id",false)!==false){
            $cu = User::find($rq->input("user_id"));
            if(!is_null($cu))$user=$cu;
        }
        $random = $this->makeRandomPrices($user,$instrument);

        if($this->useRandom == 1) return response()->json($random)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

        $res = Price::where('instrument_id',$id);
        if($rq->input("date_from","false")!="false") {$default=false;$res=$res->where("created_at",">=",intval($rq->input("date_from"))/1000);}
        if($rq->input("date_to","false")!="false") {$default=false;$res=$res->where("created_at","<=",intval($rq->input("date_to"))/1000);}
        if($default) $res=$res->whereRaw("created_at > unix_timestamp(DATE_SUB(NOW(),INTERVAL 1 MINUTE))");
        $res = $res->limit($rq->input("limit","60"))->orderBy('id','desc')->get();

        foreach($res as $row){
            $rr = $row->toArray();
            if(isset($random[$rr["created_at"]])) {
                $rrr = $row->toArray();
                $rrr["price"] = floatval($rrr["price"])*DataTune::fork2($user,$instrument)*DataTune::corida($user,$instrument,$rrr["price"]);
                $random[$rr["created_at"]] = $rrr;
            }
        }

        return response()->json(array_values($random))
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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
       foreach ($request->all() as $key => $value)
        {
            $dataSetPermission = collect(['price', 'time', 'symbol', 'source']);
            $data = collect($value)->only($dataSetPermission)->toArray();
            $validator = Validator::make($data, [
                //'user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>', 7);})],
                'price' => 'required|regex:/^(\d+(?:[\.\,]\d{1,5})?)$/|min:0|max:99999999.99999',
                'symbol' => 'required',
                // 'source' => 'required|exists:sources,name',
                // 'instrument_id'=> 'required|integer|exists:instruments,id',
                'time' => 'required|digits:10',
            ]);
            if ($validator->fails()){
                return response()->json($validator->errors());
            }
            $source = Source::where('name', $value['source'])->first();

            if(is_null($source)){
                Log::warn('Unsupported source name: ' . $value['source']);
                return response()->json(['success' => false]);
            }
            $pairs = Instrument::where('source_id', $source->id)->where('symbol', '=', $value['symbol'])->first();
            if(is_null($pairs))
            {
                return response()->json(['success' => false]);
            }
            $data['instrument_id'] = $pairs->id;
            $data['source_id'] = $source->id;
            Price::create($data);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Histo  $histo
     * @return \Illuminate\Http\Response
     */
    public function show(Histo $histo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Histo  $histo
     * @return \Illuminate\Http\Response
     */
    public function edit(Histo $histo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Histo  $histo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        // foreach ($request->all() as $key => $value)
        // {
            $value = $request->all();
            $dataSetPermission = collect(['price', 'time', 'symbol', 'source']);
            $data = collect($value)->only($dataSetPermission)->toArray();
            $validator = Validator::make($data, [
                //'user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>', 7);})],
                'price' => 'required|regex:/^(\d+(?:[\.\,]\d{1,5})?)$/|min:0|max:99999999.99999',
                'symbol' => 'required',
                // 'source' => 'required|exists:sources,name',
                // 'instrument_id'=> 'required|integer|exists:instruments,id',
                'time' => 'required|digits:10',
            ]);

            if ($validator->fails()){
                return response()->json($validator->errors());
            }

            $source = Source::where('name', $value['source'])->first();

            if(is_null($source)){
                Log::warn('Unsupported source name: ' . $value['source']);
                return response()->json(['success' => false]);
            }

            $pairs = Instrument::where('source_id', $source->id)->where('symbol', '=', $value['symbol'])->first();

            if(is_null($pairs))
            {
                return response()->json(['success' => false]);
            }

            $data['instrument_id'] = $pairs->id;
            $data['source_id'] = $source->id;

            Price::create($data);
        // }

        return response()->json(['success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Histo  $histo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Histo $histo)
    {
        //
    }

    public function price(Request $rq,$format="json",$inst){
        $prices = Price::where('instrument_id','=',$inst)->orderBy('id','desc');
        return response()->json($prices->first(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    protected function makeRandomPrices($user,$instrument){
        $histo = Histo::where('instrument_id',$instrument->id)->orderBy('id','desc')->limit(2)->get();
        $oldHisto = $histo[1];
        $histo = $histo[0];
        $coef = DataTune::fork2($user,$instrument);
        $random = [];
        $precision = 100000;
        $old_price = floatval($oldHisto->close*DataTune::corida($user,$instrument,$oldHisto->close,$oldHisto->time)*DataTune::fork2($user,$instrument,$oldHisto->time));
        $random[$histo->time]=[
            "id"=>"1132",
            "created_at"=>$histo->time,
            "updated_at"=>$histo->time,
            // "price"=>floatval($histo->open)*$coef**DataTune::corida($user,$instrument,$histo->open),
            "price"=>$old_price,
            "instrument_id"=>$instrument->id,
            "source_id"=>$histo->source_id,
            "volation"=>$histo->volation
        ];
        $high = ($histo->high == $histo->low)?$histo->close:$histo->high;
        $low =  $histo->low;
        $high*=$coef*DataTune::corida($user,$instrument,$high);
        $low*=$coef*DataTune::corida($user,$instrument,$low);

        for($i=1;$i<59;++$i){
            $price = rand(intval($low*$precision),intval($high*$precision))/$precision;
            $price = $price*$coef*DataTune::corida($user,$instrument,$price);
            $volation = 0;
            if($price>$old_price)$volation = 1;
            else if($price<$old_price)$volation = -1;
            $old_price = $price;
            $random[$histo->time+$i]=[
                "id"=>"1132",
                "created_at"=>$histo->time+$i,
                "updated_at"=>$histo->time+$i,
                "price"=>$price,
                "instrument_id"=>$instrument->id,
                "source_id"=>$histo->source_id,
                "volation"=>$volation
            ];
        }
        // last
        $random[$histo->time+60]=[
            "id"=>"1132",
            "created_at"=>$histo->time+60,
            "updated_at"=>$histo->time+60,
            "price"=>floatval($histo->close)*$coef*DataTune::corida($user,$instrument,$histo->close),
            "instrument_id"=>$instrument->id,
            "source_id"=>$histo->source_id,
            "volation"=>$histo->volation
        ];
        return $random;
    }
}
