export class Merchant {
    constructor() {
    };
    touch(d, $c) {
        skymechanics.touch('merchants-list');
        if(d && d.RedirectURL) window.open(d.RedirectURL, '_blank');
    }
    payment(id) {
        var row = $('.merchant[data-id=' + id + '] td:eq(0)').text();
        row = JSON.parse(row);
        var $modal = $('<div class="ui modal merchant" id="merchant_' + id +'_payment"></div>').appendTo('#modals');
        $modal.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
        $modal.append('<div class="header">' + row.name + '</div>');
        var $content = $('<div class="content scrolling"></div>').appendTo($modal),
            $form = $('<div class="ui form submiter globe" data-action="/user/finance/deposit" data-callback="crm.merchant.touch"></div>').appendTo($content);
        $form.append(`<input type="hidden" data-name="merchant" value="${row.name}"/>`);
        $form.append(`<input type="hidden" data-name="merchant_id" value="${row.id}"/>`);
        $form.append('<input type="hidden" data-name="currency_id" value="1"/>');
        $form.append('<input type="hidden" data-name="user_id" value="1"/>');
        var $usearch = $('<div class="field"></div>').appendTo($form);
        $usearch.append('<label>to Customer</label>');
        $('<div class="ui search"><div class="ui icon input"><input class="prompt" type="text" placeholder="Customer search..."><i class="search icon"></i></div><div class="results"></div></div>').appendTo($usearch).search({
            apiSettings: {
                url: '/json/user?search={query}',
                onResponse: function(result) {
                    var response = {
                        results: []
                    };
                    for (var i in result.data) {
                        var u = result.data[i];
                        response.results.push({
                            id: u.id,
                            title: u.name + ' ' + u.surname,
                            description: '#<strong><code>' +
                                u.id +
                                '</code></strong> ' + u
                                .rights.title
                        });
                    }
                    return response;
                }
            },
            onSelect: function(result, response) {
                console.debug('onSelect', result, response,
                    $modal.find('[data-name=user_id]'));
                $modal.find('[data-name=user_id]').val(result.id);
            },
            minCharacters: 3
        });
        $form.append(
            '<div class="field"><label>Amount</label><input class="ui input" data-name="amount" value=""/></div>'
        );
        $form.append('<div class="field"><label>Method</label>' +
            '<div class="ui selection dropdown"><input type="hidden" name="Method" data-name="method" value="CreditCard"/><div class="default text">CreditCard</div><i class="dropdown icon"></i><div class="menu">' +
            '<div class="item" data-value="CryptoCoin">CryptoCoin</div>' +
            '<div class="item" data-value="CreditCard">CreditCard</div>' +
            '<div class="item" data-value="YandexMoney">YandexMoney</div>' +
            '<div class="item" data-value="WireTransfer">WireTransfer</div>' +
            '</div></div></div>');

        $form.append('<input type="hidden" class="submit"/>');
        $modal.append(
            '<div class="actions"><div class="ui positive right labeled icon button okclose">Make<i class="checkmark icon"></i></div></div>'
        );
        page.modal('#merchant_' + id + '_payment');
    }
    edit(id) {
        var row = $('.merchant[data-id=' + id + '] td:eq(0)').text();
        row = JSON.parse(row);
        var $modal = $('<div class="ui modal deals" id="merchant_' + id +
                '_dashboard"></div>').appendTo('#modals'),
            settings = row.settings; // JSON.parse((row.settings=='null')?'{}':row.settings);

        $modal.append(
            '<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>'
        );
        $modal.append('<div class="header">' + row.name + '</div>');
        var $content = $('<div class="content scrolling"></div>').appendTo(
                $modal),
            $form = $(
                '<div class="ui form submiter globe" data-action="/json/merchant/' +
                row.id +
                '/update" data-callback="crm.merchant.touch"></div>').appendTo(
                $content);
        $form.append(
            '<div class="field"><label>Title</label><input class="ui input" data-name="title" value="' +
            row.title + '"/></div>');
        $form.append('<div class="ui horizontal divider">Settings</div>');
        for (var i in settings) {
            var setting = settings[i];
            if (typeof(setting) == "object") {
                settings = JSON.stringify(settings);
            }
            $form.append('<div class="field setting"><label>' + i +
                '</label><input class="ui input" data-name="settings.' +
                i + '" value="' + setting + '"/></div>');
        }
        $form.append('<input type="hidden" class="submit"/>');
        $modal.append(
            '<div class="actions"><div class="ui basic labeled icon button" onclick="crm.merchant.payment(' +
            id +
            ')">Pay<i class="dollar icon"></i></div><div class="ui positive right labeled icon button okclose">Ok<i class="checkmark icon"></i></div></div>'
        );
        page.modal('#merchant_' + id + '_dashboard');
    }
    list($c, d) {
        $c.html('');
        for (var i in d) {
            var row = d[i],
                $tr = $('<tr data-class="" class="merchant' + ((row.enabled == 2) ? ' disabled' : '') + '" data-id="' + row.id +'"></tr>').appendTo($c);
            $tr.append('<td style="display:none;">' + JSON.stringify(row) +'</td>');
            $tr.append('<td>' + row.id + '</td>');

            if (row.enabled == '2') $tr.append('<td>&nbsp;</td>');
            // else $tr.append('<td><div class="ui slider checkbox submiter" data-action="/json/merchant/' +row.id +'/update" data-name="merchant-enabled" data-callback="crm.merchant.touch">' +'<input class="merchant enabled switcher" type="checkbox" data-name="enabled" ' +
            //     ((row.enabled == '1') ? 'checked' : '') +
            //     ' onchange="$(this).closest(\'.submiter\').find(\'.submit\').click();"><label></label>' +
            //     '<input type="hidden" class="submit"/></div></td>');
            else $tr.append(`<td>
                <div class="ui slider checkbox submiter" data-action="/json/merchant/${row.id}/update" data-name="merchant-enabled" data-callback="crm.merchant.touch">
                    <input class="merchant enabled switcher" type="checkbox" data-name="enabled" ${(row.enabled != '0') ? 'checked' : ''} onchange="$(this).closest(\'.submiter\').find(\'.submit\').click();">
                    <label></label>
                    <input type="hidden" class="submit"/>
                </div>
            </td>`);


            $tr.append(`<td class="ui header aligned left"><a href="javascript:0;" onclick="crm.merchant.edit(${row.id})">${row.title}</a><br/><small>${row.name}</small></td>`);

            $tr.append(`<td>
                    <div class="ui radio checkbox submiter" data-action="/json/merchant/${row.id}/update" data-name="merchant-default" data-callback="crm.merchant.touch">
                        <input class="merchant default" type="checkbox" data-name="default" ${(row.default != '0') ? 'checked' : ''} onchange="$(this).closest(\'.submiter\').find(\'.submit\').click();">
                        <label></label>
                        <input type="hidden" class="submit"/>
                    </div>
                </td>`);

        }
        $('.pair.enabled.switcher').on('change', function() {
            $(this).parent().find('.submit').click();
        });
        // page.paginate(d,'instrument-list',$c);
        cf.reload();
    }
};
