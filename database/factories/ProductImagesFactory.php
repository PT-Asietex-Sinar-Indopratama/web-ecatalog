<?php

namespace Database\Factories;

use App\Models\ProductImages;
use App\Models\Products;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductImages>
 */
class ProductImagesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $index = 0;

        $imagePaths = [
            'products/images/seeder-sample-catalog.png',
            'products/images/seeder-sample-catalog-2.png',
            'products/images/seeder-sample-catalog-3.png',
        ];

        $imagePath = $imagePaths[$index % count($imagePaths)];
        $index++;

        return [
            'product_id' => Products::query()->inRandomOrder()->value('id') ?? Products::factory(),
            'image_path' => $imagePath,
            'is_thumbnail' => true,
        ];
    }
}
