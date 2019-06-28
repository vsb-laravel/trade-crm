<?php

namespace Vsb\Crm\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

use DB;
use Log;

use App\User;
use Vsb\Model\Merchant;
use Vsb\Model\Brand;
use Vsb\Model\BrandInvoice;
use Vsb\Crm\Notifications\InvoiceShipped;

class LoadInvoice extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:brands';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
        $ins = [];
        $today = strtotime(date("Y-m-01 00:00:00"));
        echo "Check on ".date("Y-m-d H:i:s")."\n";
        foreach (Brand::all() as $brand) {
            try{
                echo "Brand\t".$brand['title']."\n";
                $merchants = DB::connection($brand['name']."_db")->table('merchants')->where('enabled',1)->select('id','name')->get();
                // echo json_encode($merchants)."\n";continue;
                $invoices=DB::connection($brand['name']."_db")
                    ->table('merchant_invoices')
                    ->where('error',0)
                    ->where('amount','>',0)
                    ->whereIn('merchant_id',DB::connection($brand['name']."_db")->table('merchants')->where('enabled',1)->pluck('id'))
                    ->whereNotIn('id',BrandInvoice::where('brand_id',$brand->id)->where('created_at','>=',$today)->pluck('invoice_id'))
                    ->where('created_at','>=',$today)
                    ->orderBy('id')
                    ->get();
                foreach($invoices as $invoice){
                    $ins[] = [
                        'created_at'=>$invoice->created_at,
                        'updated_at'=>$invoice->updated_at,
                        'brand_id'=>$brand->id,
                        'invoice_id'=>$invoice->id,
                        'order_id'=>$invoice->order_id,
                        'reference_id'=>$invoice->reference_id,
                        'amount'=>$invoice->amount,
                        'currency'=>$invoice->currency,
                        'method'=>$invoice->method,
                        'error'=>0,
                        'message'=>'Ok',
                        'raw'=>$invoice->raw
                    ];
                }
            }
            catch(\Exception $e){
                echo "ERROR".$e->getMessage();
                Log::error($e);
            }
        }
        BrandInvoice::insert($ins);
        $olap = Brand::all();
        $invoices = BrandInvoice::with(['brand'])->where('notified',0)->get();
        foreach (User::where('rights_id',10)->get() as $user) {
        // foreach (User::whereIn('id',[1,5,59])->get() as $user) {
            foreach ($invoices as $invoice) {
                echo "New invoice: ".$invoice->brand->title." within ".$invoice->merchant_id." $".$invoice->amount."\n";
                Log::debug('Sending Invoice notification to '.$user->email);
                $user->notify(new InvoiceShipped($invoice,$olap));
            }

        }
        BrandInvoice::with(['brand'])->where('notified',0)->update(['notified'=>1]);
    }
}
