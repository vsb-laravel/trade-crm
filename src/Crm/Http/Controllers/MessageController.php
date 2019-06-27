<?php namespace Vsb\Crm\Http\Controllers;
use DB;
use Log;
use App\User;
use App\Event;
use App\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller{
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
        $admin = $rq->user();
        $res = [];
        // $user = ($rq->input('user_id',false)!==false)?User::find($rq->input('user_id')):$rq->user();
        $user = UserController::getUser($rq,$rq->input('user_id',false));
        if(is_null($user))return response()->json([],200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        $messages = Message::with(['author'=>function($q){$q->with('manager');},'manager','parent']);//->whereIn('author_id',$user->childs);

        // $admins = User::where(function($q)use($admin){
        //     $q->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);
        // })->pluck('id');
        // $messages->where(function($q)use($user,$admins){
        //     $q->where('user_id',$user->id)->orWhere('author_id',$user->id)
        //         ->orWhereIn('author_id',User::where('rights_id',1)->where(function($u)use($admins){
        //             $u->whereIn('parent_user_id',$admins)->orWhereIn('affilate_id',$admins);
        //         })->pluck('id'));
        // });
        $messages->where(function($q)use($admin,$user){
            $childs = $admin->childs;
            $q
                ->where(function($sq)use($childs,$user){$sq->whereIn('user_id',$childs)->where('author_id',$user->id);})
                ->orWhere(function($sq)use($childs,$user){$sq->where('user_id',$user->id)->whereIn('author_id',$childs);});
        });
        // $messages->where(function($q)use($user){$q->where('user_id',$user->id)->orWhere('author_id',$user->id);});

        if($rq->input('status',false)!==false) $messages = $messages->where('status',$rq->input('status'));
        if($rq->input('parent_id',false)!==false) $messages = $messages->where('parent_id',$rq->input('parent_id'));
        if($rq->input('search',false)!==false) $messages = $messages->where(function($q)use($rq){$q->where('subject','like','%'.$rq->search.'%')->orWhere('message','like','%'.$rq->search.'%');});
        $messages->orderBy('id');
        return response()->json($messages->get(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function add(Request $rq){
        $author = $rq->user();
        $data = $rq->all();
        $data['author_id'] = $author->id;
        $data['user_id'] = isset($data['user_id'])?$data['user_id']:$author->parent_user_id;
        // Log::debug("create task", $data);
        $message = Message::create($data);

        if($author->rights_id==1) Event::create(['type'=>'message','object_type'=>'message','object_id'=>$message->id,'user_id'=>$author->id]);

        $message->load(['manager','author']);
        return response()->json($message,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function edit($id,Request $rq){
        $user = ($rq->input("user_id",false)!==false)?User::find($rq->input("user_id")):$rq->user();
        $data = $rq->all();
        $data['user_id'] = $user->id;
        $task = Message::find($id)->update($data);
        return response()->json($task,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
    public function delete($id,Request $rq){
        $task = Message::find($id)->delete();
        return response()->json($task,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
}
?>
