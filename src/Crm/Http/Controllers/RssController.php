<?php namespace App\Http\Controllers;
use Log;
use cryptofx\RSS;
use Illuminate\Http\Request;

class RssController extends Controller{
    public function __construct(){}
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $rq){
        $feeds = [];
        $rss = new RSS;
        foreach($rss->get() as $news){
            // var_dump($news);continue;
            $feed = [
                "source"=>"reddit",
                "lang"=>"en",
                "title"=>(string)$news["title"],
                "content"=>preg_replace('/href="([^"]+)"/im','href="#"',(string)$news["content"]),
                "date"=>$news["date"]
            ];
            $feeds[]=$feed;
        }
        return response()->json($feeds,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }
}
?>
