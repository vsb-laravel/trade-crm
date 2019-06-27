<?php

namespace Vsb\Crm\Http\Controllers;

use DB;
use Log;
use Response;
use Illuminate\Http\Request;
use App\Account;
use App\Merchant;
use App\Invoice;
use App\User;
use App\UserMeta;
use App\Price;
use App\Histo;
use App\UserDocument;
use App\Option;
use App\Currency;
use App\Instrument;

use App\UserTuneHisto;
use App\UserTunePrice;

use App\Mail\SupportRequest;
use App\Mail\ApplyDemoRequest;
use App\Mail\TestMails;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Detection\MobileDetect;
class CabinetController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('online');
    }
    public function getInstruments(Request $rq){
        $res = Instrument::with([
            'from','to','source'
            // 'from'=>function($q) use ($search){$q->where('code','like','%'.$search.'%');},
            // 'to'=>function($q) use ($search){$q->where('code','like','%'.$search.'%');},
            // 'source'=>function($q) use ($search){$q->where('name','like','%'.$search.'%');}
        ])->orderBy('ordering');
        if($rq->input('search',false)){
            $c = Currency::where('code','like','%'.$rq->search.'%')->select('id')->get();
            if(!is_null($c)){
                $res=$res->where(function($q)use($c){
                    $q->whereIn('from_currency_id',$c)
                        ->orWhereIn('to_currency_id',$c);
                });
            }
        }
        if($rq->input('all',false)==false && $rq->input('all','0')!='1' ) $res= $res->where('enabled','1');
        if($rq->input('grouping',false)!=false)$res=$res->where('grouping',$rq->grouping);
        if($rq->input('currency_id',false)!=false)$res=$res->where(function($q)use($rq){
            $q->where('from_currency_id',$rq->currency_id)
                ->orWhere('to_currency_id',$rq->currency_id);
        });
        // if($rq->input('search',false)!=false) $res=$res->where('grouping',$rq->search);
        // Log::debug('Instrument list: '.$res->toSql());
        $ret = $res->get()->toArray();
        $user = ($rq->input('user_id',false)==false)?Auth::user():User::find($rq->input('user_id'));//$rq->user();
        foreach($ret as &$row){
            $pair = Instrument::find($row["id"]);
            $histo = Histo::where('instrument_id',$row["id"])->orderBy('id','desc')->first();
            $price = Price::where('instrument_id',$row["id"])->where('source_id',$row['source_id'])->orderBy('id','desc')->first();
            $uth=null;$utp=null;
            if(!is_null($histo)) $uth = (!is_null($user))?UserTuneHisto::byUser($user,$pair)->where('time',$histo->time)->first():null;
            if(!is_null($price)) $utp = (!is_null($user))?UserTunePrice::byUser($user,$pair)->where('price_id',$price->id)->first():null;
            $row["histo"] = is_null($uth)?$histo:$uth;
            $row["price"] = is_null($utp)?$price:$utp;
        }
        return $ret;
    }
    public function state(Request $rq, User $user){
        $rq->has('full');
        $user->load([
                'accounts'=>function($query){$query->with(['currency']);},
                'transactions'=>function($query){
                    $query->with(['invoice','withdrawal','merchant','comments']);
                },
                'documents',
                'trades',
                'deal'=>function($query){
                    return $query
                        ->with(['instrument','account'])
                        ->where('status_id','<',100);
                },
                'meta'
            ])->setAppends(['messages','margincall','title']);
        // $res = $user->toArray();
        // $res["pairs"]=$this->getInstruments($rq);
        return response()->json($user,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE);
    }
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $rq){
        $user = $rq->user()
            ->load(['country','manager','transactions'=>function($q){$q->with(['merchant','withdrawal','invoice','comments']);},'documents','accounts','deal'=>function($deal){$deal->with(['instrument','account'])->where('status_id','<',100);}])
            ->setAppends(['messages','margincall','title']);
        return view('react',["user"=>$user,'options'=>Option::all(),'currencies'=>Currency::all()]);
    }
    public function fastlogin(Request $rq,$id){
        $s = Auth::onceUsingId($id);
        if($s){
            $user = User::with(['country','manager','trades','transactions'=>function($q){$q->with(['merchant','withdrawal','invoice','comments']);},'documents','accounts','deal'=>function($deal){$deal->with(['instrument','account']);}])->find($id)->setAppends(['messages']);
            return view('react',["user"=>$user,'options'=>Option::all(),'currencies'=>Currency::all()]);
            // $user = json_decode(json_encode($user));
            // $user_count = User::all()->count();
            // $accounts = Account::where('user_id',$id)->get();
            // return view('react',["user"=>$user,"accounts"=>$accounts,'currencies'=>Currency::all(),'online'=>rand($user_count,$user_count*3)]);
        }
        return back();
    }

    /**
     * Show the application page.
     *
     * @return \Illuminate\Http\Response
     */
    public function page(Request $rq,$page){
        return view('page.'.$page);
    }
    public function page2(Request $rq,$page){
        return view('page_home.'.$page);
    }
    public function mobile(Request $rq,$page){
        return view('mobile.'.$page);
    }
    public function support(Request $rq){
        $mail = [
            "from"=>$rq->input('from'),
            "email"=>$rq->input('email'),
            "phone"=>$rq->input('phone'),
            "text"=>$rq->input('text'),
        ];
        $sp = new SupportRequest(json_decode(json_encode($mail)));
        Mail::send($sp);
        return back();
    }
    public function test(Request $rq){
        Mail::send(new TestMails());
        return back();
    }
    public function applydemo(Request $rq){
        $mail = [
            "name"=>$rq->input('name'),
            "surname"=>$rq->input('surname'),
            "email"=>$rq->input('email'),
            "phone"=>$rq->input('phone'),
            "country"=>$rq->input('country','not set'),
        ];
        $sp = new ApplyDemoRequest(json_decode(json_encode($mail)));
        Mail::send($sp);
        return back();
    }
    public function email(Request $rq, $template){
        $d = $rq->user()->toArray();
        $d['password']="[some password]";
        return view('email.'.$template,$d);
    }
    public function rating(Request $rq){
        $user = $rq->user();
        $target = Option::where('name','rating_target')->first();
        $targetValue = is_null($target)?100:$target->value;
        $refresh = Option::where('name','rating_refresh')->first();
        $refreshValue = is_null($refresh)?5:$refresh->value;

        $thisMonth = json_decode(json_encode([
            "f"=>date('2018-05-01'),
            "t"=>time()
        ]));
        if($rq->has('period')){
            $y = substr($rq->period,0,4);
            $m = substr($rq->period,4,2);
            $s = strtotime( date("{$y}-{$m}-01") );
            $l = strtotime( "+1 month", $s);
            $thisMonth = json_decode(json_encode([
                "f"=>$s,
                "t"=>$l,
            ]));
        }
        $today = $thisMonth->t - $thisMonth->t%(24*60*60);
        $last = [];
        $d = [];
        $raw = [];
        $raw2 = UserMeta::where('meta_name','ftd')->where('created_at','>=',$thisMonth->f)->where('created_at','<',$thisMonth->t)->orderBy('id','desc')->get();
        $totalConvertion = 0;
        $totalCustomers = 0;
        $totalDeposits = 0;
        foreach($raw2 as $row){
            $ftd = json_decode($row->meta_value);
            if( in_array($ftd->manager->id,[1053,696])) continue;
            $raw[]=$ftd;
            $d[$ftd->manager->id] = isset($d[$ftd->manager->id])?$d[$ftd->manager->id]:[
                'today'=>false,
                'this'=>['amount'=>0,'count'=>0],
                'title'=>$ftd->manager->title,
                'customers'=>User::where('parent_user_id',$ftd->manager->id)->orWhere('affilate_id',$ftd->manager->id)->count()
            ];
            $d[$ftd->manager->id]['this']['amount']+= floatval($ftd->amount);
            $d[$ftd->manager->id]['this']['count']++;
            $d[$ftd->manager->id]['today'] = $d[$ftd->manager->id]['today']?$d[$ftd->manager->id]['today']: ($row->created_at->getTimestamp() > $today);

        }
        foreach ($d as $key => $value) {
            $totalDeposits += $value['this']['count'];
            $totalCustomers+= $value['customers'];
        }
        $totalConvertion = ($totalCustomers==0)?0:(100*$totalDeposits/$totalCustomers);
        uasort($d,function($a,$b){return $a['this']['count']<=$b['this']['count'];});
        // $a = array_merge($d);
        // uasort($a,function($a,$b){return floatval($a['this']['amount'])<floatval($b['this']['amount']);});
        $c = array_merge($d);
        uasort($c,function($a,$b){
            $v1 = $a['customers']==0?0:$a['this']['count']/$a['customers'];
            $v2 = $b['customers']==0?0:$b['this']['count']/$b['customers'];
            return $v1<=$v2;
        });
        return view('crm.content.rating.index',[
            "period"=>$rq->input('period',''),
            "data"=>json_decode(json_encode(['counted'=>$d,'convertion'=>$c])),
            "raw"=>json_decode(json_encode($raw)),
            "target"=>json_decode(json_encode([
                'count'=>$targetValue,
                'days'=> (int)date('t') - (int)date('j')
            ])),
            "refresh"=>$refreshValue,
            "totalConvertion"=>$totalConvertion,
            "dates"=>$thisMonth
        ]);
    }
    public function roi(Request $rq){
        $user = $rq->user();
        $refresh = Option::where('name','rating_refresh')->first();
        $refreshValue = is_null($refresh)?5:$refresh->value;

        $thisMonth = [strtotime(date('2018-05-01')),strtotime(date("Y-m-d 23:59:59"))];
        if($rq->has('period')){
            $y = substr($rq->period,0,4);
            $m = substr($rq->period,4,2);
            $s = strtotime( date("{$y}-{$m}-01 00:00:00") );
            $l = strtotime( "+1 month", $s)+24*60*60 - 1;
            $thisMonth = [ $s,$l ];
        }
        $lastMonth = [
            $thisMonth[0] - ($thisMonth[1]-$thisMonth[0]),
            $thisMonth[1] - ($thisMonth[1]-$thisMonth[0])
        ];
        $today = $thisMonth[1] - $thisMonth[1]%(24*60*60);
        $usersThis = User::where('rights_id',1)->whereBetween('created_at',$thisMonth)->get();
        $usersLast = User::where('rights_id',1)->whereBetween('created_at',$lastMonth)->get();

        $affiliates = [];
        foreach (User::whereIn('id',User::pluck('affilate_id'))->get() as $item) {
            $affiliates[$item->id] = [
                "name"=>$item->name,
                "amount"=>0,
                "deposits"=>0,
                "deposits_last"=>0,
                "last"=>0,
                "ftd"=>0,
                "withdrawals"=>0,
                "withdrawals_last"=>0,
                "con"=>0,
                "avg"=>0,
            ];
        }
        //Invoices
        $query = DB::table('merchant_invoices')
                    ->join('users as customers','merchant_invoices.user_id','=','customers.id')
                    ->join('users as affilate','customers.affilate_id','=','affilate.id')
                    ->whereIn('customers.id',$usersThis->pluck('id'))
                    ->whereIn('merchant_invoices.merchant_id',Merchant::where('enabled',1)->pluck('id'))
                    ->where('merchant_invoices.error',0)
                    ->where('merchant_invoices.amount','>',0)
                    ->select(DB::raw('sum(merchant_invoices.amount) as amount,count(merchant_invoices.id) as deposits,affilate.name,affilate.id'))
                    ->groupBy(['affilate.name','affilate.id']);

        foreach($query->get() as $item) {
            $affiliates[$item->id]["amount"]=$item->amount;
            $affiliates[$item->id]["deposits"]=$item->deposits;
        }
        $query = DB::table('merchant_invoices')
                    ->join('users as customers','merchant_invoices.user_id','=','customers.id')
                    ->join('users as affilate','customers.affilate_id','=','affilate.id')
                    ->whereIn('customers.id',$usersLast->pluck('id'))
                    ->whereIn('merchant_invoices.merchant_id',Merchant::where('enabled',1)->pluck('id'))
                    ->where('merchant_invoices.error',0)
                    ->where('merchant_invoices.amount','>',0)
                    ->select(DB::raw('sum(merchant_invoices.amount) as amount,count(merchant_invoices.id) as deposits,affilate.name,affilate.id'))
                    ->groupBy(['affilate.name','affilate.id']);
        foreach($query->get() as $item){
            $affiliates[$item->id]["kpi"]=($item->amount==0)?1:$affiliates[$item->id]["amount"]/$item->amount-1;
            $affiliates[$item->id]["last"]=$item->amount;
            $affiliates[$item->id]["deposits_last"]=$item->deposits;
        }
        // FTD
        $query = DB::table('user_meta')
                    ->join('users as customers','user_meta.user_id','=','customers.id')
                    ->join('users as affilate','customers.affilate_id','=','affilate.id')
                    ->where('user_meta.meta_name','ftd')
                    ->select(DB::raw('meta_value as ftd,affilate.name,affilate.id'))
                    ;
        foreach($query->get() as $item){
            $ftd = json_decode($item->ftd);
            Log::debug($item->ftd);
            $affiliates[$item->id]["ftd"]=isset($affiliates[$item->id]["ftd"])?$affiliates[$item->id]["ftd"]:0;
            $affiliates[$item->id]["ftd"]+=$ftd->amount;
        }
        // Withdrawal
        $query = DB::table('withdrawals')
                    ->join('users as customers','withdrawals.user_id','=','customers.id')
                    ->join('users as affilate','customers.affilate_id','=','affilate.id')
                    ->whereIn('customers.id',$usersThis->pluck('id'))
                    ->select(DB::raw('sum(withdrawals.amount) as amount,affilate.name,affilate.id'))
                    ->groupBy(['affilate.name','affilate.id']);
        foreach($query->get() as $item)$affiliates[$item->id]["withdrawals"]=$item->amount;
        $query = DB::table('withdrawals')
                    ->join('users as customers','withdrawals.user_id','=','customers.id')
                    ->join('users as affilate','customers.affilate_id','=','affilate.id')
                    ->whereIn('customers.id',$usersLast->pluck('id'))
                    ->select(DB::raw('sum(withdrawals.amount) as amount,affilate.name,affilate.id'))
                    ->groupBy(['affilate.name','affilate.id']);
        foreach($query->get() as $item){
            $affiliates[$item->id]["withdrawals_last"]=$item->amount;
            $affiliates[$item->id]["withdrawals_kpi"]=$item->amount/$affiliates[$item->id]["withdrawals_last"] -1;
        }
        // Registrations + Con%
        $query = DB::table('users as customers')
                    ->join('users as affilate','customers.affilate_id','=','affilate.id')
                    ->leftJoin('user_meta as meta',function($join){
                        $join->on('customers.id','=','meta.user_id')
                            ->where('meta.meta_name','=','ftd');
                    })
                    ->select(DB::raw('count(customers.id) as count,avg(meta.created_at-customers.created_at) as avg,affilate.name,affilate.id'))
                    ->whereIn('customers.id',$usersThis->pluck('id'))
                    ->groupBy(['affilate.name','affilate.id']);
                    ;
        foreach($query->get() as $item){
            $affiliates[$item->id]["count"]=$item->count;
            $affiliates[$item->id]["avg"]=$item->avg/(24*60*60);
            $affiliates[$item->id]["con"]=$affiliates[$item->id]["deposits"]/$item->count;
        }
        $query = DB::table('users as customers')
                    ->join('users as affilate','customers.affilate_id','=','affilate.id')
                    ->select(DB::raw('count(customers.id) as count,affilate.name,affilate.id'))
                    ->whereIn('customers.id',$usersLast->pluck('id'))
                    ->groupBy(['affilate.name','affilate.id']);
                    ;
        foreach($query->get() as $item){
            $affiliates[$item->id]["count_last"]=$item->count;
            $affiliates[$item->id]["con_last"]=$affiliates[$item->id]["deposits_last"]/$item->count;
        }
        return view('crm.content.rating.roi',[
            "period"=>$rq->input('period',''),
            "refresh"=>$refreshValue,
            "dates"=>$thisMonth,
            "affiliates"=>collect($affiliates)
        ]);
    }
}
