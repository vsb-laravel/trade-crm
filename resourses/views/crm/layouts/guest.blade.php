<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <!-- Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width">
    <!-- SEO Meta -->
    <meta name="description" content="CRM system">
    <meta name="keywords" content="">
    <!-- Favicon -->
    <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon">
    <!-- CSS -->
    <!--  Vendor files -->
    <link rel="stylesheet" href="{{ asset('vendor/semantic-ui/semantic.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/main.css') }}?{{ filesize('css/main.css') }}">
    <link rel="stylesheet" href="{{ asset('vendor/semantic-ui/components/modal.min.css') }}">
    <link rel="stylesheet" href="{{ asset('/vendor/jquery-simple-datetimepicker-1.12.0/jquery.simple-dtpicker.css') }}">

    <link rel="stylesheet" href="{{ asset('crm.3.0/css/app.css') }}">

    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-T83LJGP');</script>
    <!-- End Google Tag Manager -->
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T83LJGP"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    @yield('page')

    <div class="ui container" id="modals"></div>
    <!-- Script-->
    <script src="{{ asset('vendor/jquery-3.2.1.min.js') }}"></script>
    <script src="{{ asset('vendor/jquery.cookie.js') }}"></script>
    <script src="{{ asset('vendor/jquery-animateNumber-0.0.14/jquery.animateNumber.min.js') }}"></script>
    <script src="{{ asset('vendor/semantic-ui/semantic.min.js') }}"></script>
    <script src="{{ asset('vendor/semantic-ui/components/modal.min.js') }}"></script>
    <script src="{{ asset('vendor/semantic-ui/components/sticky.min.js') }}"></script>
    <script src="{{ asset('vendor/jquery-tablesort-master/jquery.tablesort.min.js') }}"></script>
    <script src="{{ asset('vendor/moment-with-locales.js') }}"></script>
    <script src="{{ asset('vendor/Chart.js') }}"></script>
    <script src="{{ asset('crm.3.0/js/functions.js') }}"></script>
    <script src="{{ asset('crm.3.0/js/app.js') }}"></script>
    <script src="{{ asset('crm.3.0/js/crm.js') }}"></script>
</body>
</html>
