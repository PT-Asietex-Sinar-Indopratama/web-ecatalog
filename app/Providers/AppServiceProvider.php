<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureRateLimiting();
    }

    /**
     * Configure rate limiters for login and inquiry submission.
     */
    protected function configureRateLimiting(): void
    {
        // Login throttle: 5 attempts per minute per IP
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // Quotation throttle: 5 per 15 minutes AND 10 per 24 hours per IP,
        // plus 10-minute cooldown per phone+product combination.
        RateLimiter::for('quotation', function (Request $request) {
            $ip = $request->ip();
            $perWindowLimit = (int) config('quotation_limits.per_window', 5);
            $windowMinutes = (int) config('quotation_limits.window_minutes', 15);
            $perDayLimit = (int) config('quotation_limits.per_day', 10);
            $cooldownMinutes = (int) config('quotation_limits.cooldown_minutes', 10);

            $productParam = $request->route('product');
            $productId = is_object($productParam) ? ($productParam->id ?? 'unknown') : ($productParam ?? 'unknown');
            $phone = $request->input('customer_phone', '');
            $phoneProductKey = 'phone_product_'.hash('sha256', $phone.':'.$productId);

            return [
                // 5 requests per 15 minutes per IP
                Limit::perMinutes($windowMinutes, $perWindowLimit)->by('qip_window_'.$ip),
                // 10 requests per day per IP
                Limit::perDay($perDayLimit)->by('qip_day_'.$ip),
                // 10-minute cooldown per phone + product combo
                Limit::perMinutes($cooldownMinutes, 1)->by($phoneProductKey),
            ];
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
