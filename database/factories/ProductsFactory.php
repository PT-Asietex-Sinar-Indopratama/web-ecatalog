<?php

namespace Database\Factories;

use App\Models\ProductCategories;
use App\Models\Products;
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
        static $index = 0;

        $products = [
            ['sku' => 'ATS-BSC-001', 'name' => 'Combed Basic Tee 24s', 'price' => 125000, 'slug' => 'combed-basic-tee-24s', 'description' => 'Kaos basic cotton combed 24s dengan jahitan rapi untuk kebutuhan harian dan merchandise.', 'material' => 'Cotton Combed 24s', 'is_active' => true],
            ['sku' => 'ATS-BSC-002', 'name' => 'Combed Basic Tee 30s', 'price' => 115000, 'slug' => 'combed-basic-tee-30s', 'description' => 'Kaos ringan berbahan cotton combed 30s, cocok untuk cuaca panas dan pemakaian casual.', 'material' => 'Cotton Combed 30s', 'is_active' => true],
            ['sku' => 'ATS-OVS-001', 'name' => 'Oversize Heavy Cotton Tee', 'price' => 175000, 'slug' => 'oversize-heavy-cotton-tee', 'description' => 'Kaos oversize dengan bahan heavy cotton yang tebal namun tetap nyaman dipakai.', 'material' => 'Heavy Cotton', 'is_active' => true],
            ['sku' => 'ATS-OVS-002', 'name' => 'Oversize Street Tee', 'price' => 165000, 'slug' => 'oversize-street-tee', 'description' => 'Kaos loose fit bergaya streetwear dengan area print luas di bagian depan dan belakang.', 'material' => 'Cotton Compact', 'is_active' => true],
            ['sku' => 'ATS-HDY-001', 'name' => 'Fleece Pullover Hoodie', 'price' => 285000, 'slug' => 'fleece-pullover-hoodie', 'description' => 'Hoodie pullover berbahan fleece lembut dengan kantong depan dan rib elastis.', 'material' => 'Cotton Fleece', 'is_active' => true],
            ['sku' => 'ATS-HDY-002', 'name' => 'Zipper Hoodie Daily', 'price' => 325000, 'slug' => 'zipper-hoodie-daily', 'description' => 'Hoodie zipper praktis untuk pemakaian harian dengan finishing clean dan nyaman.', 'material' => 'Baby Terry', 'is_active' => true],
            ['sku' => 'ATS-JKT-001', 'name' => 'Coach Jacket Windbreaker', 'price' => 350000, 'slug' => 'coach-jacket-windbreaker', 'description' => 'Coach jacket ringan dengan lapisan tahan angin untuk kebutuhan event dan komunitas.', 'material' => 'Taslan Coating', 'is_active' => true],
            ['sku' => 'ATS-JKT-002', 'name' => 'Bomber Jacket Twill', 'price' => 425000, 'slug' => 'bomber-jacket-twill', 'description' => 'Jaket bomber berbahan twill dengan tampilan rapi untuk corporate casual.', 'material' => 'Twill', 'is_active' => true],
            ['sku' => 'ATS-PLO-001', 'name' => 'Corporate Polo Pique', 'price' => 185000, 'slug' => 'corporate-polo-pique', 'description' => 'Polo shirt bahan pique untuk seragam kantor, komunitas, dan event formal casual.', 'material' => 'Cotton Pique', 'is_active' => true],
            ['sku' => 'ATS-WRK-001', 'name' => 'Field Work Shirt', 'price' => 275000, 'slug' => 'field-work-shirt', 'description' => 'Kemeja lapangan dengan material kuat, nyaman, dan mudah dirawat.', 'material' => 'Japan Drill', 'is_active' => true],
        ];

        $product = $products[$index % count($products)];
        $index++;

        return [
            'category_id' => ProductCategories::query()
                ->doesntHave('children')
                ->inRandomOrder()
                ->value('id') ?? ProductCategories::factory(),
            'sku' => $product['sku'],
            'name' => $product['name'],
            'price' => $product['price'],
            'slug' => $product['slug'],
            'description' => $product['description'],
            'material' => $product['material'],
            'is_active' => $product['is_active'],
            'created_by' => Users::query()->inRandomOrder()->value('id') ?? Users::factory(),
        ];
    }
}
