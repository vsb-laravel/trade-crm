<?php

namespace Vsb\Crm\Events;

use App\Account;
use Illuminate\Support\Facades\Auth;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;


class PrivateEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $account;
    public $userId;
    /**
     * Create a new event instance.
     *
     * @param Account $account
     * @param  $userId
     */
    public function __construct($account, $userId)
    {
        $this->account = $account;
        $this->userId = $userId;
    }

    public function  broadcastAs()
    {
        return 'private_channel';
    }

    public  function broadcastWith()
    {
        return ['private_data' => $this->account,
                'user_id' => $this->userId,
                'type' => 'private',
                'text' => '6666'
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
