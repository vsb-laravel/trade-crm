<?php

namespace Vsb\Crm\Console\Commands;

use App\User;
use Illuminate\Console\Command;

class FindRecurse extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cryptofx:findrecurse {user_id?}';

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
        $args = $this->arguments();
        $users = isset($args['user'])?preg_split('/\s*,\s*/',$args['user']):null;
        if(is_null($users)){
            $users=User::where('rights_id','>',1)->get();
        }
        foreach ($users as $u) {
            $time = time();
            $childs = $u->childs;
            $parents = $u->parents;
            $time = time()-$time;
            // $this->info( '#'.$u->id.' In '.$time.'s childs['.json_encode($childs).'] parents['.json_encode($parents).']' );
            if(in_array($u->id,$parents))$this->warn( '#'.$u->id.' '.$u->rights->name.' is in parents: '.json_encode($parents));
            // if(in_array($u->id,$childs))$this->warn( '#'.$u->id.' is in childs');
        }
    }
}
