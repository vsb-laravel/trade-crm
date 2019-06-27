<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class UserStatus extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_statuses';
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
        'title','code'
    ];
}
