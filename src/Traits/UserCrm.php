<?php namespace Vsb\Traits;
use App\User;
use App\UserMeta;
use Vsb\Model\Message;
trait UserCrm{
    public function comments(){
        return $this->morphMany('Vsb\Model\Comment', 'object')->orderBy('id','desc');
    }
    public function tasks(){
        return $this->morphMany('Vsb\Model\Task', 'object');
    }
    public function mails(){
        return $this->hasMany('Vsb\Model\CustomerMailHistory','user_id');
    }
    public function manager(){
        return $this->belongsTo('App\User','parent_user_id');
    }
    public function affilate(){
        return $this->belongsTo('App\User','affilate_id');
    }
    public function users(){
        return $this->hasMany('App\User','parent_user_id','id');
    }
    public function events(){
        return $this->morphMany('Vsb\Model\Event', 'object');
    }
    public function getOfficeAttribute(){
        $um = $this->meta()->where('meta_name','office')->first();
        return is_null($um)?'':$um->meta_value;
    }
    public function scopeByRights($query,User $user){
        return ($user->rights_id=="10")?$query:$query->where('rights_id','<=',$user->rights_id);
    }
    public function scopeByOwner($q,User $owner){
        if($owner->rights_id>=8)return $q;
        $childs = $this->childs;
        return $q->where(function($query)use($childs){ $query->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs); });
    }
    public function getMessagesAttribute(){
        return Message::where('user_id',$this->id)->orWhere('author_id',$this->id)->get();
    }
    protected function recurseChilds($id){
        $ret = [];
        $us = User::where('parent_user_id',$id)->orWhere('affilate_id',$id)->select('id')->get();
        foreach ($us as $u) {
            $ret[]=$u->id;
            $ret = array_merge($ret,$this->recurseChilds($u->id));
        }
        return $ret;
    }
    protected function recurseChildsAndMe($id, $list,&$ret){
        $ret[] = $id;
        foreach($list as $user){
            if($user->parent_user_id == $id || $user->affilate_id==$id){
                if(!in_array($user->id,$ret)) $this->recurseChildsAndMe($user->id,$list,$ret);
            }
        }
    }
    protected function recurseParents($user, $list,&$ret){

        $ret[] = $user->parent_user_id;
        foreach($list as $admin){
            if($admin->id == $user->parent_user_id ){
                if(!in_array($admin->parent_user_id,$ret)) $this->recurseParents($admin,$list,$ret);
            }
        }
    }
    public function getChildsAttribute(){
        $ret = [];
        $this->recurseChildsAndMe($this->id, User::where('rights_id','>',1)->where('rights_id','<',$this->rights_id)->get(),$ret);
        return $ret;

    }
    public function getParentsAttribute(){
        $ret = User::where('rights_id','>',7)->pluck('id')->toArray();
        // if($this->isSuperadmin())return User::where('rights_id','>',1)->where('rights_id','<',$this->rights_id)->pluck('id')->toArray();
        $this->recurseParents($this, User::where('rights_id','>',3)->get(),$ret);
        return $ret;
    }
    public function isSuperadmin(){
        return $this->rights_id >= 8;
    }
    public function getGoogle2faAttribute(){
        $a = $this->meta()->where('meta_name','google2fa')->first();
        return is_null($a)?0:$a->meta_value;
    }
    public function setGoogle2faAttribute($value){
        $a = $this->meta()->where('meta_name','google2fa')->first();
        if(is_null($a))$a= UserMeta::create([
            'user_id'=>$this->id,
            'meta_name'=>'google2fa',
            'meta_value'=>'0'
        ]);
        $a->meta_value = is_array($value,["on","true","1"])?1:0;
        $a->save();
    }
    public function setGoogle2faSecretAttribute($value){
         $this->attributes['google2fa_secret'] = encrypt($value);
    }
    public function getGoogle2faSecretAttribute(){
        return is_null($this->attributes['google2fa_secret'])?null:decrypt($this->attributes['google2fa_secret']);
    }
}
