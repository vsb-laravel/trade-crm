<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="ru">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="icon" type="image/png" sizes="16x16" href="./images/favicon.png">
	<title>{{env('APP_NAME')}}</title>

	<link rel="stylesheet" type="text/css" href="/rating_files/css/jquery-ui-1.9.2.custom.css" media="all" />
	<link href="https://fonts.googleapis.com/css?family=Barlow+Condensed|Barlow:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&amp;subset=latin-ext" rel="stylesheet">
	<link type="text/css" href="/rating_files/css/jquery.jscrollpane.css" rel="stylesheet" media="all" />
	<link rel="stylesheet" type="text/css" href="/rating_files/css/style.css" media="all" />
	<script type="text/javascript" src="/rating_files/js/jquery-1.9.0.min.js"></script>
	<script type="text/javascript" src="/rating_files/js/jquery-ui-1.9.2.custom.js"></script>
	<script type="text/javascript" src="/rating_files/js/jquery.mousewheel.js"></script>
	<!-- the jScrollPane script -->
	<script type="text/javascript" src="/rating_files/js/jquery.jscrollpane.min.js"></script>
	<!-- scripts specific to this demo site -->
	<script type="text/javascript" src="/rating_files/js/date.format.js"></script>

	<script type="text/javascript" src="/rating_files/js/moment-with-locales.js"></script>
	<script type="text/javascript" src="/rating_files/js/moment-timezone-with-data.js"></script>
	<!-- <script type="text/javascript" src="/rating_files/js/moment-timezone.js"></script> -->
	<script type="text/javascript" src="/rating_files/js/main.js"></script>
	<script>
		const setMonth = (m,t) => {
			$('#period').val(m);
			$('#date_form').submit();
		};
	</script>
</head>
<body>
	<div class="container">
		<header>
			<div class="flex">
				<div class="logo"><a href="#"><img src="/images/logo.png"></a></div>
				<div class="header_caption">Agents rating</div>
				<div class="header_dates flex">
					<!-- <div class="flex fdrr">
						<span class="toggle-bg">
							<input type="radio" name="toggle"  value="off">
							<input type="radio" name="toggle" value="on">
							<span class="switch"></span>
						</span>
						<span class="all">All days</span>
					</div> -->
					<div class="calendar">
									@for($i=(date('n') - 2); $i <= date('n'); ++$i )
										@php($m = str_pad($i,2,'0',STR_PAD_LEFT) )
										<a href="#" class="month
										@if($period == date('Y').$m)
											active
										@endif" onclick="setMonth({{ date('Y').$m }})">
											{{ date("M",strtotime(date('Y').'-'.$m.'-01' )) }}
										</a>
									@endfor

						<form id="date_form">
							<input type="hidden" id="period" name="period" value="{{ $period ?? date('Ym') }}"/>
						</form>
					</div>
				</div>
			</div>
		</header>
		<section>
			<div class="flex jcsb">
				<div class="left_side">
					<div class="block ftd">
						<div>
							<h3>FTD agents rating</h3>
							<ul>
								@php($i=0)
								@php($totalDeposits=0)
								@foreach($data->counted as $m)
									@php($i++)
									@php($totalDeposits+=$m->this->count)
									<li class="flex">
										<span>{{$i}}</span>
										@if($m->today)
											<div class="up"></div>
										@else
											<div class="down"></div>
										@endif
										<div class="agent_name">{{$m->title}}</div>
										<div class="digit">{{$m->this->count}}</div>
									</li>
								@endforeach
							</ul>
						</div>
					</div>
				</div>
				<div class="central_content">
					<div class="top_three block">
						<h3>top 3 agents</h3>
						<ul class="flex jcsb">
							@php($i=3)
							@foreach($data->counted as $m)
								@if($i-- > 0)
									<li>
										@if($i==2)
											<div class="first">
										@elseif($i==1)
											<div class="second">
										@else
											<div class="third">
										@endif
											<div class="flex aic">
												<div class="place"></div>
												<div class="money">{{ number_format($m->this->count,0,'.',' ') }}</div>
											</div>
											<div class="top_name">{{ $m->title }}</div>
										</div>
									</li>
								@endif
							@endforeach
						</ul>
					</div>
					<div class="flex jcsb">
						<div class="block last">
							<h3>last depositors</h3>
							<ul>
								@php($i=4)
								@foreach($raw as $d)
									@if($i-- >= 0 )
										<li class="flex jcsb aic">
											<p>{{$d->manager->title}}</p>
											<p class="last_deposit">{{number_format($d->amount,2,'.',' ')}} usd</p>
										</li>
									@endif
								@endforeach
							</ul>
						</div>
						<div class="block group">
							<h4>Group deposits (month)</h4>
							<span class="current">{{$totalDeposits}}</span>
							@php($percent = 100*$totalDeposits/$target->count)
							<p class="so_far">So far this month</p>
							<div class="flex jcsb">
								<input class="percent" type="text" readonly name="" value="{{number_format($percent,2,'.','') }}%">
								<span class="target">Target: {{ number_format($target->count,0,'.',' ') }}</span>
							</div>
							<div class="preloader">
								<div style="width: {{$percent}}%"></div>
							</div>
						</div>
					</div>
					<div class="block time-wr">
						<h3>world time</h3>
						<ul class="flex jcsb">
							<li>
								<div class="timeblock london">
									<div class="city">London (GMT)</div>
									<div class="time flex jcsb">
										<div class="hours"></div>
										<div class="minutes"></div>
										<div class="seconds"></div>
									</div>
									<div class="day"></div>
								</div>
							</li>
							<li>
								<div class="timeblock moscow">
									<div class="city">Moscow</div>
									<div class="time flex jcsb">
										<div class="hours"></div>
										<div class="minutes"></div>
										<div class="seconds"></div>
									</div>
									<div class="day"></div>
								</div>
							</li>
							<li>
								<div class="timeblock hong">
									<div class="city">Hong Kong</div>
									<div class="time flex jcsb">
										<div class="hours"></div>
										<div class="minutes"></div>
										<div class="seconds"></div>
									</div>
									<div class="day"></div>
								</div>
							</li>
							<li>
								<div class="timeblock tokyo">
									<div class="city">Tokyo</div>
									<div class="time flex jcsb">
										<div class="hours"></div>
										<div class="minutes"></div>
										<div class="seconds"></div>
									</div>
									<div class="day"></div>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="right_side">
					<div class="block rate">
						<span>Conversion rate (visit to customer)</span>
						<p>{{ number_format( $totalConvertion, 2,'.','') }}%</p>
					</div>
					<div class="block runway">
						<span>Runway (month)</span>
						<div class="wd">
							Target/Work days<br/>
							@php($runaway=($target->count-$totalDeposits )/(($target->days==0)?1:$target->days))
							@if($runaway<0)
								@php($runaway=0)
							@endif
							<i>{{ number_format($runaway,2,'.','') }}</i>
						</div>
						<img src="/rating_files/images/grafik.png">
					</div>
					<div class="block ftd con">
						<div>
							<h3>con %</h3>
							<ul>
								@php($i=1)
								@foreach($data->convertion as $m)
								<li class="flex">
									<span>{{$i++}}</span>
									<div class="agent_name">{{$m->title}}</div>
									<div class="digit">{{ number_format(100*$m->this->count/(($m->customers==0)?1000:$m->customers),2,'.','') }}</div>
								</li>
								@endforeach

							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
	<script>
		setInterval(()=>{
			document.location.reload();
		},{{$refresh}}*60*1000);
	</script>
</body>
</html>
