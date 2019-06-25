<?php

namespace App\Http\Controllers;

use App\CompFlor;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CompFlorsController extends Controller
{

	/**
    * Show the form for creating a new resource.
    *
    * @return \Illuminate\Http\Response
    */
	public function index(Request $request)
    {

        $allFlor = CompFlor::orderBy('tb_comp_flor.id_categor', 'desc')->orderBy('tb_comp_flor.id_comp', 'asc')->paginate($request->input('per_page', 15));

   
        // SELECT tb_comp_flor.id,
        // if (id_categor = 1, CONCAT("Vip ", id_comp), CONCAT("Standart ", id_comp)) as id_comp_cat,     
        // tb_comp_flor.mac_adre,
        // tb_comp_flor.c_status
        // FROM tb_comp_flor
        // ORDER BY tb_comp_flor.id_categor DESC,
        // tb_comp_flor.id_comp

        return response()->json($allFlor);
    }

    public function store(Request $request)
    {
        // $data = collect($request->all())->except('_token')->toArray();
        // $data = array_merge($data, ['user_id' => Auth::id()]);

        // $validator = Validator::make($data, [
        //     'user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>', 7);})],
        //     'id_categor' => 'nullable|integer|digits:1',
        //     'id_gr' => 'nullable|integer|digits:11',
        //     'flor' => 'nullable|integer|digits:1',
        //     'id_comp'=> 'nullable|integer|digits:11',
        //     'x_coord' => 'nullable|integer|digits:11',
        //     'y_coord' => 'nullable|integer|digits:11',
        //     'mac_adre' => 'nullable|string|max:20',
        //     'c_status' => 'nullable|digits:1'
        // ]);

        // if ($validator->fails())
        // {
        //     return response()->json($validator->errors(), 400);
        // }

        // $data = collect($data)->except('user_id')->toArray();
        // $newFloar = CompFlor::create($data);

        // return response()->json(['newFloar' => $newFloar]);
    }

    public function destroy(CompFlor $flor)
    {
        // $validator = Validator::make(['user_id' => Auth::id()], [
        //     'user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>', 7);})],
        // ]);

        // if($validator->fails())
        // {
        //     return response()->json($validator->errors(), 400);
        // }

        // $flor->delete();
		
        // return response()->json(['success' => true]);
    }

    public function show(CompFlor $flor)
    {
        return response()->json($flor);
    }

    public function update(Request $request, CompFlor $flor)
    {
		$data = array_merge($request->all(),['user_id' => Auth::id()]);
        $rules = ['user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>', 7);})],
        		  // 'id_categor' => 'nullable|integer|digits:1',
	           //    'id_gr' => 'nullable|integer|digits:11',
	           //    'flor' => 'nullable|integer|digits:1',
	           //    'id_comp'=> 'nullable|integer|digits:11',
            //       'x_coord' => 'nullable|integer|digits:11',
	           //    'y_coord' => 'nullable|integer|digits:11',
	              'mac_adre' => 'nullable|string|max:20',
	              // 'c_status' => 'nullable|digits:1'
              ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $data = collect($data)->except(['user_id','id'])->toArray();
        $flor->update($data);

        return response()->json(['success' => true, 'flor' => $flor]);
    }
}
