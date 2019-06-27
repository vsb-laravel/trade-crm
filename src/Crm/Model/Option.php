<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'options';
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    public $timestamps = 'U';
    protected $dateFormat = 'U';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name','value','user_id','type'];
    public function is_set(){
        return ($this->value == "1" || $this->value=="true" || $this->value==true || $this->value == "on");
    }
}
