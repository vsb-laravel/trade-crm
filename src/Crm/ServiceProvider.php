<?php namespace Vsb\Crm\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider as LaravelServiceProvider;
class ServiceProvider extends LaravelServiceProvider{
    public function boot() {
        $this->registerRoutes();
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'countries');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'countries');
        $this->publishes([
            __DIR__.'/../resources/views' => resource_path('views/vendor/countries'),
        ]);
        $this->publishes([
            __DIR__.'/../config/countries.php' => config_path('countries.php'),
        ]);
        $this->publishes([
            __DIR__.'/../resources/lang' => resource_path('lang/vendor/countries'),
        ]);
    }
    public function register() {
        $this->mergeConfigFrom(__DIR__.'/../config/countries.php', 'countries');
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
}
