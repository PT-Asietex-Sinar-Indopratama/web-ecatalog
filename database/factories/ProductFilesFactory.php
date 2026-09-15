<?php

namespace Database\Factories;

use App\Models\Products;
use App\Models\ProductFiles;
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
        return [
            'product_id' => Products::inRandomOrder()->first()?->id ?? Products::factory(),
            'file_path' => 'files/' . $this->faker->word() . '.pdf',
            'file_name' => $this->faker->word() . '.pdf',
            'file_type' => 'application/pdf',
        ];
    }
}
