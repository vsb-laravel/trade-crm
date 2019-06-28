<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['cors','auth:api'])->group(function(){
    Route::apiResource('account','AccountController');
    Route::apiResource('instrument','InstrumentController');

    Route::apiResource('account','AccountController');
    Route::model('trade', 'Vsb\Crm\Deal');
    Route::apiResource('trade','DealController');
    Route::resource('user','UserController');
    Route::post('user/login','UserController@login');
    Route::model('client', 'Vsb\Crm\User');
    Route::apiResource('client','UserController');

    Route::resource('transaction','TransactionController');
    Route::resource('imap','ImapController');

    // Route::resource('chat','ChatController');
    // Route::model('wallet', 'Vsb\Crm\Wallet');
    // Route::resource('wallet','WalletController');

    // Route::resource('payment','PaymentController');
});

Route::resource('brand','BrandController');
Route::resource('telephony','TelephonyController');

Route::middleware(['cors'])->group(function(){
    Route::any('/datafeed/{method}','DatafeedController@index');
});
