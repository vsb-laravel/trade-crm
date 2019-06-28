<?php

namespace Vsb\Crm\Http\Controllers;

use Illuminate\Http\Request;
use Vsb\Crm\Exports\FinanceCustomerExport;
use Vsb\Crm\Exports\FinanceExport;
use Vsb\Crm\Exports\AffilateExport;
use Vsb\Model\Withdrawal;
use Vsb\Model\Transaction;
use Vsb\Model\Merchant;
use Vsb\Model\Invoice;
use App\User;
use App\UserMeta;
use Vsb\Model\Lead;
use Vsb\Model\Account;
use Vsb\Model\Option;
use Excel;
use Log;
use DB;

class FinanceController extends Controller {
    public function __construct(){
        $this->middleware('auth');
    }
    public function report(Request $rq,$report){
        $user = $rq->user();
        $res = $this->$report($rq,$user);
        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function customers(Request $rq){
        $user = $rq->user();
        $rows = DB::table('users')
            ->join('user_statuses','user_statuses.id','=','users.status_id')
            ->join('accounts',function($join){$join->on('accounts.user_id','=','users.id')->where('accounts.type','real');})
            ->join('user_meta',function($join){$join->on('user_meta.user_id','=','users.id')->where('meta_name','country');})
            ->join('merchant_invoices',function($join){$join->on('merchant_invoices.user_id','=','users.id')->where('merchant_invoices.error',0);})
            ->where('users.rights_id',1)
            ->where(function($query)use($user){
                if($user->rights_id>7)return;
                $childs=$user->childs;
                $query->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);
            })
            ->select(DB::raw("
                users.id as user_id,
                concat(users.name,' ',users.surname) as name,
                users.email,
                users.phone,
                users.created_at,
                user_statuses.title as status,
                accounts.amount as balance,
                sum(merchant_invoices.amount) as amount
            "))
            ->groupBy(['users.id','users.name','users.surname','users.email','users.phone','users.created_at','user_statuses.title','accounts.amount'])
            ;
        Log::debug("customers.export: ".$rows->toSql());
        Log::debug('Excel export rows:'.$rows->toSql());
        return Excel::download(new FinanceCustomerExport($rows->get()), 'customer-finance-'.$user->id.'-'.date('YmdHis').'.xlsx');

    }
    public function affilate(Request $rq){
        $user = $rq->user();
        $from = ($rq->has('date_from') && !empty($rq->date_from))?strtotime($rq->date_from):0;
        $to = ($rq->has('date_to') && !empty($rq->date_to))?strtotime($rq->date_to):time();
        // $rows = Invoice::with(['user'=>function($query){$query->with(['status'])}])
        $rows = DB::table('users as customers')
                ->leftJoin('user_meta as country',function($join){
                    $join->on('country.user_id','=','customers.id')->where('country.meta_name','=','country');
                })
                ->leftJoin('merchant_invoices as invoices',function($join)use($from,$to){
                    $join->on('customers.id','=','invoices.user_id')
                        ->whereIn('invoices.merchant_id',Merchant::where('enabled','<>',2)->pluck('id'))
                        ->where('invoices.error',0)
                        ->where('invoices.created_at','>=',$from)
                        ->where('invoices.created_at','<=',$to);
                })
                ->leftJoin('user_statuses as statuses','statuses.id','=','customers.status_id')
            ->where('customers.affilate_id',$user->id)
            ->select(DB::raw("
                    customers.id as user_id,
                    customers.email as email,
                    customers.created_at,
                    concat(customers.name,' ',customers.surname) as name,
                    country.meta_value as country,
                    statuses.title as status,
                    sum(invoices.amount) as amount
                "))
            ->groupBy(['customers.id','customers.email','customers.created_at','customers.name','customers.surname','country.meta_value','statuses.title']);
            // ->orderBy('transactions.created_at','desc');

        // Log::debug('Affilate export rows:'.$rows->toSql());
        return Excel::download(new AffilateExport($rows->get()), 'affilate-report-'.$user->id.'-'.date('YmdHis').'.xlsx');
        // return Excel::create('report-affilate-'.$user->id.'-'.date('Y-m-d-H-i-s'), function($excel) use($rows) {
        //     $excel->sheet('Report-'.date('Y-m-d'),function($sheet) use($rows){
        //         $data = $rows->get()->toArray();
        //         $export = [];
        //         $headers = [
        //             'created_at'=>'Registered',
        //             'user_id'=>'Customer ID',
        //             'name'=>'Customer',
        //             'country'=>'Country',
        //             'status'=>'Customer status',
        //             'amount' => 'Sum deposit amount'
        //         ];
        //         foreach ($data as $rowstd) {
        //             $row = json_decode(json_encode($rowstd),true);
        //             $exp = [];
        //             foreach ($headers as $key => $title) {
        //                 $val = '';
        //                 if(preg_match('/\./m',$key)){
        //                     $path = preg_split('/\./',$key);
        //                     $val = $row[$path[0]][$path[1]];
        //                 }
        //                 else $val = $row[$key];
        //                 $exp[$title]=(is_array($val))?$val["name"]:$val;
        //
        //             }
        //             $export[] = $exp;
        //         }
        //         $sheet->fromArray($export);
        //     });
        //     // ->cells('A1:ZZ9999')->setFontFamily('Open Sans')->setFontSize(14);
        // })->download('xlsx');
    }
    public function export(Request $rq){
        $user=$rq->user();
        $from = ($rq->has('date_from') && !empty($rq->date_from))?strtotime($rq->date_from):strtotime(date('Y-m-').'01');
        $to = ($rq->has('date_to') && !empty($rq->date_to))?strtotime($rq->date_to):time();
        $rows = DB::table('transactions')
                ->leftJoin('merchant_invoices','merchant_invoices.transaction_id','=','transactions.id')
                ->join('merchants','merchants.id','=','transactions.merchant_id')
                ->join('accounts','transactions.account_id','=','accounts.id')
                ->join('users as customers','customers.id','=','accounts.user_id')
                ->leftJoin('users as managers','managers.id','=','customers.parent_user_id')
                ->leftJoin('users as admins','admins.id','=','managers.parent_user_id')
                ->leftJoin('users as afillates','afillates.id','=','customers.affilate_id')
            ->where('accounts.type','real')
            ->where('merchant_invoices.error',0)
            ->where('transactions.code',200)
            ->where('transactions.created_at','>=',$from)
            ->where('transactions.created_at','<=',$to)
            ->whereNotIn('transactions.merchant_id',[1,3])
            ->where('transactions.type','deposit')
            ->select(DB::raw("
                    merchants.name,
                    merchants.title,
                    ifnull(merchant_invoices.method,'') as method,
                    from_unixtime(transactions.created_at) as date,
                    transactions.user_id,
                    transactions.amount,
                    concat(customers.name,' ',customers.surname) as name,
                    concat(managers.name,' ',managers.surname) as manager,
                    concat(admins.name,' ',admins.surname) as admin,
                    concat(afillates.name,' ',afillates.surname) as affilate
                "))
            ->orderBy('transactions.created_at','desc');
        if($rq->has('office') && !empty($rq->date_to)){
            $rows->where(
                function($q)use($rq){
                    $q->whereIn('managers.id',UserMeta::where('meta_name','office')->where('meta_value',$rq->office)->pluck('user_id'))
                        ->orWhereIn('admins.id',UserMeta::where('meta_name','office')->where('meta_value',$rq->office)->pluck('user_id'));
                }

            );

        }

        Log::debug('Excel export rows:'.$rows->toSql());
        return Excel::download(new FinanceExport($rows->get()), 'report-'.$user->id.'-'.date('YmdHis').'.xlsx');
        // return Excel::create('report-'.$user->id.'-'.date('Y-m-d-H-i-s'), function($excel) use($rows) {
        //     $excel->sheet('Report-'.date('Y-m-d'),function($sheet) use($rows){
        //         $data = $rows->get()->toArray();
        //         $export = [];
        //         $headers = [
        //             'date'=>'Date',
        //             'user_id'=>'Customer ID',
        //             'name'=>'Customer',
        //             'manager'=>'Agent',
        //             'admin'=>'Agent 2',
        //             'afillate'=>'Afillate',
        //             'method'=>'Method',
        //             'amount' => 'Amount'
        //         ];
        //         foreach ($data as $rowstd) {
        //             $row = json_decode(json_encode($rowstd),true);
        //             $exp = [];
        //             foreach ($headers as $key => $title) {
        //                 $val = '';
        //                 if(preg_match('/\./m',$key)){
        //                     $path = preg_split('/\./',$key);
        //                     $val = $row[$path[0]][$path[1]];
        //                 }
        //                 else $val = $row[$key];
        //                 $exp[$title]=(is_array($val))?$val["name"]:$val;
        //
        //             }
        //             $export[] = $exp;
        //         }
        //         $sheet->fromArray($export);
        //     });
        //     // ->cells('A1:ZZ9999')->setFontFamily('Open Sans')->setFontSize(14);
        // })->download('xlsx');
    }
    protected function deposits(Request $rq,User $user){
        $monthBegin = time();
        $hideMerchants = Option::where('name','hide_merchants_from_reports')->first();
        $childs = $user->childs;
        //sum(case when i.error in ('-1','declined') then i.amount else 0 end) as process
        $q = DB::table('merchant_invoices as i')
                ->select(DB::raw("m.id as manager_id, m.name as manager_name, m.surname as manager_surname,um.meta_value as office,
                        sum(case when i.error='0' then i.amount else 0 end) as approved,
                         sum(case when i.error in ('0','-1') then 0 else i.amount end) as declined
                         "))
                ->join("users as u","u.id","=","i.user_id")
                ->join("merchants as a","a.id","=","i.merchant_id")
                ->leftJoin("users as m","m.id","=","u.parent_user_id")
                ->leftJoin("user_meta as um",function($j){$j->on("um.user_id","=","m.id")->where('um.meta_name','office');})
                ->whereIn('a.enabled',(!is_null($hideMerchants) && $hideMerchants->is_set())?[1]:[1,2])
                ->groupBy('um.meta_value','m.id','m.name','m.surname');
        if($user->rights_id<8)$q->where(function($uq)use($childs){$uq->whereIn('u.parent_user_id',$childs)->orWhereIn('u.affilate_id',$childs);});
        $this->byPeriod($q,$rq->input('period','false'),'i.created_at');
        if($rq->input("office","false") !== "false") $q =$q->where('um.meta_value',$rq->input("office"));
        if($rq->input("manager_id","false") !== "false") $q =$q->where('m.id',$rq->input("manager_id"));
        // if($rq->input("sort",false)!==false) foreach ($rq->input("sort") as $key => $value) $q = $q->orderBy($key,$value);
        // Log::debug("report deposits:".$q->toSql());
        return $q->get();
    }
    protected function byoffice(Request $rq,User $user){
        $monthBegin = time();
        $childs = $user->childs;
        $q = DB::table('merchant_invoices as i')
                ->select(DB::raw("um.meta_value as office, m.id as manager_id, m.name as manager_name, m.surname as manager_surname,u.id, u.name,u.surname, sum(i.amount) as deposit, sum(w.amount) as withdraw"))
                ->join("accounts as a","i.account_id","=","a.id")
                ->join("users as u","u.id","=","i.user_id")
                ->leftJoin("withdrawals as w",function($j){$j->on("w.user_id","=","u.id")->where('w.created_at','>',"unix_timestamp(DATE_FORMAT(NOW() ,'%Y-%m-01'))")->whereIn("w.status",['approved']);})
                ->leftJoin("users as m","m.id","=","u.parent_user_id")
                ->leftJoin("user_meta as um",function($j){$j->on("um.user_id","=","m.id")->where('um.meta_name','office');})
                // ->where('i.created_at','>',"unix_timestamp(DATE_FORMAT(NOW() ,'%Y-%m-01'))")
                ->where('i.merchant_id','2')
                ->where('i.error','0')
                // ->where(function($uq)use($childs){$uq->whereIn('u.parent_user_id',$childs)->orWhereIn('u.affilate_id',$childs);})
                ->groupBy('um.meta_value','m.id','m.name','m.surname','u.id','u.name','u.surname');
        if($user->rights_id<8)$q->where(function($uq)use($childs){$uq->whereIn('u.parent_user_id',$childs)->orWhereIn('u.affilate_id',$childs);});
        $this->byPeriod($q,$rq->input('period','false'),'i.created_at');
        if($rq->input("office","false") !== "false") $q =$q->where('um.meta_value',$rq->input("office"));
        if($rq->input("manager_id","false") !== "false") $q =$q->where('m.id',$rq->input("manager_id"));
        if($rq->input("sort",false)!==false) foreach ($rq->input("sort") as $key => $value) $q = $q->orderBy($key,$value);
        return $q->get();
    }
    protected function userTransactions(Request $rq,User $user){
        $childs = $user->childs;
        $q = DB::table('transactions as t')
            ->select(DB::raw("
                t.id,
            	t.created_at,
                t.updated_at,
                t.type,
                t.merchant_id,
                m.title as merchant_name,
                t.amount,
                c.code as currency,
                t.code,
                case when t.code = 0 then 'processing' when t.code=200 then 'success' else 'failed' end as status,
                t.error_code,
                t.error_text,
                a.type as accountType,
                a.amount as accountBalance,
                i.order_id,
                i.method as invoiceMethod,
                i.error as invoiceError,
                i.message as invoiceErrorText,
                i.raw as invoiceRawData,
                w.method as withdrawalMethod,
                w.status as withdrawalStatus
            "))
			->join('merchants as m','m.id','=','t.merchant_id')
			->join('accounts as a','a.id','=','t.account_id')
			->join('currencies as c','c.id','=','a.currency_id')
			->join('users as u','u.id','=','t.user_id')
            ->leftJoin('merchant_invoices as i','t.id','=','i.transaction_id')
            ->leftJoin('withdrawals as w','t.id','=','w.transaction_id')
            // ->whereIn('u.id',$user->childs)

            ->orderBy('t.id','desc');
        if($user->rights_id<8)$q->where(function($uq)use($childs){$uq->whereIn('u.parent_user_id',$childs)->orWhereIn('u.affilate_id',$childs);});
        if($rq->input('user_id',false)!=false) $q->where('t.user_id',$rq->input('user_id')); else $q=$q->whereIn('t.user_id',$user->childs);
        if($rq->input('status','all')!=false){
            $status = $rq->input('status','all');
            switch($status){
                case 'success': $q=$q->where('t.code',200); break;
                case 'process': $q=$q->where('t.code',0); break;
                case 'failed': $q=$q->whereNotIn('t.code',[0,200]); break;
            }
        }
        if($rq->input('merchant_id',"false")!="false")$q=$q->where('t.merchant_id',$rq->merchant_id);
        if(($rq->input('date_from',false)!=false) || ($rq->input('date_to',false)!=false)){
            if($rq->input('date_from',false)!=false)$q=$q->where('t.created_at','>=',intval($rq->date_from/1000));
            if($rq->input('date_to',false)!=false)$q=$q->where('t.created_at','<=',intval($rq->date_to/1000));
        }
        else $this->byPeriod($q,$rq->input('period','false'),'t.created_at');
        if($rq->input('account_type',false)!=false)$q=$q->where('a.type',$rq->account_type);else $q=$q->where('a.type','real');
        // Log::debug('userTransactions: '.$q->toSql());
        return $q->paginate();
    }

    protected function dashboardMoneyRepo(Request $rq,User $user){
        $childs = ($user->rights_id>7)?User::where('rights_id','>',1)->pluck('id')->toArray():$user->childs;
        $q = DB::table(DB::raw("(
            SELECT transactions.created_at - mod(transactions.created_at,60*60*24) as trunc_date,
                case when merchants.enabled=2 and transactions.type='deposit' then 'bonus' else transactions.type end as type , transactions.amount as amount
            FROM transactions join merchants on merchants.id = transactions.merchant_id
            where transactions.code = 200
                and transactions.type in ('deposit','withdraw')
                and transactions.user_id in ( select id from users where parent_user_id in (".implode(',',$childs).") or affilate_id in (".implode(',',$childs)."))
                and merchants.enabled > 0
            ) rawtab"))
           ->select(DB::raw("trunc_date as date, type, sum(amount) as amount,count(*) as total"))
           ->groupBy(['trunc_date','type'])->orderBy('date','desc')->limit($rq->input("limit","30"));
        $this->byPeriod($q,$rq->input('period','false'),'trunc_date');
        return $q->get();
    }
    protected function withdrawalRepo(Request $rq,User $user){
        $childs = ($user->rights_id>7)?User::where('rights_id','>',1)->pluck('id')->toArray():$user->childs;
        $q = DB::table(DB::raw("(SELECT
                w.created_at-mod(w.created_at,60*60*24) as date,
     	        um.meta_value as office,
                w.amount,
                w.status
            FROM `withdrawals` w
 	            left outer join transactions t on t.id = w.transaction_id
                join users u on u.id = w.user_id
                left outer join users m on m.id = u.parent_user_id
                left outer join user_meta um on um.user_id = m.id and um.meta_name='office'
            WHERE w.status in ('success') and (u.parent_user_id in (".implode(',',$childs).") or u.affilate_id in (".implode(',',$childs)."))
            ) rawtab"))
            ->select(DB::raw("date, office, sum(amount) as amount,count(*) as total,status"))
            ->groupBy(['date','office','status'])->orderBy('date','desc')->limit($rq->input("limit","30"));
        $this->byPeriod($q,$rq->input('period','false'),'date');
        return $q->get();
    }
    protected function depositReport(Request $rq,User $user){
        $trx = Transaction::with(['user'=>function($q){
            $q->with(['manager'=>function($qq){$qq->with('meta');},'meta']);
        },'merchant','invoice'])
            ->where('type','deposit')
            ->where('code','200')
            ->whereIn('merchant_id',Merchant::where('enabled',1)->pluck('id'))
        ;
        $childs = ($user->rights_id>7)?User::where('rights_id','>',1)->pluck('id')->toArray():$user->childs;
        if($user->rights_id<8)$trx->whereIn('user_id',User::whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs)->pluck('id') );

        $trx = $this->byPeriod($trx,$rq->input('period','false'));
        if($rq->input('date_from',false)!=false)$trx = $trx->whereRaw("created_at >= unix_timestamp('{$rq->date_from}')");
        if($rq->input('date_to',false)!=false)$trx = $trx->whereRaw("created_at <= unix_timestamp('{$rq->date_to}')");
        return $trx->get();
    }
    protected function dashboardDepositRepo(Request $rq,User $user){
        $childs = ($user->rights_id>7)?User::where('rights_id','>',1)->pluck('id')->toArray():$user->childs;
        $q = DB::table(DB::raw("(
            select i.created_at - mod(i.created_at,60*60*24) as trunc_date,m.title,sum(i.amount) as amount,count(i.id) as total
            from transactions i
 	          join merchants m on m.id = i.merchant_id
              join merchant_invoices mi on i.id=mi.transaction_id
            where i.code = 200 and i.type='deposit' and i.user_id in (select id from users where parent_user_id in (".implode(',',$childs).") or affilate_id in (".implode(',',$childs)."))
            group by m.title,trunc_date
        ) rawtab"));
        if(($rq->input('date_from',false)!=false) || ($rq->input('date_to',false)!=false)){
            if($rq->input('date_from',false)!=false)$trx = $trx->whereRaw("created_at >= unix_timestamp('{$rq->date_from}')");
            if($rq->input('date_to',false)!=false)$trx = $trx->whereRaw("created_at <= unix_timestamp('{$rq->date_to}')");
        }
        else $this->byPeriod($q,$rq->input('period','false'),'trunc_date');
        return $q->get();
    }
    protected function dashboardCustomersRepo(Request $rq,User $user){
        $childs = ($user->rights_id>7)?User::where('rights_id','>',1)->pluck('id')->toArray():$user->childs;
        $q = DB::table(DB::raw("(
            select
            	created_at - mod(created_at,60*60*24) as date,
                sum(case when client_id is not null then 1 else 0 end) as newcustomers,
                sum(case when client_id is null  then 1 else 0 end) as newlead,
            	count(*) as total
            from leads
            where created_at>=	created_at - mod(created_at,60*60*24) - 7*24*60*60
                and affilate_id in (".implode(',',$childs).") or manager_id in (".implode(',',$childs).")
            group by date
            order by date
       ) rawtab"));
       $this->byPeriod($q,$rq->input('period','false'),'date');
       return $q->get();
    }
    protected function dashboardDealsRepo(Request $rq,User $user){
        $childs = ($user->rights_id>7)?User::where('rights_id','>',1)->pluck('id')->toArray():$user->childs;
        $days = $rq->input("days",7);
        $q = DB::table(DB::raw("(
            select

                sum(d.amount) as amount,
                count(d.id) as total,
                concat(cf.code,'/',ct.code) as pair,
                i.symbol as symbol,
                sum(case when d.direction = 1 then 1 else 0 end) as buys,
                sum(case when d.direction = -1 then 1 else 0 end) as sells,
                sum(d.profit) as profit
            from deals d
                join instruments i on i.id = d.instrument_id
                join currencies cf on cf.id = i.from_currency_id
                join currencies ct on ct.id = i.to_currency_id
            where d.user_id in (select id from users where parent_user_id in (".implode(',',$childs).") or affilate_id in (".implode(',',$childs).") )
                and d.created_at > ".$this->byPeriodTime($rq->input('period','false'))."
            group by cf.code,ct.code, i.symbol
            order by count(d.id) desc
        ) rawtab"));
        // $this->byPeriod($q,$rq->input('period','false'),'date');
        return $q->get();
    }
    protected function affilateReport(Request $rq,User $user){
        $q = User::with(['comments','status','deposits','country'])->where('affilate_id',$user->id);
        $this->byPeriod($q,$rq->input('period','false'));
        return $q->get();
    }
    protected function transferFlow(Request $rq,User $user){
        $ids = $rq->input("ids","null");
        $dateFrom = intval($rq->input('date_from',1000));
        $dateTo = intval($rq->input('date_to',time()*1000));
        $q = DB::connection('windigo_db')->select("SELECT
	            concat('#',ufrom.id,' ',ufrom.u_name) as user_from,
    	        concat('#',uto.id,' ',uto.u_name) as user_to,
                sum(tb_accounts_history.h_summa) as amount
            FROM `tb_accounts_history`
	           join tb_accounts afrom on afrom.id=tb_accounts_history.acc_from
               join tb_accounts ato on ato.id=tb_accounts_history.acc_to
               join tb_users ufrom on ufrom.id = afrom.id_user
               join tb_users uto on uto.id = ato.id_user
            where tb_accounts_history.h_date>=".date("YmdHi",$dateFrom)."
                and  tb_accounts_history.h_date<=".date("YmdHi",$dateTo)."
                and concat('#',ufrom.id,' ',ufrom.u_name) is not null
                and concat('#',uto.id,' ',uto.u_name) is not null
                and (ufrom.id in ($ids) or uto.id in ($ids))
            group by ufrom.id,ufrom.u_name,uto.id,uto.u_name
            having sum(tb_accounts_history.h_summa) > 0
            order by count(tb_accounts_history.h_summa) desc, sum(tb_accounts_history.h_summa) desc");
        // return collect($q);
        return $q;
    }
    protected function windigoUsers(Request $rq,User $user){
        // $q = User::select(DB::raw("users.id_user_club as id, concat(users.name,' ',users.surname) as title,users.name,users.surname"))->get();
        $q = DB::connection('windigo_db')->select("SELECT u_name as title, id, concat('#',id) as code from tb_users");
        // User::select(DB::raw("users.id_user_club as id, concat(users.name,' ',users.surname) as title,users.name,users.surname"))->get();
        return $q;
    }
    protected function affilateDepositReport(Request $rq,User $user){
        $childs = $user->childs;
        $q = Invoice::with(['user','merchant','transaction']);
            // ->whereIn('user_id',$user->childs)
        if($user->rights_id<8)$q->where(function($uq)use($childs){$uq->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);});
        $this->byPeriod($q,$rq->input('period','false'));
        return $q->get();
    }
    protected function byPeriodTime($p){
        $time = time();
        switch($p){
            // case 'today':break;
            case 'lm':
                $time = strtotime('first day of last month');
            break;
            case 'm':
                $time = strtotime('first day of '.date('F Y'));
            break;
            case 'y':
                $time = strtotime('first day of January '.date('Y'));
            break;
            default:
                if(preg_match('/(\d+)d/',$p,$m)){
                    $time = $time - $time%(24*60*60) - intval($m[1])*24*60*60;
                }
                else return false;//$time = $time - $time%(24*60*60);
            break;
        }
        return $time;
    }
    protected function byPeriod($eloq,$p,$dateField='created_at'){
        $time = $this->byPeriodTime($p);//time();
        if($time === false ) return $eloq;
        switch($p){
            case 'today':
                $eloq=$eloq->where($dateField,">=",$time);
            break;
            case 'm':
                $eloq=$eloq->where($dateField,">=",$time);
            break;
            case 'y':
                $eloq=$eloq->where($dateField,">=",$time);
            break;
            default:
                $eloq=$eloq->where($dateField,">=",$time);
            break;
        }
        return $eloq;
    }

}
/*
select s.title,count(users.id),count(i.id) as deposits
 FROM `users` join user_statuses s on s.id = users.status_id
 	left outer join merchant_invoices i on i.user_id = users.id and i.error=0
where users.affilate_id = 1029
group by s.title
*/
