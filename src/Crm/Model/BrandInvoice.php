<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class BrandInvoice extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'brand_invoices';
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateFormat = 'U';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'brand_id',
        'invoice_id',
        'order_id',
        'reference_id',
        'amount',
        'currency',
        'method',
        'raw'
    ];
    public function events(){return $this->morphMany('App\Event', 'object');}
    public function brand(){ return $this->belongsTo('App\Brand');}
}
