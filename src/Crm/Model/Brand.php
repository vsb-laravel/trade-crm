<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use DB;

class Brand extends Model
{
    use SoftDeletes;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'brands';
    // protected $appends = ['active'];
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    public $timestamps = false;
    protected $dates = ['deleted_at'];
    // protected $dateFormat = 'U';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','title','url','settings'
    ];
    public function invoices(){
        return $this->hasMany('App\BrandInvoice');
    }
    public function getActiveAttribute(){
        $ret=[];
        try{
            $can_use_crm = DB::connection($this->name."_db")->table('options')->where('name','can_use_crm')->first();
            if(!is_null($can_use_crm))$ret=json_decode(json_encode($can_use_crm),true);
        }
        catch(\Exception $e){

        }

        return $ret;
    }
    public function getTotalAttribute(){
        return $this->invoices()->where('created_at','>=',strtotime(date('Y-m-').'01'))->sum('amount');
    }
}
