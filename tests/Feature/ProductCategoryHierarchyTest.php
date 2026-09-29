<?php

use App\Models\ProductCategories;

test('builds category hierarchy options and includes descendants in filters', function () {
    $parent = ProductCategories::create([
        'name' => 'Apparel',
        'slug' => 'apparel',
        'description' => 'All apparel products.',
        'is_active' => true,
    ]);
    $child = ProductCategories::create([
        'parent_id' => $parent->id,
        'name' => 'T-Shirts',
        'slug' => 't-shirts',
        'description' => 'T-shirt products.',
        'is_active' => true,
    ]);
    $grandchild = ProductCategories::create([
        'parent_id' => $child->id,
        'name' => 'Oversize',
        'slug' => 'oversize',
        'description' => 'Oversize T-shirt products.',
        'is_active' => true,
    ]);

    $options = collect(ProductCategories::hierarchyOptions())->keyBy('id');

    expect($options[$parent->id]['label'])->toBe('Apparel')
        ->and($options[$child->id]['label'])->toBe('Apparel / T-Shirts')
        ->and($options[$grandchild->id]['label'])->toBe('Apparel / T-Shirts / Oversize')
        ->and(ProductCategories::idsIncludingDescendants([$parent->id]))
        ->toEqualCanonicalizing([$parent->id, $child->id, $grandchild->id])
        ->and($child->parent->is($parent))->toBeTrue()
        ->and($parent->children->contains($child))->toBeTrue();
});
