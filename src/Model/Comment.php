<?php

namespace Vsb\Model;

use Illuminate\Database\Eloquent\Model;


use App\User;
use Vsb\Model\Lead;

class Comment extends Model{
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
    protected $table = 'comments';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'author_user_id','object_id','comment','object_type'
    ];
    /**
     * Scope a query to only include popular users.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByUser($query,User $user){
        return $query->where('object_id', '=', $user->id)->where('object_type','user');
    }
    public function scopeByLead($query,Lead $user){
        return $query->where('object_id', '=', $user->id)->where('object_type','lead');
    }
    public function scopeByAuthor($query,User $user){
        return $query->where('author_user_id', '=', $user->id);
    }
    // public function user(){
    //     return $this->belongsTo('Vsb\Crm\User');
    // }
    public function object(){
        return $this->morphTo();
        // return $this->hasMany('Vsb\Crm\Comment','user_id');
    }
    public function author(){
        return $this->belongsTo('Vsb\Crm\User','author_user_id');
    }
}
