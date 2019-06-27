<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;
use Vsb\Crm\Model\User;

class Message extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'messages';
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
        'status','author_id','user_id','subject','message','parent_id'
    ];
    public function manager(){
        return $this->belongsTo('App\User');
    }
    public function author(){
        return $this->belongsTo('App\User','author_id');
    }
    public function parent(){
        return $this->belongsTo('App\Message','parent_id');
    }
}
