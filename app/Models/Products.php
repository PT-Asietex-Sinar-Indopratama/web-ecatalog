<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'category_id',
    'sku',
    'name',
    'slug',
    'description',
    'material',
    'is_active',
    'created_by',
])]
class Products extends Model
{
    use HasFactory, Notifiable;

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategories::class, 'category_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImages::class, 'product_id');
    }

    public function thumbnailImage(): HasOne
    {
        return $this->hasOne(ProductImages::class, 'product_id')->where('is_thumbnail', true);
    }

    public function files(): HasMany
    {
        return $this->hasMany(ProductFiles::class, 'product_id');
    }

    public function downloadableFile(): HasOne
    {
        return $this->hasOne(ProductFiles::class, 'product_id')->where('is_downloadable', true);
    }
}
