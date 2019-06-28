<?php namespace Vsb\Crm;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider as LaravelServiceProvider;
class ServiceProvider extends LaravelServiceProvider{
    public function boot() {
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'countries');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'countries');

        $this->publishes([
            __DIR__.'/../../resources/views' => resource_path('views/vendor/crm'),
        ]);
        $this->publishes([
            __DIR__.'/../../config/crm.php' => config_path('crm.php'),
        ]);
        $this->publishes([
            __DIR__.'/../../resources/lang' => resource_path('lang/vendor/crm'),
        ]);

        $this->registerRoutes();
        $this->registerCommands();
    }
    public function register() {
        $this->mergeConfigFrom(__DIR__.'/../../config/crm.php', 'crm');
        // Register Locations as service
        // $this->app->bind('vsb\Locations\LocationManager', function ($app) {
        //     return new LocationManager($app);
        // });
        // $this->app->singleton('test.locations', function ($app) {
        //     return new LocationManager($app);
        // });
        $this->app->singleton('vsb.country', function ($app) {
            // return $app->make(Facades\Country::class);
            return new Facades\Country();
        });

    }
    protected function registerRoutes(){
        Route::group([
            // 'prefix' => 'crm',
            'namespace' => 'Vsb\Crm\Http\Controllers',
            'middleware' => ['Vsb\Crm\Http\Middleware\UserOnline','Vsb\Crm\Http\Middleware\Google2FA'],
        ], function () {
            $this->loadRoutesFrom(__DIR__.'/../../routes/web.php');
        });
        // Route::group([
        //     // 'prefix' => 'crm',
        //     'namespace' => 'Vsb\Crm\Http\Controllers',
        //     // 'middleware' => ['Vsb\Crm\Http\Middleware\UserOnline','Vsb\Crm\Http\Middleware\Google2FA'],
        // ], function () {
        //     $this->loadRoutesFrom(__DIR__.'/../../routes/api.php');
        // });
    }
    protected function registerCommands(){
        if ($this->app->runningInConsole()) {
            $this->commands([
                \Vsb\Crm\Console\Commands\CleanPrices::class,
                \Vsb\Crm\Console\Commands\LoadPrices::class,
                \Vsb\Crm\Console\Commands\LoadAll::class,
                \Vsb\Crm\Console\Commands\LoadHistominute::class,
                \Vsb\Crm\Console\Commands\LoadHistohour::class,
                \Vsb\Crm\Console\Commands\LoadHistoday::class,
                \Vsb\Crm\Console\Commands\ProcessDeals::class,
                \Vsb\Crm\Console\Commands\ProcessDealsDebug::class,
                \Vsb\Crm\Console\Commands\LoadInvoice::class,
                // \Vsb\Crm\Console\Commands\LoadKassaInvoices::class
                // \Vsb\Crm\Console\Commands\LoadMails::class,
                // \Vsb\Crm\Console\Commands\Lead2Client::class
            ]);
        }
    }
}
