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
            ['sku' => 'ATS-BSC-001', 'name' => 'Combed Basic Tee 24s', 'slug' => 'combed-basic-tee-24s', 'description' => 'Kaos basic cotton combed 24s dengan jahitan rapi untuk kebutuhan harian dan merchandise.', 'material' => 'Cotton Combed 24s', 'is_active' => true],
            ['sku' => 'ATS-BSC-002', 'name' => 'Combed Basic Tee 30s', 'slug' => 'combed-basic-tee-30s', 'description' => 'Kaos ringan berbahan cotton combed 30s, cocok untuk cuaca panas dan pemakaian casual.', 'material' => 'Cotton Combed 30s', 'is_active' => true],
            ['sku' => 'ATS-OVS-001', 'name' => 'Oversize Heavy Cotton Tee', 'slug' => 'oversize-heavy-cotton-tee', 'description' => 'Kaos oversize dengan bahan heavy cotton yang tebal namun tetap nyaman dipakai.', 'material' => 'Heavy Cotton', 'is_active' => true],
            ['sku' => 'ATS-OVS-002', 'name' => 'Oversize Street Tee', 'slug' => 'oversize-street-tee', 'description' => 'Kaos loose fit bergaya streetwear dengan area print luas di bagian depan dan belakang.', 'material' => 'Cotton Compact', 'is_active' => true],
            ['sku' => 'ATS-PLO-001', 'name' => 'Corporate Polo Pique', 'slug' => 'corporate-polo-pique', 'description' => 'Polo shirt bahan pique untuk seragam kantor, komunitas, dan event formal casual.', 'material' => 'Cotton Pique', 'is_active' => true],
            ['sku' => 'ATS-PLO-002', 'name' => 'Dryfit Polo Active', 'slug' => 'dryfit-polo-active', 'description' => 'Polo dryfit dengan karakter cepat kering untuk aktivitas lapangan dan olahraga ringan.', 'material' => 'Dryfit Pique', 'is_active' => true],
            ['sku' => 'ATS-HDY-001', 'name' => 'Fleece Pullover Hoodie', 'slug' => 'fleece-pullover-hoodie', 'description' => 'Hoodie pullover berbahan fleece lembut dengan kantong depan dan rib elastis.', 'material' => 'Cotton Fleece', 'is_active' => true],
            ['sku' => 'ATS-HDY-002', 'name' => 'Zipper Hoodie Daily', 'slug' => 'zipper-hoodie-daily', 'description' => 'Hoodie zipper praktis untuk pemakaian harian dengan finishing clean dan nyaman.', 'material' => 'Baby Terry', 'is_active' => true],
            ['sku' => 'ATS-JKT-001', 'name' => 'Coach Jacket Windbreaker', 'slug' => 'coach-jacket-windbreaker', 'description' => 'Coach jacket ringan dengan lapisan tahan angin untuk kebutuhan event dan komunitas.', 'material' => 'Taslan Coating', 'is_active' => true],
            ['sku' => 'ATS-JKT-002', 'name' => 'Bomber Jacket Twill', 'slug' => 'bomber-jacket-twill', 'description' => 'Jaket bomber berbahan twill dengan tampilan rapi untuk corporate casual.', 'material' => 'Twill', 'is_active' => true],
            ['sku' => 'ATS-SPT-001', 'name' => 'Running Jersey Dryfit', 'slug' => 'running-jersey-dryfit', 'description' => 'Jersey lari berbahan dryfit yang ringan, breathable, dan nyaman untuk aktivitas intens.', 'material' => 'Dryfit Milano', 'is_active' => true],
            ['sku' => 'ATS-SPT-002', 'name' => 'Training Shirt Mesh', 'slug' => 'training-shirt-mesh', 'description' => 'Kaos olahraga dengan panel mesh untuk sirkulasi udara lebih baik.', 'material' => 'Dryfit Mesh', 'is_active' => true],
            ['sku' => 'ATS-LDS-001', 'name' => 'Ladies Relaxed Tee', 'slug' => 'ladies-relaxed-tee', 'description' => 'Kaos wanita dengan cutting relaxed fit dan bahan lembut untuk pemakaian sehari-hari.', 'material' => 'Cotton Combed 30s', 'is_active' => true],
            ['sku' => 'ATS-LDS-002', 'name' => 'Ladies Crop Tee', 'slug' => 'ladies-crop-tee', 'description' => 'Kaos crop dengan potongan modern untuk koleksi fashion casual wanita.', 'material' => 'Cotton Stretch', 'is_active' => true],
            ['sku' => 'ATS-WRK-001', 'name' => 'Field Work Shirt', 'slug' => 'field-work-shirt', 'description' => 'Kemeja lapangan dengan material kuat, nyaman, dan mudah dirawat.', 'material' => 'Japan Drill', 'is_active' => true],
            ['sku' => 'ATS-WRK-002', 'name' => 'Utility Vest Outdoor', 'slug' => 'utility-vest-outdoor', 'description' => 'Rompi utility dengan banyak kantong untuk kebutuhan lapangan dan operasional.', 'material' => 'Canvas Drill', 'is_active' => true],
            ['sku' => 'ATS-KDS-001', 'name' => 'Kids Basic Tee', 'slug' => 'kids-basic-tee', 'description' => 'Kaos anak berbahan halus dengan warna cerah dan jahitan nyaman.', 'material' => 'Cotton Combed 30s', 'is_active' => true],
            ['sku' => 'ATS-KDS-002', 'name' => 'Kids Hoodie Mini', 'slug' => 'kids-hoodie-mini', 'description' => 'Hoodie anak dengan bahan lembut dan desain simpel untuk aktivitas harian.', 'material' => 'Baby Terry', 'is_active' => true],
            ['sku' => 'ATS-ACC-001', 'name' => 'Canvas Tote Bag', 'slug' => 'canvas-tote-bag', 'description' => 'Tote bag kanvas untuk merchandise, event, dan kebutuhan promosi brand.', 'material' => 'Canvas 12 oz', 'is_active' => true],
            ['sku' => 'ATS-ACC-002', 'name' => 'Cotton Twill Cap', 'slug' => 'cotton-twill-cap', 'description' => 'Topi twill dengan panel nyaman dan area bordir logo di bagian depan.', 'material' => 'Cotton Twill', 'is_active' => false],
        ];

        $product = $products[$index % count($products)];
        $index++;

        return [
            'category_id' => ProductCategories::query()->inRandomOrder()->value('id') ?? ProductCategories::factory(),
            'sku' => $product['sku'],
            'name' => $product['name'],
            'slug' => $product['slug'],
            'description' => $product['description'],
            'material' => $product['material'],
            'is_active' => $product['is_active'],
            'created_by' => Users::query()->inRandomOrder()->value('id') ?? Users::factory(),
        ];
    }
}
