<?php

namespace App\Http\Controllers\Api;

use Log;
use Auth;
use Mail;
// use Swift_MailTransport;
use App\User;
use App\Mailbox;
use App\Mail\UserMailbox;
use Webklex\IMAP\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth as FacadeAuth;
use Illuminate\Support\Facades\Validator;

class ImapController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $mails = [];
        $user = Auth::user();
        // $users = User::where('parent_user_id',$user->id)->orWhere('id',$user->id)->get();
        $mails = Mailbox::with(['client','user'=>function($query){$query->with(['rights']);}])->whereIn('user_id',$user->childs)->orderBy('date','desc')->get();
        return response()->json($mails,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
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
        $user = Auth::user();
        $mail = [
            "from"=>$user->mail['login'],
            "to" => $request->input("to",''),
            "subject" => $request->input("subject",''),
            "message" => $request->input("message",''),
            "user" => $user
        ];
        // Backup your default mailer
        $backup = Mail::getSwiftMailer();

        // Setup your gmail mailer
        // $transport = Swift_SmtpTransport::newInstance('smtp.gmail.com', 465, 'ssl');
        $transport = new \Swift_SmtpTransport($user->mail['smtp']['host'],$user->mail['smtp']['port'],$user->mail['smtp']['encryption']);
        $transport->setUsername($user->mail['login']);
        $transport->setPassword($user->mail['password']);
        // Any other mailer configuration stuff needed...

        $gmail = new \Swift_Mailer($transport);

        // Set the mailer as gmail
        Mail::setSwiftMailer($gmail);

        // Send your message
        $sp = new UserMailbox(json_decode(json_encode($mail)));
        Mail::send($sp);
        $sender = [
            [
                "full"=>"{$user->title} <{$user->mail['login']}>",
                "host"=>ENV('host',''),
                "mail"=>$user->mail['login'],
                "mailbox"=>"mailbox",
                "personal"=>$user->title
            ]
        ];
        $client = User::where('email',$mail["to"])->first();

        $reciever = is_null($client)?[]:[
            [
                "full"=>"{$client->title} <{$client->email}>",
                "host"=>ENV('host',''),
                "mail"=>$client->email,
                "mailbox"=>"mailbox",
                "personal"=>$client->title
            ]
        ];
        $type = 'sent';
        $cc = null;
        $date = date("Y-m-d H:i:s");

        $dd = [
            'user_id'=>$user->id,
            'type'=> $type,
            'uid'=>$user->id.time(),
            'date'=>$date,
            'sender'=>$sender,
            'reciever'=>json_encode($reciever),
            'client_id'=>is_null($client)?null:$client->id,
            "subject"=>$mail['subject'],
            "message"=>$mail['message'],
            "cc"=>$cc
        ];
        // echo json_encode($dd)."\n";
        $um = Mailbox::create($dd);

        // Restore your original mailer
        Mail::setSwiftMailer($backup);
        return response()->json($mail,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    // public function show(User $user)
    public function show(Mailbox $item)
    {
        return response()->json($item->makeVisible('message')->toArray(),200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
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
    public function update(Request $request, $uid)
    {
        $user = $request->has('user_id')?User::find($request->user_id):Auth::user();
        $um = Mailbox::where('user_id',$user->id)->where('uid',$uid)->first();
        $um->update($request->all());
        return response()->json($um,200,['Content-Type' => 'application/json; charset=utf-8'],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $uid)
    {
        $user = $request->has('user_id')?User::find($request->user_id):Auth::user();

        $um = Mailbox::where('user_id',$request->input('user_id',0))->where('uid',$uid)->first();
        if(!is_null($um)){
            if($um->type=='inbox'){
                $iClient = $this->getImap($user);
                //Get all Mailboxes
                /** @var \Webklex\IMAP\Support\FolderCollection $aFolder */
                $aFolder = $iClient->getFolders();
                foreach($aFolder as $oFolder){
                    $m = $oFolder->getMessage($uid);
                    if(!is_null($m)){
                        $m->delete();
                        break;
                    }
                }
                $iClient->expunge();
            }
            $um->delete();
        }
    }
    protected function getImap(User $user){
        $i = new Client([
            'host'          => $user->mail['imap']['host'],//'imap.yandex.ru',
            'port'          => $user->mail['imap']['port'],
            'encryption'    => $user->mail['imap']['encryption'],
            'validate_cert' => false,
            'username'      => $user->mail['login'],
            'password'      => $user->mail['password'],
        ]);
        //Connect to the IMAP Server
        $i->connect();
        return $i;
    }
}
/*
{
    "server": "yandex",
    "login": "2",
    "password": "3",
    "imap": {
        "host": "imap.yandex.ru",
        "port": "993",
        "encryption": "ssl"
    },
    "smtp": {
        "host": "smtp.yandex.ru",
        "port": "465",
        "encryption": "ssl"
    }
}
 */
