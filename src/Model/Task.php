<?php

namespace Vsb\Model;

use Illuminate\Database\Eloquent\Model;
use Vsb\Model\TaskStatus;
use Vsb\Model\TaskType;
use App\User;

class Task extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tasks';
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
    protected $cast = [
        'start_date'=>"timestamp",
        'end_date'=>"timestamp",
    ];
    protected $fillable = [
        'status_id','type_id','user_id','title','text','start_date','end_date','object_id','object_type'
    ];
    public function status(){
        return $this->belongsTo('Vsb\Crm\TaskStatus');
    }
    public function object(){
        return $this->morphTo();
    }
    public function user(){
        return $this->belongsTo('Vsb\Crm\User');
    }
    public function type(){
        return $this->belongsTo('Vsb\Crm\TaskType');
    }
    public function scopeByUser($query,User $str){
        if(false==$str || is_null($str)) return $query;
        return $query->where('user_id', '=', $str->id);
    }
    public function scopeByUserId($query,$str){
        if(false==$str || is_null($str) || $str == "all") return $query;
        return $query->where('user_id', '=', $str);
    }
    public function scopeByStatus($query,$str){
        if(false==$str || is_null($str) || $str == "all") return $query;
        $status = TaskStatus::where('code','=',$str)->first();
        if(false==$status || is_null($status)) return $query;
        return $query->where('status_id', '=', $status->id);
    }
    public function scopeByType($query,$str){
        if(false==$str || is_null($str) || $str == "all") return $query;
        $status = TaskType::where('code','=',$str)->first();
        if(false==$status || is_null($status)) return $query;
        return $query->where('type_id', '=', $status->id);
    }
}
