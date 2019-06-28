<?php

namespace Vsb\Crm\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class InvoiceShipped extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($invoice,$olap)
    {
        $this->invoice = $invoice;
        $this->olap = $olap;
    }
    protected $invoice=null;
    protected $olap=null;
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
        $notif = (new MailMessage)
                    ->success()
                    ->greeting($this->invoice->brand->title.'. New deposit.')
                    ->line($this->invoice->brand->title.' amount $'.number_format($this->invoice->amount,2,'.',' ').".")
                    ->action('Sales SkyMechanics', url('http://sales.xcryptex.com'))
                    ->line('For this month.'.date('Y-m-d'));
        foreach($this->olap as $ol){
            $notif->line($ol->title.'    $'.number_format($ol->total,2,'.',' ').' (10%: '.number_format($ol->total*.1,2,'.',' ').')');
        }
        return $notif;
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
