<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;
use Vsb\Crm\Model\User;

class Wallet extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wallets';
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
    protected $dates = [
        'created_at',
        'updated_at',
    ];
    protected $fillable = [
        'wallet','user_id', 'currency_id','key'
    ];
    public function user(){
        return $this->belongsTo('App\User');
    }
    public function currency(){
        return $this->belongsTo('App\Currency');
    }
}
