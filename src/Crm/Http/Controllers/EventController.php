<?php namespace App\Http\Controllers;
use DB;
use Log;
use App\User;
use App\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller{
    public function __construct()
    {
        $this->middleware('auth');
        // $this->middleware('online');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $rq){
        $res = [];
        // return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        // $user = ($rq->input('user_id',false)!==false)?User::find($rq->input('user_id')):$rq->user();
        $user = UserController::getUser($rq,$rq->input('user_id',false));
        // $q = Event::with(['user','object'])->whereIn('user_id',$user->childs());
        $q = Event::with(['user','object'])->whereIn('user_id',$user->childs);
        if($rq->input('status',false)!==false)$q->where('status',$rq->status);
        if($rq->input('type',false)!==false)$q->where('object_type',$rq->type);
        $q->orderBy('id')->limit(128);
        return response()->json($q->get(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    public function update(Request $rq,Event $event){
        $event->update($rq->all());
        return response()->json($event,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function delete($id,Request $rq){
        $task = Message::find($id)->delete();
        return response()->json($task,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
}
?>
