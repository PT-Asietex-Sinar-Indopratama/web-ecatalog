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
            'products/combed-basic-tee-24s.jpg',
            'products/combed-basic-tee-30s.jpg',
            'products/oversize-heavy-cotton-tee.jpg',
            'products/corporate-polo-pique.jpg',
            'products/fleece-pullover-hoodie.jpg',
            'products/coach-jacket-windbreaker.jpg',
            'products/running-jersey-dryfit.jpg',
            'products/ladies-relaxed-tee.jpg',
            'products/field-work-shirt.jpg',
            'products/canvas-tote-bag.jpg',
        ];

        $imagePath = $imagePaths[$index % count($imagePaths)];
        $index++;

        return [
            'product_id' => Products::query()->inRandomOrder()->value('id') ?? Products::factory(),
            'image_path' => $imagePath,
        ];
    }
}
