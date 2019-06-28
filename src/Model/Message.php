<?php

namespace Vsb\Model;

use Illuminate\Database\Eloquent\Model;
use App\User;

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
        return $this->belongsTo('Vsb\Crm\User');
    }
    public function author(){
        return $this->belongsTo('Vsb\Crm\User','author_id');
    }
    public function parent(){
        return $this->belongsTo('Vsb\Crm\Message','parent_id');
    }
}
