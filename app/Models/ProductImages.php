<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'product_id',
    'image_path',
    'is_thumbnail',
])]
class ProductImages extends Model
{
    use HasFactory, Notifiable;

    protected $appends = [
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'is_thumbnail' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public function getImageUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->image_path);
    }
}
