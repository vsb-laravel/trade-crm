<?php

namespace Vsb\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mailbox extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'imap';
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateFormat = 'U';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
		'user_id',
		'type',
		'uid',
		'date',
		'sender',
		'reciever',
		'client_id',
		'subject',
		'message',
        'cc',
        'status'
    ];
    protected $hidden = [
        'message'
    ];
    protected $casts = [
        'reciever'=>'array',
        'sender'=>'array'
    ];
    public function getBodyAttribute(){
        return $this->attributes['body'] = $this->message;
    }
    public function client(){ return $this->belongsTo('Vsb\Crm\User','client_id');}
    public function user(){ return $this->belongsTo('Vsb\Crm\User');}
}
