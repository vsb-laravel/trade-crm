<?php

namespace Vsb\Model;

use Illuminate\Database\Eloquent\Model;

class Error extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'errors';
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    public $timestamps = false;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'code','title','description'
    ];
    public function events(){
        return $this->morphMany('Vsb\Crm\Event', 'object');
    }
}
