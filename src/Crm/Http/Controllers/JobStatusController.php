<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class JobStatusController extends Controller
{
    public function getLastTicket()
    {
        $tickets = DB::table('prices')
                     ->join('instruments', 'prices.instrument_id', '=', 'instruments.id')
                     ->select('instruments.symbol', DB::raw('max(prices.created_at) as last_date'))
                     ->where('instruments.enabled', '=', 1)
                     ->groupBy('instrument_id')
                     ->get();

          return response()->json(['tickets' => $tickets]);
    }
}
