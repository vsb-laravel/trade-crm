<?php

namespace App\Events;

use App\Account;
use Illuminate\Support\Facades\Auth;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class AccountEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $account;
    public function __construct($account)
    {
        $this->account = $account;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('channel.'.$this->account->user_id);
        // return new PrivateChannel('channel.'.$this->account->user_id);
    }
    public function  broadcastAs(){
        return 'account';
    }
    public  function broadcastWith()
    {
        return ['private_data' => $this->account,
                'user_id' => Auth::id(),
                'type' => 'private',
                'text' => '11111111'
            ];
    }
}
