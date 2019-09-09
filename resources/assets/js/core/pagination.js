import { VUIMessage, VUIModal } from '../components';
export class VUIPaginate {
    // page.paginate(d, 'user-list', container, `<div class="ui basic icon button open-in-cards" onclick="crm.user.card($('[data-name=user_selected]:checked'),'kyc',this)" style="display:none;"><i class="address card outline icon"></i> ${__('crm.open_in_cards')}</div>`);
    constructor(d, tl='data-list', $t=undefined  ){
        let s='';
        if($t && $t.data('name'))tl= $t.attr('data-name');
        if($t && $t.data('id'))tl= $t.attr('data-id');
        if(d==false)return;
        var from=1,to=d.last_page;
        from = ((d.current_page-3) > from )?d.current_page-3:from;
        to =  ((d.current_page+3) <= to )?d.current_page+3:to;

        s+='<div class="ui pagination borderless menu" style="margin:auto;">';
        s+='<div class="item"><a class="requester" data-name="page" data-value="1" href="javascript:void(0);" data-trigger="click" data-target="'+tl+'">First page</a></div>';
        if(d.prev_page_url)s+='<div class="item prev"><a class="requester" data-name="page" data-value="'+(d.current_page-1)+'" href="javascript:void(0);" data-trigger="click" data-target="'+tl+'">...</a></div>';
        for(var i=from;i<=to;++i){
            s+='<div class="item '+((d.current_page==(i))?"active":"")+'"><a class="requester" data-name="page" data-value="'+(i)+'" href="javascript:void(0);" data-trigger="click" data-target="'+tl+'">'+(i)+'</a></div>';
        }
        if(d.next_page_url)s+='<div class="item next"><a class="requester" data-name="page" data-value="'+(d.current_page+1)+'" href="javascript:void(0);" data-trigger="click" data-target="'+tl+'">...</a></div>';
        s+='<div class="item"><a class="requester" data-name="page" data-value="'+d.last_page+'" href="javascript:void(0);" data-trigger="click" data-target="'+tl+'">Last page</a></div>';
        s+=`<div class="ui last item"><div class="ui labeled input"><div class="ui label">${__('crm.exactly_page')}</div><input class="requester" data-trigger="enter" data-target="${tl}" type="number" data-name="page" placeholder="${__('crm.max_page')} ${d.last_page}" max="${d.last_page}"/></div>`;
        // s+=`<div class="ui right menu"><div class="item"><div class="ui labeled input"><div class="ui label">${__('crm.exactly_page')}</div><input class="requester" data-trigger="enter" data-target="${tl}" type="number" data-name="page" placeholder="${__('crm.max_page')} ${d.last_page}" max="${d.last_page}"/></div></div></div>`;
        s+='</div>';


        // s+='<div class="total_item"><span>'+d.current_page+'</span>/<span>'+d.last_page+'</span></div>';
        if($t){
            const $parent = ($t.prop('tagName') == 'TBODY')?$t.parent():$t;

            var $pp = $parent.parent().find(".pagination"),
                $totals = $parent.parent().find('.list-totals');
            // console.debug('pagination',$parent.parent(),$parent,$t,$totals,$pp)
            if(!$pp.length) $pp = $('<div class="pagination ui attached message" style="width:100%;text-align:center;"></div>').insertAfter($parent);
            $pp.html(s);

            if(!$totals.length){
                $totals = $('<div class="ui top attached borderless secondary menu fluid list-totals"></div>').insertBefore($parent);
                $totals.append(`<div class="item">${__('crm.dashboard.totals')}:&nbsp;&nbsp;<span class="ui header total" number="'+d.total+'"></span></div>`);
                for(let j = 3;j<arguments.length;++j){
                    const strArgs = arguments[j] || undefined;
                    if(strArgs) $totals.append('<div class="item">'+strArgs+'</div>');
                }
                // if($.inArray(tl,['user-list'])){
                //     var $btn = $('<button class="ui basic icon labeled button requester" data-name="export" data-value="xlsx" data-trigger="click" data-target="'+tl+'"><i class="file excel outline icon"></i> Export</button>').appendTo($('<div class="item"></div>').appendTo($totals));
                // }
                var $totalRight = $('<div class="right menu"></div>').appendTo($totals);
                var $pagination = $('<select class="ui compact dropdown requester" data-name="per_page" data-trigger="change" data-target="'+tl+'"></select>').appendTo($('<div class="item">Per page: </div>').appendTo($totalRight)),
                    per_page = $.cookie('per_page'),
                    options = [15,20,30,50,100,500];
                if(!per_page){ $.cookie('per_page',15); per_page=15; }
                for(var i in options)$pagination.append('<option'+((options[i]==per_page)?' selected':'')+'>'+options[i]+'</option>');
                $pagination.on('change',function(){
                    var pp = $(this).dropdown('get value');
                    $.cookie('per_page',pp[0]);
                    skymechanics.touch(tl);
                });

                // $('<button class="ui basic icon button updater" data-target="'+tl+'"><i class="refresh icon"></i></button>').appendTo($('<div class="item"></div>').appendTo($totalRight)).on('click',function(){skymechanics.touch($(this).attr('data-target'));});
                $('<button class="ui basic icon button updater" data-target="'+tl+'"><i class="refresh icon"></i></button>').appendTo($('<div class="item"></div>').appendTo($totalRight)).on('click',function(){skymechanics.touch(tl);});

            }
            $totals.find('.total').animateNumber({number:d.total}).prop('number', d.total);
            // $totals.find('.updater').attr('data-target',tl);
            skymechanics.reload();
        }
    }
}
