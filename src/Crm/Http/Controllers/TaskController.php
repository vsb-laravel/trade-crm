<?php namespace Vsb\Crm\Http\Controllers;
use DB;
use Log;
use Vsb\Crm\Model\User;
use Vsb\Crm\Model\Task;
use Vsb\Crm\Model\TaskStatus;
use Vsb\Crm\Model\TaskType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller{
    public function __construct(){
        $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $rq){
        $res = [];
        $user = $rq->user();
        $tasks = Task::orderBy('status_id','desc')->orderBy('start_date')
            ->byType($rq->input("type","all"))
            ->byStatus($rq->input("status","all"))
            ->where("user_id",$user->id)
            ->whereRaw("date(start_date)>='".date("Y-m-d")."'")
            ->with(['status','type','user','object']);
        if($rq->input('object_type',false)!==false)$tasks= $tasks->where('object_type',$rq->input('object_type'));
        if($rq->input('object_id',false)!==false)$tasks= $tasks->where('object_id',$rq->input('object_id'));
        // Log::debug($tasks->toSql());
        return response()->json($tasks->get(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function add(Request $rq){
        $data = $rq->all();
        // Log::debug("create task", $data);
        return response()->json(Task::create($data),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function edit($id,Request $rq){
        $user = ($rq->input("user_id",false)!==false)?User::find($rq->input("user_id")):$rq->user();
        $task = Task::find($id)->update($rq->all());
        return response()->json($task,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function delete($id,Request $rq){
        $task = Task::find($id)->delete();
        return response()->json($task,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function statuses(Request $rq){
        return response()->json(TaskStatus::all(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function types(Request $rq){
        return response()->json(TaskType::all(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
}
?>
