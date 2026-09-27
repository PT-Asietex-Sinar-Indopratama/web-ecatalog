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
    'file_path',
    'file_name',
    'file_type',
    'is_downloadable',
])]
class ProductFiles extends Model
{
    use HasFactory, Notifiable;

    protected $appends = [
        'file_url',
    ];

    protected function casts(): array
    {
        return [
            'is_downloadable' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public function getFileUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->file_path);
    }
}
