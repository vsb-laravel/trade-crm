<?php

namespace App\Events;

use Illuminate\Support\Facades\Auth;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PresistentEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $data;
    public $usersId;

    public function __construct($data, array $usersId)
    {
        $this->data = $data;
        $this->usersId = $usersId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    
    public function broadcastOn()
    {
        return ['channel-amotrade'];
    }

    public  function broadcastWith()
    {
        return ['data' => $this->data, 'user_id' => [Auth::id(), 1, 3, 4, 5, 6], 'type' => 'group'];
    }

    public function  broadcastAs()
    {
        return 'presister';
    }
}

