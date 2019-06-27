<?php

namespace Vsb\Crm\Http\Controllers;

use Vsb\Crm\Model\WindigoRang;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WindigoRangController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return response()->json(WindigoRang::paginate($request->input('per_page',15)));
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
        $data = collect($request->all())->except('_token')->toArray();
        $data = array_merge($data, ['user_id' => Auth::id()]);

        $validator = Validator::make($data, [
        	'user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>=', 7);})],
            'r_sort' => 'required|integer',
            'r_hour' => 'required|integer',
            'r_bonus' => 'required|integer',
            'r_name'=> 'required|string',
			'r_picture' => 'nullable|string'
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 400);
        }
        return response()->json(WindigoRang::create($data));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\WindigoRang  $windigoRang
     * @return \Illuminate\Http\Response
     */
    public function show(WindigoRang $windigoRang)
    {
        return response()->json($windigoRang);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\WindigoRang  $windigoRang
     * @return \Illuminate\Http\Response
     */
    public function edit(WindigoRang $windigoRang)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\WindigoRang  $windigoRang
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, WindigoRang $windigoRang)
    {
        $data = array_merge($request->all(), ['user_id' => Auth::id()]);

        $validator = Validator::make($data, [
        	'user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>=', 7);})],
            'r_sort' => 'nullable|integer',
            'r_hour' => 'nullable|integer',
            'r_bonus' => 'nullable|integer',
            'r_name'=> 'nullable|string',
			'r_picture' => 'nullable|string'
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 400);
        }
        $windigoRang->update($data);
        return response()->json($windigoRang);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\WindigoRang  $windigoRang
     * @return \Illuminate\Http\Response
     */
    public function destroy(WindigoRang $windigoRang)
    {
        $validator = Validator::make(['user_id'=>Auth::id()], [
        	'user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>=', 7);})]
        ]);
        if ($validator->fails()) return response()->json($validator->errors(), 400);
        $windigoRang->delete();
        return response()->json(true);
    }
}
