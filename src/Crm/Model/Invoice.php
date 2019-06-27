<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'merchant_invoices';
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
        'created_at',
        'merchant_id',
        'transaction_id',
        'user_id',
        'account_id',
        'order_id',
        'reference_id',
        'amount',
        'currency',
        'method',
        'raw',
        'error'
    ];
    protected $casts = [
        "raw"=>"json",
        "amount"=>"float"
    ];
    public function getRawAttribute(){
        $ret = isset($this->attributes["raw"])?json_decode($this->attributes["raw"],true):[];
        // foreach($ret as $key=>$rettier){
        //     $ret[$key] = htmlspecialchars($rettier);
        // }
        if(isset($ret["postback"]) && is_string($ret["postback"])) $ret["postback"] = preg_replace('/[\r\n\t]/im','',htmlspecialchars($ret["postback"]));
        return $ret;
    }
    public function events(){return $this->morphMany('App\Event', 'object');}
    public function merchant(){ return $this->belongsTo('App\Merchant');}
    public function account(){ return $this->belongsTo('App\Account');}
    public function user(){ return $this->belongsTo('App\User');}
    public function transaction(){ return $this->belongsTo('App\Transaction');}
}
