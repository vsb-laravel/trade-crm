<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// CRM

Route::domain('crm.'.env('SM_DOMAIN'))->group(function(){Route::get('/','CrmController@index')->name('crm');});
Route::domain('partner.'.env('SM_DOMAIN'))->group(function(){Route::get('/','CrmController@index')->name('partner');});
Route::domain('affilate.'.env('SM_DOMAIN'))->group(function(){Route::get('/','CrmController@index')->name('affilate');});
Route::domain('pay.'.env('SM_DOMAIN'))->group(function(){
    Route::get('/{merchant}/success','TransactionController@paySuccess');
    Route::get('/{merchant}/fail','TransactionController@payFail');
    Route::any('/{merchant}/back','TransactionController@payBack');
    Route::any('/{merchant}/form','TransactionController@payForm');
    Route::any('/{merchant}/status/{order_id?}','TransactionController@payStatus');
});

Route::prefix('data')->group(function(){
    Route::get('/user', 'AngularController@user')->name('angular.user');
    Route::get('/account', 'AngularController@account')->name('angular.account');
    Route::get('/prices', 'AngularController@prices')->name('angular.prices');
    Route::apiResource('client','Api\UserController');
    Route::apiResource('country', 'Api\CountryController',['only'=>['index']]);
    Route::apiResource('brand', 'Api\BrandController');
    Route::apiResource('trx', 'Api\TransactionController');
});
// Candles
Route::get('/data/{type}/{arge?}', 'HistoController@histo')->name('histo')->where('type','histominute|histohour|histoday')->where('agre','[0-9]+');
//Currencies
Route::get('/currency/{code?}','CurrencyController@index')->name('currencies');
Route::get('/currency/{currency}/update','CurrencyController@update')->name('currency.update');

//Deals
Route::get('/deal','DealController@index')->name('deals');
Route::get('/deal/add','DealController@store')->name('dealadd');
Route::get('/deal/delete','DealController@destroy')->name('deal.delete');
Route::post('/deal','DealController@store')->name('deal.store');
Route::put('/deal/{deal}','DealController@update')->name('deal.update');
Route::delete('/deal/{deal}','DealController@destroy')->name('deal.destroy');

// Route::get('/account','UserController@useraccount')->name('useraccount');
// Route::get('/{format}/price/{inst}','HistoController@price')->name('price.list')->where('format','json|html');
Route::get('/price/{format}/{id?}','HistoController@prices')->name('price.list')->where('format','json')->where('id','[0-9]+');
Route::get('/currentprice/{format}/{id?}','HistoController@price')->name('price.list')->where('format','json')->where('id','[0-9]+');

Route::get('/user/finance/withdrawal','TransactionController@makeWithdrawal')->name('user.makeWithdrawal');
Route::get('/user/finance/deposit','TransactionController@makeDeposit')->name('user.makeDeposit');
Route::get('/user/finance/demodeposit','TransactionController@demodeposit')->name('user.demodeposit');


/*Task JSON data */
// Route::get('/task','TaskController@index')->name('task.list')->where('format','json|html');
// Route::get('/task/add','TaskController@add')->name('task.add');
// Route::get('/task/{id}/update','TaskController@edit')->name('task.edit')->where('id','[0-9]+');
// Route::get('/task/{id}/delete','TaskController@delete')->name('task.delete')->where('id','[0-9]+');
// Route::get('/task/status','TaskController@statuses')->name('task.status');
// Route::get('/task/type','TaskController@types')->name('task.type');

Route::post('/task_add','NewTaskController@addTask')->middleware('auth');
Route::post('/get_tasks','NewTaskController@index')->middleware('auth');
Route::post('/show_task','NewTaskController@showTask')->middleware('auth');

Route::delete('/delete_task','NewTaskController@deleteTask')->middleware('auth');
Route::put('/edit_task','NewTaskController@editTask')->middleware('auth');

Route::post('/get_users_available', 'NewTaskController@getUsersAvailable')->middleware('auth');
/* USer JSON data*/
Route::get('/{format}/user/','UserController@ulist')->name('user.list')->where('format','json|html|xlsx');
Route::get('/{format}/user/{id}','UserController@index')->name('user.info')->where('format','json|html')->where('id','[0-9]+');
Route::get('/{format}/user/{id}/update','UserController@update')->name('user.update')->where('format','json')->where('id','[0-9]+');
Route::get('/{format}/user/{id}/delete','UserController@destroy')->name('user.update')->where('format','json')->where('id','[0-9]+');
Route::get('/{format}/user/{id}/documents','UserController@documents')->name('user.documents')->where('format','json')->where('id','[0-9]+');
Route::get('/{format}/user/{id}/history','UserController@history')->name('user.documents')->where('format','json')->where('id','[0-9]+');

