<?php

use App\Models\ProductCategories;
use App\Models\ProductFiles;
use App\Models\ProductImages;
use App\Models\Products;
use Database\Seeders\DatabaseSeeder;

test('seeds three parent categories with two children and ten matching products', function () {
    app(DatabaseSeeder::class)->run();

    $expectedProductDistribution = [
        'basic-t-shirt' => 2,
        'oversize-t-shirt' => 2,
        'hoodie' => 2,
        'jacket' => 2,
        'polo-shirt' => 1,
        'workwear' => 1,
    ];

    expect(ProductCategories::query()->whereNull('parent_id')->count())->toBe(3)
        ->and(ProductCategories::query()->whereNotNull('parent_id')->count())->toBe(6)
        ->and(Products::query()->count())->toBe(10)
        ->and(ProductImages::query()->count())->toBe(10)
        ->and(ProductFiles::query()->count())->toBe(10);

    ProductCategories::query()
        ->whereNull('parent_id')
        ->withCount('children')
        ->get()
        ->each(function (ProductCategories $category): void {
            expect($category->children_count)->toBe(2);
        });

    foreach ($expectedProductDistribution as $slug => $productCount) {
        $category = ProductCategories::query()->where('slug', $slug)->firstOrFail();

        expect($category->products()->count())->toBe($productCount);
    }
});
