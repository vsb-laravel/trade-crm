<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class EmployPromoCede extends Model
{
	protected $connection = 'windigo_db';
    protected $table = 'tb_promo_cod_user';

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    public $timestamps = false;
	protected $fillable = ['id_user', 'id_promo', 'p_date'];
}
