<div class="ui top" id="notificationBar" style="display:none;">
    <div class="ui stackable centered two columns grid">
        <div class="column">
            <div class="ui items">
                <div class="ui item">
                    <div class="ui tiny image centered middle aligned">
                        <!-- <img src="/crm.3.0/images/avatar/1.jpg"> -->
                        <i class="ui info huge icon"></i>
                    </div>
                    <div class="content">
                        <a class="header">My Neighbor Totoro</a>
                        <div class="meta">
                            <span class="cinema">IFC Cinema</span>
                        </div>
                        <div class="description">
                            <p></p>
                        </div>
                        <div class="extra">
                            <div class="ui right floated primary button">
                                Buy tickets
                                <i class="right chevron icon"></i>
                            </div>
                            <div class="ui label">Limited</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@if($mobile)
<!-- <div class="ui vertical sidebar"> -->
<div class="ui inverted left sidebar vertical labeled icon menu" id="menuBar">
    <a class="item"  onclick="page.show(this,'dashboard');">
        <img class="logo ui small image" src="{{ asset('images/logo.png')}}" />
        <!--  style="width:4.2em" -->
    </a>
    @include('crm.partials.left')
</div>
<div class="ui fixed inverted menu">
    <a class="ui icon item toggler"><i class="ui bars large icon"></i></a>
@else
<div class="ui top fixed inverted menu" id="crm_header">
    <a class="item" onclick="page.show(this,'dashboard');" style="padding:0!important;">
        <img class="ui logo" src="{{ asset('images/logo.png')}}"/>
    </a>
    @include('crm.partials.left')
