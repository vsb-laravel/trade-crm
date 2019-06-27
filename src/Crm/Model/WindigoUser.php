<?php

namespace Vsb\Crm\Model;
use Illuminate\Database\Eloquent\Model;

class WindigoUser extends Model{
    protected $connection = 'windigo_db';
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tb_users';
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
        'id_user_crm','s_rang'
    ];
    protected $cast = [
        's_rang'=>'integer'
    ];
    public function setting(){
        return $this->hasOne('App\WindigoUserSettings','id_user');
    }
    

}
