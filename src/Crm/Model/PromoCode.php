<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class PromoCode extends Model
{
	protected $connection = 'windigo_db';
    protected $table = 'tb_promo_cod';

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    public $timestamps = false;
	protected $fillable = ['p_cod', 'p_name', 'p_bonus', 'p_tirazh', 'p_note'];
}
