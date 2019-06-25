class Rang {
    constructor(url,login,password,$cont){
        this.data=[];
    }
    touch(){
        cf.touch('rang-list');
        $('.modal .close').click();
    }
    list($c,d){
        $c.html('');
        console.debug('rangs list');
        // this.data=d.data;
        d.data.map((row,i)=>{
            let $row = $(`<tr></tr>`).appendTo($c);
            // $(`<td class="one wide">
            //         <div class="ui slider checkbox submiter" data-action="/windigoRang/${row.id}" data-method="PUT" data-name="comprice-active" data-callback="crm.rang.touch">
            //             <input type="checkbox" data-name="active" class="rang activer switcher" ${row.active==1?'checked="checked"':null}/>
            //             <label>Active</label>
            //             <input type="hidden" class="submit"/>
            //         </div>
            //     </td>`).appendTo($row);
            // $(`<td class="one wide">
            //         <div class="ui checkbox submiter" data-action="/windigoRang/${row.id}" data-method="PUT" data-name="comprice-active" data-callback="crm.rang.touch">
            //             <input type="checkbox" data-name="packet" class="rang switcher" ${row.active==1?'checked="checked"':null}/>
            //             <label>Packet</label>
            //             <input type="hidden" class="submit"/>
            //         </div>
            //     </td>`).appendTo($row);
            $(`<td class="center aligned">${row.r_sort}</td>`).appendTo($row);
            $(`<td class=""eight wide><a class="ui link" onclick="crm.rang.edit(${row.id})">${row.r_name}</a><br/></td>`).appendTo($row);
            $(`<td class="right aligned">${row.r_hour}</td>`).appendTo($row);
            $(`<td class="right aligned">${(row.r_bonus)?row.r_bonus.dollars():''}</td>`).appendTo($row);
            $(`<td class="one wide right aligned submiter" data-action="/windigoRang/${row.id}" data-method="DELETE" data-name="comprice-active" data-callback="crm.rang.touch">
                <div class="ui icon basic button submit"><i class="ui trash icon"></i></button>
            </td>`).appendTo($row);
        });
        $(`.rang.switcher`).on('change',function(){
            $(this).parent().find('.submit').click();
        })
        page.paginate(d, 'rang-list', $c);
        cf.reload();
    }
    add(){
        let $c = $(`<div class="ui modal submiter" data-action="/windigoRang" data-method="POST" data-callback="crm.rang.touch" id="rang_add"></div>`).appendTo('#modals');
        $c.append('<i class="close icon"></i>');
        $c.append('<div class="header"><i class="icon industry outline"></i> New rang registration form</div>');
        //'t_name','active','t_time_start','t_time_end','id_categor','price','paket'
        let $bo = $(`<div class="content ui form"></div>`).appendTo($c),
            $b = $(`<div class="fields"></div>`).appendTo($bo);
        $(`<div class="field required"><label>Sort#</label><div class="ui input"><input type="number" data-name="r_sort" placeholder="Sort order"  step="1" min="0"/></div></div>`).appendTo($b);
        $(`<div class="field ten wide required"><label>Name</label><div class="ui input"><input type="text" data-name="r_name" placeholder="Name" required></div></div>`).appendTo($b);
        // $(`<h4 class="ui dividing header">Prices</h4>`).appendTo($bo);
        $b = $(`<div class="fields"></div>`).appendTo($bo);
        $(`<div class="field four wide "><label>Hours</label><div class="ui left icon input"><i class="ui clock icon"></i><input type="number" data-name="r_hour"/></div></div>`).appendTo($b);
        $(`<div class="field six wide"><label>Bonus</label><div class="ui left icon input"><i class="ui dollar icon"></i><input type="number" data-name="r_bonus"/><label></label></div></div>`).appendTo($b);

        const $f = $(`<div class="actions"></div>`).appendTo($c);
        $(`<div class="ui black deny button">Close</div>`).appendTo($f);
        $(`<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>`).appendTo($f);
        page.modal('#rang_add');
    }
    edit(id){
        let $c = $(`<div class="ui modal submiter" data-action="/windigoRang/${id}" data-method="put" data-callback="crm.rang.touch" id="rang_edit"></div>`).appendTo('#modals');
        $c.append('<i class="close icon"></i>');
        $c.append(`<div class="header"><i class="icon industry outline"></i>#${id} Edit rang </div>`);
        let $bo = $(`<div class="content ui form loader"></div>`).appendTo($c);
        const $f = $(`<div class="actions">
                <div class="ui black deny button">Close</div>
                <div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>
            </div>`).appendTo($c);
        page.modal('#rang_edit');

        $.ajax({
            url:`/windigoRang/${id}`,
            type: "get",
            dataType: 'json',
            success: (row,s,x)=>{
                $bo.removeClass('loader');
                //'t_name','active','t_time_start','t_time_end','id_categor','price','paket'
                let $b = $(`<div class="fields"></div>`).appendTo($bo);
                $(`<div class="field required"><label>Sort#</label><div class="ui input"><input type="number" data-name="r_sort" placeholder="Sort order"  step="1" min="0" value="${row.r_sort}"/></div></div>`).appendTo($b);
                $(`<div class="field ten wide required"><label>Name</label><div class="ui input"><input type="text" data-name="r_name" placeholder="Name"  value="${row.r_name}"></div></div>`).appendTo($b);
                // $(`<h4 class="ui dividing header">Prices</h4>`).appendTo($bo);
                $b = $(`<div class="fields"></div>`).appendTo($bo);
                $(`<div class="field four wide "><label>Hours</label><div class="ui left icon input"><i class="ui clock icon"></i><input type="number" data-name="r_hour" value="${row.r_hour}"/></div></div>`).appendTo($b);
                $(`<div class="field six wide"><label>Bonus</label><div class="ui left icon input"><i class="ui dollar icon"></i><input type="number" data-name="r_bonus" value="${row.r_bonus}"/><label></label></div></div>`).appendTo($b);
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
crm['rang'] = new Rang();
