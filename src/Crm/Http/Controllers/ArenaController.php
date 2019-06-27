<?php

namespace Vsb\Crm\Http\Controllers;

use DB;
use Log;
use \Excel;
use App\User;
use \Datetime;
use DataTables;
use \DateTimeZone;
use App\CompFlor;
use Carbon\Carbon;
use App\CompReserve;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Auth\RegisterController;

class ArenaController extends Controller
{
	public function copyAccounts()
	{
		$paracy = DB::connection('windigo_db')->table('tb_accounts')->get()->toArray();

		foreach ($paracy as $key => $value)
		{
			DB::table('users')
			   ->join('accounts', 'users.id', '=', 'accounts.user_id')
			   ->where('users.id_user_club', '=', $value->id_user)
			   ->update(['accounts.amount' => $value->prachy]);
		}

		return 'true';
	}

	public function report(Request $request,$report=false){
		$period = [
			$request->input('date_from',date('Y-m-d h:i:s',strtotime('-5 days',time()))),
			$request->input('date_to',date('Y-m-d h:i:s'))
		];
		$period[0] = date('Ymd0000',strtotime($period[0]));
		$period[1] = date('Ymd0000',strtotime('+1 day',strtotime($period[1])));
		$rep = [];
		if($report == 'cheque'){}
		else{
			$rep = DB::connection('windigo_db')->table('tb_game_time')->whereBetween('g_date',$period)
				->select(DB::raw("date_format(concat(substring(g_date,1,4),'-',substring(g_date,5,2),'-',substring(g_date,7,2),' ',substring(g_date,9,2),':',substring(g_date,11,2),':00'),'%Y-%m-%d %H:%i:%s') as date1,
				date_format(date_add(concat(substring(g_date,1,4),'-',substring(g_date,5,2),'-',substring(g_date,7,2),' ',substring(g_date,9,2),':',substring(g_date,11,2),':00'),INTERVAL g_time MINUTE),'%Y-%m-%d %H:%i:%s') as date2,
				g_date,
				g_time,
				id_user"))
				->get();
		}

		return response()->json($rep,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE);
	}
	public function karta(Request $request){
		$period = [
			date("YmdHi",time()+3*60*60),
			date("YmdHi",strtotime("+5 minutes")+3*60*60),
		];
		$res = DB::connection('windigo_db')
				->table('tb_comp_flor')
				->leftJoin('tb_chat_user_online',function($join){
					$join->where('tb_chat_user_online.u_status','=',1)->where('tb_chat_user_online.id_comp','=','tb_comp_flor.id');
				})
				->leftJoin('tb_users','tb_chat_user_online.id_user','=','tb_users.id')
				->select(DB::raw("DISTINCT
					tb_comp_flor.id as id,
					tb_comp_flor.id_comp as comp,
					tb_comp_flor.id_categor as vip,
				    tb_comp_flor.mac_adre as mac,
				    tb_comp_flor.c_status as active,
				    tb_chat_user_online.u_status as status,
				  	tb_users.id_user_crm as user_id,
				  	tb_users.u_name as name
					"))
				;
		return response()->json([
			"period"=>$period,
			"data"=>DB::connection('windigo_db')->select("select DISTINCT
						tb_comp_flor.id as id,
						tb_comp_flor.id_comp as comp,
					    tb_comp_flor.mac_adre as mac,
						tb_comp_flor.id_categor as vip,
					    tb_comp_flor.c_status as active,
					    tb_chat_user_online.u_status as status,
					  	tb_users.id_user_crm as user_id,
					  	tb_users.U_name as name
						 from `tb_comp_flor` left join `tb_chat_user_online` on `tb_chat_user_online`.`u_status` <> 0 and `tb_chat_user_online`.`id_comp` = tb_comp_flor.id left join `tb_users` on `tb_chat_user_online`.`id_user` = `tb_users`.`id`")
		],200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE);
	}
	public function panel(Request $request){

		$time = time()+(3*60*60);
		$date=date('Ymd',$time).'0000';
		$periodArr = [
			date('YmdHi',$time),
			date('YmdHi',strtotime('+1 minutes',$time)),
		];
		$period = json_decode(json_encode([
			// "start"=>date('Ymdhi',strtotime('-1 minutes',time())),
			"start"=>$periodArr[0],
			"end"=>$periodArr[1]
		]));
		$res = [
			"period"=>$periodArr,
			"free"=>CompFlor::where('c_status',1)->count(),
			"users"=>DB::connection('windigo_db')
				->table('tb_chat_user_online')
				->where('u_status',1)
				->where('id_comp','<>',0)
				->count(),
			"gamers"=>DB::connection('windigo_db')
				->table('tb_comp_reservation')
				->where('status',1)
				->where('r_date_start','>=',$date)
				->count(),
			"invoices"=>DB::connection('windigo_db')
				->table('tb_accounts_history')
				->where('h_type_to',22)
				->where('h_date','>=',$date)
				->sum('h_summa'),
			"sos"=>DB::connection('windigo_db')
				->table('tb_sos')
				->where('s_date','>=',$date)
				->count(),
			"reservations" =>DB::connection('windigo_db')
				->table('tb_comp_reservation')
				->where('status','<',1)
				->where(function($query)use($periodArr){
					$query->whereBetween('r_date_start',$periodArr)
						->orWhereBetween('r_date_end',$periodArr);
					// $query->where(function($q)use($period){$q->where('r_date_start','>=',$period->start)->where('r_date_end','<=',$period->end);})
					// 	->orWhere(function($q)use($period){$q->where('r_date_start','<=',$period->start)->where('r_date_end','>=',$period->end);})
					// 	->orWhere(function($q)use($period){$q->where('r_date_start','>=',$period->start)->where('r_date_end','<=',$period->end);})
					// 	->orWhere(function($q)use($period){$q->where('r_date_start','<=',$period->start)->where('r_date_end','>=',$period->end);});
				})->count(),
			"plan" =>DB::connection('windigo_db')->table('tb_comp_reservation')
				->where('status','<',2)
				->where(function($query)use($periodArr){
					$query->whereBetween('r_date_start',$periodArr)
						->orWhereBetween('r_date_end',$periodArr);
					// $query->where(function($q)use($period){$q->where('r_date_start','>=',$period->start)->where('r_date_end','<=',$period->end);})
					// 	->orWhere(function($q)use($period){$q->where('r_date_start','<=',$period->start)->where('r_date_end','>=',$period->end);})
					// 	->orWhere(function($q)use($period){$q->where('r_date_start','>=',$period->start)->where('r_date_end','<=',$period->end);})
					// 	->orWhere(function($q)use($period){$q->where('r_date_start','<=',$period->start)->where('r_date_end','>=',$period->end);});
				})->count()
		];
		return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE);
	}
	public function graph(Request $request,$report='reservation'){
		$period = [
			$request->input('date_from',date('Y-m-d h:i:s',strtotime('-5 days',time()))),
			$request->input('date_to',date('Y-m-d h:i:s'))
		];
		$period[0] = date('Ymd0000',strtotime($period[0]));
		$period[1] = date('Ymd0000',strtotime('+1 day',strtotime($period[1])));

		$period = json_decode(json_encode($period));

		$rep = DB::connection('windigo_db')->table('tb_game_time')->join('tb_comp_flor','tb_comp_flor.id','=','tb_game_time.id_comp')->whereBetween('tb_game_time.g_date',$period)
			->select(DB::raw("date_format(concat(substring(tb_game_time.g_date,1,4),'-',substring(tb_game_time.g_date,5,2),'-',substring(tb_game_time.g_date,7,2),' ',substring(tb_game_time.g_date,9,2),':',substring(tb_game_time.g_date,11,2),':00'),'%Y-%m-%d %H:%i:%s') as date1,
			date_format(date_add(concat(substring(tb_game_time.g_date,1,4),'-',substring(tb_game_time.g_date,5,2),'-',substring(tb_game_time.g_date,7,2),' ',substring(tb_game_time.g_date,9,2),':',substring(tb_game_time.g_date,11,2),':00'),INTERVAL g_time MINUTE),'%Y-%m-%d %H:%i:%s') as date2,
			tb_game_time.g_date,
			tb_game_time.g_time,
			tb_comp_flor.id_categor,
			tb_game_time.id_user"))
			->get();
		$money = DB::connection('windigo_db')->table('tb_accounts_history')->whereBetween('h_date',$period)->where('h_type',21)
			->select(DB::raw("date_format(concat(substring(h_date,1,4),'-',substring(h_date,5,2),'-',substring(h_date,7,2),' ',substring(h_date,9,2),':',substring(h_date,11,2),':00'),'%Y-%m-%d %H:%i:%s') as date, h_summa as amount"))
			->get();
		$res =[
			"period"=>[preg_replace('/(\d{4})(\d{2})(\d{2})\d+/im',"$1-$2-$3 00:00:00",$period[0]),preg_replace('/(\d{4})(\d{2})(\d{2})0000/',"$1-$2-$3 00:00:00",$period[1])],
			"reservation" => DB::connection('windigo_db')->table('tb_comp_reservation')->whereBetween('r_date_start',$period)->orderBy('r_date_start')->get(),
			"sos" => DB::connection('windigo_db')->table('tb_sos')->whereBetween('s_date',$period)->orderBy('s_date')->get(),
			"comp" => DB::connection('windigo_db')->table('ah_comp_flor')->whereBetween('created_at',[preg_replace('/(\d{4})(\d{2})(\d{2})0000/',"$1-$2-$3 00:00:00",$period[0]),preg_replace('/(\d{4})(\d{2})(\d{2})0000/',"$1-$2-$3 00:00:00",$period[1])])->orderBy('id_comp')->get(),
			"chat" => DB::connection('windigo_db')->table('ah_chat_user_online')->whereBetween('created_at',[preg_replace('/(\d{4})(\d{2})(\d{2})0000/',"$1-$2-$3 00:00:00",$period[0]),preg_replace('/(\d{4})(\d{2})(\d{2})0000/',"$1-$2-$3 00:00:00",$period[1])])->orderBy('id_comp')->get(),
			"report" => $rep,
			"money" => $money,
			"comps"=>DB::connection('windigo_db')->table('tb_comp_flor')->select(DB::raw('id_categor as categor,count(*) as cnt'))->groupBy('id_categor')->get()
		];
		return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE);
	}

	public function  transferWindigo(Request $request)
	{
		$createdDate = Carbon::now('Europe/Kiev');
		$data = collect($request->all())->except('_token')->toArray();
		$data = array_merge($data, ['user_admin_id' => Auth::id()]);
		$validator = Validator::make($data, [
			'user_admin_id' => ['required', Rule::exists('users', 'id')->where(function ($query) {
                            	$query->where('id', '=', Auth::id())->where('rights_id', '>=', 10);
                        	}),
      		],
            'user_id' => 'required|exists:windigo_db.tb_users,id',
            'amount' => 'required|integer|min:1|max:10000000',
            'description' => 'required|string|max:50',
        ]);


        if($validator->fails())
        {
            return response()->json($validator->errors());
        }

		if($data['typeTransfers'] == 'add')
		{
			$type = 'deposit';
		}
		else if($data['typeTransfers'] == 'minus')
		{
			$windigoNow = DB::connection('windigo_db')->table('tb_accounts')->where('id_user', '=', $data['user_id'])->value('prachy');
			$courseWindigo = DB::connection('windigo_db')->table('tb_club_setting')->where('id', '=', 1)->value('val_int');

			if(intval($windigoNow) < intval($data['amount']) * intval($courseWindigo))
			{
				return response()->json(['amount' => 'Вы не можете снять с клиента сумму превышающюю его счёт']);
			}

			$type = 'creadit';
			$data['amount'] = -$data['amount'];
		}

		$user = User::where('id_user_club', '=', $data['user_id'])->first();
		$user->history()->create(['user_id'=> $user->id, 'type'=>$type, 'object_id' => Auth::id(),
							      'object_type'=>'User',
							      'description' => 'Перевод от(user_crm_id): ' . Auth::id() . ' Перевод кому(user_crm_id): '. $data['user_id'] . ' Время: ' . $createdDate
							       . 'Сумма (грн):' . $data['amount']  . ' Описание: ' . $data['description']]);

		$hash =  md5($data['amount']  . $createdDate);
		$idHash = DB::table('transfers_confirmation')->insertGetId(['amount' => $data['amount'], 'user_arena_id' => $data['user_id'], 'user_admin_id' => $data['user_admin_id'],
														           'status' => 0, 'hash_code' => $hash, 'created_at' => $createdDate, 'description' => $data['description']]);
        $client = new \GuzzleHttp\Client();
		$response = $client->get('https://web.windigoarena.gg/php/crm_brana.php?add_prachy_new22=' . $hash . '&ad=' . $idHash);

		$courseWindigo = DB::connection('windigo_db')->table('tb_club_setting')->where('id', '=', 1)->value('val_int');

        return response()->json(['success' => true, 'courseWindigo' => $courseWindigo]);
	}

	public function transferWindigoHistory(Request $request)
	{
		if($request->input('type_history') !== 'crm')
		{
			$history = DB::connection('windigo_db')
						 ->table('tb_accounts_history')
						 ->leftJoin('tb_accounts', 'tb_accounts_history.acc_from', '=', 'tb_accounts.id')
						 ->leftJoin('tb_users', 'tb_accounts.id_user', '=', 'tb_users.id')
						 ->leftJoin('tb_accounts as accounts', 'tb_accounts_history.acc_to', '=', 'accounts.id')
						 ->leftJoin('tb_users as users', 'accounts.id_user', '=', 'users.id')
						 ->leftJoin('tb_accounts_index', 'tb_accounts_history.h_type', '=', 'tb_accounts_index.id')
						 ->select('users.u_name as to_u_name', 'users.id as to_id', 'tb_accounts_index.note',
						 		  'tb_users.u_name as from_u_name','tb_users.id as from_id', 'tb_accounts_history.*')
						 ->where(function($query) use($request) {
							$query->where('tb_accounts.id_user', '=', $request->input('user_id'))
								  ->orWhere('accounts.id_user', '=', $request->input('user_id'));});

			if(!empty($request->input('type_history')))
			{
				$history = $history->where('h_type', '=', $request->input('type_history'));
			}

			return DataTables::of($history->get())
	                        ->editColumn('h_date',function($date) {
						        return Carbon::parse($date->h_date);
						     })
	                        ->editColumn('to_u_name',function($data) {
	                        	$data->to_u_name = $data->to_u_name ?? '';
	                        	$data->to_id = $data->to_id ?? '';

	                        	return $data->to_u_name . ' -- Id user arena(' . $data->to_id . ')' ;
	                        })
	                        ->editColumn('from_u_name',function($data) {
	                        	$data->from_u_name = $data->from_u_name ?? '';

	                        	return $data->from_u_name . ' -- Id user arena(' . $data->from_id . ')' ;
	                        })
	                        ->make(true);
		}
		elseif($request->input('type_history') === 'crm')
		{
			$crmTransfer = DB::table('transfers_confirmation')
							->leftJoin('users', 'transfers_confirmation.user_admin_id', '=', 'users.id')
							->leftJoin('users as tb_users', 'transfers_confirmation.user_arena_id', '=', 'tb_users.id_user_club')
							->select('transfers_confirmation.user_arena_id',DB::raw('CONCAT(users.name, " ", users.surname) as from_u_name'),
									 DB::raw('CONCAT(tb_users.name, " ", tb_users.surname) as to_u_name'),
									 'transfers_confirmation.id', 'transfers_confirmation.amount as h_summa',
									 'transfers_confirmation.description as note', 'transfers_confirmation.created_at as h_date')
							->where('transfers_confirmation.user_arena_id', '=', $request->input('user_id'))
							->get();


			return DataTables::of($crmTransfer)->make(true);
		}
	}

	public function getTransferType(Request $request)
	{
		$typeHistory = DB::connection('windigo_db')
					 ->table('tb_accounts_history')
					 ->leftjoin('tb_accounts', function($join){
                			$join->on('tb_accounts_history.acc_to','=','tb_accounts.id');
                			$join->orOn('tb_accounts_history.acc_from','=','tb_accounts.id');
            		 })
					 ->join('tb_accounts_index', 'tb_accounts_history.h_type', '=', 'tb_accounts_index.id')
					 ->select("tb_accounts_history.h_type", 'tb_accounts_history.id', 'tb_accounts_index.note', 'tb_accounts_index.id')
					 ->where('tb_accounts.id_user', '=', $request->input('user_id'))
					 ->get()
					 ->unique('id');

		return response()->json($typeHistory);
	}

	public function getAdminUsers(Request $request)
	{
		$admins = DB::connection('windigo_db')
					 ->table('tb_users')
					 ->where('tb_users.admin', '=', 1)
					 ->get();

		return DataTables::of(collect($admins))
						 ->addColumn('buttons',
	                            function($row) {
	                                return "<button id-user='" . $row->id . "' title='Изменить данные'  type ='button' class='btn btn-default  fa fa-pencil edit-user'></button>
	                                &nbsp;<button type ='button' data-toggle='tooltip' title='Удалить как из админов' class='btn btn-danger fa fa-times close-user' id-user='" . $row->id . "' ></button>";
	                     })
	                     ->rawColumns(['buttons'])
						 ->make(true);
	}

	public function getLimitWindigo(Request $request)
	{
		$limit  = DB::connection('windigo_db')
		            ->table('tb_club_setting')
		            ->where('tb_club_setting.id', '=', 5)
		            ->first();

		return response()->json($limit);
	}

	public function updateLimitWindigo(Request $request)
	{
		$validator = Validator::make(['limit' => $request->input('limit')], [
            'limit' => 'required|integer|min:0|max:100000000',
        ]);

		if($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $limit = DB::connection('windigo_db')
		            ->table('tb_club_setting')
		            ->where('tb_club_setting.id', '=', 5)
		            ->update(['val_int' => $request->input('limit')]);

		return response()->json(['success' => true]);
	}

	public function getStaticticPlay(Request $request)
	{
		$result = [];
		$statistic = DB::connection('windigo_db')
		  			   ->table('tb_game_stat')
		  			   ->leftJoin('tb_game_id_list', 'tb_game_stat.id_game', '=', 'tb_game_id_list.id')
		  			   ->select('tb_game_stat.*' , 'tb_game_id_list.*', 'tb_game_id_list.id as game_id')
		  			   ->get()
		  			   ->toArray();

		foreach ($statistic as $key => $value)
		{

			if(!empty($value->date_start) && !empty($value->date_end))
			{
				$start = Carbon::parse($value->date_start)->timestamp ;
				$end = Carbon::parse($value->date_end)->timestamp;

				$statistic[$key]->all_date = $end - $start;
			}
		}

		$statistic = collect($statistic)->groupBy('game_id')->toArray();

		foreach ($statistic as $key => $value)
		{
			$id = $value[0]->game_id;
			$game_name = $value[0]->note;
			$value = collect($value);
			$countTime = $value->sum('all_date');
			$countWindigo = $value->sum('sum_wnd');
			$result[$id] = [$game_name, $countTime, $countWindigo];
		}

		return response()->json($result);
	}

	public function showAdminUsers(Request $request)
	{
		$userArena = DB::connection('windigo_db')
					   ->table('tb_users')
					   ->where('id', '=', $request->input('id'))
					   ->first();

		$user = User::find($userArena->id_user_crm);

		return response()->json($user);
	}

	public  function addAdminUsers(Request $request)
	{
		$data = collect($request->all())->except('_token')->toArray();
		$validator = Validator::make(['name' => $request->input('u_name'),
								      'last_name' => $request->input('surname'),
									  'login' => $request->input('login'),
									  'password' => $request->input('u_passw'),
								   	  'email' => $request->input('email'),
									  'phone' => $request->input('teleph')],
									  [ 'name' => 'required|max:30',
						                'login' => 'required|max:30|unique:windigo_db.tb_users,u_name',
						                'password' => 'required|string|max:1000000',
						                'email' => 'required|string|email|max:30|unique:windigo_db.tb_users|unique:users',
						                'phone' => 'required|string|max:20|unique:windigo_db.tb_users,teleph|max:20|unique:users,phone',
						                'last_name' => 'required|string|max:30'
        ]);

		if($validator->fails())
        {
            return response()->json($validator->errors());
        }


		$data['admin'] = 1;
		$data['secretkey'] = uniqid();
		$secret_key = uniqid();
		$new_password_hash = md5($data['u_passw'] . ":" . $data['secretkey']);
		// $data['surname'] = 'arena';
		$tz = 'Europe/Kiev';
		$dt = new DateTime("now", new DateTimeZone($tz));
		$dateSupport = $dt->format('Y'). $dt->format('m') . $dt->format('d') . $dt->format('H') . $dt->format('i');
		$dataCrm = ['name' => $data['u_name'], 'surname' => $data['surname'], 'email' => $data['email'], 'phone' => $data['teleph'], 'password' => $data['u_passw'],
					'rights_id' => 7];

		$createAdminCrm = new RegisterController();
		$userCrm = $createAdminCrm->create($dataCrm);

		// DB::transaction(function () use($data, $dateSupport, $new_password_hash) {
			$adminId = DB::connection('windigo_db')
					   ->table('tb_users')
					   ->insertGetId([
					   		'u_name' => $data['u_name'], 'u_passw' => $new_password_hash, 'secretkey' => $data['secretkey'], 'email' => $data['email'],
					   		'teleph' => $data['teleph'], 'admin' => $data['admin'], 'u_login' => $data['login'], 'id_user_crm' => $userCrm->id ,
						]);
			$settingAdmin = DB::connection('windigo_db')
							  ->table('tb_user_setting')
							  ->insertGetId([
							  	'id_user' => $adminId, 'name1' => $data['surname'], 'name2' => $data['u_name']
							  ]);
			$accountAdmin = DB::connection('windigo_db')
						      ->table('tb_accounts')
						      ->insertGetId(['id_user' => $adminId]);
			$generalChat = DB::connection('windigo_db')
							 ->table('tb_chat_group_user')
							 ->insertGetId([
							 	'user_id' => $adminId,
							 	'id_group' => 1
							 ]);
			$support  = DB::connection('windigo_db')
						  ->table('tb_chat_user_friends')
						  ->insertGetId([
						  	'id_user_from' => $adminId, 'id_user_to' => 23, 'i_status' => 1, 'i_date' => $dateSupport
						  ]);
			$onlineUser = DB::connection('windigo_db')
							->table('tb_chat_user_online')
							->insertGetId([
								'id_user' => $adminId
							]);
		// });

		$rangUser = DB::connection('windigo_db')->table('tb_rang')->select('id', 'r_bonus', 'r_name')->where('r_sort', '=', 0)->first();

        if(!empty($rangUser))
        {
           $rang[0]= $rangUser->id;
           $rang[1]= $rangUser->r_name;
           $rang[2]= $rangUser->r_bonus;
        }

		$id_user_club_to = $adminId;
		$cena = $rang[2];


        $adminAccount = DB::connection('windigo_db')->table('tb_accounts')->select('id', 'prachy')->where('id_user', '=', $adminId)->first();

       	if(!empty($adminAccount))
       	{
       		$res[0] = $adminAccount->id;
       		$res[1] = $adminAccount->prachy;
       	}

        $acc_to = $res;
       	$type[0][0] = 24;
		$type[0][1] = 0;
		$type[0][2] = 45;
		$id_acc_from = 0;
		$id_acc_to = $acc_to[0];
		$cena = $rang[2];

		DB::connection('windigo_db')->statement('UPDATE   tb_accounts SET   prachy = prachy - ' . $cena . ' WHERE   tb_accounts.id=' . $id_acc_from . ';');
		DB::connection('windigo_db')->statement('UPDATE   tb_accounts SET   prachy = prachy + ' . $cena . ' WHERE   tb_accounts.id=' . $id_acc_to . ';');


		$id_trans = DB::connection('windigo_db')->table('tb_accounts_history')
									            ->insertGetId(['acc_from' => $id_acc_from, 'acc_to' => $id_acc_to, 'h_summa' => $cena, 'h_date' => $dateSupport,
															   'h_type' => $type[0][0], 'h_type_from' => $type[0][1], 'h_type_to' => $type[0][2]]);

		$indexText = DB::connection('windigo_db')
					   ->table('tb_accounts_index')
					   ->select('id_index_text', 'text_mess')
					   ->where('id', '=', $type[0][2])
					   ->first();
		$text = sprintf($indexText->id_index_text,$cena,$rang[1]);
		$createNotification = DB::connection('windigo_db')
								->table('tb_notifications')
								->insertGetId(['n_date' => $dateSupport, 'id_user' => $adminId, 'n_text' => $text, 'n_type' => $type[0][0], 'id_trans' => $id_trans]);

		return response()->json(['success' => true]);
	}

	public function updateAdminUsers(Request $request)
	{
		$validator = Validator::make(['name' => $request->input('u_name'),
								      'last_name' => $request->input('surname'),
									  'login' => $request->input('login'),
								   	  'email' => $request->input('email'),
									  'phone' => $request->input('teleph')],
									  [ 'name' => 'required|string|max:30',
						                'login' => 'required|string|max:30|unique:windigo_db.tb_users,u_name,'. $request->input('id', 0),
						                'email' => 'required|string|email|max:30|unique:windigo_db.tb_users,email,' . $request->input('id', 0),
						                'phone' => 'required|string|max:20|unique:windigo_db.tb_users,teleph,' . $request->input('id', 0),
						                'last_name' => 'required|string|max:30'
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $updateAdminArena =  DB::connection('windigo_db')
		        			    ->table('tb_users')
		        				->where('tb_users.id', '=', $request->input('id'))
		        				->update([
							   		'u_name' => $request->input('u_name'), 'email' => $request->input('email'),
							   		'teleph' => $request->input('teleph'),  'u_login' => $request->input('login') ,
								]);

		$adminArena = DB::connection('windigo_db')
						->table('tb_user_setting')
						->where('tb_user_setting.id_user', '=', $request->input('id'))
						->update(['name1' => $request->input('surname'), 'name2' => $request->input('u_name')]);
		$userCrm = DB::connection('windigo_db')
					  ->table('tb_users')
					  ->where('id', '=', $request->input('id'))
					  ->value('id_user_crm');

		$updateAdminCrm = User::where('id', '=', $userCrm)->update([
					   		'name' => $request->input('u_name'), 'email' => $request->input('email'),
					   		'phone' => $request->input('teleph'),  'surname' => $request->input('surname') ,
						]);

		return response()->json(['success' => true]);
	}

	public function disableAdminUsers(Request $request)
	{

		$validator = Validator::make(['id' => Auth::user()->id], [
            'id' => ['required',
                        Rule::exists('users')->where(function ($query) {
                            $query->where('id', '=', Auth::user()->id)->where('rights_id', '>=', 7);
                        }),
            ]
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $userCrm = DB::connection('windigo_db')
					  ->table('tb_users')
					  ->where('id', '=', $request->input('id'))
					  ->value('id_user_crm');
		$disableAdminCrm = User::where('id', '=', $userCrm)->update(['rights_id' => 0]);
		$adminArena = DB::connection('windigo_db')
						->table('tb_users')
						->where('tb_users.id', '=', $request->input('id'))
						->update(['admin' => 0]);

		return response()->json(['success' => true]);
	}

	public function getBannedSite(Request $request)
	{
		$baneed = DB::connection('windigo_db')
				    ->table('tb_porno_site')
				    ->get();

		return DataTables::of(collect($baneed))
						 ->addColumn('buttons',
	                            function($row) {
	                                return "<button id-site='" . $row->id . "' title='Изменить данные'  type ='button' class='btn btn-default  fa fa-pencil edit-site'></button>
	                                &nbsp;<button type ='button' data-toggle='tooltip' title='Удалить из списка запрещенных' class='btn btn-danger fa fa-trash-o delete-site' id-site='" . $row->id . "' ></button>";
	                     })
	                     ->rawColumns(['buttons'])
						 ->make(true);
	}

	public function showBannedSite(Request $request)
	{
		$site = DB::connection('windigo_db')
					   ->table('tb_porno_site')
					   ->where( 'tb_porno_site.id', '=', $request->input('id'))
					   ->first();

		return response()->json($site);
	}

	public function addBannedSite(Request $request)
	{
		$validator = Validator::make($request->all(), [
            'name_site' => 'required|string|max:150|unique:windigo_db.tb_porno_site,name_site',
            'url_site' => 'required|string|max:150|unique:windigo_db.tb_porno_site,url_site',
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $site = DB::connection('windigo_db')
					   ->table('tb_porno_site')
					   ->insertGetId([ 'url_site' => $request->input('url_site'), 'name_site' => $request->input('name_site')]);

		return response()->json(['success' => true]);
	}

	public function updateBannedSite(Request $request)
	{
		$validator = Validator::make($request->all(), [
			'id' => 'integer|exists:windigo_db.tb_porno_site,id',
            'name_site' => 'required|string|max:150|unique:windigo_db.tb_porno_site,name_site,' . $request->input('id', 0),
            'url_site' => 'required|string|max:150|unique:windigo_db.tb_porno_site,url_site,' . $request->input('id', 0),
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors());
        }

       	$site = DB::connection('windigo_db')
				  ->table('tb_porno_site')
				  ->where('id', '=', $request->input('id'))
				  ->update([ 'url_site' => $request->input('url_site'), 'name_site' => $request->input('name_site')]);

		return response()->json(['success' => true]);
	}

	public function removeBannedSite(Request $request)
	{
		$validator = Validator::make($request->all(), [
            'id' => 'integer|exists:windigo_db.tb_porno_site,id'
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors(),400);
        }

        $site = DB::connection('windigo_db')
				  ->table('tb_porno_site')
				  ->where('id', '=', $request->input('id'))
				  ->delete();

		return response()->json(['success' => true]);
	}

	public function getListPartners(Request $request)
	{
		$partnerUser = User::where('rights_id', '=', 3)->get()->toArray();

		foreach ($partnerUser as $key => $value)
		{
			$partnerInfo = DB::connection('windigo_db')
					         ->table('tb_partner')
					         ->where('tb_partner.crm_partner_id', '=', $value['id'])
					         ->first();

			if(!empty($partnerInfo))
			{
				// dd($partnerInfo[0]);
				$partnerUser[$key] = array_merge($value, ['number_egr' => $partnerInfo->number_egr, 'bank_details' => $partnerInfo->bank_details, 'place_registration' => $partnerInfo->place_registration,
														  'contact_person' => $partnerInfo->contact_person]);
				// $partnerUser[$key] = [$partnerUser[$key], $partnerInfo[0]];
			}
			else
			{
				unset($partnerUser[$key]);
			}
		}

		return DataTables::of(collect($partnerUser))
						 ->addColumn('buttons',
	                            function($row) {
	                                return "<button id-partner='" . $row['id'] . "' title='Изменить данные'  type ='button' class='btn btn-default  fa fa-pencil edit-partner'></button>
	                                &nbsp;<button type ='button' data-toggle='tooltip' title='Удалить' class='btn btn-danger fa fa-trash-o delete-partner' id-partner='" . $row['id'] . "' ></button>";
	                     })
	                     ->rawColumns(['buttons'])
						 ->make(true);

	}

	public function showPartner(Request $request)
	{
		$partnerUser = User::find($request->input('id'));
		$partnerInfo =  DB::connection('windigo_db')
					       ->table('tb_partner')
					       ->where('tb_partner.crm_partner_id', '=', $partnerUser['id'])
					       ->first();

		$partnerUser = collect($partnerUser)->toArray();
		$partnerUser = array_merge($partnerUser, ['number_egr' => $partnerInfo->number_egr, 'bank_details' => $partnerInfo->bank_details, 'place_registration' => $partnerInfo->place_registration,
														  'contact_person' => $partnerInfo->contact_person, 'partner_info_id' => $partnerInfo->id]);

		return response()->json($partnerUser);

	}

	public function updatePartner(Request $request)
	{
		$validator = Validator::make($request->all(), [
							  	'number_egr' => 'required|integer|digits:8|unique:windigo_db.tb_partner,number_egr,' . $request->input('idInfo'),
							  	'bank_details' => 'required|string|max:250',
							  	'place_registration' => 'required|string|max:250',
							  	'contact_person' => 'required|string|max:250',
				                'login' => 'required|max:30',
				                'email' => 'required|string|email|max:30|unique:users,email,' . $request->input('id'),
				                'phone' => 'required|integer|digits_between:1,20|unique:users,phone,' . $request->input('id') ]);

		if($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $partnerUser = User::where('id', '=', $request->input('id'))->update(['name' => $request->input('login'),
																		      'surname' => $request->input('login'),
																		      'email' => $request->input('email'),
																		      'phone' => $request->input('phone')]);
        $partnerInfo = DB::connection('windigo_db')
        				 ->table('tb_partner')
        				 ->where('crm_partner_id', '=', $request->input('id'))
        				 ->update(['number_egr' => $request->input('number_egr'), 'bank_details' => $request->input('bank_details'),
				  				 'place_registration' => $request->input('place_registration'), 'contact_person' => $request->input('contact_person')]);

        return response()->json(['success' => true]);
	}

	public function addPartners(Request $request)
	{
		$validator = Validator::make($request->all(), [
									  	'number_egr' => 'required|integer|digits:8|unique:windigo_db.tb_partner,number_egr',
									  	'bank_details' => 'required|string|max:250',
									  	'place_registration' => 'required|string|max:250',
									  	'contact_person' => 'required|string|max:250',
						                'login' => 'required|max:30',
						                'password' => 'required|string',
						                'email' => 'required|string|email|max:30|unique:users,email',
						                'phone' => 'required|integer|digits_between:1,20|unique:users,phone' ]);

		if($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $dataCrm = ['name' => $request->input('login'),
				    'surname' => $request->input('login'),
				    'email' => $request->input('email'),
				    'phone' => $request->input('phone'),
				    'password' => $request->input('password'),
					'rights_id' => 3];

		$createAdminCrm = new RegisterController();
		$partnerCrm = $createAdminCrm->create($dataCrm);
		$partner = DB::connection('windigo_db')
					  ->table('tb_partner')
					  ->insertGetId(['number_egr' => $request->input('number_egr'), 'bank_details' => $request->input('bank_details'),
					  				 'place_registration' => $request->input('place_registration'), 'contact_person' => $request->input('contact_person'),
					  				 'crm_partner_id' => $partnerCrm->id
					  ]);

		return response()->json(['success' => true]);
	}

	public function removePartner(Request $request)
	{

		$validator = Validator::make(['id' => Auth::user()->id], [
            'id' => ['required',
                        Rule::exists('users')->where(function ($query) {
                            $query->where('id', '=', Auth::user()->id)->where('rights_id', '>=', 7);
                        }),
            ]
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors());
        }

		$disableAdminCrm = User::where('id', '=', $request->input('id'))->update(['rights_id' => 0]);


		return response()->json(['success' => true]);
	}

	public function getListSmo(Request $request)
	{
		$smoUsers = User::where('rights_id', '=', 4)->get()->toArray();

		return DataTables::of(collect($smoUsers))
						 ->addColumn('buttons',
	                            function($row) {
	                                return "<button id-smo='" . $row['id'] . "' title='Изменить данные'  type ='button' class='btn btn-default  fa fa-pencil edit-smo'></button>
	                                &nbsp;<button type ='button' data-toggle='tooltip' title='Удалить' class='btn btn-danger fa fa-trash-o delete-smo' id-smo='" . $row['id'] . "' ></button>";
	                     })
	                     ->rawColumns(['buttons'])
						 ->make(true);
	}

	public function addSmo(Request $request)
	{
		$data = array_merge($request->all(),['id_user' => Auth::id()]);
		$validator = Validator::make($data, [
			'id_user' => ['required',
                        Rule::exists('users','id')->where(function ($query) {
                            $query->where('id', '=', Auth::id())->where('rights_id', '>=', 7);
                        }),
      		],
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20:users|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors());
        }

		$dataCrm = ['name' => $data['name'], 'surname' => $data['surname'], 'email' => $data['email'],
					'phone' => $data['phone'], 'password' => $data['password'], 'rights_id' => 4];
		$createAdminCrm = new RegisterController();
		$userCrm = $createAdminCrm->create($dataCrm);

		return response()->json(['success' => true]);
	}

	public function showSmo(Request $request)
	{
		$smo = User::find($request->input('id'));

		return response()->json($smo);
	}

	public function updateSmo(Request $request)
	{
		$data = array_merge($request->all(),['id_user' => Auth::id()]);
		$validator = Validator::make($data, [
			'id_user' => ['required', Rule::exists('users', 'id')->where(function ($query) {
                            $query->where('id', '=', Auth::id())->where('rights_id', '>=', 7);
                        }),
      		],
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $request->input('id'),
            'phone' => 'required|string|max:20:users|unique:users,phone,' . $request->input('id'),
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors());
        }

		$updateAdminCrm = User::where('id', '=', $request->input('id'))->update([
					   		'name' => $request->input('name'), 'email' => $request->input('email'),
					   		'phone' => $request->input('phone'),  'surname' => $request->input('surname') ,
						]);

		return response()->json(['success' => true]);
	}

	public function removeSmo(Request $request)
	{

		$validator = Validator::make(['id_user' => Auth::id()], [
            'id_user' => ['required', Rule::exists('users', 'id')->where(function ($query) {
                            $query->where('id', '=', Auth::id())->where('rights_id', '>=', 7);
                        }),
      		],
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors(),400);
        }

        $disableCashier = User::where('id', '=', $request->input('id'))->update(['rights_id' => 0]);

		return response()->json(['success' => true]);
	}

	public function getExcelReport(Request $request)
	{
		$data = [['Дата' => '21.08.2018', 'ID user' => '88', 'Поступление (грн)' =>  100, 'Тип' => "Оплата наличными"],
				['Дата' => '22.08.2018', 'ID user' => '62', 'Поступление (грн)' =>  193, 'Тип' => "Оплата LiqPay"]];

		return Excel::create('report', function($excel) use ($data) {
						$excel->sheet('mySheet', function($sheet) use ($data)
	        			{
							$sheet->fromArray($data);
	        			});
				})->download();

		// $allSum = DB::connection('windigo_db')
		// 			->table('tb_partner')
		// 			->select('crm_partner_id', 'money')
		// 			->whereIn('crm_partner_id',[588,685])
		// 			->get();

		// $partnersId = $allSum->pluck('crm_partner_id')->unique();
		// $partners = User::select(DB::raw('CONCAT(name, " ", surname) AS full_name'), 'id')->whereIn('id', $partnersId)->get();

		// foreach ($allSum as $key => $value)
  //       {
  //         $allSum[$key]->partner_name = $partners->where('id', '=', $value->crm_partner_id)->pluck('full_name')[0];
  //         $allSum[$key] = collect($allSum[$key])->toArray();
  //       }

  //     	$allSum = $allSum->toArray();

		// return Excel::create('report', function($excel) use ($allSum) {
		// 					$excel->sheet('mySheet', function($sheet) use ($allSum)
		// 	    			{
		// 						$sheet->fromArray($allSum);
		// 	    			});
		// 			})
		// 	       ->download();

		// $productSales = DB::connection('windigo_db')
  //                              ->table('tb_partner_purchases_user')
  //                              ->join('tb_partner_product', 'tb_partner_purchases_user.product_id', '=', 'tb_partner_product.id')
  //                              ->join('tb_partner_cashier', 'tb_partner_purchases_user.cashier_id', '=', 'tb_partner_cashier.crm_cashier_id')
  //                              ->join('tb_partner_purchase_code', 'tb_partner_purchases_user.sms_code_id', '=', 'tb_partner_purchase_code.id')
  //                              ->select('tb_partner_purchases_user.*', 'tb_partner_cashier.crm_cashier_id', 'tb_partner_cashier.crm_partner_id', 'tb_partner_product.name_product')
  //                              ->whereIn('tb_partner_cashier.crm_partner_id',[588,685])
  //                              ->where('tb_partner_purchase_code.status', '=', 1);

  //       if(!empty($request->input('fromDate')))
  //       {
  //           $productSales = $productSales->whereDate('tb_partner_purchases_user.buy_date', '>=', Carbon::parse($request->input('fromDate')));
  //       }

  //       if(!empty($request->input('toDate')))
  //       {
  //           $productSales = $productSales->whereDate('tb_partner_purchases_user.buy_date', '<=', Carbon::parse($request->input('toDate')));
  //       }

  //       $productSales = $productSales->get();
  //       $cashiersId = $productSales->pluck('crm_cashier_id')->unique();
  //       $partnersId = $productSales->pluck('crm_partner_id')->unique();
  //       $cashiers = User::select(DB::raw('CONCAT(name, " ", surname) AS full_name'), 'id')->whereIn('id', $cashiersId)->get();
  //       $partners = User::select(DB::raw('CONCAT(name, " ", surname) AS full_name'), 'id')->whereIn('id', $partnersId)->get();

  //       foreach ($productSales as $key => $value)
  //       {
  //         $productSales[$key]->cashier_name = $cashiers->where('id', '=', $value->crm_cashier_id)->pluck('full_name')[0];
  //         $productSales[$key]->partner_name = $partners->where('id', '=', $value->crm_partner_id)->pluck('full_name')[0];
  //         $productSales[$key]->all_sum = $productSales[$key]->count_product * $productSales[$key]->product_price;
  //         // dd(collect($productSales[$key])->toArray());
  //         $productSales[$key] = collect($productSales[$key])->toArray();
  //       }

  //       $productSales = $productSales->toArray();

		// return Excel::create('report', function($excel) use ($productSales) {
		// 		$excel->sheet('mySheet', function($sheet) use ($productSales)
  //   			{
		// 			$sheet->fromArray($productSales);
  //   			});
		// })->download();

	}

	public function getStatusBets(Request $request)
	{


	}

	public function createMyBet(Request $request)
	{
		$data = array_merge($request->all(),['id_user' => Auth::id()]);
		// dd($data);
		$validator = Validator::make($data, [
			'id_user' => ['required', Rule::exists('users', 'id')->where(function ($query) {
                            $query->where('id', '=', Auth::id())->where('rights_id', '>=', 7);
                        }),
      		],
            'betGameId' => 'required|integer|exists:windigo_db.tb_stavky_virtual_game_arena,id_game',
            'nameBet' => 'required|string|max:50',
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors());
        }

        if(!empty($data['matchInfo']))
        {
	        foreach ($data['matchInfo'] as $key => $value)
	        {
	        	$validator = Validator::make(['team_name1' => $value['team_1'], 'team_name2' => $value['team_2'], 'start_game' => $value['start_game']], [
		            'team_name1' => 'required|string|max:50',
		            'team_name2' => 'required|string|max:50',
		            'start_game' => 'required|date|after:now', // Проверить часовой пояс
	        	]);

	        	if($validator->fails())
	        	{
	            	return response()->json($validator->errors());
	        	}

	        	if(empty($value['forecast']))
	        	{
	        		return response()->json(['forecast' => false]);
	        	}

	        	foreach ($value['forecast'] as $key => $value)
	        	{
	        		$validator = Validator::make(['name_result' => $key, 'coefficient_1' => $value['coefficient_1'], 'coefficient_2' => $value['coefficient_2']], [
			            'name_result' => 'required|max:50',
			            'coefficient_1' => 'required|numeric|regex:/^(\d+(?:[\.\,]\d{1,3})?)$/|min:1|max:1000',
			            'coefficient_2' => 'required|numeric|regex:/^(\d+(?:[\.\,]\d{1,3})?)$/|min:1|max:1000',
	        		]);

		        	if($validator->fails())
		        	{
		            	return response()->json($validator->errors());
		        	}
	        	}
	        }
	    }
	    else
	    {
	    	return response()->json(['matchInfo' => false]);
	    }

		$getIdTournament = DB::connection('windigo_db')->table('tb_stavky_data_competition')->min('comp_id');
		$newIdTournament = $getIdTournament - 1;
	    $tournament = DB::connection('windigo_db')
	    				->table('tb_stavky_data_competition')
	    				->insertGetId(['comp_id' => $newIdTournament, 'comp_sport' => $data['betGameId'],
	    							   'comp_name' => $data['nameBet'], 'arena_club' => 1]);

	    foreach ($data['matchInfo'] as $key => $value)
	    {
	    	// dd($value['forecast']);
	    	$getInfoGame = DB::connection('windigo_db')
	    				  ->table('tb_stavky_data_comp_game')
	    				  ->selectRaw('min(team1_id) as team1_id , min(id_game) as id_game, min(team2_id) as team2_id')
	    				  ->first();
	    	$newIdgame = $getInfoGame->id_game - 1;
	    	$newIdTeam1 = $getInfoGame->team1_id - 1;
	    	$newIdTeam2 = $getInfoGame->team2_id - 1;

	    	$game = DB::connection('windigo_db')
	    			  ->table('tb_stavky_data_comp_game')
	    			  ->insert(['id_competit' => $newIdTournament, 'id_game' => $newIdgame,
	    			  			'team_name1' => $value['team_1'], 'team_name2' => $value['team_2'],
	    			  			'start_ts' => Carbon::parse($value['start_game'])->timestamp,
	    			  			'current_game_state' => 'notstarted', 'team1_id' => $newIdTeam1,
	    			  			'team2_id' => $newIdTeam2 ]);

	    	foreach ($value['forecast'] as $condition => $meanings)
	    	{
	    		$getIdmarket = DB::connection('windigo_db')
			    				 ->table('tb_stavky_data_comp_game_market')
			    				 ->min('id_market');
	    		$newIdMarket = $getIdmarket - 1;
	    		$createMarket = DB::connection('windigo_db')->table('tb_stavky_data_comp_game_market')
	    										->insert(['id_market' => $newIdMarket,
	    												  'id_game' => $newIdgame,
	    												  'name_templ' => $condition
	    										]);
	    		$getIdEvent = DB::connection('windigo_db')
	    					    ->table('tb_stavky_data_comp_game_market_event')
	    					    ->min('id_event');
	    		$newIdEvent = $getIdEvent - 1;
	    		$createMarketEvent = DB::connection('windigo_db')
	    							   ->table('tb_stavky_data_comp_game_market_event')
	    							   ->insert([['id_market' => $newIdMarket, 'id_event' => $newIdEvent, 'type_1' => 'W1', 'e_name' => 'W1', 'e_price' => $meanings['coefficient_1']],
	    										['id_market' => $newIdMarket, 'id_event' => $newIdEvent - 1, 'type_1' => 'W2', 'e_name' => 'W2', 'e_price' => $meanings['coefficient_2']]]);
	    	}
	    }

        return response()->json(['success' => true]);
	}

	public function getListMyBets()
	{
		$listMyBet = DB::connection('windigo_db')
						->table('tb_stavky_data_competition')
						->join('tb_stavky_data_comp_game', 'tb_stavky_data_competition.comp_id', '=', 'tb_stavky_data_comp_game.id_competit')
						->join('tb_stavky_virtual_game_arena', 'tb_stavky_data_competition.comp_sport', '=', 'tb_stavky_virtual_game_arena.id_game')
						->join('tb_stavky_data_comp_game_market', 'tb_stavky_data_comp_game.id_game', '=', 'tb_stavky_data_comp_game_market.id_game')
						->join('tb_stavky_data_comp_game_market_event', 'tb_stavky_data_comp_game_market.id_market', '=', 'tb_stavky_data_comp_game_market_event.id_market')
						->select('tb_stavky_data_comp_game.team_name1', 'tb_stavky_data_comp_game.team_name2', 'tb_stavky_data_comp_game_market.name_templ',
						         'tb_stavky_virtual_game_arena.g_name', 'tb_stavky_data_comp_game.id_game',
						          DB::raw('GROUP_CONCAT(tb_stavky_data_comp_game_market_event.e_price SEPARATOR ":") as price'),
						          'tb_stavky_data_competition.comp_id',
						          'tb_stavky_data_comp_game.start_ts', 'tb_stavky_data_competition.comp_name')

						->where('tb_stavky_data_competition.arena_club', '=', 1)
						->groupBy('tb_stavky_data_comp_game_market.id_market')
						->get();

		return DataTables::of($listMyBet)
						 ->addColumn('buttons',
	                            function($row) {
	                                return "<button id-competition ='" . $row->comp_id . "' id-game='" . $row->id_game . "' title='Изменить данные'  type ='button' class='btn btn-default  fa fa-pencil edit-bet'></button>
	                                &nbsp;<button id-competition ='" . $row->comp_id . "' type ='button' data-toggle='tooltip' title='Удалить матч' class='btn btn-danger fa fa-times close-bet' id-game='" . $row->id_game . "' ></button>";
	                     })
	                     ->editColumn('start_date', function($data) {
					        return Carbon::createFromTimestamp($data->start_ts);
					     })
	                     ->editColumn('w1',function($data) {
					        return explode(':', $data->price)[0];
					     })
					     ->addColumn('w2', function($data) {
					     	$w2 = explode(':', $data->price)[1] ?? 0;

					     	return $w2;
					     })
	                     ->rawColumns(['buttons'])
						 ->make(true);
	}

	public function showInfoGame(Request $request)
	{
		$validator = Validator::make($request->all(), [
		            'idGame' => 'required|exists:windigo_db.tb_stavky_data_comp_game,id_game',
       	]);

    	if($validator->fails())
    	{
        	return response()->json($validator->errors());
    	}

		$infoGame = DB::connection('windigo_db')
						->table('tb_stavky_data_competition')
						->join('tb_stavky_data_comp_game', 'tb_stavky_data_competition.comp_id', '=', 'tb_stavky_data_comp_game.id_competit')
						->join('tb_stavky_virtual_game_arena', 'tb_stavky_data_competition.comp_sport', '=', 'tb_stavky_virtual_game_arena.id_game')
						->join('tb_stavky_data_comp_game_market', 'tb_stavky_data_comp_game.id_game', '=', 'tb_stavky_data_comp_game_market.id_game')
						->join('tb_stavky_data_comp_game_market_event', 'tb_stavky_data_comp_game_market.id_market', '=', 'tb_stavky_data_comp_game_market_event.id_market')
						->select('tb_stavky_data_comp_game.team_name1', 'tb_stavky_data_comp_game.team_name2', 'tb_stavky_data_comp_game_market.name_templ',
						         'tb_stavky_virtual_game_arena.g_name', 'tb_stavky_data_comp_game.id_game',
						          DB::raw('GROUP_CONCAT(tb_stavky_data_comp_game_market_event.e_price SEPARATOR ":") as price'),
						          'tb_stavky_data_competition.comp_id',
						          'tb_stavky_data_competition.comp_name',
						          DB::raw('DATE_FORMAT(CONVERT_TZ(FROM_UNIXTIME(tb_stavky_data_comp_game.start_ts), @@session.time_zone, "+00:00"), "%Y-%m-%dT%H:%i:%s") as start_date'))

						->where('tb_stavky_data_competition.arena_club', '=', 1)
						->where('tb_stavky_data_comp_game.id_game', $request->input('idGame'))
						->groupBy('tb_stavky_data_comp_game_market.id_market')
						->first();

		return response()->json($infoGame);
	}

	public function updateMybet(Request $request)
	{
		$data = array_merge($request->all(),['id_user' => Auth::id()]);
		$validator = Validator::make($data, [
		            'idGame' => 'required|exists:windigo_db.tb_stavky_data_comp_game,id_game',
		            'id_user' => ['required', Rule::exists('users', 'id')->where(function ($query) {
                            $query->where('id', '=', Auth::id())->where('rights_id', '>=', 7);
                        }),
      				],
      				'startDateBet' => 'required|date|after:now',
      				'coefficient_1' => 'required|numeric|regex:/^(\d+(?:[\.\,]\d{1,3})?)$/|min:1|max:1000',
      				'coefficient_2' => 'required|numeric|regex:/^(\d+(?:[\.\,]\d{1,3})?)$/|min:1|max:1000',
       	]);

    	if($validator->fails())
    	{
        	return response()->json($validator->errors());
    	}

    	$startDate = Carbon::parse($data['startDateBet'])->timestamp;
    	$updateGame = DB::connection('windigo_db')->table('tb_stavky_data_comp_game')->where('id_game', '=', $data['idGame'])->update(['start_ts' => $startDate]);
		$updateEvent = DB::connection('windigo_db')
						->table('tb_stavky_data_competition')
						->join('tb_stavky_data_comp_game', 'tb_stavky_data_competition.comp_id', '=', 'tb_stavky_data_comp_game.id_competit')
						->join('tb_stavky_virtual_game_arena', 'tb_stavky_data_competition.comp_sport', '=', 'tb_stavky_virtual_game_arena.id_game')
						->join('tb_stavky_data_comp_game_market', 'tb_stavky_data_comp_game.id_game', '=', 'tb_stavky_data_comp_game_market.id_game')
						->join('tb_stavky_data_comp_game_market_event', 'tb_stavky_data_comp_game_market.id_market', '=', 'tb_stavky_data_comp_game_market_event.id_market')
						->select('tb_stavky_data_comp_game_market_event.e_name', 'tb_stavky_data_comp_game_market_event.id_event')
						->where('tb_stavky_data_competition.arena_club', '=', 1)
						->where('tb_stavky_data_comp_game.id_game', $data['idGame'])
						->get();
    	$updateEvent1 = $updateEvent->where('e_name', 'W1')->first();
    	$updateEvent2 = $updateEvent->where('e_name', 'W2')->first();
    	$updateEvent1 = DB::connection('windigo_db')->table('tb_stavky_data_comp_game_market_event')
    					  ->where('id_event', $updateEvent1->id_event)->update(['e_price' => $data['coefficient_1']]);
    	$updateEvent2 =  DB::connection('windigo_db')->table('tb_stavky_data_comp_game_market_event')
    					   ->where('id_event', $updateEvent2->id_event)->update(['e_price' => $data['coefficient_2']]);

		return response()->json(['success' => true]);
	}

	public function updatePassword(Request $request)
	{
		$data = array_merge($request->all(),['id_user' => Auth::id()]);
		$validator = Validator::make($data, [
		            'password' => 'required|string|min:6|max:20',
		            'id_user_club' => 'required|exists:users,id_user_club',
		            'id_user' => ['required', Rule::exists('users', 'id')->where(function ($query) {
                            $query->where('id', '=', Auth::id())->where('rights_id', '>=', 7);
                        }),
      				],
       	]);

    	if($validator->fails())
    	{
        	return response()->json($validator->errors());
    	}

    	$password = file_get_contents('https://web.windigoarena.gg/php/crm_brana.php?new_pass=' . $data['password'] . '&us=' . $data['id_user_club']);

    	if($password == 0)
    	{
    		return response()->json(['success' => true]);
    	}
	}
}
