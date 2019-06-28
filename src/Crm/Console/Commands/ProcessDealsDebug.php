<?php

namespace Vsb\Crm\Console\Commands;

use Illuminate\Console\Command;

//local classes
use Vsb\Model\Deal;
use Vsb\Model\DealStatus;
use Vsb\Model\Price;
use Vsb\Model\Instrument;
use Vsb\Model\Currency;
use Vsb\Model\Source;
use cryptofx\CryptoCompareApi;
use cryptofx\DealMechanic;

class ProcessDealsDebug extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:debug';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process deals debug';

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
        $closeDealStatus = DealStatus::where('code','close')->first();
        $deals = Deal::where('status_id','<>',$closeDealStatus->id)->orderBy('id')->orderBy('updated_at')->get();
        foreach($deals as $deal){
            DealMechanic::fork($deal);
            // echo json_encode($deal)."\n";
        }

    }
}
