<?php

namespace Vsb\Crm\Http\Controllers;
use Log;
use Vsb\Crm\Model\UserMeta;
use Illuminate\Http\Request;

class UserMetaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->middleware('auth');
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
        $usermetum = UserMeta::create($request->all());
        return response()->json($usermetum);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\UserMeta  $usermetum
     * @return \Illuminate\Http\Response
     */
    public function show(UserMeta $usermetum)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\UserMeta  $usermetum
     * @return \Illuminate\Http\Response
     */
    public function edit(UserMeta $usermetum)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\UserMeta  $usermetum
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserMeta $usermetum){
        Log::debug('UserMeta@update: '.json_encode($usermetum));
        $usermetum->update($request->all());
        return response()->json($usermetum);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\UserMeta  $usermetum
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserMeta $usermetum)
    {
        // if(is_null($usermetum)) $usermetum = UserMeta::find($usermetum);
        $usermetum->delete();
        return response()->json(['meta'=>$usermetum,'message'=>'destroed']);
    }
}
