<div id="cards_container_toggler" class="ui hude green icon button">
    <i class="ui angle double left icon" style="margin-left:-8px!important;"></i>
    {{ __('crm.cards.title') }}
    <span class="" id="cards_container_count"></span>
</div>
@push('scripts')
    <script>
        const dpt = 0;
        $(document).ready(()=>{
            $('#cards_container_toggler').css('right',`-${$('#cards_container_toggler').width()-dpt}px`).hover(()=>{
                $('#cards_container_toggler').css('right',`-4px`);
            },()=>{
                $('#cards_container_toggler').css('right',`-${$('#cards_container_toggler').width()-dpt}px`);
            });
        })

    </script>
@endpush

<div class="ui right crm sidebar overlay" id="cards_container">
    <div class="ui segment">
        <div id="cards_container_menu" class="ui stackable secondary menu">
            <a id="cards_container_closer" class="ui icon item"><i class="ui angle right big grey icon"></i></a>
        </div>
        <div id="cards_container_content" class="ui stackable fluid one cards"></div>
    </div>
</div>
