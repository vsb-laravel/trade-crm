<?php

namespace Vsb\Model;

use Illuminate\Database\Eloquent\Model;

class Telephony extends Model
{
    //
    protected $table = 'telephony';
    const CREATED_AT = null;
    const UPDATED_AT = null;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','settings','enabled'
    ];
}
