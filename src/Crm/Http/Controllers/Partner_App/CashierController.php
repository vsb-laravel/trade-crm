<?php

namespace Vsb\Crm\Http\Controllers\Partner_App;

use DB;
use Log;
use Vsb\Crm\Model\User;
use DataTables;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Auth\RegisterController;

class CashierController extends Controller
{
	public function getListCashiers(Request $request)
	{
		$cashiersId = DB::connection('windigo_db')
						->table('tb_partner_cashier')
						->select('crm_cashier_id')
						->get();

		$cashiersId = $cashiersId->pluck('crm_cashier_id');

		$cashiers = User::where('rights_id', '=', 2)
						->whereIn('id', $cashiersId)
						->get();

		return DataTables::of($cashiers)
						 ->addColumn('buttons',
	                            function($row) { 
	                                return "<button id-cashier='" . $row->id . "' title='Изменить данные'  type ='button' class='btn btn-default  fa fa-pencil edit-cashier'></button>
	                                &nbsp;<button type ='button' data-toggle='tooltip' title='Удалить кассира' class='btn btn-danger fa fa-times delete-сashier' id-cashier='" . $row->id . "' ></button>";
	                     })
	                     ->rawColumns(['buttons'])
						 ->make(true);
	}

	public function showCashier(Request $request)
	{
		$cashier = User::find($request->input('id'));

		return response()->json($cashier);
	}

	public function updateCashier(Request $request)
	{
		$data = array_merge($request->all(),['id_user' => Auth::id()]);
		$validator = Validator::make($data, [
			'id_user' => ['required', Rule::exists('users', 'id')->where(function ($query) {
                            $query->where('id', '=', Auth::id())->where('rights_id', '>=', 3);
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

	public function removeCashier(Request $request)
	{

		$validator = Validator::make(['id_user' => Auth::id()], [
            'id_user' => ['required', Rule::exists('users', 'id')->where(function ($query) {
                            $query->where('id', '=', Auth::id())->where('rights_id', '>=', 3);
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

	public function createCashier(Request $request)
	{
		$data = array_merge($request->all(),['id_user' => Auth::id()]);
		$validator = Validator::make($data, [
			'id_user' => ['required',
                        Rule::exists('users','id')->where(function ($query) {
                            $query->where('id', '=', Auth::id())->where('rights_id', '>=', 3);
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

		$dataCrm = ['name' => $data['name'], 'surname' => $data['surname'], 'email' => $data['email'], 'phone' => $data['phone'], 'password' => $data['password'],
					'rights_id' => 2,];
		$createAdminCrm = new RegisterController();
		$userCrm = $createAdminCrm->create($dataCrm);



		$partner = DB::connection('windigo_db')
				  ->table('tb_partner_cashier')
				  ->insert(['crm_cashier_id' => $userCrm->id, 'crm_partner_id' => Auth::id()]);

		return response()->json(['success' => true]);
	}
}
