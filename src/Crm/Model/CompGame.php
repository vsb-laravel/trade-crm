<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class CompGame extends Model
{
	protected $connection = 'windigo_db';
    protected $table = 'tb_comp_info_soft';

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    public $timestamps = false;
	protected $fillable = ['note','icon_path','exe_path','id_comp','type_soft'];
}
