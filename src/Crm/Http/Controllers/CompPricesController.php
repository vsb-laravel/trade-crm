<?php

namespace Vsb\Crm\Http\Controllers;

use App\CompPrice;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class CompPricesController extends Controller
{

	/**
    * Show the form for creating a new resource.
    *
    * @return \Illuminate\Http\Response
    */
	public function index(Request $request)
    {
        // $allPrices = Prices::paginate($request->input('per_page', 15));
		$se = $request->has('search')?"%{$request->search}%":'%';
        $allPrices = CompPrice::where('t_name','like',$se);

        return response()->json($allPrices->paginate($request->input('per_page', 15)));
    }

    public function store(Request $request)
    {
    	if(Auth::user()->rights_id < 7)
        {
        	return false;
        }

        $data = collect($request->all())->except('_token')->toArray();
        $data = array_merge($data, ['user_id' => Auth::id()]);

        $validator = Validator::make($data, [
        	'user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>', 7);})],
            't_name' => 'nullable|string|max:50',
            'id_categor' => 'nullable|integer',
            't_time_start' => 'nullable|string|max:4',
            't_time_end'=> 'nullable|string|max:4',
            'price' => 'nullable|digits',
            'active' => 'nullable|digits:1',
            'paket' => 'nullable|digits:1'
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 400);
        }

        $data = collect($data)->except('user_id')->toArray();
        $newPrices = CompPrice::create($data);

        return response()->json(['newPrices' => $newPrices]);
    }

    public function destroy(CompPrice $price)
    {

    	if(Auth::user()->rights_id < 7)
        {
        	return false;
        }

        $price->delete();
		return response()->json(['success' => true]);
    }

    public function show(CompPrice $price)
    {
        return response()->json($price);
    }

    public function update(Request $request, CompPrice $price)
    {

		$data = array_merge($request->all(),['user_id' => Auth::id()]);

        $rules = ['user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>', 7);})],
        		  // 'id' => 'required|exists:tb_comp_price,id',
        		  't_name' => 'nullable|string|max:50',
	              'id_categor' => 'nullable|integer',
	              't_time_start' => 'nullable|string|max:4',
	              't_time_end'=> 'nullable|string|max:4',
	              'price' => 'nullable',
	              'active' => 'nullable|digits:1',
	              'paket' => 'nullable|digits:1'];

        $validator = Validator::make($data, $rules);

        if ($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $data = collect($data)->except(['user_id','id'])->toArray();
        // $price = CompPrice::where('id',$id)->first()->update($data);
        $price->update($data);

        return response()->json(['success' => true, 'price' => $price]);
    }
}
