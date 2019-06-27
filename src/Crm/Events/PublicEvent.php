<?php

namespace Vsb\Crm\Events;


use Illuminate\Support\Facades\Auth;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PublicEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;
    /**
     * Create a new event instance.
     *
     * @param  $data
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    public function  broadcastAs()
    {
        return 'channel-amotrade';
    }

    public  function broadcastWith()
    {
        return ['public_data' => $this->data, 'type' => 'group_public', 'text' => '77777'];
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
}
