<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;
use Vsb\Crm\Model\User;

class Event extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'events';
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
    protected $dates = [
        'created_at',
        'updated_at',
    ];
    protected $fillable = [
        'status','user_id','object_id','object_type','type'
    ];
    public function user(){
        return $this->belongsTo('App\User');
    }
    public function object(){
        return $this->morphTo();
    }
}
