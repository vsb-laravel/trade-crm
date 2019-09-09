let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

// mix.sass('resources/assets/sass/app.scss', 'public/css');
// edor files build once
mix
    .scripts([
        'vendor/jquery-3.2.1.min.js',
        'vendor/jquery.cookie.js',
        'vendor/inputmask.5.x/dist/inputmask.min.js',
        'vendor/inputmask.5.x/dist/jquery.inputmask.min.js',
        'vendor/inputmask.5.x/dist/bindings/inputmask.binding.js',
        'vendor/jquery-animateNumber-0.0.14/jquery.animateNumber.min.js',
        'vendor/semantic-ui/semantic.min.js',
        'vendor/semantic-ui/components/calendar.min.js',
        'vendor/jquery-tablesort-master/jquery.tablesort.min.js',
        'vendor/moment-with-locales.js',
        'vendor/Chart.js',
        'vendor/chartjs-plugin-annotation/chartjs-plugin-annotation.js',
        'vendor/chartjs-plugin-draggable/dist/chartjs-plugin-draggable.js',
        'vendor/chartjs-plugin-zoom/chartjs-plugin-zoom.js',
        'vendor/chartjs-chart-financial/docs/Chart.Financial.js',
        'vendor/jquery-file-upload/js/vendor/jquery.ui.widget.js',
        'vendor/jquery-file-upload/js/jquery.iframe-transport.js',
        'vendor/jquery-file-upload/js/jquery.fileupload.js',
        'vendor/jquery.mark.min.js',
        'vendor/socket.io-client/dist/socket.io.js',
        // <!-- Calendar -->
        'vendor/calendar-js/fullcalendar.js',
        'vendor/calendar-js/bootstrap3-typeahead.js',
        'vendor/calendar-js/sweetalert2.js',
        'vendor/calendar-js/data_time_picker_UI.js',
        'vendor/pell/dist/pell.min.js',
        // treant js
        'vendor/treant/vendor/jquery.easing.js',
        'vendor/treant/vendor/raphael.js',
        'vendor/treant/Treant.js'
    ],'public/crm/js/vendor.js')
    .js([
        'resources/assets/js/functions.js',
        'resources/assets/js/app.js',
        'resources/assets/js/crm.js',
        'resources/assets/js/scheduler/func_calendar.js',
        'resources/assets/js/scheduler/func_users_avalible_table.js',
        'resources/assets/js/modules/tasks_notification.js',
    ],'public/crm/js/crm.js')
    .stylus('resources/assets/style.styl','public/crm/css/crm.css')
    .copyDirectory('resources/assets/images', 'public/crm/images')
;
