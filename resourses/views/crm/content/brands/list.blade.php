<div class="popup popup_b finance-invoices" style="display:block;">
    <div class="close" onclick="{ $(this).parent().fadeOut( 256, function(){ $(this).remove(); stopLoadersInPopup($(this)); } ); }"></div>
    <div class="contenta flex">
        <strong>{{ trans('messages.merchant_transaction') }}</strong>
        <table>
            <thead>
                <tr>
                    <td>ID<div class="arrow sorter" data-name="id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
                    <td>Date<div class="arrow sorter" data-name="created_at" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
                    <td>Merchant<div class="arrow sorter" data-name="merchant_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
                    <td>Client<div class="arrow sorter" data-name="user_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
                    <td>Manager<div class="arrow sorter" data-name="user_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
                    <td>Method<div class="arrow sorter" data-name="method" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
                    <td>Amount<div class="arrow sorter" data-name="amount" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
                    <td>Order ID<div class="arrow sorter" data-name="order_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
                    <td>Transaction ID<div class="arrow sorter" data-name="transaction_id" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
                    <td>Error<div class="arrow sorter" data-name="error" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
                    <td>Message<div class="arrow sorter" data-name="message" data-trigger="click" data-target="deal-list" data-value="asc"><span></span><span></span></div></td>
                    <td></td>
                </tr>
            </thead>
            <tbody class="loadering" data-name="invoice-list" data-action="/finance/invoice" data-function="crmInvoices" data-autostart="true" data-trigger=""></tbody>
        </table>
    </div>
    <script>
        function crmInvoices (container,d,x,s){
            container.html('');
            var daily = 0,curDate = new Date();
            for(var i in d.data){
                var row=d.data[i], s = '<tr data-class="invoice" data-id="'+row.id+'">', trxDate = new Date(row.created_at*1000),
                    manager = (row.user.manager)?row.user.manager:undefined;
                daily+=(trxDate.getFullYear()==curDate.getFullYear() && trxDate.getMonth()==curDate.getMonth() && trxDate.getDay()==curDate.getDay() )?1:0;
                s+='<td>'+row.id+'</td>';
                s+='<td>'+dateFormat(row.created_at)+'</td>';
                s+='<td>'+row.merchant.title+'</td>';
                s+='<td><a href="#" data-class="user" data-id="'+row.user.id+'">'+row.user.name+' '+row.user.surname+'</a></td>';
                s+=(manager)?'<td><a href="#" data-class="manager" data-id="'+manager.id+'">'+manager.name+' '+manager.surname+'</a></td>':'<td></td>';
                s+='<td>'+row.method+'</td>';
                s+='<td>'+currency.value(row.amount,row.account.currency.code)+'</td>';
                s+='<td>'+row.order_id+'</td>';
                s+='<td>'+row.transaction_id+'</td>';
                s+='<td>'+row.error+'</td>';
                s+='<td>'+row.message+'</td>';

                s+='</tr>'
                container.append(s);
            }
            cf.pagination(d,'invoice-list',container);
            $('.invoice_list_total').text(d.total);
            $('.invoice_list_total_daily').text(daily);
        }
    </script>
</div>