Route::get('/{format}/user/status','UserController@status')->name('user.status')->where('format','json');
Route::get('/{format}/user/rights','UserController@rights')->name('user.rights')->where('format','json');
Route::get('/{format}/user/countries','UserController@countries')->name('user.countries')->where('format','json');
Route::get('/{format}/user/offices','UserController@offices')->name('user.offices')->where('format','json');
Route::get('/{format}/user/meta','UserController@metaData')->name('user.meta')->where('format','json');
Route::get('/{format}/user/online','UserController@online')->name('user.online')->where('format','json');

/* Deal controller JSON */
Route::get('/{format}/deal','DealController@index')->name('deal.list')->where('format','json|html')->where('id','[0-9]+');
Route::get('/{format}/deal/add','DealController@store')->name('deal.add')->where('format','json|html');
Route::get('/{format}/deal/{id}/info','DealController@index')->name('deal.info')->where('format','json|html')->where('id','[0-9]+');
Route::get('/{format}/deal/{id}/update','DealController@update')->name('deal.update')->where('format','json');
Route::get('/{format}/deal/delete','DealController@destroy')->name('deal.delete')->where('format','json');
Route::get('/{format}/deal/status','DealController@statuses')->name('deal.statuses')->where('format','json');
/* Instruments */
Route::get('/{format}/instrument/{id}','InstrumentController@index')->name('instrument.info')->where('format','json|html')->where('id','[0-9]+');
Route::get('/{format}/instrument','InstrumentController@indexes')->name('instrument.list')->where('format','json|html');
Route::get('/{format}/instrument/add','InstrumentController@store')->name('instrument.add')->where('format','json|html');
Route::get('/{format}/instrument/{id}/update','InstrumentController@update')->name('instrument.update')->where('format','json|html')->where('id','[0-9]+');
Route::get('/{format}/instrument/{id}/history','InstrumentController@history')->name('instrument.history')->where('format','json')->where('id','[0-9]+');
/* Fanance */
Route::get('/{format}/merchant','TransactionController@merchants')->name('merchant.list')->where('format','json');
Route::get('/{format}/merchant/{merchant}/update','TransactionController@merchantupdate')->name('merchant.update')->where('format','json')->where('merchant','[0-9]+');

Route::get('/{format}/finance/{id?}','TransactionController@index')->name('finance.list')->where('format','json')->where('id','[0-9]+');
Route::get('/{format}/finance/deposit','TransactionController@deposit')->name('finance.deposit')->where('format','json');
Route::get('/{format}/finance/balance','TransactionController@balance')->name('finance.balance')->where('format','json');
Route::get('/{format}/finance/withdrawal','TransactionController@withdrawal')->name('finance.withdrawal')->where('format','json')->where('id','[0-9]+');
Route::get('/{format}/finance/withdrawal/{id}/{status}','TransactionController@withdrawalUpdate')->name('finance.withdrawal.update')->where('format','json')->where('id','[0-9]+')->where('status','[a-z]+');


Route::get('/user/hierarchy/{format}/{id?}','UserController@hierarchy')->name('user.hierarchy')->where('format','json')->where('id','[0-9]+');
Route::get('/user/ban/{format}/{id}','UserController@ban')->name('user.ban')->where('format','json')->where('id','[0-9]+');
Route::get('/user/add/{format}','UserController@store')->name('user.add')->where('format','json');
Route::get('/user/{user}/remove','UserController@destroy')->name('user.remove');

Route::get('/user/{id}/controll/off','UserController@controll')->name('user.controll')->where('id','[0-9]+');
Route::get('/user/{id}/comment','UserController@comment')->name('user.comment')->where('id','[0-9]+');

Route::post('/user/{id}/google2fa','UserController@google2fa')->name('user.google2fa')->where('id','[0-9]+');
Route::post('/2fa', function () { return redirect(URL()->previous()); })->name('2fa')->middleware('2fa');
Route::get('/2fa/otp', function () { return redirect(URL()->previous()); })->name('login2fa')->middleware('2fa');

Route::get('/finance/invoice/html','TransactionController@invoicesForm')->name('finance.listView');
Route::get('/finance/invoice','TransactionController@invoices')->name('finance.list');