@endif

    <div class="right menu">
        @can('ftd')
        <div id="dashboard_events" class="ui simple dropdown item" data-name="dashboard-events" data-action="/user/events?status=new" data-autostart="true" data-refresh="0" data-function="crm.events.dashboard" @if(count($events)==0) style="display:none" @endif>
        <!-- <div class="ui simple dropdown item events" data-name="dashboard-events" data-action="/user/events?status=new" data-autostart="true" data-refresh="48000" data-function="crm.events.dashboard" id="dashboard_events"  style="display:none"> -->
            <i class="icon alarm large"></i>
            <div class="ui olive label count">&nbsp;</div>
            <div class="menu" style="max-height:90vh;overflow:auto;"></div>
        </div>
        @if($mobile)
        @else
            <a id="online_users" class="ui icon item simple dropdown" data-name="users-online" data-action="/json/user/online?users=1" data-function="crm.user.online" data-refresh="32000" data-autostart="true">
                <i class="icon user large"></i>
                <div class="ui green label">0</div>
                <div class="menu" style="max-height:90vh;overflow:auto;"></div>
            </a>
            <a id="online_admins" class="ui icon item simple dropdown" data-name="users-online" data-action="/json/user/online?admins=1" data-function="crm.user.online" data-refresh="0" data-autostart="true">
                <i class="icon circle user large"></i>
                <div class="ui green label">0</div>
                <div class="menu" style="max-height:90vh;overflow:auto;"></div>
            </a>
            <a  href="#" class="ui simple dropdown item" data-name="dashboard-messages" data-action="/user/messages?user_id={{Auth::id()}}&status=new" data-autostart="true" data-refresh="0" data-function="crm.messages.dashboard" id="dashboard_messages">
                <i class="icon comment alternate outline large"></i>
                <div class="ui @if(count($messages)) yellow @endif label messages" @if(!count($messages)) style="display:none" @endif>{{count($messages)}}</div>
                <div class="menu" style="max-height:90vh;overflow:auto;"></div>
                @push('scripts')
                    <script>
                        crm.messages.dashboard($('#dashboard_messages'),{!! json_encode($messages) !!});
                    </script>
                @endpush
            </a>
        @endif

            @ifmodule('mail')
                <a class="ui icon item" onclick="page.show(this,'imap');" id="dashboard_mail">
                    <i class="icon mail large"></i>
                    <div class="ui" id="mail_count"></div>
                </>
            @endifmodule
            @elsecan('partner')
                <a class="ui icon item simple dropdown loadering" data-name="users-online" data-action="/json/user/online?users=1" data-function="crm.user.online" data-refresh="0" data-autostart="true"  style="display:none">
                    <i class="icon user large"></i>
                    <div class="ui green label" style="display:none">&nbsp;</div>
                    <div class="menu"></div>
                </a>
            @endcan
        @if($mobile)
        @else
            <a class="ui simple dropdown item loadering" data-content="Scheduler&Calendar" data-position="bottom center" onclick="page.show(this,'tasks')">
                <i class="icon calendar large"></i>
                @if(count($tasks))
                <div class="ui red label tasks">{{count($tasks)}}</div>
                @endif
                <!-- <div class="menu" id="listTasks"></div> -->
                <div class="menu hidden" id="listTasksHidden">
                    @foreach($tasks as $task)
                        <div class="item">
                            @if(isset($task->object) && !is_null($task->object))
                                <span class="ui header">
                                    <a href="javascript:crm.{{$task->object_type}}.info({{$task->object_id}},'tasks')">
                                        @if($task->object_type == 'lead')
                                            <i class="ui user outline icon"></i>
                                        @else
                                            <i class="ui user icon"></i>
                                        @endif
                                        {{ $task->object->title ?? ''}}
                                    </a>
                                </span>
                            @else
                            <span class="ui header">{{$task->title}}</span>
                            @endif

                        </div>
                    @endforeach
                </div>
            </a>


            @ifmodule('chat')
            <a class="ui icon item" onclick="page.show(this,'chart');">
                <i class="icon comment large"></i>
            </a>
            @endifmodule
            <div class="ui dropdown item helper" data-content="Choose Your language" data-position="bottom center">
                <i class="world large icon"></i>
                <div class="menu ">
                    <a class="item @if(App::isLocal('ru')) active @endif" href="/locale/ru"><i class="ru flag"></i> RU</a>
                    <a class="item @if(App::isLocal('en')) active @endif" href="/locale/en"><i class="us flag"></i> EN</a>
                </div>
            </div>
            <a class="ui item helper" id="clock" @if($mobile) style="display:none" @endif></a>
        @endif
        <div class="ui simple dropdown item">
            <i class="setting icon large"></i>
            <i class="dropdown icon"></i>
            <div class="menu">
                <div class="item" style="font-size:80%!important;text-align:right;">v{{ $git_version ?? ''}}</div>
                <a class="item inverted" onclick="page.show(this,'private');"><div class="ui small header"><i class="ui user icon"></i>{{Auth::user()->title}}</div></a>
                <div class="divider"></div>
                @can('partner')
                @elsecan('kyc')
                <a class="item" onclick="page.show(this,'options','admins');"><i class="user circle icon"></i>{{ trans('crm.administrators') }}</a>
                @endcan
                @can('admin')
                <a class="item" onclick="page.show(this,'admintree');"><i class="sitemap icon"></i>@lang('crm.options.admintree')</a>
                @endcan
                @can('admin')
                <a class="item" onclick="page.show(this,'options','dashboard');"><i class="settings icon"></i>@lang('crm.options.title')</a>
                <div class="divider"></div>
                <a class="item" target="_blank" href="http://xptx.us/login"><i class="ui bug icon"></i> {{ trans('crm.tickets') }} <i class="ui external alternate icon"></i></a>
                @endcan
                <div class="divider"></div>
                <a class="item icon" href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                    <i class="icon sign out large"></i> {{ trans('messages.logout') }}
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                        {{ csrf_field() }}
                    </form>
                </a>
            </div>
        </div>

    </div>
</div>
<!-- <div class="ui bottom attached progress progress-loader" data-value="0" data-total="100" style="position:fixed;top:4rem;left:0;width:100%"><div class="bar"></div></div> -->
