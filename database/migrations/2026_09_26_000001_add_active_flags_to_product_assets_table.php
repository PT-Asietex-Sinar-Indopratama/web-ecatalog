<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            $table->boolean('is_thumbnail')->default(false)->after('image_path');
        });

        Schema::table('product_files', function (Blueprint $table) {
            $table->boolean('is_downloadable')->default(false)->after('file_type');
        });
    }

    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            $table->dropColumn('is_thumbnail');
        });

        Schema::table('product_files', function (Blueprint $table) {
            $table->dropColumn('is_downloadable');
        });
    }
};
