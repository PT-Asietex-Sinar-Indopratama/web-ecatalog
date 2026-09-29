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

        $categoryGroups = [
            [
                'name' => 'T-Shirts',
                'slug' => 't-shirts',
                'description' => 'Koleksi kaos untuk kebutuhan casual, event, dan merchandise.',
                'children' => [
                    [
                        'name' => 'Basic T-Shirt',
                        'slug' => 'basic-t-shirt',
                        'description' => 'Kaos basic dengan potongan reguler untuk kebutuhan sehari-hari.',
                    ],
                    [
                        'name' => 'Oversize T-Shirt',
                        'slug' => 'oversize-t-shirt',
                        'description' => 'Kaos oversize dengan potongan loose fit untuk gaya streetwear.',
                    ],
                ],
            ],
            [
                'name' => 'Outerwear',
                'slug' => 'outerwear',
                'description' => 'Pakaian luar untuk kebutuhan casual, komunitas, dan perusahaan.',
                'children' => [
                    [
                        'name' => 'Hoodie',
                        'slug' => 'hoodie',
                        'description' => 'Hoodie nyaman dengan bahan fleece atau baby terry.',
                    ],
                    [
                        'name' => 'Jacket',
                        'slug' => 'jacket',
                        'description' => 'Jaket casual dan semi-formal untuk kebutuhan outdoor.',
                    ],
                ],
            ],
            [
                'name' => 'Uniforms',
                'slug' => 'uniforms',
                'description' => 'Pakaian seragam untuk kantor, komunitas, dan pekerjaan lapangan.',
                'children' => [
                    [
                        'name' => 'Polo Shirt',
                        'slug' => 'polo-shirt',
                        'description' => 'Polo shirt rapi untuk seragam kerja dan kegiatan formal casual.',
                    ],
                    [
                        'name' => 'Workwear',
                        'slug' => 'workwear',
                        'description' => 'Pakaian kerja dan seragam lapangan dengan material kuat.',
                    ],
                ],
            ],
        ];
        $subcategories = [];

        foreach ($categoryGroups as $group) {
            $children = $group['children'];
            unset($group['children']);

            $parent = ProductCategories::factory()->create($group);

            foreach ($children as $child) {
                $subcategory = ProductCategories::factory()
                    ->for($parent, 'parent')
                    ->create($child);
                $subcategories[$subcategory->slug] = $subcategory;
            }
        }

        $productDistribution = [
            'basic-t-shirt' => 2,
            'oversize-t-shirt' => 2,
            'hoodie' => 2,
            'jacket' => 2,
            'polo-shirt' => 1,
            'workwear' => 1,
        ];
        $products = collect();

        foreach ($productDistribution as $categorySlug => $productCount) {
            $products = $products->concat(
                Products::factory($productCount)
                    ->for($subcategories[$categorySlug], 'category')
                    ->create(),
            );
        }

        foreach ($products as $product) {
            ProductImages::factory()
                ->for($product, 'product')
                ->create(['is_thumbnail' => true]);
            ProductFiles::factory()
                ->for($product, 'product')
                ->create(['is_downloadable' => true]);
        }
    }
}
