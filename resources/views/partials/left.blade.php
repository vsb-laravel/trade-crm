@ifmodule('brands')
    @can('chief')
    <a class="header item"  onclick="page.show(this,'brands');">
        <i class="ui chart pie icon"></i>
        {{ trans('crm.brands.title') }}
    </a>
    @endcan
@endifmodule
@ifmodule('customers')
    @can('affilate')
    <div class="ui simple item">
        <i class="ui user icon"></i>
        <a data-href="page__customers_clients">{{ trans('crm.dashboard.customers') }}</a>
        <div class="stackable menu">
            @can('marketing')
            <a class="item" onclick="page.show(this,'customers','clients');">{{ trans('crm.customers.clients') }}</a>
            @endcan
            @ifmodule('bets')
            @else
                @can('lead')
                    <a class="item" onclick="page.show(this,'customers','leads');">{{ trans('crm.customers.leads') }}</a>
                    <a class="item" onclick="crm.lead.showImport();">{{ trans('crm.customers.import_leads') }}</a>
                @endcan
            @endifmodule
        </div>
    </div>
    @endcan
@endifmodule
@ifmodule('trades')
    @can('retention')
    <a class="item" onclick="page.show(this,'trades','list');"><i class="ui chart line icon"></i> {{ trans('crm.trades.title') }}</a>
    <!-- <div class="ui simple item">
        <i class="ui chart line icon"></i>
        <a onclick="page.show(this,'trades','list');">{{ trans('crm.dashboard.trades') }}<i class="dropdown icon"></i></a>
        <div class="stackable menu">
            <a class="item" onclick="page.show(this,'trades','list');">{{ trans('crm.dashboard.trades') }}</a>
        </div>
    </div> -->
    @endcan
@endifmodule
@ifmodule('finance')
    @can('ftd')
    <div class="ui simple item">
        <i class="ui money bill alternate outline icon"></i>
        <a href="javascript:0;" data-href="page__finance_dashboard">{{ trans('crm.finance.title') }}</a>
        <div class="stackable menu">
            @can('admin')
                <a class="item" onclick="page.show(this,'finance','dashboard');">{{ trans('crm.finance.title') }}</a>
                <a class="item" onclick="page.show(this,'finance','withdrawals');">{{ trans('crm.finance.withdrawals') }}</a>
            @endcan
            <a class="item" onclick="page.show(this,'finance','transactions');">{{ trans('crm.finance.transactions') }}</a>
        </div>
    </div>
    @endcan
@endifmodule
@ifmodule('instruments')
@can('retention')
<div class="ui simple item">
    <i class="ui industry icon"></i>
    <a>{{ trans('crm.dashboard.instruments') }}</a>
    <div class="stackable menu">
        <a class="item" onclick="page.show(this,'pairs','groups');">{{ trans('crm.instruments.groups.title') }}</a>
        @can('superadmin')
        <a class="item" onclick="page.show(this,'pairs','list');">{{ trans('crm.dashboard.instruments') }}</a>
        <a class="item" onclick="page.show(this,'pairs','sources');">{{ trans('crm.dashboard.sources') }}</a>
        <a class="item" onclick="page.show(this,'pairs','currencies');">{{ trans('crm.dashboard.currencies') }}</a>
        <a class="item" onclick="page.show(this,'pairs','prices');">{{ trans('crm.dashboard.prices') }}</a>
        @endcan
    </div>
</div>
@endcan
@endifmodule
@ifmodule('newsfeed')
<a class="header item"  onclick="page.show(this,'newsfeed','list');">
    <i class="ui newspaper icon"></i>
    {{ trans('crm.news.title') }}
</a>
@endifmodule
@ifmodule('rating')
    @can('chief')
    <a class="header item" href="/rating">
        <i class="ui chart line icon"></i>
        Rating
    </a>
    <a class="header item" href="/roi" target="_blank">
        <i class="ui chart area icon"></i>
        Roi
    </a>
    @endcan
@endifmodule
@ifmodule('cms')
<a class="header item"  onclick="page.show(this,'cms','list');">
    <i class="ui leaf icon"></i>
    CMS
</a>
@endifmodule
@ifmodule('bets')
<a class="header item"  onclick="page.show(this,'bets');">
    <i class="ui leaf icon"></i>
    {{ trans('crm.bets.title') }}
</a>
@endifmodule
