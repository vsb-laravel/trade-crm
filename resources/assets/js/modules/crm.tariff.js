class Tariff {
    constructor(url,login,password,$cont){
        this.data=[];
    }
    touch(){
        cf.touch('tariff-list');
        $('.modal .close').click();
    }
    windigosettings($c,d){
        console.debug('Bets windigosettings',$c,d)
        $c.val(d.val_int);
    }
    list($c,d){
        $c.html('');
        console.debug('tariffs list');
        // this.data=d.data;
        d.data.map((row,i)=>{
            let $row = $(`<tr></tr>`).appendTo($c);
            $(`<td class="one wide">
                    <div class="ui slider checkbox submiter" data-action="/compprice/${row.id}" data-method="PUT" data-name="comprice-active" data-callback="crm.tariff.touch">
                        <input type="checkbox" data-name="active" class="tariff activer switcher" ${row.active==1?'checked="checked"':null}/>
                        <label>Active</label>
                        <input type="hidden" class="submit"/>
                    </div>
                </td>`).appendTo($row);
            $(`<td class="one wide">
                    <div class="ui checkbox submiter" data-action="/compprice/${row.id}" data-method="PUT" data-name="comprice-active" data-callback="crm.tariff.touch">
                        <input type="checkbox" data-name="packet" class="tariff switcher" ${row.active==1?'checked="checked"':null}/>
                        <label>Packet</label>
                        <input type="hidden" class="submit"/>
                    </div>
                </td>`).appendTo($row);
            $(`<td class="tree wide center aligned">${row.t_time_start.replace(/(\d{2})(\d{2})/,"$1:$2")} - ${row.t_time_end.replace(/(\d{2})(\d{2})/,"$1:$2")}</td>`).appendTo($row);
            $(`<td class="">
                <a class="ui link" onclick="crm.tariff.edit(${row.id})">${row.t_name}</a><br/>
                <div class="ui description">
                    CategoryID: <b>${row.id_categor}</b> ID: <b>${row.id}</b>
                </div>
                </td>`).appendTo($row);
            $(`<td class="tree wide right aligned">${(row.price)?row.price.dollars():null}</td>`).appendTo($row);
            $(`<td class="one wide right aligned submiter" data-action="/compprice/${row.id}" data-method="DELETE" data-name="comprice-active" data-callback="crm.tariff.touch">
                <div class="ui icon basic button submit"><i class="ui trash icon"></i></button>
            </td>`).appendTo($row);
        });
        $(`.tariff.switcher`).on('change',function(){
            $(this).parent().find('.submit').click();
        })
        page.paginate(d, 'tariff-list', $c);
        cf.reload();
    }
    add(){
        let $c = $(`<div class="ui modal submiter" data-action="/compprice" data-method="POST" data-callback="crm.tariff.touch" id="tariff_add"></div>`).appendTo('#modals');
        $c.append('<i class="close icon"></i>');
        $c.append('<input type="hidden" data-name="t_time_start"/>');
        $c.append('<input type="hidden" data-name="t_time_end"/>');
        $c.append('<div class="header"><i class="icon industry outline"></i> New tariff registration form</div>');
        //'t_name','active','t_time_start','t_time_end','id_categor','price','paket'
        let $bo = $(`<div class="content ui form"></div>`).appendTo($c),
            $b = $(`<div class="fields"></div>`).appendTo($bo);
        $(`<div class="field ten wide required"><label>Name</label><div class="ui input"><input type="text" data-name="t_name" placeholder="Name" required></div></div>`).appendTo($b);
        $(`<div class="field required"><label>Category#</label><div class="ui input"><input type="number" data-name="id_categor" placeholder="Category"  step="1" min="0"/></div></div>`).appendTo($b);
        $(`<h4 class="ui dividing header">Times</h4>`).appendTo($bo);
        $b = $(`<div class="fields"></div>`).appendTo($bo);
        $(`<div class="field eight wide required"><label>Start</label><div class="ui left icon input"><i class="ui clock icon"></i><input type="time" id="startTime"/></div></div>`).appendTo($b);
        $(`<div class="field eight wide required"><label>End</label>  <div class="ui left icon input"><i class="ui clock icon"></i><input type="time" id="endTime"/></div></div>`).appendTo($b);

        $(`<h4 class="ui dividing header">Prices</h4>`).appendTo($bo);
        $b = $(`<div class="fields"></div>`).appendTo($bo);
        $(`<div class="field ten wide "><label>Price</label><div class="ui left icon input"><i class="ui dollar icon"></i><input type="number" data-name="price"/></div></div>`).appendTo($b);
        $(`<div class="field"><label>Packet</label><div class="ui checkbox"><input type="checkbox" data-name="paket"/><label></label></div></div>`).appendTo($b);

        const $f = $(`<div class="actions"></div>`).appendTo($c);
        $(`<div class="ui black deny button">Close</div>`).appendTo($f);
        $(`<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>`).appendTo($f);
        $(`#tariff_add #startTime`).on('change',function(){
            const val = $(this).val().replace(/(\d+):(\d+)/,'$1$2');
            console.debug('set time',val);
            $(`[data-name="t_time_start"]`).val(val);
        })
        $(`#tariff_add #endTime`).on('change',function(){
            const val = $(this).val().replace(/(\d+):(\d+)/,'$1$2');
            console.debug('set time',val);
            $(`[data-name="t_time_end"]`).val(val);
        })
        page.modal('#tariff_add');
    }
    edit(id){
        let $c = $(`<div class="ui modal submiter" data-action="/compprice/${id}" data-method="put" data-callback="crm.tariff.touch" id="tariff_edit"></div>`).appendTo('#modals');
        $c.append('<i class="close icon"></i>');
        $c.append(`<div class="header"><i class="icon industry outline"></i>#${id} Edit tariff </div>`);
        let $bo = $(`<div class="content ui form loader"></div>`).appendTo($c);
        const $f = $(`<div class="actions">
                <div class="ui black deny button">Close</div>
                <div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>
            </div>`).appendTo($c);
        page.modal('#tariff_edit');

        $.ajax({
            url:`/compprice/${id}`,
            type: "get",
            dataType: 'json',
            success: (d,s,x)=>{
                $bo.removeClass('loader');
                //'t_name','active','t_time_start','t_time_end','id_categor','price','paket'
                let $b = $(`<div class="fields"></div>`).appendTo($bo);
                $(`<div class="field ten wide"><label>Name</label><div class="ui input"><input type="text" data-name="t_name" placeholder="Name" value="${d.t_name}"></div></div>`).appendTo($b);
                $(`<div class="field"><label>Category#</label><div class="ui input"><input type="number" data-name="id_categor" placeholder="Category"  step="1" min="0" value="${d.id_categor}"/></div></div>`).appendTo($b);
                $(`<h4 class="ui dividing header">Times</h4>`).appendTo($bo);
                $b = $(`<div class="fields"></div>`).appendTo($bo);
                $c.append(`<input type="hidden" data-name="t_time_start" value="${d.t_time_start}"/>`);
                $c.append(`<input type="hidden" data-name="t_time_end" value="${d.t_time_end}"/>`);
                $(`<div class="field eight wide"><label>Start</label><div class="ui left icon input"><i class="ui clock icon"></i><input type="time" id="startTime" value="${d.t_time_start.replace(/(\d{2})(\d{2})/,'$1:$2')}"/></div></div>`).appendTo($b);
                $(`<div class="field eight wide"><label>End</label>  <div class="ui left icon input"><i class="ui clock icon"></i><input type="time" id="endTime" value="${d.t_time_end.replace(/(\d{2})(\d{2})/,'$1:$2')}"/></div></div>`).appendTo($b);

                $(`<h4 class="ui dividing header">Prices</h4>`).appendTo($bo);
                $b = $(`<div class="fields"></div>`).appendTo($bo);
                $(`<div class="field ten wide "><label>Price</label><div class="ui left icon input"><i class="ui dollar icon"></i><input type="number" data-name="price" value="${d.price?d.price:''}"/></div></div>`).appendTo($b);
                $(`<div class="field"><label>Packet</label><div class="ui checkbox"><input type="checkbox" ${d.paket?'checked="checked"':''} data-name="paket"/><label></label></div></div>`).appendTo($b);

                $(`#tariff_add #startTime`).on('change',function(){
                    const val = $(this).val().replace(/(\d+):(\d+)/,'$1$2');
                    console.debug('set time',val);
                    $(`[data-name="t_time_start"]`).val(val);
                })
                $(`#tariff_add #endTime`).on('change',function(){
                    const val = $(this).val().replace(/(\d+):(\d+)/,'$1$2');
                    console.debug('set time',val);
                    $(`[data-name="t_time_end"]`).val(val);
                })
            },
            error: (x,s)=>{
                console.warn(x,s);
                $bo.append(`<div class="ui erro message">
                    <div class="header">Error</div>
                    <div class="description">${s}</div>
                </div>`)

            }
        })




    }
};
if (!crm || crm == undefined || crm == null) crm = {};
crm['tariff'] = new Tariff();
