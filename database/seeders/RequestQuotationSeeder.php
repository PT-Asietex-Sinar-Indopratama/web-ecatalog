<?php

namespace Database\Seeders;

use App\Models\Products;
use App\Models\RequestQuotations;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class RequestQuotationSeeder extends Seeder
{
    /**
     * Seed request quotations across September and October.
     */
    public function run(): void
    {
        $products = Products::query()
            ->orderBy('id')
            ->limit(10)
            ->get(['id', 'name', 'sku']);

        if ($products->isEmpty()) {
            return;
        }

        $quotations = [
            [
                'customer_name' => 'Bruno Fernandes',
                'customer_phone' => '628121110001',
                'company_name' => 'PT Sinar Textile',
                'quantity' => 250,
                'notes' => 'Need quotation for company event uniforms.',
                'status' => 'new',
                'created_at' => '2026-09-03 09:15:00',
            ],
            [
                'customer_name' => 'Matheus Cunha',
                'customer_phone' => '628121110002',
                'company_name' => 'CV Maju Bersama',
                'quantity' => 120,
                'notes' => 'Please include available color options.',
                'status' => 'in_progress',
                'admin_notes' => 'Sales team has contacted the customer.',
                'status_changed_at' => '2026-09-08 13:30:00',
                'created_at' => '2026-09-08 10:45:00',
            ],
            [
                'customer_name' => 'Bryan Mbeumo',
                'customer_phone' => '628121110003',
                'company_name' => 'Komunitas Lari Utara',
                'quantity' => 80,
                'notes' => 'Looking for breathable material.',
                'status' => 'closed',
                'closed_reason' => 'won',
                'admin_notes' => 'Customer approved the quotation.',
                'status_changed_at' => '2026-09-12 16:00:00',
                'created_at' => '2026-09-10 14:20:00',
            ],
            [
                'customer_name' => 'Benjamin Šeško',
                'customer_phone' => '628121110004',
                'company_name' => null,
                'quantity' => 35,
                'notes' => 'Need sample pricing first.',
                'status' => 'new',
                'created_at' => '2026-09-18 11:05:00',
            ],
            [
                'customer_name' => 'Marcus Rashford',
                'customer_phone' => '628121110005',
                'company_name' => 'PT Garuda Event',
                'quantity' => 500,
                'notes' => 'Bulk order for October campaign.',
                'status' => 'in_progress',
                'admin_notes' => 'Waiting for customer quantity confirmation.',
                'status_changed_at' => '2026-09-24 15:10:00',
                'created_at' => '2026-09-24 08:40:00',
            ],
            [
                'customer_name' => 'Harry Maguire',
                'customer_phone' => '628121110006',
                'company_name' => 'Koperasi Sekolah Mandiri',
                'quantity' => 200,
                'notes' => 'Need durable material for daily use.',
                'status' => 'closed',
                'closed_reason' => 'lost',
                'admin_notes' => 'Customer chose another supplier.',
                'status_changed_at' => '2026-10-02 10:25:00',
                'created_at' => '2026-10-01 09:30:00',
            ],
            [
                'customer_name' => 'Lisandro Martínez',
                'customer_phone' => '628121110007',
                'company_name' => 'PT Prima Logistic',
                'quantity' => 150,
                'notes' => 'Requesting quotation for field staff uniforms.',
                'status' => 'new',
                'created_at' => '2026-10-04 13:55:00',
            ],
            [
                'customer_name' => 'Diogo Dalot',
                'customer_phone' => '628121110008',
                'company_name' => 'Studio Kreatif Awan',
                'quantity' => 60,
                'notes' => 'Interested in custom branding options.',
                'status' => 'in_progress',
                'admin_notes' => 'Design requirement discussed.',
                'status_changed_at' => '2026-10-06 11:15:00',
                'created_at' => '2026-10-06 10:00:00',
            ],
            [
                'customer_name' => 'Kobbie Mainoo',
                'customer_phone' => '628121110009',
                'company_name' => null,
                'quantity' => 25,
                'notes' => 'Checking minimum order quantity.',
                'status' => 'closed',
                'closed_reason' => 'invalid',
                'admin_notes' => 'Request did not meet minimum inquiry details.',
                'status_changed_at' => '2026-10-12 09:45:00',
                'created_at' => '2026-10-11 17:20:00',
            ],
            [
                'customer_name' => 'Luke Shaw',
                'customer_phone' => '628121110010',
                'company_name' => 'PT Nusantara Retail',
                'quantity' => 320,
                'notes' => 'Need quotation for multiple store uniforms.',
                'status' => 'new',
                'created_at' => '2026-10-18 14:35:00',
            ],
        ];

        foreach ($quotations as $index => $quotation) {
            $product = $products[$index % $products->count()];
            $createdAt = Carbon::parse($quotation['created_at']);
            $statusChangedAt = isset($quotation['status_changed_at'])
                ? Carbon::parse($quotation['status_changed_at'])
                : null;

            $requestQuotation = new RequestQuotations([
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_sku' => $product->sku,
                'customer_name' => $quotation['customer_name'],
                'customer_phone' => $quotation['customer_phone'],
                'company_name' => $quotation['company_name'],
                'quantity' => $quotation['quantity'],
                'notes' => $quotation['notes'],
                'status' => $quotation['status'],
                'closed_reason' => $quotation['closed_reason'] ?? null,
                'admin_notes' => $quotation['admin_notes'] ?? null,
                'status_changed_at' => $statusChangedAt,
            ]);
            $requestQuotation->created_at = $createdAt;
            $requestQuotation->updated_at = $statusChangedAt ?? $createdAt;
            $requestQuotation->save();
        }
    }
}
