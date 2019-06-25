<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Log;
use Excel;
use App\Lead;

use App\LeadStatus;
use App\LeadHistory;
use App\User;
use App\UserMeta;
use App\Comment;
use App\Exports\LeadExport;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\UserController;

class LeadController extends Controller {
    protected $_formats = [
        "all" => ['name','surname','email','phone','country','source'],
        "csv" => ['name','surname','email','phone','country','source'],
        "xlsx" => ['name','surname','email','phone','country','source'],
        "bin" => ['name','surname','email','phone','country','source'],
        "zip" => ['name','surname','email','phone','country','source'],
        "xls" => ['name','surname','email','phone','country','source']
    ];
    public function __construct(){
        $this->middleware('auth');
    }
    public function upload(Request $rq){
        $user = $rq->user();
        $affilate = $rq->has('affilate_id')?User::find($rq->affilate_id):$user;
        $status = LeadStatus::where('code','newclient')->first();
        $res = ["file"=>false,"leads"=>[],"errors"=>[]];
        if($rq->hasFile('import')){
            $res["file"]=$rq->import->path();
        }
        $extension = $rq->import->extension();
        Log::debug('importing Leads '.$rq->import->path()." [{$extension}]");
        // $extension = 'all';
        // if(!isset($this->_formats[$extension]))return redirect()->back()->with(['flash'=>"Error in file"]);
        // $format = $this->_formats[$extension];
        $leadsData = [];
        if( in_array($extension,['csv','txt'])){
            Log::debug('loading from csv...');
            if (($handle = fopen($rq->import->path(), "r")) !== FALSE) {
                Log::debug('loading from csv. File opened...');
                $count = 0;
                // while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                while (($data = fgetcsv($handle)) !== FALSE) {
                    $leadsData[] = [
                        'created_at'=>time(),
                        'updated_at'=>time(),
                        'status_id'=>$status->id,
                        'user_id'=>$user->id,
                        'manager_id'=>$user->id,
                        'affilate_id'=>$affilate->id,
                        'name' => isset($data[0])?$data[0]:'',
                        'surname' => isset($data[1])?$data[1]:'',
                        'email' => isset($data[2])?$data[2]:'',
                        'phone' => isset($data[3])?$data[3]:'',
                        'country' => isset($data[4])?$data[4]:'',
                        'source' => isset($data[5])?$data[5]:'',
                    ];
                    ++$count;
                }
                Log::debug('Parsed '.$count.' rows');
                fclose($handle);
            }
        }
        else {
            $data = Excel::load($rq->import->path(),function($reader){})->get();
            if(!empty($data) && $data->count()){

                foreach ($data as $key => $value) {
                    $leadsData[] = [
                        'created_at'=>time(),
                        'updated_at'=>time(),
                        'status_id'=>$status->id,
                        'user_id'=>$user->id,
                        'manager_id'=>$user->id,
                        'affilate_id'=>$user->id,
                        'name' => $value->name,
                        'surname' => $value->surname,
                        'email' => $value->email,
                        'phone' => $value->phone,
                        'country' => $value->country,
                        'source' => $value->source,
                    ];
                }

            }
            // $objWorksheet = $objPHPExcel->getActiveSheet();
            // $line = 1;
            // $leadsData = [];
            // $endRows = false;
            // foreach ($objWorksheet->getRowIterator() as $row) {
            //     $cellIterator = $row->getCellIterator();
            //     $cellIterator->setIterateOnlyExistingCells(FALSE); // This loops through all cells,
            //     $i=0;
            //     $leadData = ["user_id"=>$user->id,"affilate_id"=>$user->id,"manager_id"=>$user->id,"status_id"=>$status->id];
            //     foreach ($cellIterator as $cell) {
            //         if(!isset($format[$i]))break;
            //         $value = $cell->getValue();
            //         $endRows = ($value == 'null' || is_null($value));
            //         if($endRows) break;
            //         $leadData[ $format[$i] ] = $value;
            //         $i++;
            //     }
            //     if($endRows) break;
            //     $leadData['created_at'] = time();
            //     $leadData['updated_at'] = time();
            //     $leadsData[] = $leadData;
            //     Log::debug(json_encode($leadData));
            //     // $res["leads"][]=$leadData;
            //     $line++;
            // }
            // try{
            //     Lead::insert($leadsData);
            // }
            // catch(\Exception $e){
            //     Log::error($e);
            //     $res["errors"][]=$e->getMessage();
            // }
            // return redirect()->back();
            // return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        }
        if(!empty($leadsData)){
            try{
                foreach (array_chunk($leadsData,4000) as $t) {
                    Lead::insert($t);
                }
                // Lead::insert($leadsData);
            }
            catch(\Exception $e){
                Log::error($e);
                $res["errors"][]=$e->getMessage();
            }

        }
        return redirect()->back();
    }
    public function ulist(Request $rq,$format='json'){
        $user = $rq->user();
        $res = Lead::with(['comments'=>function($query){$query->orderBy('id','desc');},'status','manager'=>function($query){return $query->with(['meta']);},'affilate'=>function($query){return $query->with('meta');}])->whereNull('client_id');
        if($user->rights_id<10) $res->where(
                function($query)use($user){
                    $childs = $user->childs;
                    $query->whereIn('affilate_id',$childs)->orWhereIn('manager_id',$childs);
                }
            );

        if($rq->input('affilate_id',"false")!=="false")$res=$res->where("affilate_id",$rq->input('affilate_id'));
        if($rq->input('status_id',"false")!=="false"){
            $statuses = is_array($rq->status_id)?$rq->status_id:preg_split('/,/m',$rq->status_id);
            $res=$res->whereIn("status_id",$statuses);
        }
        if($rq->input('manager_id',"false")!=="false")$res=$res->where("manager_id",$rq->input('manager_id'));
        if($rq->input('my',"false")=="1")      $res=$res->where('manager_id',$user->id);
        if($rq->input('country',"false")!=="false")$res=$res->where("country",$rq->input('country'));
        if($rq->input('office',"false")!=="false")$res=$res->whereIn("manager_id",UserMeta::where('meta_name','office')->where('meta_value',$rq->input("office"))->select('user_id')->get());
        if($rq->has('date_from')) {
            $res->whereRaw("created_at >= unix_timestamp('{$rq->date_from}')");
        }
        if($rq->has('date_to')) {
            $res->whereRaw("created_at <= unix_timestamp('{$rq->date_to}')+60*60*24");
        }
        if($rq->input('search',"false")!=="false"){
            $se = $rq->input('search','%');
            if(preg_match('/^#(\d+)/',$se,$m))$res->where('id',$m[1]);
            else $res->whereRaw("(id like '%".$se."%' or name like '%".$se."%' or surname like '%".$se."%' or email like '%".$se."%' or phone like '%".$se."%' or source like '%".$se."%')");
        }
        if(false!==$rq->input('sort',false)){
            foreach($rq->input('sort') as $sort=>$asc) $res= $res->orderBy($sort,$asc);
        }
        if($rq->input('comment',"false")=="1") {
            $ret = (($res instanceof Collection)?$res:$res->get());
            $res = $ret->sortByDesc(function($item,$key){
                if(!count($item->comments))return 0;
                Log::debug('comments sort:['.$item->id.']'.$item->comments->sortByDesc('created_at')->first()->created_at);
                return $item->comments->sortByDesc('created_at')->first()->created_at->timestamp;
            })->values();
        }
        else $res->orderBy('id','desc');
        if($rq->input('excel','false')=="1") return Excel::download(new LeadExport(($res instanceof Collection)?$res:$res->get()), 'leads-'.$user->id.'-'.date('YmdHis').'.xlsx');
        $res = $res->paginate($rq->input('per_page',15));
        return ($format=='json')
            ?response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)
            :view('crm.lead.list',[
                "statuses"=>[
                    "list"=>LeadStatus::all()
                ],
                "leads"=>$res
            ]);
    }
    public function index(Request $rq,$id,$format="html"){
        if(Auth::guest())return route('home');
        $user = $rq->user();
        $childs = $user->childs;
        if($user->rights_id<=1) return route('home');
        $lead = Lead::with(['manager','status','comments'=>function($query){return $query->with('author')->orderBy('id','desc');}])->find($id);
        return ($format=='json')
                ?response()->json($lead,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)
                :view('crm.content.lead.dashboard',[
                    "lead"=>$lead,
                    "countries"=>UserController::$countries,
                    "statuses" => LeadStatus::all(),
                    "managers" => User::whereIn('id',$childs)->orWhereIn('affilate_id',$childs)->get()
                ]);
            ;
    }
    public function add(Request $rq){
        $leadData = $rq->all();
        $leadData["manager_id"] = $rq->user()->id;
        $leadData["affilate_id"] = $rq->user()->id;
        $leadData["user_id"] = $rq->user()->id;
        $lead = Lead::create($leadData);
        $lead->load(['status','manager'=>function($query){return $query->with(['meta']);},'affilate'=>function($query){return $query->with('meta');}]);
        return response()->json($lead,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function update(Request $rq,$id){
        list($res,$code)=[["error"=>"404","message"=>"User {$id} not found."],404];
        try{
            $user = $rq->user();
            $lead = Lead::find($id);
            $udata = $rq->all();
            foreach($udata as $k=>$v){
                if($v == false || $v=="false")unset($udata[$k]);
            }
            $lead->update($udata);
            $res=$lead;
            $code=200;
            $status = LeadStatus::where('code','registered')->first();
            if(isset($udata['status_id']) && $udata['status_id'] == $status->id ){
                $data=$lead->toArray();
                $data['password'] = str_random(12);
                $rg = app('App\Http\Controllers\Auth\RegisterController');
                $res = $rg->create($data);
                $res->update([
                    'parent_user_id'=>$lead->manager_id,
                    'affilate_id'=>$lead->affilate_id
                ]);
                Auth::login($user, true);
            }
        }
        catch(\Exception $e){
            $code = 500;
            $res = [
                "error"=>$e->getCode(),
                "message"=>$e->getMessage()
            ];
        }
        return response()->json($res,$code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function delete(Request $rq,$id){
        list($res,$code)=[["error"=>"404","message"=>"Lead {$id} not found."],404];
        try{
            $res = Lead::find($id)->delete();
            $code=200;
        }
        catch(\Exception $e){
            $code = 500;
            $res = [
                "error"=>$e->getCode(),
                "message"=>$e->getMessage()
            ];
        }
        return response()->json($res,$code,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function comment(Request $rq, $id){
        $author = $rq->user();
        $lead = Lead::find($id);
        $comment = $rq->input('comment','');
        $res = [];
        if(strlen($comment) && !empty($comment))$res = $lead->comments()->save(Comment::create([
                'author_user_id'=>$author->id,
                'object_id'=>$lead->id,
                'object_type'=>'lead',
                'comment'=>$comment
            ]));
        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        return $this->index($rq,$id,"html");
        // $lead->comment()
    }
    public function status(Request $rq){
        return response()->json(LeadStatus::all(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
}
