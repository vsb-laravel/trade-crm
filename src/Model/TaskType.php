<?php

namespace Vsb\Model;

use Illuminate\Database\Eloquent\Model;

class TaskType extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'task_types';
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
