<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'parent_id',
    'name',
    'slug',
    'description',
    'is_active',
])]
class ProductCategories extends Model
{
    use HasFactory, Notifiable;

    /**
     * @return BelongsTo<ProductCategories, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * @return HasMany<ProductCategories, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    /**
     * @return HasMany<Products, $this>
     */
    public function products(): HasMany
    {
        return $this->hasMany(Products::class, 'category_id');
    }

    /**
     * @return array<int, array{id: int, parent_id: int|null, name: string, label: string}>
     */
    public static function hierarchyOptions(bool $activeOnly = false): array
    {
        $categories = self::query()
            ->orderBy('name')
            ->get(['id', 'parent_id', 'name', 'is_active']);
        $categoriesByParent = $categories->groupBy(
            fn (self $category): int => $category->parent_id ?? 0,
        );
        $options = [];
        $visited = [];

        $appendChildren = function (int $parentId, array $path) use (
            &$appendChildren,
            &$options,
            &$visited,
            $categoriesByParent,
            $activeOnly,
        ): void {
            foreach ($categoriesByParent->get($parentId, collect()) as $category) {
                if (isset($visited[$category->id])) {
                    continue;
                }

                $visited[$category->id] = true;
                $categoryPath = [...$path, $category->name];

                if (! $activeOnly || $category->is_active) {
                    $options[] = [
                        'id' => $category->id,
                        'parent_id' => $category->parent_id,
                        'name' => $category->name,
                        'label' => implode(' / ', $categoryPath),
                    ];
                }

                $appendChildren($category->id, $categoryPath);
            }
        };

        $appendChildren(0, []);

        return $options;
    }

    /**
     * @param  array<int, int|string>  $categoryIds
     * @return array<int, int>
     */
    public static function idsIncludingDescendants(array $categoryIds): array
    {
        $childrenByParent = self::query()
            ->get(['id', 'parent_id'])
            ->groupBy(fn (self $category): int => $category->parent_id ?? 0);
        $ids = array_values(array_unique(array_map('intval', $categoryIds)));
        $queue = $ids;

        while ($queue !== []) {
            $parentId = array_shift($queue);

            foreach ($childrenByParent->get($parentId, collect()) as $child) {
                if (! in_array($child->id, $ids, true)) {
                    $ids[] = $child->id;
                    $queue[] = $child->id;
                }
            }
        }

        return $ids;
    }

    /**
     * @return array{is_active: 'boolean'}
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
