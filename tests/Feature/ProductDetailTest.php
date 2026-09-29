<?php

use App\Models\ProductFiles;
use App\Models\ProductImages;
use App\Models\Products;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\get;

test('shows an active product detail with its assets', function () {
    $product = Products::factory()->create(['is_active' => true]);

    $image = ProductImages::factory()
        ->for($product, 'product')
        ->create(['is_thumbnail' => true]);
    $file = ProductFiles::factory()
        ->for($product, 'product')
        ->create(['is_downloadable' => true]);

    get(route('product.show', $product))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Product/Index')
            ->where('product.id', $product->id)
            ->where('product.name', $product->name)
            ->where('product.thumbnail_image.id', $image->id)
            ->where('product.downloadable_file.id', $file->id));
});

test('does not expose inactive product details', function () {
    $product = Products::factory()->create(['is_active' => false]);

    get(route('product.show', $product))->assertNotFound();
});
