<?php

namespace Vsb\Crm\Http\Controllers;

use Vsb\Crm\Model\WindigoSettings;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class WindigoSettingsController extends Controller
{

	/**
    * Show the form for creating a new resource.
    *
    * @return \Illuminate\Http\Response
    */
	public function index(Request $request)
    {
        $se = $request->has('search')?"%{$request->search}%":'%';
        $allPrices = WindigoSettings::where('val_str','like',$se)->orWhere('note','like',$se);

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
            'int_val' => 'required|integer',
            'int_str'=> 'required|string',
			'note' => 'nullable|string'
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 400);
        }

        $data = collect($data)->except('user_id')->toArray();
        $newPrices = WindigoSettings::create($data);

        return response()->json(['newPrices' => $newPrices]);
    }

    public function destroy(WindigoSettings $price)
    {

    	if(Auth::user()->rights_id < 7)
        {
        	return false;
        }

        $price->delete();
		return response()->json(['success' => true]);
    }

    public function show(Request $request, $ws)
    {
        return response()->json(WindigoSettings::find($ws));
    }

    public function update(Request $request, $windigosettings)
    {

		$data = array_merge($request->all(),['user_id' => Auth::id()]);

        $rules = ['user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>', 7);})],
        		  'int_val' => 'nullable|integer',
			  ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $data = collect($data)->except(['user_id','id'])->toArray();
        $windigosettings = WindigoSettings::where('id',$windigosettings)->first();
        $windigosettings->update($data);

        return response()->json($windigosettings);
    }
}
