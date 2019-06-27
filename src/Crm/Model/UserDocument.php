<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;


use Vsb\Crm\Model\User;
use Vsb\Crm\Model\UserRights;
use Vsb\Crm\Model\Account;

class UserDocument extends Model{
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateFormat = 'U';
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_documents';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'type','user_id','file','status'
    ];
    /**
     * Scope a query to only include popular users.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByUser($query,User $user){
        return $query->where('user_id', '=', $user->id);
    }
    public function user(){
        return $this->belongsTo('App\User');
    }
}
