<?php

namespace Vsb\Crm\Http\Controllers;

use Vsb\Model\Currency;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($code=null){
        $curs = is_null($code)?Currency::where('enabled','1'):Currency::where('code','=',$code);

        return response()->json($curs->get());
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
     * @param  \Vsb\Crm\Currency  $currency
     * @return \Illuminate\Http\Response
     */
    public function show(Currency $currency){
        return response()->json($currency);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \Vsb\Crm\Currency  $currency
     * @return \Illuminate\Http\Response
     */
    public function edit(Currency $currency)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Vsb\Crm\Currency  $currency
     * @return \Illuminate\Http\Response
     */
    // public function update(Request $request, $code){
    public function update(Request $request, Currency $currency){
        $currency->update($request->all());
        return response()->json($currency);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Vsb\Crm\Currency  $currency
     * @return \Illuminate\Http\Response
     */
    public function destroy(Currency $currency)
    {
        //
    }
}
