<?php

namespace Vsb\Crm\Model;


use Illuminate\Database\Eloquent\Model;

class UserMeta extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_meta';
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
        'meta_name','meta_value','user_id'
    ];
    // public function user(){
    //     return $this->belongsTo('App\User');
    // }
    /**
     * Scope a query to only include popular users.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByUser($query,$user)
    {
        return (!is_null($user)&&isset($user->id) )?$query->where('user_id', '=', $user->id):$query;
    }
    /**
     * Scope a query to only include popular users.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeMeta($query,$n)
    {
        return $query->where('meta_name', '=', $n);
    }
    public function user(){
        return $this->belongsTo('App\User');
    }
}
