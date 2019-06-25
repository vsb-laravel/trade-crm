<?php

namespace App\Http\Controllers\Partner_App;

use DB;
use Log;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ShopCashierController extends Controller
{
	public function searchUser(Request $request)
	{
		$emailСheck = strripos($request->input('search_input'), '@');

		if($emailСheck == false)
		{
			$searchColumn = 'tb_users.id';
		}
		else
		{
			$searchColumn = 'tb_users.email';
		}

		$user = DB::connection('windigo_db')
				  ->table('tb_users')
				  ->Where($searchColumn, '=', $request->input('search_input'))			  
				  ->first();

		return response()->json($user);
	}

	public function getProducts(Request $request)
	{
		$products = DB::connection('windigo_db')
					  ->table('tb_partner')
					  ->join('tb_partner_product', 'tb_partner.id', '=', 'tb_partner_product.partner_id')
					  ->join('tb_partner_cashier', 'tb_partner.crm_partner_id', '=', 'tb_partner_cashier.crm_partner_id')
					  ->select('tb_partner_product.*')
					  ->where('tb_partner_cashier.crm_cashier_id', '=', Auth::id())
					  ->get();

		return response()->json($products);
	}

	public function sellProducts(Request $request)
	{
		dd($request->all());
	}
}
