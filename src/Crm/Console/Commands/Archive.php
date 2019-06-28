<?php

namespace Vsb\Crm\Console\Commands;

use Illuminate\Console\Command;

class Archive extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:archive';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Archive old transactions';

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
        //
    }
}
