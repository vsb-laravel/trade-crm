<?php

namespace Vsb\Crm\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Webklex\IMAP\Client;

use DB;
use Log;

use App\User;
use Vsb\Model\Mailbox;
use Vsb\Crm\Notifications\InvoiceShipped;

class LoadMails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:mails';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Loading mails';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
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
    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        foreach(User::whereNotNull('mail')->get() as $user){
            if(is_null($user) || is_null($user->mail) || !isset($user->mail['imap'])){
                continue;
            }
            try{
                // Log::debug('LoadMails for '.$user->mail['login']);
                $iClient = $this->getImap($user);
                // echo json_encode($user->mail,JSON_PRETTY_PRINT)."\n";
                //Get all Mailboxes
                /** @var \Webklex\IMAP\Support\FolderCollection $aFolder */
                $aFolder = $iClient->getFolders();
                foreach($aFolder as $oFolder){
                    //Get all Messages of the current Mailbox $oFolder
                    /** @var \Webklex\IMAP\Support\MessageCollection $aMessage */
                    $aMessage = $oFolder->getMessages();
                    /** @var \Webklex\IMAP\Message $oMessage */
                    foreach($aMessage as $oMessage){
                        // $mails[] = $oMessage;continue;

                        $um = Mailbox::withTrashed()->where('user_id',$user->id)->where('uid',$oMessage->getUid())->first();

                        if(is_null($um)){
                            $sender = $oMessage->getSender();
                            $type = ($sender{0}->mail==$user->mail['login'])?'sent':'inbox';
                            $cc = $oMessage->getCc();
                            $cc = count($cc)?$cc{0}->mail:null;
                            $date = $oMessage->getDate();
                            // echo "[{$type}] user_id = ".$user->id," and uid = ".$oMessage->getUid()." ".json_encode($um)."\n";
                            // echo json_encode($oMessage->getFrom())."\n";
                            // echo json_encode($oMessage->getTo())."\n";
                            echo json_encode($oMessage->getDate())."\n";
                            // echo json_encode($cc)."\n";
                            $client =($type=='inbox')
                                ?User::where('email',$oMessage->getFrom(){0}->mail)->first()
                                :User::where('email',$oMessage->getTo(){0}->mail)->first();

                            $dd = [
                        		'user_id'=>$user->id,
                        		'type'=> $type,
                        		'uid'=>$oMessage->getUid(),
                        		'date'=>$date->date,
                        		'sender'=>json_encode($sender),
                        		'reciever'=>json_encode($oMessage->getTo()),
                        		'client_id'=>is_null($client)?null:$client->id,
                                "subject"=>$oMessage->getSubject(),
                                "message"=>$oMessage->getHTMLBody(true),
                                "cc"=>$cc
                            ];
                            // echo json_encode($dd)."\n";
                            $um = Mailbox::create($dd);
                            // echo
                        }

                    }
                }
            }
            catch(\Exception $e){
                echo "Exception[".$e->getCode()."]: ".$e->getMessage()."\n";
                Log::error("Mails for ".$user->mail['login'].' are not loaded');
                continue;
            }
        }
    }
}
