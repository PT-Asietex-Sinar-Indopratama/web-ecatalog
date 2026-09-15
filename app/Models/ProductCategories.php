<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
class ProductCategories extends Model
{
    use HasFactory, Notifiable;
}
