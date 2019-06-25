<?php

namespace App\Http\Controllers;

use App\Newsfeed;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsfeedController extends Controller
{
    public function __construct(){
        $this->middleware('cors');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $items = Newsfeed::with(['user']);
        if($request->has("search") && $request->search !== "false") {
            $se = $request->input('search','%');
            if(preg_match('/^#(\d+)/',$se,$m))$items->where('id',$m[1]);
            else $items->where(function($q)use($se){
                $q->where('user_id','like',"%{$se}%")
                    ->orWhere('category','like',"%{$se}%")
                    ->orWhere('anonce','like',"%{$se}%")
                    ->orWhere('title','like',"%{$se}%")
                    ->orWhere('content','like',"%{$se}%");
            });
        }
        if($request->has("type") && $request->type !== "false") $items->whereIn('type',preg_split('/,/',$request->type));
        if($request->has("user_id") && $request->user_id !== "false") $items->whereIn('user_id',preg_split('/,/',$request->user_id));
        if($request->has("published") && $request->published !== "false") $items->whereIn('published',preg_split('/,/',$request->published));
        return response()->json($items->paginate($request->input('per_page',15)),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
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
        $validator = Validator::make($request->all(), [
            "title" => 'required',
            "content"=>'required',
            "category"=>'required',
            "anonce"=>'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()],500,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
        }
        $user = $request->user();
        $data = $request->all();
        $data['user_id']=$user->id;
        $item = Newsfeed::create($data);
        $item->load(['user']);
        return response()->json($item,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Newsfeed  $newsfeed
     * @return \Illuminate\Http\Response
     */
    public function show(Newsfeed $newsfeed)
    {
        $newsfeed->load(['user']);
        return response()->json($newsfeed,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Newsfeed  $newsfeed
     * @return \Illuminate\Http\Response
     */
    public function edit(Newsfeed $newsfeed)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Newsfeed  $newsfeed
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Newsfeed $newsfeed)
    {
        $newsfeed->update($request->all());
        $newsfeed->load(['user']);
        return response()->json($newsfeed,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Newsfeed  $newsfeed
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request,Newsfeed $newsfeed)
    {
        $newsfeed->delete();
        return $this->index($request);
    }
}
