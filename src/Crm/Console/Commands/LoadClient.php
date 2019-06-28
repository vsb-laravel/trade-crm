<?php

namespace Vsb\Crm\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

use DB;
use Log;

use App\User;
use Vsb\Model\Lead;
use Vsb\Model\LeadStatus;

class LoadClient extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:loadclient';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Bulk action lead to client';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $counts = 0;
        if (($handle = fopen('tests/amotrader/clients.csv', "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                try{
                    $client = User::where('email',$data[1])->orWhere('phone','+'.$data[2])->first();
                    if(!is_null($client)){
                        echo "already in base {$client->email}\n";
                        continue;
                    }
                    else{
                        $nn = preg_split("/\s/",$data[0]);
                        $bal = floatval($data[5]);
                        $password = str_random(8);
                        $cl = [
                            "name"=>$nn[0],
                            "surname"=>$nn[1],
                            "email"=>$data[1],
                            "phone"=>"+".$data[2],
                            "country"=>$data[3],
                            "source"=>$data[4],
                            "password"=>$password,
                            "confirm_password"=>$password,
                        ];
                        $rg = app('Vsb\Crm\Http\Controllers\Auth\RegisterController');
                        $client = $rg->create($cl);
                    }

                    $acc = $client->accounts()->where('type','real')->first();

                    if($bal>0){
                        $acc->update(['amount'=>$bal]);
                        $client->update(['deposited'=>1]);
                    }
                    $counts++;
                    echo "{$counts}\t added to {$client->email}\n";
                }
                catch(\Exception $e){
                    echo $e->getMessage()."\n";
                    echo $e->getTraceAsString()."\n";
                }
            }
            fclose($handle);
        }

    }
}
