<?php

namespace Vsb\Crm\Console\Commands;

use Illuminate\Console\Command;
use Vsb\Model\Instrument;
use Vsb\Model\Price;
use Vsb\Crm\Events\PriceEvent;
use Vsb\Model\Source;

class Tick extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:tick {--source=fake_ticks} {pair?} {value?} ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate fake tick for specific instrument with assigned value';

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
        $pairID = false;
        $value = false;
        $instrument = null;
        $price = null;
        $args = $this->arguments();
        if(!isset($args['pair'])){
            $pairs = Instrument::where('enabled',1)->get();
            foreach($pairs as $pair){
                $this->info("#{$pair->id}\t{$pair->symbol}");
            }
            $pairID = $this->ask('Instrument id?');
        }
        else $pairID = $args['pair'];
        $instrument = Instrument::find($pairID);
        if(!isset($args['value'])){
            // $date = date('Y-m-d H:i:s',$instrument->updated_at);
            $date = $instrument->updated_at;
            $this->info("Lastest price was at {$date}\t{$instrument->price}");
            $value = $this->ask('value?');
        }else $value = $args["value"];
        $sourceName =$this->option('source');
        $source = Source::where('name',$sourceName)->first();
        if(is_null($source)){
            $this->info("Using default source fake_ticks");
            $source = Source::where('name','fake_ticks')->first();
        }
        if(is_null($source)){
            $this->info("No source fake_ticks, so using first one");
            $source = Source::find(1);
        }
        if(is_null($source)){
            $this->info("No one sources assigned. Check table sources");
            return;
        }
        $volation=0;
        $volation = ($instrument->pirce>$value)?-1:1;
        $price = Price::create([
            'time'=>time(),
            "price"=>$value,
            "instrument_id"=>$instrument->id,
            'source_id'=>$source->id,
            'volation'=>$volation
        ]);
        event(new PriceEvent($price));
    }
}
