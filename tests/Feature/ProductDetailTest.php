<?php

use App\Models\ProductFiles;
use App\Models\ProductImages;
use App\Models\Products;
use App\Models\RequestQuotations;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\get;
use function Pest\Laravel\post;

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

test('stores a quotation and prepares a whatsapp sales link', function () {
    config(['services.sales.whatsapp_number' => '6280000000000']);

    $product = Products::factory()->create(['is_active' => true]);

    post(route('product.quotation.store', $product), [
        'customer_name' => 'Budi Santoso',
        'customer_phone' => '081234567890',
        'company_name' => 'PT Contoh',
        'quantity' => 100,
        'notes' => 'Mohon info estimasi produksi.',
    ])
        ->assertRedirect(route('product.show', $product))
        ->assertSessionHas('flash.type', 'success');

    $quotation = RequestQuotations::query()->firstOrFail();

    expect($quotation->product_id)->toBe($product->id)
        ->and($quotation->product_name)->toBe($product->name)
        ->and($quotation->product_sku)->toBe($product->sku)
        ->and($quotation->customer_name)->toBe('Budi Santoso')
        ->and($quotation->status)->toBe('new');

    expect(session('flash.whatsapp_url'))
        ->toContain('https://wa.me/6280000000000')
        ->toContain('Budi+Santoso');
});
