<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'product_id',
    'product_name',
    'product_sku',
    'customer_name',
    'customer_phone',
    'company_name',
    'quantity',
    'notes',
    'status',
    'closed_reason',
    'admin_notes',
    'status_changed_by',
    'status_changed_at',
])]
class RequestQuotations extends Model
{
    use HasFactory;

    /**
     * @return BelongsTo<Products, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class);
    }

    /**
     * @return BelongsTo<Users, $this>
     */
    public function statusChangedBy(): BelongsTo
    {
        return $this->belongsTo(Users::class, 'status_changed_by');
    }

    protected function casts(): array
    {
        return [
            'status_changed_at' => 'datetime',
        ];
    }
}
