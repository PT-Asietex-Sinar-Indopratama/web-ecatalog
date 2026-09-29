<?php

use App\Models\ProductFiles;
use App\Models\ProductImages;
use App\Models\Products;
use App\Models\Users;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

beforeEach(function () {
    Role::create(['name' => 'admin', 'guard_name' => 'web']);

    $this->admin = Users::factory()->create([
        'email' => 'product-admin@example.test',
    ]);
    $this->admin->assignRole('admin');

    actingAs($this->admin);
    Storage::fake('public');
});

test('stores one image and one file as the automatic product assets', function () {
    $product = Products::factory()->make();

    post(route('dashboard.product.store'), [
        'category_id' => $product->category_id,
        'sku' => 'UPLOAD-001',
        'name' => $product->name,
        'slug' => 'upload-001',
        'description' => $product->description,
        'material' => $product->material,
        'is_active' => true,
        'images' => [UploadedFile::fake()->image('product.jpg')],
        'files' => [UploadedFile::fake()->create('catalog.pdf', 100, 'application/pdf')],
    ])->assertSessionHasNoErrors();

    $storedProduct = Products::query()->where('sku', 'UPLOAD-001')->firstOrFail();
    $image = $storedProduct->images()->sole();
    $file = $storedProduct->files()->sole();

    expect($image->is_thumbnail)->toBeTrue()
        ->and($file->is_downloadable)->toBeTrue();
    Storage::disk('public')->assertExists($image->image_path);
    Storage::disk('public')->assertExists($file->file_path);
});

test('rejects more than one image or file for a product', function () {
    $product = Products::factory()->make();

    post(route('dashboard.product.store'), [
        'category_id' => $product->category_id,
        'sku' => 'UPLOAD-002',
        'name' => $product->name,
        'slug' => 'upload-002',
        'description' => $product->description,
        'material' => $product->material,
        'is_active' => true,
        'images' => [
            UploadedFile::fake()->image('first.jpg'),
            UploadedFile::fake()->image('second.jpg'),
        ],
        'files' => [
            UploadedFile::fake()->create('first.pdf', 100, 'application/pdf'),
            UploadedFile::fake()->create('second.pdf', 100, 'application/pdf'),
        ],
    ])->assertSessionHasErrors(['images', 'files']);

    expect(Products::query()->where('sku', 'UPLOAD-002')->exists())->toBeFalse();
});

test('requires existing assets to be deleted before replacements are uploaded', function () {
    $product = Products::factory()->create();
    $image = ProductImages::factory()->for($product, 'product')->create();
    $file = ProductFiles::factory()->for($product, 'product')->create();

    post(route('dashboard.product.update', $product), [
        '_method' => 'put',
        'category_id' => $product->category_id,
        'sku' => $product->sku,
        'name' => $product->name,
        'slug' => $product->slug,
        'description' => $product->description,
        'material' => $product->material,
        'is_active' => $product->is_active,
        'images' => [UploadedFile::fake()->image('replacement.jpg')],
        'files' => [UploadedFile::fake()->create('replacement.pdf', 100, 'application/pdf')],
    ])->assertSessionHasErrors(['images', 'files']);

    expect($product->images()->pluck('id')->all())->toBe([$image->id])
        ->and($product->files()->pluck('id')->all())->toBe([$file->id]);
});
