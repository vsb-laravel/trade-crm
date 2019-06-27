<?php

namespace Vsb\Crm\Http\Controllers\Api;

use DB;
use Log;
use Auth;
use App\User;
use App\Message;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request){
        $user = $request->user();
        $response = Message::with(['user','author'])->where(function($query)use($user){
            $query->where('user_id',$user->id)
                ->orWhere('author_id',$user->id);
        })->orderBy('id','desc')->paginate($request->input('per_page',15));
        return response()->json($response,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
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
    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            "user_id" => 'required|exists:users,id',
            "author_id" => 'required|exists:users,id',
            "message" => 'string|required'
        ]);
        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        }

        $response = Message::create($request->all());
        return response()->json($response,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    // public function show(User $user)
    public function show(Message $message)
    {
        $message->load(['user','author']);
        return response()->json($message,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(Message $message)
    {
        $message->load(['user','author']);
        return response()->json($message,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Message $message){
        $validator = Validator::make($request->all(), [
            "user_id" => 'exists:users,id',
            "author_id" => 'exists:users,id',
            "message" => 'string'
        ]);
        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        }
        $message->update($request->all());
        return response()->json($message,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(Message $message){
        $message->delete();
        return response()->json('ok',200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
}
