<?php

namespace Database\Factories;

use App\Models\ProductCategories;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductCategories>
 */
class ProductCategoriesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $index = 0;

        $categories = [
            [
                'name' => 'Basic T-Shirt',
                'slug' => 'basic-t-shirt',
                'description' => 'Koleksi kaos basic untuk kebutuhan casual, event, dan merchandise.',
                'is_active' => true,
            ],
            [
                'name' => 'Oversize T-Shirt',
                'slug' => 'oversize-t-shirt',
                'description' => 'Kaos oversize dengan potongan loose fit untuk gaya streetwear.',
                'is_active' => true,
            ],
            [
                'name' => 'Polo Shirt',
                'slug' => 'polo-shirt',
                'description' => 'Polo shirt rapi untuk seragam kerja, komunitas, dan kebutuhan promosi.',
                'is_active' => true,
            ],
            [
                'name' => 'Hoodie',
                'slug' => 'hoodie',
                'description' => 'Hoodie nyaman dengan bahan fleece untuk aktivitas harian.',
                'is_active' => true,
            ],
            [
                'name' => 'Jacket',
                'slug' => 'jacket',
                'description' => 'Jaket casual dan semi-formal untuk kebutuhan outdoor maupun corporate.',
                'is_active' => true,
            ],
            [
                'name' => 'Sportswear',
                'slug' => 'sportswear',
                'description' => 'Produk pakaian olahraga dengan bahan ringan dan cepat kering.',
                'is_active' => true,
            ],
            [
                'name' => 'Ladies Wear',
                'slug' => 'ladies-wear',
                'description' => 'Koleksi pakaian wanita dengan cutting nyaman dan modern.',
                'is_active' => true,
            ],
            [
                'name' => 'Workwear',
                'slug' => 'workwear',
                'description' => 'Pakaian kerja dan seragam lapangan dengan material kuat.',
                'is_active' => true,
            ],
            [
                'name' => 'Kids Wear',
                'slug' => 'kids-wear',
                'description' => 'Produk pakaian anak dengan bahan lembut dan nyaman.',
                'is_active' => true,
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Aksesori pendukung seperti topi, tote bag, dan pouch.',
                'is_active' => false,
            ],
        ];

        $category = $categories[$index % count($categories)];
        $index++;

        return [
            'name' => $category['name'],
            'slug' => $category['slug'],
            'description' => $category['description'],
            'is_active' => $category['is_active'],
        ];
    }
}
