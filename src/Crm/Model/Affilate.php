<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class Affilate extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'affilates';
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
        'name','description','user_id'
    ];
    /**
     * Scope a query to only include popular users.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUser($query,User $user)
    {
        return $query->where('user_id', '=', $user->id);
    }
    public function user(){
        return $this->belongsTo('App\User');
    }
}
