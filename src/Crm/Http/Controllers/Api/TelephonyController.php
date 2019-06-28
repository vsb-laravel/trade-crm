<?php

namespace App\Http\Controllers\Api;

use App\Telephony;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TelephonyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Telephony::all());
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Telephony  $telephony
     * @return \Illuminate\Http\Response
     */
    public function show(Telephony $telephony)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Telephony  $telephony
     * @return \Illuminate\Http\Response
     */
    public function edit(Telephony $telephony)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Telephony  $telephony
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Telephony $telephony)
    {
        $telephony->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Telephony  $telephony
     * @return \Illuminate\Http\Response
     */
    public function destroy(Telephony $telephony)
    {
        //
    }
}