Route::get('/user/kyc/{format?}','UserController@kycList')->name('user.kyc')->where('format','json|html');
Route::get('/user/{id}/kyc/{format?}','UserController@kycInfo')->name('user.kycinfo')->where('id','[0-9]+')->where('format','json|html');
Route::post('/user/{id}/upload','UserController@upload')->name('user.upload')->where('id','[0-9]+');
Route::get('/user/kyc/{id}/update/{status}','UserController@kycUpdate')->name('user.kycupdate')->where('id','[0-9]+')->where('status','verified|declined');
Route::get('/user/kyc/{id}/delete','UserController@kycDelete')->name('user.kycdelete')->where('id','[0-9]+');

// Route::get('/user/{format}','UserController@ulist')->name('user.list')->where('format','json');

Route::post('/lead/upload','LeadController@upload')->name('lead.upload');
Route::get('/lead/list/{format}','LeadController@ulist')->name('lead.list')->where('format','html|json');
Route::get('/lead/add','LeadController@add')->name('lead.add');
Route::get('/lead/{id}/update','LeadController@update')->name('lead.update')->where('id','[0-9]+');
Route::get('/lead/{id}/delete','LeadController@delete')->name('lead.delete')->where('id','[0-9]+');
Route::get('/lead/{id}/{format?}','LeadController@index')->name('lead.info')->where('id','[0-9]+')->where('format','html|json');
Route::get('/lead/{id}/comment','LeadController@comment')->name('lead.comment')->where('id','[0-9]+');
Route::get('/lead/status','LeadController@status')->name('lead.status')->where('id','[0-9]+');

Route::get('/email/support','HomeController@support');
Route::get('/email/applydemo','HomeController@applydemo');

Route::get('/finance/report/{report}','FinanceController@report');
Route::get('/finance/export','FinanceController@export');

Route::get('/sources','InstrumentController@sources');



// payments
/*
'successurl' => 'http://cryptoforex.bs2/pay/success',
'failureurl' => 'http://cryptoforex.bs2/pay/fail',
'postbackurl' => 'http://cryptoforex.bs2/pay/back'
*/
Route::get('/pay/{merchant}/success','TransactionController@paySuccess');
Route::get('/pay/{merchant}/fail','TransactionController@payFail');
Route::any('/pay/{merchant}/back','TransactionController@payBack');
Route::put('/pay/{merchant}/{trxId}/approve','TransactionController@payApprove');
Route::any('/pay/{merchant}/form','TransactionController@payForm');
Route::get('/pay/success','TransactionController@paySuccess');
Route::get('/pay/fail','TransactionController@payFail');
Route::any('/pay/back','TransactionController@payBack');
Route::get('/transaction/add','TransactionController@addTransaction');
Route::delete('/transaction/{trx}','TransactionController@destroy')->where('trx','[0-9]+')->name('reversal');


Route::get('/view/email/{template}','HomeController@email');
Route::get('/news','RssController@index');
Route::get('/test/mail','HomeController@test');
Route::get('/test/mail/{blade}',function(Illuminate\Http\Request $request,$blade){
    return view('email.'.$blade,$request->all());
});

Route::get('/user/events','EventController@index')->name('events.list');
Route::get('/user/event/{event}/update','EventController@update')->name('events.update');

Route::get('/user/mail','MailController@lists');
Route::get('/mail','MailController@index');
Route::get('/mail/add','MailController@add');
Route::get('/mail/send','MailController@mail');
Route::get('/mail/{mail}/update','MailController@update')->where('mail','[0-9]+');
Route::get('/mail/{mail}/delete','MailController@delete')->where('mail','[0-9]+');


Route::get('/user/messages','MessageController@index');
Route::get('/user/message/add','MessageController@add')->where('id','[0-9]+');
Route::get('/user/message/{id}/edit','MessageController@edit')->where('id','[0-9]+');
Route::get('/user/message/{id}/delete','MessageController@delete')->where('id','[0-9]+');

Route::get('/user/fastlogin/{id}','CabinetController@fastlogin')->where('id','[0-9]+');


Route::get('/used/comments','TransactionController@usedComments');

Route::get('/affilate/export','FinanceController@affilate');
Route::get('/export/affilate','FinanceController@affilate');
Route::get('/export/customers','FinanceController@customers');

Route::get('/user/{user}/state','CabinetController@state')->name('global.state');
Route::get('/test','HomeController@test')->name('test.page');

