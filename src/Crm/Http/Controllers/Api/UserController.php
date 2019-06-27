<?php

namespace Vsb\Crm\Http\Controllers\Api;

use Log;
use Auth;
use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        // if(is_null($user))
        // Log::debug('User',$user->toArray());
        // $users =User::with(['status'])->where('rights_id',1)->orderBy('id','desc');

        // else $users->where('1','0');
        $res=User::with([
            // 'manager',
            // 'accounts'=>function($query){
            //     $query->with(['currency'])->where('status','open');
            // },
            // 'orders'=>function($query){$query->with(['currency','account']);},
            // 'operations'=>function($query2){
            //     $query2->with(['account'])->limit(16);
            // },
            'rights',
            'status',
            'deposits',
            // 'meta'
        ]);
        $childs = $user->childs;
        $res->where(function($query)use($childs){
            $query->whereIn('parent_user_id',$childs)
                ->orWhereIn('affilate_id',$childs);
        });

        if($request->has('email'))$res->where('email',$request->email);
        if($request->has('date_from')){
            $date_from =strtotime($request->date_from);
            $date_from = $date_from - $date_from%(24*60*60);
            $res->whereRaw("created_at >= {$date_from}");
        }
        if($request->has('date_to')){
            $date_to =strtotime($request->date_to);
            $date_to = $date_to - $date_to%(24*60*60);
            $date_to += (24*60*60);
            $res->whereRaw("created_at <= {$date_to}");
        }
        $res->limit(1024);
        return response()->json($res->get(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        list($data,$res,$code)=[$request->all(),false,200];
        try{
            $validator = Validator::make($request->all(), [
                "email" => 'email|required|unique:users,email',
                "phone" => 'required|unique:users,phone',
                "name"=>'required',
                "surname"=>'required'
            ]);
            if ($validator->fails()) {
                return response()->json(['error'=>$validator->errors()],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
            }
            $rg = app('App\Http\Controllers\Auth\RegisterController');
            $data['affilate_id']=$request->user()->id;
            $res = $rg->create($data);

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

    /**
     * Display the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    // public function show(User $user)
    public function show(User $user)
    {
        $user = User::with(['status','accounts','meta','manager','affilate','deal'])->where('id',$user->id)->first();
        return response()->json($user,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }
    public function login(Request $request){
        try{
            $user = Auth::attempt(['email' => $request->input('email',''), 'password' => $request->input('password','')],true);
            if ( !$user )
                return response()->json(['message'=>'wrong user name or password'],200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        }
        catch(\Exception $e){
            return response()->json(['message'=>$e->getMessage()],200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        }
        $user = Auth::user();
        $session_id = session()->getId();
        $res = array_merge($user->toArray(),['token'=>$session_id]);
        return response()->json($res,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
}
