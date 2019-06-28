<?php

namespace Vsb\Model;

use Illuminate\Database\Eloquent\Model;

class LeadHistory extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'lead_history';
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateFormat = 'U';
    const UPDATED_AT = null;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'lead_id','old_status_id','new_status_id','message','user_id'
    ];
}
