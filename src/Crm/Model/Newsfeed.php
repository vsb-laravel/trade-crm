<?php

namespace Vsb\Crm\Model;

use Illuminate\Database\Eloquent\Model;

class Newsfeed extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    // protected $table = 'options';
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    public $timestamps = 'U';
    protected $dateFormat = 'U';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['title','icon','content','user_id','type','published','category','anonce'];
    public function user(){
        return $this->belongsTo('App\User');
    }
    public function scopeByUser($query,User $user){
        $childs = $user->childs;
        $query->whereIn('user_id',User::where(function($u)use($childs){
            $u->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs);
        })->pluck('id'));
    }
}
// ALTER TABLE `newsfeeds` ADD `category` VARCHAR(127) NOT NULL AFTER `published`, ADD `anonce` TEXT NOT NULL AFTER `category`;
