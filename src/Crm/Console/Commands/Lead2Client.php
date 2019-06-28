<?php

namespace Vsb\Crm\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

use DB;
use Log;

use App\User;
use Vsb\Model\Lead;
use Vsb\Model\LeadStatus;

class Lead2Client extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:lead2client';

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
        $registered = LeadStatus::where('code','registered')->first();
        $leads = Lead::where('manager_id',2)->whereNull('client_id');
        $counts = $leads->count();
        foreach($leads->get() as $lead){
            $counts--;
            $data=$lead->toArray();
            $data['password'] = str_random(12);
            try{

                $rg = app('Vsb\Crm\Http\Controllers\Auth\RegisterController');
                $client = $rg->create($data);
                $client->update([
                    'parent_user_id'=>$lead->manager_id,
                    'affilate_id'=>$lead->affilate_id
                ]);
                echo "{$counts}\t{$lead->id} converted to {$client->id}\n";
            }
            catch(\Exception $e){
                echo $e->getMessage()."\n";
            }


        }
        $leads->update(['status_id'=>$registered->id]);

    }
}
