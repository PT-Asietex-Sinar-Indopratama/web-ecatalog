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
            ['file_path' => 'files/catalog-basic-t-shirt.pdf', 'file_name' => 'catalog-basic-t-shirt.pdf'],
            ['file_path' => 'files/size-chart-t-shirt.pdf', 'file_name' => 'size-chart-t-shirt.pdf'],
            ['file_path' => 'files/catalog-polo-shirt.pdf', 'file_name' => 'catalog-polo-shirt.pdf'],
            ['file_path' => 'files/catalog-hoodie.pdf', 'file_name' => 'catalog-hoodie.pdf'],
            ['file_path' => 'files/catalog-jacket.pdf', 'file_name' => 'catalog-jacket.pdf'],
            ['file_path' => 'files/catalog-sportswear.pdf', 'file_name' => 'catalog-sportswear.pdf'],
            ['file_path' => 'files/catalog-ladies-wear.pdf', 'file_name' => 'catalog-ladies-wear.pdf'],
            ['file_path' => 'files/material-guide.pdf', 'file_name' => 'material-guide.pdf'],
            ['file_path' => 'files/printing-guide.pdf', 'file_name' => 'printing-guide.pdf'],
            ['file_path' => 'files/product-care-instruction.pdf', 'file_name' => 'product-care-instruction.pdf'],
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
