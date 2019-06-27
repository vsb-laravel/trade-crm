<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class UserHierarchy extends Model
{
    const UPDATED_AT = null;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_hierarchy';
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    public $timestamps = 'U';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'parent_user_id','user_id'
    ];
    public function scopeByParent($query,$id){
        return $query->where('parent_user_id',$id);
    }
    public function parent(){
        return $this->belongsTo('App\User','parent_user_id');
    }
    public function user(){
        return $this->belongsTo('App\User','user_id');
    }
    public function scopeByUser($query,User $user){
        return $query->where('user_id',$user->id);
    }
}
