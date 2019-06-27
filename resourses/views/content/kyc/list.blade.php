<div class="popup users user kyc-list" style="display:block;">
    <div class="close" onclick="{ $('.kyc-list').fadeOut( 256, function(){ $(this).remove(); } ); }"></div>
    <div class="search">
        <form action="#" class="flex jcsb width">
            <div class="left flex">
                <div class="inner">
                    <select class="loader requester" data-name="office" data-title="Office" data-action="/json/user/offices" data-autostart="true" data-trigger="change" data-target="kyc-list"></select>
                </div>
                <div class="inner">
                    <select class="loader requester" data-name="manager_id" data-title="Administator" data-action="/json/user?rights_id=7" data-autostart="true" data-trigger="change" data-target="kyc-list"></select>
                </div>
                <div class="inner">
                    <select class="loader requester" data-name="manager_id" data-title="Manager" data-action="/json/user?rights_id[0]=4&rights_id[1]=5&rights_id[2]=6" data-autostart="true" data-trigger="change" data-target="kyc-list"></select>
                </div>
            </div>
            <div class="center flex">

            </div>
            <div class="right flex">


            </div>
        </form>
    </div>

    <table>
        <thead>
            <tr>
                <td><input type="checkbox" class="check-all" data-list="kyc_selected" /></td>
                <td>ID <div class="arrow sorter" data-name="country" data-trigger="click" data-target="kyc-list" data-value="asc"><span></span><span></span></div></td>
                <td>Registred <div class="arrow sorter" data-name="created_at" data-trigger="click" data-target="kyc-list" data-value="asc"><span></span><span></span></div></td>
                <td>Email <div class="arrow sorter" data-name="email" data-trigger="click" data-target="kyc-list" data-value="asc"><span></span><span></span></div></td>
                <td>Name <div class="arrow sorter" data-name="name" data-trigger="click" data-target="kyc-list" data-value="asc"><span></span><span></span></div></td>
                <td>Phone <div class="arrow sorter" data-name="phone" data-trigger="click" data-target="kyc-list" data-value="asc"><span></span><span></span></div></td>
                <td>Country <div class="arrow sorter" data-name="country" data-trigger="click" data-target="kyc-list" data-value="asc"><span></span><span></span></div></td>
                <td>Documents</td>
            </tr>
        </thead>
        <tbody id="kyc_list" data-name="kyc-list" class="loader" data-action="/user/kyc/json" data-function="kycList" data-autostart="true" data-trigger=""></tbody>
    </table>
</div>
