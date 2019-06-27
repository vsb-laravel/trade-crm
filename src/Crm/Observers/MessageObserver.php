<?php

namespace Vsb\Crm\Observers;
use Vsb\Crm\Model\User;
use Vsb\Crm\Model\Message;
use App\Events\UserStateEvent;

class MessageObserver
{
    /**
     * Handle the Message "created" event.
     *
     * @param  \App\Message  $Message
     * @return void
     */
    public function created(Message $message)
    {
        $user = User::find($message->user_id);
        if(is_null($user)) return;
        if($user->rights_id > 1 ) $user = User::find($message->author_id);
        if(is_null($user)) return;
        event(new UserStateEvent($user->id));
    }
    public function updated(Message $message)
    {
        $user = User::find($message->user_id);
        if(is_null($user)) return;
        if($user->rights_id > 1 ) $user = User::find($message->author_id);
        if(is_null($user)) return;
        event(new UserStateEvent($user->id));
    }
}
