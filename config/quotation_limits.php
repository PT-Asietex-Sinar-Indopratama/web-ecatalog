<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Request Quotation Rate Limiting Configuration
    |--------------------------------------------------------------------------
    |
    | Mengatur batas pengiriman request quotation dari endpoint publik.
    | Nilai dapat diubah melalui environment variable tanpa deploy ulang.
    |
    */

    // Maksimal pengiriman per window per IP
    'per_window' => (int) env('QUOTATION_LIMIT_PER_WINDOW', 5),

    // Durasi window dalam menit
    'window_minutes' => (int) env('QUOTATION_LIMIT_WINDOW_MINUTES', 15),

    // Maksimal pengiriman per hari per IP
    'per_day' => (int) env('QUOTATION_LIMIT_PER_DAY', 10),

    // Cooldown (menit) sebelum nomor WA + produk yang sama bisa dikirim lagi
    'cooldown_minutes' => (int) env('QUOTATION_LIMIT_COOLDOWN_MINUTES', 10),

];
