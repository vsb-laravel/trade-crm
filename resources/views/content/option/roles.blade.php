@php($rights = \App\UserRights::where('id','<',10)->where('id','>',1)->get());
@php($roles = function ($role){
    $r = env($role);
    $rr = preg_split('/\s*,\s*/',$r);
    $response = '';
    foreach (\App\UserRights::where('id','<',10)->where('id','>',1)->get() as $right) {
        $response.= '<td>';
        $response.= '<div class="ui checkbox">
            <input class="role-rights" data-id="'.$role.'" data-rights_id="'.$right->id.'" type="checkbox"'.(in_array($right->id,$rr)?'checked="checked"':'').'/>
            <label>&nbsp;</label>
        </div>';
        $response.= '</td>';
    }
    return $response;
})
<div class="ui header">{{ trans('crm.options.roles') }}</div>
<table class="ui table padded attached">
    <thead>
        <tr>
            <th class="three wide">{{ trans('crm.roles.title') }}</th>
            @foreach ($rights as $right)
                <th data-id="{{$right->id}}">{{ $right->title }}</th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        <tr data-id="CF_AUTH_FASTLOGIN"><th>{{ trans('crm.roles.role_FASTLOGIN') }}</th>{!! $roles('CF_AUTH_FASTLOGIN') !!}</tr>
        <tr data-id="CF_AUTH_RETENTION"><th>{{ trans('crm.roles.role_RETENTION') }}</th>{!! $roles('CF_AUTH_RETENTION') !!}</tr>
        <tr data-id="CF_AUTH_MANAGER"><th>{{ trans('crm.roles.role_MANAGER') }}</th>{!! $roles('CF_AUTH_MANAGER') !!}</tr>
        <tr data-id="CF_AUTH_MARKETING"><th>{{ trans('crm.roles.role_MARKETING') }}</th>{!! $roles('CF_AUTH_MARKETING') !!}</tr>
        <tr data-id="CF_AUTH_PARTNER"><th>{{ trans('crm.roles.role_PARTNER') }}</th>{!! $roles('CF_AUTH_PARTNER') !!}</tr>
        <tr data-id="CF_AUTH_MARKETINGONLY"><th>{{ trans('crm.roles.role_MARKETINGONLY') }}</th>{!! $roles('CF_AUTH_MARKETINGONLY') !!}</tr>
        <tr data-id="CF_AUTH_AFFILATE"><th>{{ trans('crm.roles.role_AFFILATE') }}</th>{!! $roles('CF_AUTH_AFFILATE') !!}</tr>
        <tr data-id="CF_AUTH_CLIENT"><th>{{ trans('crm.roles.role_CLIENT') }}</th>{!! $roles('CF_AUTH_CLIENT') !!}</tr>
        <tr data-id="CF_AUTH_FIRED"><th>{{ trans('crm.roles.role_FIRED') }}</th>{!! $roles('CF_AUTH_FIRED') !!}</tr>
        <tr data-id="CF_AUTH_KYC"><th>{{ trans('crm.roles.role_KYC') }}</th>{!! $roles('CF_AUTH_KYC') !!}</tr>
        <tr data-id="CF_AUTH_LEAD"><th>{{ trans('crm.roles.role_LEAD') }}</th>{!! $roles('CF_AUTH_LEAD') !!}</tr>
        <tr data-id="CF_AUTH_EXPORT"><th>{{ trans('crm.roles.role_EXPORT') }}</th>{!! $roles('CF_AUTH_EXPORT') !!}</tr>
        <tr data-id="CF_AUTH_ADDADMIN"><th>{{ trans('crm.roles.role_ADDADMIN') }}</th>{!! $roles('CF_AUTH_ADDADMIN') !!}</tr>
        <tr data-id="CF_AUTH_FINANCE"><th>{{ trans('crm.roles.role_FINANCE') }}</th>{!! $roles('CF_AUTH_FINANCE') !!}</tr>
        <tr data-id="CF_AUTH_PARTNER"><th>{{ trans('crm.roles.role_PARTNER') }}</th>{!! $roles('CF_AUTH_PARTNER') !!}</tr>
        <tr data-id="CF_AUTH_CRM"><th>{{ trans('crm.roles.role_CRM') }}</th>{!! $roles('CF_AUTH_CRM') !!}</tr>
        <tr data-id="CF_AUTH_SUPER"><th>{{ trans('crm.roles.role_SUPER') }}</th>{!! $roles('CF_AUTH_SUPER') !!}</tr>
        <tr data-id="CF_AUTH_CUSTOMERS"><th>{{ trans('crm.roles.role_CUSTOMERS') }}</th>{!! $roles('CF_AUTH_CUSTOMERS') !!}</tr>
        <tr data-id="CF_AUTH_LEADS"><th>{{ trans('crm.roles.role_LEADS') }}</th>{!! $roles('CF_AUTH_LEADS') !!}</tr>
        <tr data-id="CF_AUTH_TRADES"><th>{{ trans('crm.roles.role_TRADES') }}</th>{!! $roles('CF_AUTH_TRADES') !!}</tr>
        <tr data-id="CF_AUTH_MANAGE_TRADES"><th>{{ trans('crm.roles.role_MANAGE_TRADES') }}</th>{!! $roles('CF_AUTH_MANAGE_TRADES') !!}</tr>
        <tr data-id="CF_AUTH_TRANSACTIONS"><th>{{ trans('crm.roles.role_TRANSACTIONS') }}</th>{!! $roles('CF_AUTH_TRANSACTIONS') !!}</tr>
        <tr data-id="CF_AUTH_TUNE_TRADES"><th>{{ trans('crm.roles.role_TUNE_TRADES') }}</th>{!! $roles('CF_AUTH_TUNE_TRADES') !!}</tr>
        <tr data-id="CF_AUTH_DO_DEPOSIT"><th>{{ trans('crm.roles.role_DO_DEPOSIT') }}</th>{!! $roles('CF_AUTH_DO_DEPOSIT') !!}</tr>
        <tr data-id="CF_AUTH_DO_WITHDRAW"><th>{{ trans('crm.roles.role_DO_WITHDRAW') }}</th>{!! $roles('CF_AUTH_DO_WITHDRAW') !!}</tr>
    </tbody>
</table>
@push('scripts')
    <script>
        $('.role-rights').on('change',function(){
            const $row = $(this).parents('tr:first');
            const role = $row.data('id');
            let vals = [];
            $row.find('.role-rights').each(function(){
                if($(this).is(':checked')){
                    vals.push($(this).data("rights_id"));
                }
            })
            vals.push(10); //superadmin
            $.ajax({
                url:'/role/rights',
                type:'post',
                data:{
                    _token:window.csrf,
                    role: role,
                    rights: vals.join(',')
                },
                success:(d,s,x)=>{console.log(d,s,x);},
                error:(s,x)=>{console.log(d,s,x);},
                complete:(d,s,x)=>{console.log(d,s,x);}
            });
        })
    </script>
@endpush
