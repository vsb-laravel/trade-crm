<?php

namespace Vsb\Crm\Console\Commands;

use Illuminate\Console\Command;

//local classes
use Log;
use Vsb\Model\Deal;
use Vsb\Model\DealStatus;
use Vsb\Model\Price;
use Vsb\Model\Instrument;
use Vsb\Model\Currency;
use Vsb\Model\Source;
use Vsb\Model\Account;
use Vsb\Crm\Events\AccountEvent;
use cryptofx\CryptoCompareApi;
use cryptofx\DealMechanic;

class ProcessDeals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:process';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process deals';

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
    public function handle(){
        echo "Proccess deals stated ....\n";
        $openDealStatus = DealStatus::where('code','close')->first();
        // $deals = Deal::orderBy('id')->get();

        $ticks = time();
        while(time()-$ticks<60){
            $deals = Deal::where('status_id','<>',$openDealStatus->id)->orderBy('id')->orderBy('updated_at')->get();
            foreach($deals as $deal){
                try{
                    DealMechanic::fork($deal);
                    // event( new AccountEvent(Account::find($deal->account_id)) );
                }
                catch(\Exception $e){
                    Log::error($e);
                }

            }
            usleep(400);
        }
    }
}
