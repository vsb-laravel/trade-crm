<div class="ui header">@lang('crm.options.admintree')</div>
<link rel="stylesheet" href="{{ asset('vendor/treant/Treant.css') }}">
<style>
    /* body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,fieldset,input,textarea,p,blockquote,th,td { margin:0; padding:0; }
    table { border-collapse:collapse; border-spacing:0; }
    fieldset,img { border:0; }
    address,caption,cite,code,dfn,em,strong,th,var { font-style:normal; font-weight:normal; }
    caption,th { text-align:left; }
    h1,h2,h3,h4,h5,h6 { font-size:100%; font-weight:normal; }
    q:before,q:after { content:''; }
    abbr,acronym { border:0; }

    body { background: #fff; } */
    /* optional Container STYLES */
    .chart { height: 600px; margin: 5px; width: 900px; }
    .Treant > .node { padding: 3px; border: 1px solid rgba(0,0,0,.2); border-radius: 2px; background-color: none; width:85px;}
    .Treant > .node img { width: 100%; height: 100%;}
    .Treant > .node.alarm { background-color: rgba(255,55,45,.75)}

    .Treant .collapse-switch {
        font-size: 20px;
        right: 16px;
        top: 6px;
        border: none;
        background: none;
        font-family: 'Fontawesome';
        transition: all .2s ease-in;
    }
    .Treant .collapse-switch::after {content: '\f106';}
    .Treant .node.collapsed .collapse-switch::after {content: '\f107';}
    .Treant .node.collapsed .collapse-switch { background: none; border: none;}
    .Treant .allow-assign{box-shadow: 0 0 8px #000;}
    .Treant .node-name{font-weight: bold; color:rgba(0,0,0,.9);}
    .Treant .node-title{color:rgba(0,0,0,.8);}
    .Treant .node-desc{font-style: italic; color:rgba(0,0,0,.8); font-size: 90%;}
</style>
<div id="admin_hierarchy" data-name="admin-tree" class="loadering" data-action="/json/user?assigner=1" data-function="crm.user.admintree" data-autostart="true" data-need-loader="true" style="height:100%"></div>
