<?php

namespace App\Http\Controllers\Partner_App;

use DB;
use Log;
use App\User;
use DataTables;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
	public function getListProducts(Request $request)
	{
		$products = DB::connection('windigo_db')
					  ->table('tb_partner')
					  ->join('tb_partner_product', 'tb_partner.id', '=', 'tb_partner_product.partner_id')
					  ->select('tb_partner_product.*')
					  ->where('tb_partner.crm_partner_id', '=', Auth::id())
					  ->get();

		return DataTables::of($products)
						 ->addColumn('buttons',
	                            function($row) { 
	                                return "<button id-product='" . $row->id . "' title='Изменить данные'  type ='button' class='btn btn-default  fa fa-pencil edit-product'></button>
	                                &nbsp;<button type ='button' data-toggle='tooltip' title='Удалить продукт' class='btn btn-danger fa fa-times delete-product' id-product='" . $row->id . "' ></button>";
	                     })
	                     ->rawColumns(['buttons'])
						 ->make(true);
	}

	public function showProduct(Request $request)
	{
		$product = DB::connection('windigo_db')
					  ->table('tb_partner_product')
					  ->where('tb_partner_product.id', '=', $request->input('id'))
					  ->first();

		return response()->json($product);
	}

	public function updateProduct(Request $request)
	{
		$data = array_merge($request->all(),['id_user' => Auth::id()]);
		$validator = Validator::make($data, [
			'id_user' => ['required',
                        Rule::exists('users', 'id')->where(function ($query) {
                            $query->where('id', '=', Auth::id())->where('rights_id', '>=', 3);
                        }),
      		],
			'name_product' => 'string|unique:windigo_db.tb_partner_product,name_product,' . $request->input('id'),
            'price' => 'required|regex:/^(\d+(?:[\.\,]\d{1,2})?)$/|min:0|max:9999999.99',
            'description' => 'nullable|string|max:250|',
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $product = DB::connection('windigo_db')
				  ->table('tb_partner_product')
				  ->where('tb_partner_product.id', '=', $request->input('id'))
				  ->update(['name_product' => $request->input('name_product'), 'price' => $request->input('price'), 'description' => $request->input('description')]);

		return response()->json(['success' => true]);
	}

	public function removeProduct(Request $request)
	{
		$partner = DB::connection('windigo_db')
					  ->table('tb_partner')
					  ->join('tb_partner_product', 'tb_partner.id', '=', 'tb_partner_product.partner_id')
					  ->where('tb_partner_product.id', '=', $request->input('id'))
					  ->value('tb_partner.id');


		$validator = Validator::make(['partner_id' => $partner], [
            'partner_id' => 'exists:windigo_db.tb_partner_product,partner_id'
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors(),400);
        }

        $site = DB::connection('windigo_db')
				  ->table('tb_partner_product')
				  ->where('id', '=', $request->input('id'))
				  ->delete();

		return response()->json(['success' => true]);
	}

	public function createProduct(Request $request)
	{
		$data = array_merge($request->all(),['id_user' => Auth::id()]);
		$validator = Validator::make($data, [
			'id_user' => ['required',
                        Rule::exists('users','id')->where(function ($query) {
                            $query->where('id', '=', Auth::id())->where('rights_id', '>=', 3);
                        }),
      		],
			'name_product' => 'string|unique:windigo_db.tb_partner_product,name_product',
            'price' => 'required|regex:/^(\d+(?:[\.\,]\d{1,2})?)$/|min:0|max:9999999.99',
            'description' => 'nullable|string|max:250|',
        ]);

        if($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $partner = DB::connection('windigo_db')
					  ->table('tb_partner')
					  ->where('tb_partner.crm_partner_id', '=', Auth::id())
					  ->value('id');

       	$product = DB::connection('windigo_db')
				  ->table('tb_partner_product')
				  ->insert(['name_product' => $request->input('name_product'), 'price' => $request->input('price'), 'description' => $request->input('description'), 'partner_id' => $partner]);

		return response()->json(['success' => true]);
	}
}
