class Compflow {
    constructor(url,login,password,$cont){
        this.data=[];
    }
    touch(){
        cf.touch('compflow-list');
        $('.modal .close').click();
    }
    windigosettings($c,d){
        console.debug('Bets windigosettings',$c,d)
        $c.val(d.val_int);
    }
    list($c,d){
        $c.html('');
        console.debug('compflows list');
        d.data.map((row,i)=>{
            let $row = $(`<tr></tr>`).appendTo($c);
            $(`<td class="one wide">${row.id}</td>`).appendTo($row);
            $(`<td class="one wide">
                    <div class="ui checkbox">
                        <input type="checkbox"${row.c_status==1?'checked="checked"':null}/>
                        <label>Is online</label>
                    </div>
                </td>`).appendTo($row);
            $(`<td class="">
                <a class="ui link" onclick="crm.compflow.edit(${row.id})">Comp#${row.id_comp}</a><br/>
                <div class="ui description">
                    CategoryID: <b>${row.id_categor}</b>
                </div>
                <div class="ui description">
                    Flor: <b>${row.flor}</b>
                </div>
                <div class="ui meta">
                    MAC: <b>${row.mac_adre}</b>
                </div>
                <div class="ui extra">
                    Coordinates: <b>${row.x_coord}</b> : <b>${row.y_coord}</b>
                </div>
                </td>`).appendTo($row);
            $(`<td class="one wide right aligned submiter" data-action="/compflor/${row.id}" data-method="DELETE" data-name="comprice-active" data-callback="crm.compflow.touch">
                <div class="ui icon basic button submit"><i class="ui trash icon"></i></button>
            </td>`).appendTo($row);
        });
        page.paginate(d, 'compflow-list', $c);
        cf.reload();
    }
    add(){
        /*
            c_status:0
            flor:1
            id:1
            id_categor:1
            id_comp:1
            id_gr:1
            mac_adre:null
            x_coord:32
            y_coord:52
        */
        let $c = $(`<div class="ui modal submiter" data-action="/compflor" data-method="POST" data-callback="crm.compflow.touch" id="compflow_add"></div>`).appendTo('#modals');
        $c.append('<i class="close icon"></i>');
        $c.append('<div class="header"><i class="icon industry outline"></i> New compflow registration form</div>');
        let $bo = $(`<div class="content ui form"></div>`).appendTo($c),
            $b = $(`<div class="fields"></div>`).appendTo($bo);
        $(`<div class="field ten wide required"><label>MAC</label><div class="ui input"><input type="text" data-name="mac_adre" placeholder="MAC address" required></div></div>`).appendTo($b);
        $(`<div class="field required"><label>Computer ID#</label><div class="ui input"><input type="number" data-name="id_comp" placeholder="Number"  step="1" min="0"/></div></div>`).appendTo($b);
        $b = $(`<div class="fields"></div>`).appendTo($bo);
        $(`<div class="field required"><label>Category#</label><div class="ui input"><input type="number" data-name="id_categor" placeholder="Category"  step="1" min="0"/></div></div>`).appendTo($b);
        $(`<div class="field required"><label>Group#</label><div class="ui input"><input type="number" data-name="id_gr" placeholder="Category"  step="1" min="0"/></div></div>`).appendTo($b);
        $(`<div class="field required"><label>Flor#</label><div class="ui input"><input type="number" data-name="flor" placeholder="flor"  step="1" min="0"/></div></div>`).appendTo($b);
        $(`<h4 class="ui dividing header">Coordinates</h4>`).appendTo($bo);
        $b = $(`<div class="fields"></div>`).appendTo($bo);
        $(`<div class="field required"><label>X</label><div class="ui input"><input type="number" data-name="x_coord" placeholder="X coordinate"  step="1" min="0"/></div></div>`).appendTo($b);
        $(`<div class="field required"><label>Y</label><div class="ui input"><input type="number" data-name="y_coord" placeholder="Y coordinate"  step="1" min="0"/></div></div>`).appendTo($b);

        const $f = $(`<div class="actions"></div>`).appendTo($c);
        $(`<div class="ui black deny button">Close</div>`).appendTo($f);
        $(`<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>`).appendTo($f);
        page.modal('#compflow_add');
    }
    edit(id){
        let $c = $(`<div class="ui modal submiter" data-action="/compflor/${id}" data-method="put" data-callback="crm.compflow.touch" id="compflow_edit"></div>`).appendTo('#modals');
        $c.append('<i class="close icon"></i>');
        $c.append(`<div class="header"><i class="icon industry outline"></i>#${id} Edit compflow </div>`);
        let $bo = $(`<div class="content ui form loader"></div>`).appendTo($c);
        const $f = $(`<div class="actions">
                <div class="ui black deny button">Close</div>
                <div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>
            </div>`).appendTo($c);
        page.modal('#compflow_edit');

        $.ajax({
            url:`/compflor/${id}`,
            type: "get",
            dataType: 'json',
            success: (d,s,x)=>{
                $bo.removeClass('loader');
                let $b = $(`<div class="fields"></div>`).appendTo($bo);
                $(`<div class="field ten wide"><label>MAC</label><div class="ui input"><input type="text" data-name="mac_adre" placeholder="MAC address" value="${d.mac_adre}"></div></div>`).appendTo($b);
                $(`<div class="field"><label>Computer ID#</label><div class="ui input"><input type="number" data-name="id_comp" placeholder="Number"  step="1" min="0"  value="${d.id_comp}"/></div></div>`).appendTo($b);
                $b = $(`<div class="fields"></div>`).appendTo($bo);
                $(`<div class="field"><label>Category#</label><div class="ui input"><input type="number" data-name="id_categor" placeholder="Category"  step="1" min="0" value="${d.id_categor}"/></div></div>`).appendTo($b);
                $(`<div class="field"><label>Group#</label><div class="ui input"><input type="number" data-name="id_gr" placeholder="Category"  step="1" min="0" value="${d.id_gr}"/></div></div>`).appendTo($b);
                $(`<div class="field"><label>Flor#</label><div class="ui input"><input type="number" data-name="flor" placeholder="flor"  step="1" min="0" value="${d.flor}"/></div></div>`).appendTo($b);
                $(`<h4 class="ui dividing header">Coordinates</h4>`).appendTo($bo);
                $b = $(`<div class="fields"></div>`).appendTo($bo);
                $(`<div class="field"><label>X</label><div class="ui input"><input type="number" data-name="x_coord" placeholder="X coordinate"  step="1" min="0" value="${d.x_coord}"/></div></div>`).appendTo($b);
                $(`<div class="field"><label>Y</label><div class="ui input"><input type="number" data-name="y_coord" placeholder="Y coordinate"  step="1" min="0" value="${d.y_coord}"/></div></div>`).appendTo($b);
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
crm['compflow'] = new Compflow();
