<?php

namespace Vsb\Crm\Model;

use Log;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Vsb\Crm\Model\UserMeta;
use Vsb\Crm\Model\UserRights;
use Vsb\Crm\Model\UserHierarchy;
use Vsb\Crm\Model\Account;

class UserHistory extends Authenticatable
{
    use Notifiable;
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
        'user_id','type','object_id', 'object_type', 'description'
    ];
    protected $table='user_history';

    public function user(){
        //'parent_user_id','user_id'
        return $this->belongsTo('App\User');
    }
    public function object(){
        return $this->morphTo();
        // return $this->hasMany('App\Comment','user_id');
    }
}
