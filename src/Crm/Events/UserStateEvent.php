<?php

namespace App\Events;

use Log;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Support\Facades\Redis;
use App\User;


class UserStateEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $broadcastQueue = 'userstate';
    public $user_id;
    public $user;
    public $group;
    public $loaded;

    public function tag(){
        return ['userstate', 'user['.$this->loaded.']:'.$this->user_id];
    }
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($user_id)
    {
        $this->user_id = $user_id;
        $this->loaded = time();
        $this->user = User::find($this->user_id);
        $this->group = $this->user->parents;
        $this->group[]=$this->user->id;
        $onlineUsers = json_decode(Redis::get('cf:online'));
        $reals = [];
        if(is_array($onlineUsers)){
            foreach($onlineUsers as $manager){
                if(in_array($manager->id,$this->group))$reals[]=$manager->id;
            }
            if(count($reals)){
                $this->user->load([
                    'accounts'=>function($query) { $query->with(['currency']);},
                    'transactions'=>function($query) { $query->with(['invoice','withdrawal','merchant','comments']); },
                    'deal'=>function($query){ return $query->with(['instrument','status','account']);},
                    'documents',
                    'comments'=>function($query){return $query->with('author');},
                    'meta'
                ]);
                $this->user->setAppends(['title','pairgroup','balance','activity','campaign','office','messages']);
                // $this->user->setAppends(['title','pairgroup','balance','messages']);
                // Log::debug('real online is <'.join($reals).'> of '.join($this->group,','));
            }
        }

        // else Log::debug('noone online of '.join($this->group,','));
        $this->loaded = time() - $this->loaded;
    }


    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'user';
    }
    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        $user = $this->user->toArray();
        $user['loaded']=time()-$this->loaded;
        return ['data' => $user,
                'user_id' => $this->group,
                'type'=>'group'
        ];
    }
    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-private');
    }
}
