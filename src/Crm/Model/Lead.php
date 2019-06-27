<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Lead extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'leads';
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
        'status_id','source','user_id','name','surname','email','phone','country','manager_id','client_id','affilate_id'
    ];
    protected $appends = ['title'];
    public function getTitleAttribute(){
        return $this->name.' '.$this->surname;
    }
    public function status(){
        return $this->belongsTo('App\LeadStatus');
    }
    public function manager(){
        return $this->belongsTo('App\User','manager_id');
    }
    public function affilate(){
        return $this->belongsTo('App\User','affilate_id');
    }
    public function comments(){
        return $this->morphMany('App\Comment', 'object');
        // return $this->hasMany('App\Comment','user_id');
    }
    public function tasks(){
        return $this->morphMany('App\Task', 'object');
        // return $this->hasMany('App\Comment','user_id');
    }
    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope('deleted', function (Builder $builder) {
            $builder->whereNull('client_id');
        });
    }
}
