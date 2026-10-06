<?php

namespace Database\Factories;

use App\Models\ProductFiles;
use App\Models\Products;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductFiles>
 */
class ProductFilesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $index = 0;

        $files = [
            ['file_path' => 'products/files/seeder-sample-catalog.pdf', 'file_name' => 'seeder-sample-catalog.pdf'],
            ['file_path' => 'products/files/seeder-sample-catalog-2.pdf', 'file_name' => 'seeder-sample-catalog-2.pdf'],
            ['file_path' => 'products/files/seeder-sample-catalog-3.pdf', 'file_name' => 'seeder-sample-catalog-3.pdf'],
        ];

        $file = $files[$index % count($files)];
        $index++;

        return [
            'product_id' => Products::query()->inRandomOrder()->value('id') ?? Products::factory(),
            'file_path' => $file['file_path'],
            'file_name' => $file['file_name'],
            'file_type' => 'application/pdf',
            'is_downloadable' => true,
        ];
    }
}
