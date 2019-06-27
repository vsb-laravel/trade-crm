<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="ru">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>{{env('APP_NAME')}}</title>

	<link rel="stylesheet" type="text/css" href=" {{ asset('rating_files/css/jquery-jvectormap.css') }} " media="all" />
	<link rel="stylesheet" type="text/css" href=" {{ asset('rating_files/css/jquery-ui-1.9.2.custom.css') }} " media="all" />
	<link href="https://fonts.googleapis.com/css?family=Barlow+Condensed|Barlow:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&amp;subset=latin-ext" rel="stylesheet">
	<link type="text/css" href=" {{ asset('rating_files/css/jquery.jscrollpane.css') }} " rel="stylesheet" media="all" />
	<link rel="stylesheet" type="text/css" href=" {{ asset('rating_files/css/style.css') }} " media="all" />
	<script type="text/javascript" src="{{ asset('rating_files/js/jquery-1.9.0.min.js') }}"></script>
	<script type="text/javascript" src="{{ asset('rating_files/js/jquery-ui-1.9.2.custom.js') }}"></script>
	<script type="text/javascript" src="{{ asset('rating_files/js/jquery.mousewheel.js') }}"></script>
	<!-- the jScrollPane script -->
	<script type="text/javascript" src="{{ asset('rating_files/js/jquery.jscrollpane.min.js') }}"></script>
	<!-- scripts specific to this demo site -->
	<script type="text/javascript" src="{{ asset('rating_files/js/date.format.js') }}"></script>

	<script type="text/javascript" src="{{ asset('rating_files/js/moment-with-locales.js') }}"></script>
	<script type="text/javascript" src="{{ asset('rating_files/js/moment-timezone-with-data.js') }}"></script>
	<!-- <script type="text/javascript" src="{{ asset('rating_files/js/moment-timezone.js') }}"></script> -->

	<script src=" {{ asset('rating_files/js/jquery-jvectormap.js') }}"></script>
    <script src=" {{ asset('rating_files/js/jquery.mousewheel.js') }}"></script>
    <script src=" {{ asset('rating_files/js/src/jvectormap.js') }}"></script>

	  <script src=" {{ asset('rating_files/js/src/abstract-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/abstract-canvas-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/abstract-shape-element.js') }}"></script>

	  <script src=" {{ asset('rating_files/js/src/svg-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/svg-group-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/svg-canvas-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/svg-shape-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/svg-path-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/svg-circle-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/svg-image-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/svg-text-element.js') }}"></script>

	  <script src=" {{ asset('rating_files/js/src/vml-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/vml-group-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/vml-canvas-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/vml-shape-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/vml-path-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/vml-circle-element.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/vml-image-element.js') }}"></script>

	  <script src=" {{ asset('rating_files/js/src/map-object.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/region.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/marker.js') }}"></script>

	  <script src=" {{ asset('rating_files/js/src/vector-canvas.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/simple-scale.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/ordinal-scale.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/numeric-scale.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/color-scale.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/legend.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/data-series.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/proj.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/src/map.js') }}"></script>
	  <script src=" {{ asset('rating_files/js/jquery-jvectormap-world-mill-en.js') }}"></script>
	<script type="text/javascript" src="{{ asset('rating_files/js/main.js') }}"></script>
	<script>
    //jQuery.noConflict();
    jQuery(function(){
      var $ = jQuery;
        var map = new jvm.Map({
        container: $('#map1'),
        /*$('#map1').vectorMap({*/
        map: 'world_mill_en',
        panOnDrag: true,
        backgroundColor: 'transparent',
        zoomOnScroll: false,
        regionsSelectable: true,
        regionsSelectableOne: true,
        regionStyle: {
		  initial: {
		    fill: 'white',
		    "fill-opacity": 1,
		    stroke: 'none',
		    "stroke-width": 0,
		    "stroke-opacity": 1
		  },
		  hover: {
		    "fill-opacity": 0.8,
		    cursor: 'pointer'
		  },
		  selected: {
		    fill: '#F06C55'
		  },
		  selectedHover: {
		  }
		},
        focusOn: {
          x: 0.5,
          y: 0.5,
          scale: 1,
          animate: true
        },
        onRegionClick: function(event, code){
          console.log(code, map.getRegionName(code));
          var coun = map.getRegionName(code);
          $(".regions").hide();
          $(".countries").show();
          $(".countries > ul > li p").text(coun + ': 17%');
        },
        series: {
          regions: [{
            scale: ["#FFC188", "#0497FF", '#7B92C2', '#FFC188', '#EAA8A4', '#669384', '#33EBB9', '#00AD69', '#AE89FF'],
            normalizeFunction: 'polynomial',
            values: {
              "AF": 16.63,
              "NA": 11.45,
              "AL": 11.58,
              "DZ": 158.97,
              "AO": 85.81,
              "AG": 1.1,
              "AR": 351.02,
              "AM": 8.83,
              "AU": 1219.72,
              "AT": 366.26,
              "AZ": 52.17,
              "BS": 7.54,
              "BH": 21.73,
              "BD": 105.4,
              "BB": 3.96,
              "BY": 52.89,
              "BE": 461.33,
              "BZ": 1.43,
              "BJ": 6.49,
              "BT": 1.4,
              "BO": 19.18,
              "BA": 16.2,
              "BW": 12.5,
              "BR": 2023.53,
              "BN": 11.96,
              "BG": 44.84,
              "BF": 8.67,
              "BI": 1.47,
              "KH": 11.36,
              "CM": 21.88,
              "CA": 1563.66,
              "CV": 1.57,
              "CF": 2.11,
              "TD": 7.59,
              "CL": 199.18,
              "CN": 5745.13,
              "CO": 283.11,
              "KM": 0.56,
              "CD": 12.6,
              "CG": 11.88,
              "CR": 35.02,
              "CI": 22.38,
              "HR": 59.92,
              "CY": 22.75,
              "CZ": 195.23,
              "DK": 304.56,
              "DJ": 1.14,
              "DM": 0.38,
              "DO": 50.87,
              "EC": 61.49,
              "EG": 216.83,
              "SV": 21.8,
              "GQ": 14.55,
              "ER": 2.25,
              "EE": 19.22,
              "ET": 30.94,
              "FJ": 3.15,
              "FI": 231.98,
              "FR": 2555.44,
              "GA": 12.56,
              "GM": 1.04,
              "GE": 11.23,
              "DE": 3305.9,
              "GH": 18.06,
              "GR": 305.01,
              "GD": 0.65,
              "GT": 40.77,
              "GN": 4.34,
              "GW": 0.83,
              "GY": 2.2,
              "HT": 6.5,
              "HN": 15.34,
              "HK": 226.49,
              "HU": 132.28,
              "IS": 12.77,
              "IN": 1430.02,
              "ID": 695.06,
              "IR": 337.9,
              "IQ": 84.14,
              "IE": 204.14,
              "IL": 201.25,
              "IT": 2036.69,
              "JM": 13.74,
              "JP": 5390.9,
              "JO": 27.13,
              "KZ": 129.76,
              "KE": 32.42,
              "KI": 0.15,
              "KR": 986.26,
              "KW": 117.32,
              "KG": 4.44,
              "LA": 6.34,
              "LV": 23.39,
              "LB": 39.15,
              "LS": 1.8,
              "LR": 0.98,
              "LY": 77.91,
              "LT": 35.73,
              "LU": 52.43,
              "MK": 9.58,
              "MG": 8.33,
              "MW": 5.04,
              "MY": 218.95,
              "MV": 1.43,
              "ML": 9.08,
              "MT": 7.8,
              "MR": 3.49,
              "MU": 9.43,
              "MX": 1004.04,
              "MD": 5.36,
              "MN": 5.81,
              "ME": 3.88,
              "MA": 91.7,
              "MZ": 10.21,
              "MM": 35.65,
              "NA": 11.45,
              "NP": 15.11,
              "NL": 770.31,
              "NZ": 138,
              "NI": 6.38,
              "NE": 5.6,
              "NG": 206.66,
              "NO": 413.51,
              "OM": 53.78,
              "PK": 174.79,
              "PA": 27.2,
              "PG": 8.81,
              "PY": 17.17,
              "PE": 153.55,
              "PH": 189.06,
              "PL": 438.88,
              "PT": 223.7,
              "QA": 126.52,
              "RO": 158.39,
              "RU": 1476.91,
              "RW": 5.69,
              "WS": 0.55,
              "ST": 0.19,
              "SA": 434.44,
              "SN": 12.66,
              "RS": 38.92,
              "SC": 0.92,
              "SL": 1.9,
              "SG": 217.38,
              "SK": 86.26,
              "SI": 46.44,
              "SB": 0.67,
              "ZA": 354.41,
              "ES": 1374.78,
              "LK": 48.24,
              "KN": 0.56,
              "LC": 1,
              "VC": 0.58,
              "SD": 65.93,
              "SR": 3.3,
              "SZ": 3.17,
              "SE": 444.59,
              "CH": 522.44,
              "SY": 59.63,
              "TW": 426.98,
              "TJ": 5.58,
              "TZ": 22.43,
              "TH": 312.61,
              "TL": 0.62,
              "TG": 3.07,
              "TO": 0.3,
              "TT": 21.2,
              "TN": 43.86,
              "TR": 729.05,
              "TM": 0,
              "UG": 17.12,
              "UA": 136.91,
              "AE": 239.65,
              "GB": 2258.57,
              "US": 14624.18,
              "UY": 40.71,
              "UZ": 37.72,
              "VU": 0.72,
              "VE": 285.21,
              "VN": 101.99,
              "YE": 30.02,
              "ZM": 15.69,
              "ZW": 5.57
            }
          }]
        }
      });
    })
  </script>
