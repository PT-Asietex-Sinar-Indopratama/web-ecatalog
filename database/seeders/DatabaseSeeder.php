<?php

namespace Database\Seeders;

use App\Models\ProductCategories;
use App\Models\ProductFiles;
use App\Models\ProductImages;
use App\Models\Products;
use App\Models\Users;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        // Seed roles & default admin user via Spatie
        $this->call(RoleSeeder::class);

        // Seed product data
        Users::factory(10)->create();
        ProductCategories::factory(10)->create();
        Products::factory(20)->create();
        ProductImages::factory(20)->create();
        ProductFiles::factory(20)->create();
    }
}
