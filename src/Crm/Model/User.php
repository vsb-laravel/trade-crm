<?php

namespace Vsb\Crm\Model;

use Log;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Passport\HasApiTokens;

use App\Notifications\PasswordReset;
use Vsb\Crm\Model\UserMeta;
use Vsb\Crm\Model\UserRights;
use Vsb\Crm\Model\UserHierarchy;
use Vsb\Crm\Model\InstrumentGroup;
use Vsb\Crm\Model\Account;
use Vsb\Crm\Model\Lead;
use Vsb\Crm\Model\Message;

class User extends Authenticatable
{
    use HasApiTokens,Notifiable;
    // protected $appends = ['title','pairgroup','balance','activity','campaign','office','messages'];
    protected $appends = ['title','pairgroup','balance','activity','campaign','office','margincall','stopout','ip','google2fa','olap','messages'];
    // use Notifiable;
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateFormat = 'U';
    protected $casts = [
        'mail'=>'array',
        'campaign'=>'array',
        'olap'=>'array',
        'rang'=>'array',
        'balance'=>'float',
        'margincall'=>'float'
    ];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','surname','rights_id', 'email', 'phone','password','status_id','parent_user_id','email_verified','email_verification_token','affilate_id',
        'deposited',//ALTER TABLE `users` ADD `deposited` INT(1) NOT NULL DEFAULT '0' AFTER `email_verified`;
        'secret',// ALTER TABLE `users` ADD `secret` VARCHAR(255) NULL AFTER `deposited`;
        'mail',
        'lead_id',
        'source',
        'google2fa_secret',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token','email_verification_token','secret','lead_id','mail'
    ];
    public function lead(){
        return $this->belongsTo('App\Lead','id','client_id')->withoutGlobalScope('deleted');
    }
    public function rights(){
        return $this->belongsTo('App\UserRights');
    }
    public function status(){
        return $this->belongsTo('App\UserStatus','status_id');
    }
    public function comments(){
        return $this->morphMany('App\Comment', 'object')->orderBy('id','desc');
    }
    public function history(){
        return $this->morphMany('App\UserHistory', 'object');
        // return $this->hasMany('App\Comment','user_id');
    }
    public function tasks(){
        return $this->morphMany('App\Task', 'object');
        // return $this->hasMany('App\Comment','user_id');
    }
    public function accounts(){
        return $this->hasMany('App\Account','user_id');
    }
    public function mails(){
        return $this->hasMany('App\CustomerMailHistory','user_id');
    }
    public function account(){
        return $this->belongsTo('App\Account')->where('type','real');
    }
    public function country(){
        return $this->hasMany('App\UserMeta')->where('meta_name','country');
    }
    public function manager(){
        //'parent_user_id','user_id'
        return $this->belongsTo('App\User','parent_user_id');
    }
    // public function messages(){
    //     return $this->hasMany('App\Message')->where('status','new');
    // }
    public function affilate(){
        //'parent_user_id','user_id'
        return $this->belongsTo('App\User','affilate_id');
    }
    public function users(){
        //'parent_user_id','user_id'
        return $this->hasMany('App\User','parent_user_id','id');
    }
    public function meta(){
        //'parent_user_id','user_id'
        return $this->hasMany('App\UserMeta');
    }
    public function events(){
        return $this->morphMany('App\Event', 'object');
    }
    public function can_trade(){
        return $this->hasMany('App\UserMeta')->where('meta_name','can_trade');
    }
    public function kyc(){
        return $this->hasMany('App\UserMeta')->where('meta_name','kyc');
    }
    public function last_login(){
        return $this->hasMany('App\UserMeta')->where('meta_name','last_login');
    }
    public function last_ip(){
        return $this->hasMany('App\UserMeta')->where('meta_name','last_login_ip');
    }
    public function getOfficeAttribute(){
        $um = $this->meta()->where('meta_name','office')->first();
        return is_null($um)?'':$um->meta_value;
    }
    // public function office(){
    //     return $this->hasOne('App\UserMeta','user_id')->where('meta_name','office');
    // }
    public function deposits(){
        return $this->hasMany('App\Transaction')->whereIn('type',['deposit'])->where('code','200')->orderBy('id')->limit(1);
    }
    public function transactions(){
        return $this->hasMany('App\Transaction')->whereIn('type',['deposit','withdraw'])->where('code','200');
        // return $this->hasMany('App\Transaction')->whereIn('code',['0','200']);//->whereIn('type',['deposit','withdraw']);
    }
    public function operations(){
        return $this->hasMany('App\Transaction')->where('code','200');
    }
    public function invoices(){
        return $this->hasMany('App\Invoice')->where('error',0);
    }
    public function withdrawals(){
        return $this->hasMany('App\Withdrawal');
    }
    public function deal(){
        return $this->hasMany('App\Deal')->orderBy('id','desc');
    }
    public function trades(){
        return $this->hasMany('App\Deal')->where('status_id','<','100')->orderBy('id','desc');
    }
    public function orders(){
        return $this->hasMany('App\Order')->orderBy('id','desc');
    }
    public function documents(){
        return $this->hasMany('App\UserDocument');
    }
    public function activedeals(){
        return $this->hasMany('App\Deal')->where('status_id','10');
    }
    public function onDeals(){
        return $this->deal->sum('amount');
    }
    public function scopeByRights($query,User $user){
        return ($user->rights_id=="10")?$query:$query->where('rights_id','<=',$user->rights_id);
    }
    public function scopeByOwner($q,User $owner){
        if($owner->rights_id>=8)return $q;
        $childs = $this->childs;
        return $q->where(function($query)use($childs){ $query->whereIn('parent_user_id',$childs)->orWhereIn('affilate_id',$childs); });
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
    // protected static function boot()
    // {
    //     parent::boot();
    //     static::addGlobalScope('byowner', function (Builder $builder) {
    //         // $user = Auth::user();
    //         // if($user->rights_id<10){
    //         //     $builder->whereIn('parent_user_id',User::where('parent_user_id',$user->id)->select('id')->get())->whereOr('parent_user_id',$user->id);
    //         // }
    //     });
    // }
    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new PasswordReset($token));
    }
    public function getTitleAttribute(){
        return $this->name.' '.$this->surname;
    }
    // public function getTitleAttribute(){
    //     $ret = $this->attributes['title']=$this->name.' '.$this->surname;
    //     return $ret;
    // }

    public function getPairgroupAttribute(){
        $ret = UserMeta::where('user_id',$this->id)->where('meta_name','pairgroup')->first();
        if(is_null($ret)){
            $ig = InstrumentGroup::where('name','default')->first();
            $ret = is_null($ig)?1:$ig->id;
        }else $ret = $ret->meta_value;
        return $ret;
    }
    public function getGroupAttribute(){
        // return InstrumentGroup::where('name','default')->first();
        $ret = UserMeta::where('user_id',$this->id)->where('meta_name','pairgroup')->first();
        return (is_null($ret))?InstrumentGroup::where('name','default')->first():InstrumentGroup::find($ret->meta_value);
    }
    public function getCampaignAttribute(){
        $ret = UserMeta::where('user_id',$this->id)->where('meta_name','campaign')->first();
        if(is_null($ret)){
            $ret = json_decode(json_encode([]));
        }else $ret = json_decode($ret->meta_value);
        return $ret;
    }
    // meta values
    public function midname(){
        return $this->hasMany('App\UserMeta')->where('meta_name','midname');
    }
    public function birthday(){
        return $this->hasMany('App\UserMeta')->where('meta_name','birthday');
    }
    public function getAddressAttribute(){
        $c =$this->meta()->where('meta_name','city')->first();
        $a1 =$this->meta()->where('meta_name','address1')->first();
        $a2 =$this->meta()->where('meta_name','address2')->first();
        $z =$this->meta()->where('meta_name','zip')->first();
        return json_decode(json_encode([
            'city'=>is_null($c)?'':$c->meta_value,
            'address1'=>is_null($a1)?'':$a1->meta_value,
            'address2'=>is_null($a2)?'':$a2->meta_value,
            'zip'=>is_null($z)?'':$z->meta_value
        ]));
    }
    public function getPassportAttribute(){
        $c =$this->meta()->where('meta_name','series')->first();
        $a1 =$this->meta()->where('meta_name','num_pasport')->first();
        $a2 =$this->meta()->where('meta_name','issued')->first();
        $z =$this->meta()->where('meta_name','until')->first();
        return json_decode(json_encode([
            'series'=>is_null($c)?'':$c->meta_value,
            'num_pasport'=>is_null($a1)?'':$a1->meta_value,
            'issued'=>is_null($a2)?'':$a2->meta_value,
            'until'=>is_null($z)?'':$z->meta_value
        ]));
    }

    public function getBalanceAttribute(){
        $ret =  $this->accounts()->where('type','real')->where('status','open')->sum('amount');

        return floatval($ret);
    }

    public function getActivityAttribute(){
        $a = $this->meta()->where('meta_name','last_login')->first();
        return is_null($a)?-1:intval($a->meta_value);
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

    public function getAutologinlinkAttribute(){
        $a = $this->meta()->where('meta_name','once_login_link')->first();
        return is_null($a)?null:'https://trade.'.env('SM_DOMAIN').'/once/'.$a->meta_value;
    }
    public function getMessagesAttribute(){
        return Message::where('user_id',$this->id)->orWhere('author_id',$this->id)->get();
    }
    public function getMargincallAttribute(){
        $ret = UserMeta::where('user_id',$this->id)->where('meta_name','margincall')->first();
        return is_null($ret)?0:$ret->meta_value;
    }
    public function setMargincallAttribute($value){
        $ret = UserMeta::where('user_id',$this->id)->where('meta_name','margincall')->first();
        $ret->meta_value = $value;
        $ret->save();
    }
    public function getStopoutAttribute(){
        $ret = UserMeta::where('user_id',$this->id)->where('meta_name','stopout')->first();
        if(is_null($ret)){
            $ret = $this->getGroupAttribute()->stopout;
        }else $ret = $ret->meta_value;

        return $ret;
    }
    public function setStopoutAttribute($value){
        $ret = UserMeta::where('user_id',$this->id)->where('meta_name','stopout')->first();
        $ret->meta_value = $value;
        $ret->save();
    }
    public function getIpAttribute(){
        $ret = UserMeta::where('user_id',$this->id)->where('meta_name','last_login_ip')->first();
        if(is_null($ret)){
            $ret = trans('crm.hidden');
        }else $ret = $ret->meta_value;
        return $ret;
    }
    public function setIpAttribute($ip){
        $ret = UserMeta::where('user_id',$this->id)->where('meta_name','last_login_ip')->first();
        if(is_null($ret)){
            UserMeta::create([
                'user_id' => $this->id,
                'meta_name'=>'last_login_ip',
                'meta_value'=>$ip
            ]);
        }
        else {
            $ret->meta_value = $ip;
            $ret->save();
        }
    }
    public function getOlapAttribute(){
        $ret = UserMeta::where('user_id',$this->id)->where('meta_name','olap')->first();
        return is_null($ret)?[]:json_decode($ret->meta_value,true);
    }
    // public function getCountryAttribute(){
    //     $c =$this->meta()->where('meta_name','country')->first();
    //     return is_null($c)?'':$c->meta_value;
    // }
    // public function wallets(){
    //     return $this->hasMany('App\Wallet');
    // }
    //
    // public function getChilds(){
    //     return $this->recurseChildsAndMe($this->id);
    // }
    // public function childs(){
    //     return $this->recurseChildsAndMe($this->id);
    // }
    // protected function recurseChildsAndMe2($id, $depth=0){
    //     $ret = [$id];
    //     // if($depth>10)return $ret;
    //     $us = User::where('rights_id','<',$this->rights_id)->where('rights_id','>','1')->where(function($query)use($id){$query->where('parent_user_id',$id)->orWhere('affilate_id',$id);})->select('id')->get();
    //     foreach($us as $u) {
    //         if($u->rights_id>$this->rights_id)continue;
    //         $ret = array_merge($ret,$this->recurseChildsAndMe2($u->id,$depth++));
    //     }
    //     return $ret;
    // }
}
?>
