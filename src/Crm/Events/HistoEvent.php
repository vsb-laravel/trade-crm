<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class HistoEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
     public $data;

     public function __construct($h)
     {
         $this->data = $h;

         echo 'New histo event should be broadcasted: '.json_encode($this->data) . "\n";
     }

     public function  broadcastAs()
     {
         return 'ohls';
     }

     public  function broadcastWith()
     {
         $data = $this->data->toArray();
         $data["time"]-=3*60*60;
         return ['data' => $data,
                 'type' => 'public',
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
