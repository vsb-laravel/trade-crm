@can('chief')
<div id="bets_console" style="font-family:'Lucida Console'; font-size:10px; font-weight:100;">


</div>
@push('scripts')
<script>
    $(document).ready(()=>{
        const bets = new Bets('http://eu-swarm-test.betconstruct.com','Cybbet','WZDk8<=x',$('#bets_console'));
        bets.start(4000);
    });
</script>
@endpush

@endcan
 <!-- http://chat.xcryptex.com/php/crm_brana.php?print_karta=5 -->