##Task route
Route::post('/task_add','NewTaskController@addTask')->middleware('auth');
Route::post('/get_tasks','NewTaskController@index')->middleware('auth');
Route::post('/show_task','NewTaskController@showTask')->middleware('auth');
Route::delete('/delete_task','NewTaskController@deleteTask')->middleware('auth');
Route::put('/edit_task','NewTaskController@editTask')->middleware('auth');
Route::post('/get_users_available', 'NewTaskController@getUsersAvailable')->middleware('auth');
##

Route::resource('option','OptionController');

Route::resource('pairgroup','Api\InstrumentGroupController');
Route::model('instrument','App\Instrument');
Route::resource('instrument','Api\InstrumentController');

// Route::resource('order','OrderController');
Route::any('webhook','HomeController@webhook');
Route::middleware(['auth'])->group(function(){
    Route::get('logs', '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index')->name('admin.logs');

    Route::model('imap', 'App\Mailbox');
    Route::resource('imap','Api\ImapController');
    Route::model('client', 'App\User');
    Route::resource('client','Api\UserController');
    Route::model('order', 'Transaction');
    Route::resource('order','Api\OrderController');
    Route::model('chat', 'Message');
    Route::resource('chat','Api\ChatController');
    Route::resource('account','AccountController');
    Route::resource('wallet','Api\WalletController');

    Route::resource('newsfeed','NewsfeedController');
    // Route::post('wallet/exchange','Api\WalletConstroller@update')

    Route::any('/exchange','ExchangeController@exchange');

    Route::get('/trade/{path?}',function(){
        return view('react');
    })->where('path','.*')->name('react');

    Route::get('/rating','CabinetController@rating')->name('rating');
    Route::get('/roi','CabinetController@roi')->name('roi');

    #PromoCode
    // Route::model('promocode', 'App\PromoCode');
    // Route::model('promocode', 'App\PromoCode');
    // Route::resource('promocode','PromoCodeController');

    #CompFlor
    Route::model('compflor', 'App\CompFlor');
    Route::resource('compflor','CompFlorsController');

    #CompGame
    Route::model('compGame', 'App\CompGame');
    Route::resource('compGame','CompGameController');
    Route::post('compGame/update', 'CompGameController@update');

    #CompPrice
    Route::model('compprice', 'App\CompPrice');
    Route::resource('compprice','CompPricesController');
    Route::model('windigosettings', 'App\WindigoSettings');
    Route::resource('windigosettings','WindigoSettingsController');
    // Route::model('windigorang', 'App\WindigoSettings');
    Route::resource('windigoRang','WindigoRangController');
});

## Price processing
Route::model('prices', 'App\Price');
Route::resource('prices', 'PriceController');


##  Sockets
Route::get('test_private', function(){
    $account = new App\Account();
    $account = $account->where('user_id', '=', Auth::id())->get()->toArray();

    event(new App\Events\PrivateEvent($account, Auth::id()));
})->middleware('auth');

Route::get('check-auth', function(){
    $user = Auth::user();
    if(!is_null($user)){
        $user->load(['rights','status']);
    }
    return response()->json(['auth' => Auth::check(), 'user_info' => $user]);
});
Route::get('check-user/{id}', 'UserController@checkUserChild')->where('id','[0-9]+');
Route::get('test_public', function(){
    event(new App\Events\PublicEvent('test public'));
});
Route::get('test_group', function(){
    event(new App\Events\PresistentEvent('test public', [1,2,3,4]));
    event(new App\Events\DealEvent('test deal', \App\User::where('rights_id','>=',8)->pluck('id')->toArray()));
});
##  End Socket
Route::any('/wallet/{currency}/callback', 'Api\WalletController@callback');
Route::get('/test/recurse','UserController@recurse');
Route::get('/bets/room','CrmController@room');
Route::get('/locale/{lang}', function($lang){
    Session::put('vsb_locale', $lang);
    return Redirect::back();
})->name('locale');
Route::get('/{lang}/{route}', function($lang,$route){
    Session::put('vsb_locale', $lang);
    return Redirect('/'.$route);
})->where('lang','ru|en|pt|ar|es|fr|sp|it')->where('route','login|register');
Route::get('/once/{uid}','AffiliateController@once')->where('uid','\S{32}')->name('user.once.login');


// Route::get('test_price', function(){
//     $data = [ "price" => "1.27700",
//               "time" => 1544007816,
//               "instrument_id" => 58,
//               "source_id" => 6]
//     \App\Price::create($data);
// });


Route::model('usermeta', 'App\UserMeta');
Route::apiResource('usermeta','UserMetaController');
