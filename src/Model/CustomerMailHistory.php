<?php

namespace Vsb\Model;

use Illuminate\Database\Eloquent\Model;

class CustomerMailHistory extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mail_history';
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateFormat = 'U';
    const UPDATED_AT = null;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id','mail_id','sender_id','text'
    ];
    public function user(){
        return $this->belongsTo('Vsb\Crm\User');
    }
    public function sender(){
        return $this->belongsTo('Vsb\Crm\User','sender_id');
    }
    public function mail(){
        return $this->belongsTo('Vsb\Crm\CustomerMail','mail_id');
    }
}
