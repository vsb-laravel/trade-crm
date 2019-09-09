<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <title>{{ config('app.name', 'Laravel') }}</title>
    <!-- Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width">

    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- SEO Meta -->
    <meta name="description" content="CRM system">
    <meta name="keywords" content="">
    <!-- Favicon -->
    <!-- <link rel="icon" type="image/png" sizes="16x16" href="favicon.ico"> -->
    <link rel="icon" type="image/png" sizes="16x16" href="./images/favicon.png">
    <!-- CSS -->
    <!--  Vendor files -->
    <base href="/"/>
    <link rel="stylesheet" href="{{ asset('css/icon.css') }}?{{ filesize('css/icon.css') ?? '0' }}">
    <link rel="stylesheet" href="{{ asset('vendor/semantic-ui/semantic.min.css') }}">
    <link rel="stylesheet" href="{{ asset('vendor/semantic-ui/components/calendar.min.css') }}">
    <link href="/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" href="{{ asset('vendor/pell/dist/pell.min.css') }}"/>
    <link rel="stylesheet" href="{{ asset('crm.3.0/css/crm.css') }}?{{filesize('crm.3.0/css/crm.css')}}">
    <link rel="stylesheet" href="{{ asset('crm.3.0/css/jquery.toastmessage.css') }}">
    <script>
        class Collection{
            constructor(data,opts={
                value:"id", name:"name",desc:false
            }){
                this.opts=opts;
                this.data=[];
                try{
                    if(typeof(data) == 'string')this.data = JSON.parse(data);
                    else this.data=data;
                }
                catch(e){
                    console.warn(e);
                }
                this.toOptionList = this.toOptionList.bind(this);
                this.toItemList = this.toItemList.bind(this);
                this.walk = this.walk.bind(this);
                this.add = this.add.bind(this);
                this.first = this.first.bind(this);
                this.last = this.last.bind(this);
            }
            add(n,v,d=false){
                let obj = {};
                obj[this.opts.name]=n;
                obj[this.opts.value]=v;
                obj[this.opts.desc]=d;
                this.data = this.data.reverse();
                this.data.push(obj);
                this.data = this.data.reverse();
            }
            toItemList(firstEmpty=false){
                let ret = firstEmpty?`<div class="ui item" data-value=""><span class="text"></span><span class="description"></span></div>`:''
                return ret + this.walk((n,v,d) => {return `<div class="ui item" data-value="${v}"><span class="text">${n}</span>${(d!==false)?`<span class="description">${d}</span>`:''}</div>`;});
            }
            toOptionList(firstEmpty=false){
                let ret = firstEmpty?`<option></option>`:''
                return ret+this.walk((n,v,d) => {return `<option value="${v}">${n}</option>`; });
            }
            walk(callback){
                let ret = '';
                for(let i in this.data){
                    const itr = this.data[i];
                    const value = getObjectByPath(itr,this.opts.value);
                    const name = getObjectByPath(itr,this.opts.name);
                    const desc = this.opts.desc?getObjectByPath(itr,this.opts.desc):false;
                    ret+=callback(name,value,desc)
                }
                return ret;
            }
            first(){
                return this.data[0];
            }
            last(){
                return this.data[this.data.length-1];
            }
        }
    </script>
    <script>
        window.wsport = {{ env('WSPORT',3000) }};
        window.wshost = "{{ env('WSHOST','localhost') }}";
        window.user = {!! json_encode(Auth::user()) !!};
        window.user.childs = {!! json_encode(Auth::user()->childs) !!};
        window.user.can = {
        	ipcheck:{{ Auth::user()->can('ipcheck')?'true':'false' }},
        	superadmin:{{ Auth::user()->can('superadmin')?'true':'false' }},
        	chief:{{ Auth::user()->can('chief')?'true':'false' }},
        	admin:{{ Auth::user()->can('admin')?'true':'false' }},
        	ftd:{{ Auth::user()->can('ftd')?'true':'false' }},
        	retention:{{ Auth::user()->can('retention')?'true':'false' }},
        	manager:{{ Auth::user()->can('manager')?'true':'false' }},
        	marketing:{{ Auth::user()->can('marketing')?'true':'false' }},
        	marketingOnly:{{ Auth::user()->can('marketingOnly')?'true':'false' }},
        	affilate:{{ Auth::user()->can('affilate')?'true':'false' }},
        	client:{{ Auth::user()->can('client')?'true':'false' }},
        	fired:{{ Auth::user()->can('fired')?'true':'false' }},
        	kyc:{{ Auth::user()->can('kyc')?'true':'false' }},
        	lead:{{ Auth::user()->can('lead')?'true':'false' }},
        	export:{{ Auth::user()->can('export')?'true':'false' }},
        	addAdmin:{{ Auth::user()->can('addAdmin')?'true':'false' }},
        	finance:{{ Auth::user()->can('finance')?'true':'false' }},
        	partner:{{ Auth::user()->can('partner')?'true':'false' }},

            deposit: {{ Auth::user()->can('do.deposit')?'true':'false' }},
            withdraw: {{ Auth::user()->can('do.withdraw')?'true':'false' }},
            customers: {{ Auth::user()->can('customers')?'true':'false' }},
            leads: {{ Auth::user()->can('leads')?'true':'false' }},
            transactions: {{ Auth::user()->can('transactions')?'true':'false' }},

            trades: {{ Auth::user()->can('trades')?'true':'false' }},
            tune: {{ Auth::user()->can('tune.trades')?'true':'false' }},
            manage_trades: {{ Auth::user()->can('manage.trades')?'true':'false' }},
            fastlogin: {{ Auth::user()->can('fastlogin')?'true':'false' }},
        };
        window.user.statuses = new Collection({!! json_encode($statuses["user"]) !!},{name:"title",value:"id"});
        window.user.rights = new Collection({!! json_encode($rights["list"]) !!},{name:"name",value:"id"});
        window.affilates = new Collection({!! json_encode($affilates) !!},{name:"title",value:"id",desc:"rights.name"})
        window.employees = new Collection({!! json_encode($employees) !!},{name:"title",value:"id",desc:"rights.name"})
        window.managers = new Collection({!! json_encode($managers) !!},{name:"title",value:"id",desc:"rights.name"})
        window.managers.add("me",window.user.id,window.user.rights.name)
        window.countries = new Collection({!!json_encode($countries)!!},{name:"title",value:"id"});
        window.merchants = new Collection({!! json_encode(App\Merchant::select("id","title","name")->get()) !!},{name:"title",value:"id",desc:"name"});

        window.Laravel = {!! json_encode(['csrfToken' => csrf_token(),]) !!};
        window.csrf = '{!! csrf_token() !!}';
        window.animationTime = 256;
        window.onloads = [];
        const USE_UTC = {{ config('app.USE_UTC','false') }};
        window.system={
            @if(App::isLocale('ru'))
                months:['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
                weeks:['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
            @else
                months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                weeks:['Sun','Mon','Tue','Wen','Thu','Fri','Sat'],
            @endif
            user: window.user,
            options: {
                _data:JSON.parse('{!! json_encode($options) !!}'),
                get:function(n){
                    for(var o in system.options._data){
                        var opt = system.options._data[o];
                        if(opt.name==n){
                            if(opt.type='bollean') return (opt.value=="1");
                            return opt.value;
                        }
                    }
                    return undefined;
                }
            },
            mailer: "{{env('MAIL_USERNAME')}}",
            app:"{{ config('app.name', 'Laravel')  }}",
            telephony:{
                // _data:JSON.parse('{!! preg_replace(["/\"([\{\}])/im","/\\\/im","/^\"/","/\"$/"],["$1","","",""],json_encode($telephony)) !!}'),
                _data:JSON.parse('{!! preg_replace(["/\"\{/im","/\}\"/im","/\\\/im","/^\"/","/\"$/"],["{","}",""],json_encode($telephony)) !!}'),

                list:[],
                get:function(){
                    let list = [];
                    for(let i in system.telephony._data){
                        let tel = system.telephony._data[i];
                        if(tel.enabled==1)list.push(tel);
                    }
                    system.telephony.list = list;
                    return list;
                },
                available:function(){
                    for(let i in system.telephony._data){
                        let tel = system.telephony._data[i];
                        if(tel.enabled==1) return i;
                    }
                }
            },
            sources: {
                _data:JSON.parse('{!! json_encode($sources) !!}'),
                toOptionList:function(){
                    var ret ='';
                    for(var i in system.sources._data){
                        var cur = system.sources._data[i];
                        ret+='<option value="'+cur.id+'">'+cur.name+'</option>';
                    }
                    return ret;
                },
                toOptionListDiv:function(){
                    var ret ='';
                    for(var i in system.sources._data){
                        var cur = system.sources._data[i];
                        ret+=`<div class="ui item" data-value="${cur.id}">${cur.name}</div>`;
                    }
                    return ret;
                }
            },
            pairs:{
                _data:{},
                get:function(i){
                    if(system.pairs._data[i]) return system.pairs._data[i];
                    return {
                        title:"",
                        from:{code:"",name:"",image:""},
                        to:{code:"",name:"",image:""}
                    };
                }
            },
            countries: {
                _data:{!! json_encode($countries) !!},
                toOptionList:function(){
                    var ret ='';
                    for(var i in system.countries._data){
                        var cur = system.countries._data[i];
                        ret+='<option value="'+cur.id+'">'+cur.title+'</option>';
                    }
                    return ret;
                }
            }
        };
        var currentAuth = {!! json_encode(Auth::user()) !!}
        var lead = {
                statuses: JSON.parse('{!! json_encode($statuses["lead"]) !!}',{name:"title",value:"id",desc:"name"})
            };
        var currency = {
            data:{},
            value: function(a,c,p=2){
                var symb = (c=='' || this.data[c] == undefined)?'':this.data[c].unicode,sign = (parseFloat(a)<0)?'-':'',val = Math.abs(parseFloat(a));

                return sign+symb+val.toFixed(p).replace(/(\d)(?=(\d{3})+\.)/g, '$1');
            },
            image:function(c){
                return (c=='' || this.data[c] == undefined)?'':this.data[c].image;
            },
            toOptionList:function(){
                var ret ='';
                for(var i in currency.data){
                    var cur = currency.data[i];
                    ret+='<option value="'+cur.id+'">'+i+'</option>';
                }
                return ret;
            },
            toOptionListDiv:function(){
                var ret ='';
                for(var i in currency.data){
                    var cur = currency.data[i];
                    ret+=`<div class="ui item" data-value="${cur.id}">
                        <span class="text">${cur.code}</span>
                        <span class="description">${cur.name}</span>
                    </div>`;
                }
                return ret;
            },
            toValues:function(exclude=false){
                let ret = [];
                for(var i in currency.data){
                    const cur = currency.data[i];
                    if(exclude!=false && $.inArray(cur.id,exclude)>-1)continue;
                    ret.push({
                        value: cur.id,
                        text: cur.name,
                        name: cur.code
                    });
                }

                return ret;
            },
            byId:(id)=>{
                for( let i in currency.data){
                    const itm = currency.data[i];
                    if(itm.id == id) return itm;
                }
                return false;
            }
        };
        @if(isset($currencies))
            @foreach($currencies as $currency)
                currency.data["{{$currency->code}}"]={
                    id:{{$currency->id}},
                    name:"{{$currency->name}}",
                    code:"{{$currency->code}}",
                    symbol:'{{$currency->symbol}}',
                    unicode:'{{$currency->unicode}}',
                    image:'{{$currency->image}}'
                };
            @endforeach
        @endif
        @if(isset($instruments))
            @foreach($instruments as $pair)
                system.pairs._data["{{$pair->id}}"]=JSON.parse('{!! json_encode($pair) !!}');
            @endforeach
        @endif
        function checkOptions($c,d){

            let options = {};
            d.map( (o,i) => {
                options[o.name] = o.type==='boolean'?o.value==="1":o.value;
            } );
            if(!options.can_use_crm && system.user.rights_id<10){
                //logout and redirect to google
                $.post('/logout');
                window.location.href='https://google.com';
            }
        }
        let dict = `{!! json_encode(trans('crm')) !!}`;
        dict = dict.replace(/\\r/ig,'').replace(/\\n/ig,'').replace(/[\r\n]/ig,'')
        try{
            window._trans = {
                crm: {!! json_encode(trans('crm')) !!},
                messages: {!! json_encode(trans('messages')) !!}
            };
            // console.debug(window._trans);
        }
        catch(e){
            console.warn('dictionary not loaded',dict, e);
        }
        const __ = (s) => {
            const lang = window._trans?window._trans:{};
            let path = s.split(/\./), ret = lang;
            for(i=0;i<path.length;++i){
                const v = path[i];
                // console.debug('__trans',v,ret[v],s);
                ret = (ret[v])?ret[v]:false;
            }
            return ret?ret:s;
        };
        window.user.historyTypes = new Collection([
            {title: __('crm.show.all'),name: false},
            {title: __('crm.trades.title'),name: "deal"},
            {title: __('crm.finance.transaction'),name: "transaction"},
            {title: __('crm.customers.manager'),name: "manager"},
            {title: __('crm.customers.affilate'),name: "affilate"},
            {title: __('crm.customers.title'),name: "user"},
            {title: __('crm.finance.withdrawal'),name: "withdrawal"}
        ],{name:"title",value:"name"});
    </script>
</head>
<body class="{{ mb_strtolower(config('app.name', 'Laravel')) }}" style="height: 100%;">
    @include('crm.partials.sidebar')
    @include('crm.partials.header')
    <div class="ui pusher">
        <div class="ui active page dimmer content" style="height:100vh;" id="main_dimmer"><div class="ui text loader" id="page_loader_text"></div></div>
        <script>
            var timer = 0;
            var wordCount=0;
            var words = [__('crm.customers.title'),__('crm.leads.title'),__('crm.trades.title'),__('crm.transactions.title'),__('crm.settings'),__('crm.starting_system')];
            var loaderText = document.getElementById('page_loader_text');
            const wording = ()=>{
                if(wordCount<words.length){
                    loaderText.innerHTML = `<div class="ui inverted header"><small>${(wordCount+1 < words.length)?__('crm.loading'):''}</small>&nbsp;<strong>${words[wordCount]}</strong></div>`;
                    wordCount++;
                    if(wordCount < words.length) setTimeout(wording,120);//dotting(dotsCount);
                }
            }
            wording();
        </script>
        @yield('page')
    </div>
    @include('crm.partials.footer')

    <div id="body_event_trigger" style="display:none;"></div>
    <div class="loadering" id="options-checker" data-name="check-options" data-action="/option" data-autostart="true" data-function="checkOptions"></div>

    <div class="" style="display: none; position:fixed; width:100vw; margin:0; top: 0px; background: rgba(181,204,24,.92); padding:24px;text-align:center; z-index: 999; color:#fff; font-size: 24px;" id="reenable_connection">
        <p>Connection to server lost</p>
        <button class="ui red huge button" onclick="document.location.reload()">Reload</button>
    </div>
    <div id="modals"></div>
    <!-- Script-->
    <script src="{{ asset('crm.3.0/js/vendor.js') }}"></script>
    <script src="{{ asset('crm.3.0/js/crm.js') }}?{{filesize('crm.3.0/js/crm.js')}}"></script>
    @stack('scripts')

</body>
</html>
