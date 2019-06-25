<?php

namespace App\Events;

use Log;
use App\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class EventEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $broadcastQueue = 'notification';
    protected $event;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($event)
    {
        $this->event = $event;
    }
    public function  broadcastAs()
    {
        return 'event';
    }

    public  function broadcastWith()
    {
        // if($this->event->object_type == 'deal'){
        //     $this->event->load([
        //         'object'=>function($query){
        //             $query->with([
        //                 'user'=>function($query2){
        //                     $query2->with([
        //                         'manager',
        //                         'rights',
        //                         'status',
        //                         'country',
        //                         'meta',
        //                         'last_login',
        //                         'last_ip',
        //                         'kyc',
        //                         'trades',
        //                         'accounts'=>function($query) { $query->with(['currency']);},
        //                         'transactions'=>function($query) { $query->with(['invoice','withdrawal','merchant','comments']); },
        //                         'deal'=>function($query){ return $query->with(['instrument','status','account']);},
        //                         'documents',
        //                         'comments'=>function($query){return $query->with('author');}
        //                     ]);
        //                 },
        //                 'instrument'=>function($query3){
        //                     $query3->with(['from','to','source']);
        //                 },
        //                 'currency',
        //                 'status',
        //                 'account'
        //             ]);
        //         },
        //         'user'
        //     ]);
        //     // Log::debug('EventEvent '.json_encode($this->event));
        // }
        $this->event->loadMissing(['object','user']);
        $admins = $this->event->user->parents;
        return ['data' => $this->event, 'user_id' => $admins, 'type' => 'group'];
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
