<?php

namespace App\Http\Controllers;

use App\CompGame;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CompGameController extends Controller
{

	/**
    * Show the form for creating a new resource.
    *
    * @return \Illuminate\Http\Response
    */
	
    public function index(Request $request)
    {

        $game = CompGame::where('id_comp', '=', $request->input('id_comp'))->get()->toArray();

        return response()->json($game);
    }

    public function store(Request $request)
    {
        $data = collect($request->all())->except('_token')->toArray();
        $data = array_merge($data, ['user_id' => Auth::id()]);
        $data['type_soft'] = $request->input('type_soft', 1);
        $validator = Validator::make($data, [
            //'user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>', 7);})],
            'note' => 'required|string|max:244',
            'icon_path' => 'required|string|max:254',
            'exe_path'=> 'required|string|max:254',
            //'id_comp' => 'required|exists:connection.windigo_db,tb_comp_flor,id_comp',
            'type_soft' => 'required|integer|digits:1',
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $data = collect($data)->except('user_id')->toArray();
        $game = CompGame::create($data);

        return response()->json(['success' => true, 'game' => $game]);
    }

    public function destroy(CompGame $game)
    {
        // $validator = Validator::make(['user_id' => Auth::id()], [
        //     'user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>', 7);})],
        // ]);

        // if($validator->fails())
        // {
        //     return response()->json($validator->errors(), 400);
        // }

        $game->delete();
		
        return response()->json(['success' => true]);
    }

    public function show(CompGame $game)
    {   
        // $validator = Validator::make(['user_id' => Auth::id()], [
        //     'user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>', 7);})],
        // ]);

        // if($validator->fails())
        // {
        //     return response()->json($validator->errors(), 400);
        // }

        return response()->json($game);
    }

    public function update(Request $request, CompGame $game)
    {
        $data = array_merge($request->all(),['user_id' => Auth::id()]);
        $data['type_soft'] = $request->input('type_soft', 0);
        $validator = Validator::make($data, [
            // 'id' => 'required|exists:connection.windigo_db,tb_comp_info_soft',
            // 'id' => ['required', Rule::exists('tb_comp_info_soft','id')->where(function ($query) use ($data) {$query->where('id', '=', $data['id']);})],
            // 'user_id' => ['required', Rule::exists('users','id')->where(function ($query) {$query->where('rights_id', '>', 7);})],
            'note' => 'required|string|max:244',
            'icon_path' => 'required|string|max:254',
            'exe_path'=> 'required|string|max:254',
            // 'id_comp' => 'required|exists:connection.windigo_db,tb_comp_flor,id_comp',
            'type_soft' => 'required|integer|digits:1',
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $data = collect($data)->except(['user_id','id'])->toArray();
        $game->update($data);

        return response()->json(['success' => true, 'game' => $game]);
    }
}
