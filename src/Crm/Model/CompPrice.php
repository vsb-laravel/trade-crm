<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class CompPrice extends Model
{
	protected $connection = 'windigo_db';
    protected $table = 'tb_comp_price';

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    public $timestamps = false;
	protected $fillable = [
        't_name','active','t_time_start','t_time_end','id_categor','price','paket'
    ];
}
