<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'product_id',
    'file_path',
    'file_name',
    'file_type',
])]
class ProductFiles extends Model
{
    use HasFactory, Notifiable;
}