</head>
<body>
	<div class="container">
		<header>
			<div class="flex">
				<div class="logo"><a href="#"><img src="images/logo.png"></a></div>
				<div class="header_caption">Affiliate statistic</div>
				<div class="header_dates header_dates-affiliate flex">
					<div class="flex periods">
						<!-- <span class="toggle-bg">
							<input type="radio" name="toggle"  value="off">
							<input type="radio" name="toggle" value="on">
							<span class="switch"></span>
						</span>
						<span class="all">All days</span> -->
						<a href="#">All time</a>
						<a href="#">Day</a>
						<a href="#">Week</a>
						<a href="#" class="active">Month</a>
					</div>
					<div class="calendar">
						<div class="flex jcsb">
							<label for="from">From day</label>
							<input type="text" id="from" name="from" placeholder="mm/dd/yyyy">
						</div>
						<div class="flex jcsb">
							<label for="to">to day</label>
							<input type="text" id="to" name="to" placeholder="mm/dd/yyyy">
						</div>
						<!--
							<label for="from">From day</label>
							<input type="hidden" id="date_from" name="date_from" placeholder="mm/dd/yyyy" value=""/>
							<label for="to">to day</label>
							<input type="hidden" id="date_to" name="date_to" placeholder="mm/dd/yyyy" value="">
						-->
					</div>
				</div>
			</div>
		</header>
		<section>
			<div class="flex jcsb">
				<div class="column">
					<div class="block flow_of_funds with_hide_list">
						<span>Flow of funds (including FTD)</span>
						<p>@amount($affiliates->sum('amount'))$</p>
                        @if($affiliates->avg('kpi')>=0)
						    <i class="plus">+@percent($affiliates->avg('kpi'))</i>
                        @else
                            <i class="minus">@percent($affiliates->avg('kpi'))</i>
                        @endif
						<button class="show_more"><span>show more</span></button>
						<div class="open_list">
							<div class="ftd">
								<div>
									<ul>
                                        @php($i=1)
                                        @foreach($affiliates->sortByDesc('amount') as $item)
                                            <li class="flex">
                                                <span>{{ $i++ }}</span>
                                                @if(($item["kpi"]??0)>=0)
                                                <div class="up"></div>
                                                @else
                                                <div class="down"></div>
                                                @endif
                                                <div class="agent_name">{{ $item["name"] }}</div>
                                                <div class="digit">@amount($item["amount"])$</div>
                                            </li>
                                        @endforeach
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="block flow_of_funds">
						<span>Affiliate KPI (without FTD)</span>
						<p>@amount($affiliates->sum('amount')-$affiliates->sum('ftd'))$</p>
						<!-- <i class="plus">+5.4%</i> -->
						<div class="divider_block">
							<div class="ftd affiliate_list">
								<ul>
                                    @php($i=1)
                                    @foreach($affiliates->sortByDesc('ftd') as $item)
                                        <li class="flex">
                                            <span>{{ $i++ }}</span>
                                            <div class="agent_name">{{ $item["name"] }}</div>
                                            <div class="digit">@amount($item["ftd"])$</div>
                                        </li>
                                    @endforeach
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="column">
					<div class="block flow_of_funds with_hide_list">
						<span>Amount of withdrawals</span>
						<p>@amount($affiliates->sum('withdrawals'))$</p>
						@if($affiliates->avg('withdrawals_kpi')>=0)
						    <i class="plus">+@percent($affiliates->avg('withdrawals_kpi'))</i>
                        @else
                            <i class="minus">@percent($affiliates->avg('withdrawals_kpi'))</i>
                        @endif
						<button class="show_more"><span>show more</span></button>
						<div class="open_list">
							<div class="ftd">
								<div>
									<ul>
                                        @php($i=1)
                                        @foreach($affiliates->sortByDesc('withdrawals') as $item)
                                            <li class="flex">
                                                <span>{{ $i++ }}</span>
                                                @if(($item["withdrawals_kpi"]??0)>=0)
                                                <div class="up"></div>
                                                @else
                                                <div class="down"></div>
                                                @endif
                                                <div class="agent_name">{{ $item["name"] }}</div>
                                                <div class="digit">@amount($item["withdrawals"])$</div>
                                            </li>
                                        @endforeach
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="block flow_of_funds avg_period with_hide_list">
						<span>Avg period from registration to deposit (days)</span>
						<p>@number($affiliates->avg('avg'))</p>
						<button class="show_more"><span>show more</span></button>
						<div class="open_list">
							<div class="ftd">
								<div>
									<ul>
                                        @php($i=1)
                                        @foreach($affiliates->sortBy('avg') as $item)
                                            <li class="flex">
                                                <span>{{ $i++ }}</span>
                                                <div class="agent_name">{{ $item["name"] }}</div>
                                                <div class="digit">@number($item["avg"])</div>
                                            </li>
                                        @endforeach
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="block ftd registrations">
						<div>
							<span class="span_capt">Con% (registrations/deposits)</span>
							<ul>
                                @php($i=1)
                                @foreach($affiliates->sortByDesc('con') as $item)
                                    <li class="flex">
                                        <span>{{ $i++ }}</span>
                                        @if(($item["con_last"]??0)<$item["con"])
                                        <div class="up"></div>
                                        @else
                                        <div class="down"></div>
                                        @endif
                                        <div class="agent_name">{{ $item["name"] }}</div>
                                        <div class="digit">@percent($item["con"])</div>
                                    </li>
                                @endforeach

							</ul>
						</div>
					</div>

				</div>
				<div class="column">
					<div class="block flow_of_funds avg_period">
						<span>Registered clients (without auto-login)</span>
						<p>526</p>
						<div class="divider_block">
							<div class="ftd registered_clients">
								<ul>
									<li class="flex">
										<span>1</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">189/36%</div>
									</li>
									<li class="flex">
										<span>2</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">80/15.2%</div>
									</li>
									<li class="flex">
										<span>3</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">78/14.9%</div>
									</li>
									<li class="flex">
										<span>4</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">60/11.4%</div>
									</li>
									<li class="flex">
										<span>5</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">52/9.9%</div>
									</li>
									<li class="flex">
										<span>6</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">30/5.7%</div>
									</li>
									<li class="flex">
										<span>7</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">9/1.71%</div>
									</li>
									<li class="flex">
										<span>8</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">7/1.3%</div>
									</li>
									<li class="flex">
										<span>9</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">7/1.3%</div>
									</li>
									<li class="flex">
										<span>10</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">7/1.3%</div>
									</li>
									<li class="flex">
										<span>11</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">7/1.3%</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div class="block flow_of_funds avg_period with_hide_list">
						<span>Average age of client (years old)</span>
						<p>36</p>
						<div class="divider_block">
							<img src={{ asset('rating_files/images/age_diagram.png') }}>
						</div>
						<button class="show_more"><span>show more</span></button>
						<div class="open_list">
							<div class="ftd">
								<div>
									<ul>
										<li class="flex">
											<span>1</span>
											<div class="up"></div>
											<div class="agent_name">Vitaly Petrenko</div>
											<div class="digit">58</div>
										</li>
										<li class="flex">
											<span>2</span>
											<div class="down"></div>
											<div class="agent_name">Nickolas Hendorson</div>
											<div class="digit">56</div>
										</li>
										<li class="flex">
											<span>1</span>
											<div class="up"></div>
											<div class="agent_name">Vitaly Petrenko</div>
											<div class="digit">58</div>
										</li>
										<li class="flex">
											<span>2</span>
											<div class="down"></div>
											<div class="agent_name">Nickolas Hendorson</div>
											<div class="digit">56</div>
										</li>
										<li class="flex">
											<span>1</span>
											<div class="up"></div>
											<div class="agent_name">Vitaly Petrenko</div>
											<div class="digit">58</div>
										</li>
										<li class="flex">
											<span>2</span>
											<div class="down"></div>
											<div class="agent_name">Nickolas Hendorson</div>
											<div class="digit">56</div>
										</li>
										<li class="flex">
											<span>1</span>
											<div class="up"></div>
											<div class="agent_name">Vitaly Petrenko</div>
											<div class="digit">58</div>
										</li>
										<li class="flex">
											<span>2</span>
											<div class="down"></div>
											<div class="agent_name">Nickolas Hendorson</div>
											<div class="digit">56</div>
										</li>
										<li class="flex">
											<span>1</span>
											<div class="up"></div>
											<div class="agent_name">Vitaly Petrenko</div>
											<div class="digit">58</div>
										</li>
										<li class="flex">
											<span>2</span>
											<div class="down"></div>
											<div class="agent_name">Nickolas Hendorson</div>
											<div class="digit">56</div>
										</li>
										<li class="flex">
											<span>1</span>
											<div class="up"></div>
											<div class="agent_name">Vitaly Petrenko</div>
											<div class="digit">58</div>
										</li>
										<li class="flex">
											<span>2</span>
											<div class="down"></div>
											<div class="agent_name">Nickolas Hendorson</div>
											<div class="digit">56</div>
										</li>
										<li class="flex">
											<span>1</span>
											<div class="up"></div>
											<div class="agent_name">Vitaly Petrenko</div>
											<div class="digit">58</div>
										</li>
										<li class="flex">
											<span>2</span>
											<div class="down"></div>
											<div class="agent_name">Nickolas Hendorson</div>
											<div class="digit">56</div>
										</li>
										<li class="flex">
											<span>1</span>
											<div class="up"></div>
											<div class="agent_name">Vitaly Petrenko</div>
											<div class="digit">58</div>
										</li>
										<li class="flex">
											<span>2</span>
											<div class="down"></div>
											<div class="agent_name">Nickolas Hendorson</div>
											<div class="digit">56</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="column right_column">
					<div class="block trading_value">
						<div class="flex jcsb">
							<span class="span_capt">Avg trading value</span>
							<div class="trading_value-money">10,144 $</div>
						</div>
						<img class="trading_value-chart" src={{ asset('rating_files/images/chart.png') }}>
						<button class="show_more"><span>show more</span></button>
						<div class="open_list">
							<div class="ftd affiliate_list">
								<ul>
									<li class="flex">
										<span>2</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>2</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>3</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>4</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>5</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>6</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>7</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>8</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>9</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>10</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>11</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div class="block requested_approved">
						<div class="flex jcsb aic">
							<div class="requested">
								<span>W/d requested</span>
								<p class="requested-money">14,520 $</p>
								<span class="requested_percent">-1.2%</span>
							</div>
							<div class="requested_approved-chart">
								<img src={{ asset('rating_files/images/requset_approved.png') }}>
							</div>
							<div class="approved">
								<span>W/d requested</span>
								<p class="approved-money">14,520 $</p>
								<span class="approved_percent">-1.2%</span>
							</div>
						</div>
						<button class="show_more"><span>show more</span></button>
						<div class="open_list">
							<div class="ftd requested_approved_clients">
								<ul>
									<li class="flex">
										<span>1</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digits">
											<div class="request_digit">5,123 $</div>
											<div class="approved_digit">4,005 $</div>
										</div>
									</li>
									<li class="flex">
										<span>1</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digits">
											<div class="request_digit">5,123 $</div>
											<div class="approved_digit">4,005 $</div>
										</div>
									</li>
									<li class="flex">
										<span>1</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digits">
											<div class="request_digit">5,123 $</div>
											<div class="approved_digit">4,005 $</div>
										</div>
									</li>
									<li class="flex">
										<span>1</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digits">
											<div class="request_digit">5,123 $</div>
											<div class="approved_digit">4,005 $</div>
										</div>
									</li>
									<li class="flex">
										<span>1</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digits">
											<div class="request_digit">5,123 $</div>
											<div class="approved_digit">4,005 $</div>
										</div>
									</li>
									<li class="flex">
										<span>1</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digits">
											<div class="request_digit">5,123 $</div>
											<div class="approved_digit">4,005 $</div>
										</div>
									</li>
									<li class="flex">
										<span>1</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digits">
											<div class="request_digit">5,123 $</div>
											<div class="approved_digit">4,005 $</div>
										</div>
									</li>
									<li class="flex">
										<span>1</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digits">
											<div class="request_digit">5,123 $</div>
											<div class="approved_digit">4,005 $</div>
										</div>
									</li>
									<li class="flex">
										<span>1</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digits">
											<div class="request_digit">5,123 $</div>
											<div class="approved_digit">4,005 $</div>
										</div>
									</li>
									<li class="flex">
										<span>1</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digits">
											<div class="request_digit">5,123 $</div>
											<div class="approved_digit">4,005 $</div>
										</div>
									</li>
									<li class="flex">
										<span>1</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digits">
											<div class="request_digit">5,123 $</div>
											<div class="approved_digit">4,005 $</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div class="block instrument_usage_cut">
						<div class="flex jcsb">
							<span class="span_capt">Instrument usage cut</span>
							<div class="instrument_usage_cut-percent">+1.15%</div>
						</div>
						<img class="instrument_usage_cut-chart" src={{ asset('rating_files/images/instrument.png') }}>
						<button class="show_more"><span>show more</span></button>
						<div class="open_list">
							<div class="ftd affiliate_list">
								<ul>
									<li class="flex">
										<span>2</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">0.6%</div>
									</li>
									<li class="flex">
										<span>2</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">1.3%</div>
									</li>
									<li class="flex">
										<span>3</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">1.42%</div>
									</li>
									<li class="flex">
										<span>4</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2.05%</div>
									</li>
									<li class="flex">
										<span>5</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">3.49%</div>
									</li>
									<li class="flex">
										<span>2</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">0.6%</div>
									</li>
									<li class="flex">
										<span>2</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">1.3%</div>
									</li>
									<li class="flex">
										<span>3</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">1.42%</div>
									</li>
									<li class="flex">
										<span>4</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2.05%</div>
									</li>
									<li class="flex">
										<span>5</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">3.49%</div>
									</li>
									<li class="flex">
										<span>5</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">3.49%</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex jcsb second_row">
				<div class="column">
					<div class="block flow_of_funds with_hide_list average_ltv">
						<span>Average LTV</span>
						<p>25,562 $</p>
						<button class="show_more"><span>show more</span></button>
						<div class="open_list">
							<div class="ftd affiliate_list">
								<ul>
									<li class="flex">
										<span>2</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>2</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>3</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>4</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>5</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>6</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>7</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>8</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>9</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>10</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
									<li class="flex">
										<span>11</span>
										<div class="agent_name">Affiliate name 1</div>
										<div class="digit">2,325 $</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div class="block ftd registrations">
						<div>
							<span class="span_capt">Pick up rate</span>
							<ul>
								<li class="flex">
									<span>1</span>
									<div class="up"></div>
									<div class="agent_name">Affiliate name 1</div>
									<div class="digit">28%</div>
								</li>
								<li class="flex">
									<span>2</span>
									<div class="down"></div>
									<div class="agent_name">Affiliate name 2</div>
									<div class="digit">14%</div>
								</li>
								<li class="flex">
									<span>1</span>
									<div class="up"></div>
									<div class="agent_name">Affiliate name 3</div>
									<div class="digit">13%</div>
								</li>
								<li class="flex">
									<span>2</span>
									<div class="down"></div>
									<div class="agent_name">Affiliate name 3</div>
									<div class="digit">6%</div>
								</li>
								<li class="flex">
									<span>1</span>
									<div class="up"></div>
									<div class="agent_name">Affiliate name 4</div>
									<div class="digit">58%</div>
								</li>
								<li class="flex">
									<span>2</span>
									<div class="down"></div>
									<div class="agent_name">Affiliate name 5</div>
									<div class="digit">56%</div>
								</li>
								<li class="flex">
									<span>1</span>
									<div class="up"></div>
									<div class="agent_name">Affiliate name 6</div>
									<div class="digit">58%</div>
								</li>
								<li class="flex">
									<span>2</span>
									<div class="down"></div>
									<div class="agent_name">Nickolas Hendorson</div>
									<div class="digit">56%</div>
								</li>
								<li class="flex">
									<span>1</span>
									<div class="up"></div>
									<div class="agent_name">Vitaly Petrenko</div>
									<div class="digit">58%</div>
								</li>
								<li class="flex">
									<span>2</span>
									<div class="down"></div>
									<div class="agent_name">Nickolas Hendorson</div>
									<div class="digit">56%</div>
								</li>
								<li class="flex">
									<span>1</span>
									<div class="up"></div>
									<div class="agent_name">Vitaly Petrenko</div>
									<div class="digit">58%</div>
								</li>

							</ul>
						</div>
					</div>
				</div>
				<div class="column countries_column">
					<div class="block">
						<div class="flex">
							<span class="span_capt">Spread by countries</span>
						</div>
						<div class="flex">
							<!-- <img src={{ asset('rating_files/images/countries_map.png') }}> -->
							<div id="map1"></div>
							<div class="regions">
								<ul>
									<li class="europe"><p>Europe: 28%</p><button class="regions_more"></button>
									<div class="open_list">
										<div class="ftd affiliate_list">
											<ul>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">0.6%</div>
												</li>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.3%</div>
												</li>
												<li class="flex">
													<span>3</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.42%</div>
												</li>
												<li class="flex">
													<span>4</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">2.05%</div>
												</li>
												<li class="flex">
													<span>5</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">3.49%</div>
												</li>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">0.6%</div>
												</li>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.3%</div>
												</li>
												<li class="flex">
													<span>3</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.42%</div>
												</li>
												<li class="flex">
													<span>4</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">2.05%</div>
												</li>
												<li class="flex">
													<span>5</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">3.49%</div>
												</li>
												<li class="flex">
													<span>5</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">3.49%</div>
												</li>
											</ul>
										</div>
									</div>
									</li>
									<li class="russia"><p>Russia: 24%</p><button class="regions_more"></button>
										<div class="open_list">
										<div class="ftd affiliate_list">
											<ul>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">0.6%</div>
												</li>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.3%</div>
												</li>
												<li class="flex">
													<span>3</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.42%</div>
												</li>
												<li class="flex">
													<span>4</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">2.05%</div>
												</li>
												<li class="flex">
													<span>5</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">3.49%</div>
												</li>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">0.6%</div>
												</li>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.3%</div>
												</li>
												<li class="flex">
													<span>3</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.42%</div>
												</li>
												<li class="flex">
													<span>4</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">2.05%</div>
												</li>
												<li class="flex">
													<span>5</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">3.49%</div>
												</li>
												<li class="flex">
													<span>5</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">3.49%</div>
												</li>
											</ul>
										</div>
									</div>
									</li>
									<li class="neareast"><p>Near East and Middle Asia: 18%</p><button class="regions_more"></button></li>
									<li class="afrika"><p>Africa: 11.1%</p><button class="regions_more"></button></li>
									<li class="eastasia"><p>East Asia: 10%</p><button class="regions_more"></button></li>
									<li class="southeastasia"><p>Southeast Asia: 8%</p><button class="regions_more"></button></li>
									<li class="australia"><p>Australia et al. near: 0.5%</p><button class="regions_more"></button></li>
									<li class="southamerika"><p>South America: 0.3%</p><button class="regions_more"></button></li>
									<li class="northamerica"><p>North America: 0.1%</p><button class="regions_more"></button></li>
								</ul>
							</div>
							<div class="countries">
								<ul>
									<li><p>Italy: 17%</p><button class="regions_more"></button>
									<div class="open_list">
										<div class="ftd affiliate_list">
											<ul>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">0.6%</div>
												</li>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.3%</div>
												</li>
												<li class="flex">
													<span>3</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.42%</div>
												</li>
												<li class="flex">
													<span>4</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">2.05%</div>
												</li>
												<li class="flex">
													<span>5</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">3.49%</div>
												</li>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">0.6%</div>
												</li>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.3%</div>
												</li>
												<li class="flex">
													<span>3</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.42%</div>
												</li>
												<li class="flex">
													<span>4</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">2.05%</div>
												</li>
												<li class="flex">
													<span>5</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">3.49%</div>
												</li>
												<li class="flex">
													<span>5</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">3.49%</div>
												</li>
											</ul>
										</div>
									</div>
									</li>
									<!-- <li ><p>Russia: 24%</p><button class="regions_more"></button>
										<div class="open_list">
										<div class="ftd affiliate_list">
											<ul>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">0.6%</div>
												</li>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.3%</div>
												</li>
												<li class="flex">
													<span>3</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.42%</div>
												</li>
												<li class="flex">
													<span>4</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">2.05%</div>
												</li>
												<li class="flex">
													<span>5</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">3.49%</div>
												</li>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">0.6%</div>
												</li>
												<li class="flex">
													<span>2</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.3%</div>
												</li>
												<li class="flex">
													<span>3</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">1.42%</div>
												</li>
												<li class="flex">
													<span>4</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">2.05%</div>
												</li>
												<li class="flex">
													<span>5</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">3.49%</div>
												</li>
												<li class="flex">
													<span>5</span>
													<div class="agent_name">Affiliate name 1</div>
													<div class="digit">3.49%</div>
												</li>
											</ul>
										</div>
									</div>
									</li>
									<li ><p>Near East and Middle Asia: 18%</p><button class="regions_more"></button></li>
									<li ><p>Africa: 11.1%</p><button class="regions_more"></button></li>
									<li><p>East Asia: 10%</p><button class="regions_more"></button></li>
									<li><p>Southeast Asia: 8%</p><button class="regions_more"></button></li>
									<li><p>Australia et al. near: 0.5%</p><button class="regions_more"></button></li>
									<li><p>South America: 0.3%</p><button class="regions_more"></button></li>
									<li><p>North America: 0.1%</p><button class="regions_more"></button></li>-->
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="block each_status">
				<div class="flex jcsb">
					<span class="span_capt">Each individual status</span>
					<ul class="flex statuses">
						<li class="notinterested">Not interested</li>
						<li class="wrongnumber">Wrong number</li>
						<li class="registered">Registred</li>
						<li class="deposited">Deposited</li>
						<li class="callbacknoanswer">Callback/No answer</li>
						<li class="hungup">Hung up</li>
						<li class="unreachable">Unreachable</li>
						<li class="noanswer1">No answer 1</li>
						<li class="noanswer2">No answer 2</li>
						<li class="noanswer3">No answer 3</li>
						<li class="callback">Callback</li>
						<li class="newclient">New client</li>
					</ul>
				</div>
				<div class="each_status_affiliate">
					<ul class="flex">
						<li>
							<span>1. Affiliate name 1</span>
							<img src={{ asset('rating_files/images/status_chart.png') }}>
						</li>
						<li>
							<span>1. Affiliate name 1</span>
							<img src={{ asset('rating_files/images/status_chart.png') }}>
						</li>
						<li>
							<span>1. Affiliate name 1</span>
							<img src={{ asset('rating_files/images/status_chart.png') }}>
						</li>
						<li>
							<span>1. Affiliate name 1</span>
							<img src={{ asset('rating_files/images/status_chart.png') }}>
						</li>
						<li>
							<span>1. Affiliate name 1</span>
							<img src={{ asset('rating_files/images/status_chart.png') }}>
						</li>
					</ul>
				</div>
			</div>
		</section>
	</div>

</body>
