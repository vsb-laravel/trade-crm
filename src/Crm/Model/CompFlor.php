<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class CompFlor extends Model
{
	protected $connection = 'windigo_db';
    protected $table = 'tb_comp_flor';

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    public $timestamps = false;
	protected $fillable = [
        'id_categor', 'id_gr', 'flor', 'id_comp', 'x_coord', 'y_coord','mac_adre', 'c_status'
    ];
}
