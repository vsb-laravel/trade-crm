<?php

namespace Vsb\Crm\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class Withdrawal extends Notification
{
    use Queueable;
    protected $user;
    protected $withdrawal;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user,$withdrawal)
    {
        $this->user = $user;
        $this->withdrawal = $withdrawal;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line('Dear Trader,')
                    ->line('your withdrawal request of $'.number_format($this->withdrawal->amount,2,'.',' ').' has been submitted, we will take care of it shortly. Thank You')
                    ->action('Trade more', url('login'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
