<?php

namespace Vsb\Crm\Model;
use Illuminate\Database\Eloquent\Model;

class WindigoUserSettings extends Model{
    protected $connection = 'windigo_db';
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tb_user_setting';
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
        'id_user','s_rang'
    ];
    protected $cast = [
        's_rang'=>'integer'
    ];

}
