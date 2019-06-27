<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class CompReserve extends Model
{
	protected $connection = 'windigo_db';
    protected $table = 'tb_comp_reservation';

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    public $timestamps = false;
	protected $fillable = [
        'id_categor', 'id_paket', 'id_comp', 'r_date_start', 'r_date_end','id_user', 'status','cost', 'r_date_creation','id_creator','id_comp_id','key_str'
    ];
	protected $casts = [
		'id_categor'=>'integer',
		'id_paket'=>'integer',
		'id_comp'=>'integer',
		'r_date_start'=>'integer',
		'r_date_end'=>'integer',
		'id_user'=>'integer',
		'status'=>'integer',
		'cost'=>'integer',
		'r_date_creation'=>'integer',
		'id_creator'=>'integer',
		'id_comp_id'=>'integer',
		'key_str'=>'string'
	];
}
