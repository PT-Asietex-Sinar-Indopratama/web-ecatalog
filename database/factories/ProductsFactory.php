<?php

namespace Database\Factories;

use App\Models\Products;
use App\Models\ProductCategories;
use App\Models\Users;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Products>
 */
class ProductsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => ProductCategories::inRandomOrder()->first()?->id ?? ProductCategories::factory(),
            'sku' => $this->faker->unique()->bothify('SKU-####-????'),
            'name' => $this->faker->words(3, true),
            'slug' => $this->faker->slug(),
            'description' => $this->faker->paragraph(),
            'material' => $this->faker->word(),
            'is_active' => $this->faker->boolean(90),
            'created_by' => Users::inRandomOrder()->first()?->id ?? Users::factory(),
        ];
    }
}
