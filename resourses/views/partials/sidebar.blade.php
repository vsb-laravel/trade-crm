<div id="cards_container_toggler" class="ui labeled button" style="position:fixed;top:5em;right:0;z-index:99;display:none;">
    <div class="ui button">
        <i class="ui angle left icon"></i>{{ __('crm.cards.title') }}
    </div>
    <div class="ui basic label" id="cards_container_count"></div>
</div>
<div class="ui right crm sidebar overlay" style="width:94vw;z-index:99;" id="cards_container">
    <div class="ui segment">
        <a id="cards_container_closer" class="ui icon link"><i class="ui angle right big grey icon"></i></a>
        <div id="cards_container_menu" class="ui stackable secondary pointer menu"></div>
        <div id="cards_container_content" class="ui stackable fluid one cards ">
            <div class="ui content"><div class="ui inverted dimmer"><div class="ui text loader">{{ trans('crm.fetching') }}</div></div></div>
        </div>
    </div>
</div>
