<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\RequestQuotations;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RequestQuotationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = RequestQuotations::query()->with('product:id,name,sku');

        if ($request->filled('search')) {
            $query->where(function ($query) use ($request) {
                $search = '%'.$request->search.'%';

                $query->where('customer_name', 'like', $search)
                    ->orWhere('customer_phone', 'like', $search)
                    ->orWhere('company_name', 'like', $search)
                    ->orWhere('product_name', 'like', $search)
                    ->orWhere('product_sku', 'like', $search);
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $sortableColumns = [
            'created_at',
            'customer_name',
            'product_name',
            'quantity',
            'status',
        ];

        $sort = $request->string('sort', 'created_at')->toString();
        $direction = $request->string('direction', 'desc')->toString();

        if (! in_array($sort, $sortableColumns, true)) {
            $sort = 'created_at';
        }

        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        $quotations = $query
            ->orderBy($sort, $direction)
            ->orderBy('id', $direction)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Dashboard/RequestQuotation/Index', [
            'quotations' => $quotations,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', 'all'),
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function store(Request $request, Products $product): RedirectResponse
    {
        abort_unless($product->is_active, 404);

        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:2147483647'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $quotation = RequestQuotations::create([
            ...$validated,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'status' => 'new',
        ]);

        $message = collect([
            'Halo, saya ingin meminta penawaran untuk produk berikut:',
            '',
            "Produk: {$quotation->product_name}",
            "SKU: {$quotation->product_sku}",
            "Nama: {$quotation->customer_name}",
            "No. WhatsApp: {$quotation->customer_phone}",
            $quotation->company_name ? "Perusahaan: {$quotation->company_name}" : null,
            $quotation->quantity ? "Jumlah: {$quotation->quantity}" : null,
            $quotation->notes ? "Catatan: {$quotation->notes}" : null,
        ])->filter()->implode("\n");

        $whatsappUrl = 'https://wa.me/'.config('services.sales.whatsapp_number').'?text='.urlencode($message);

        return redirect()->route('product.show', $product)->with('flash', [
            'type' => 'success',
            'message' => 'Permintaan penawaran berhasil disimpan.',
            'whatsapp_url' => $whatsappUrl,
        ]);
    }
}
