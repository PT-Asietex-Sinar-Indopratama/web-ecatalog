<?php

namespace Database\Factories;

use App\Models\Products;
use App\Models\ProductImages;
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
        return [
            'product_id' => Products::inRandomOrder()->first()?->id ?? Products::factory(),
            'image_path' => 'products/' . $this->faker->fileExtension() . '.jpg',
        ];
    }
}
