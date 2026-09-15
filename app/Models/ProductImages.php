<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'product_id',
    'image_path',
])]
class ProductImages extends Model
{
    use HasFactory, Notifiable;
}
