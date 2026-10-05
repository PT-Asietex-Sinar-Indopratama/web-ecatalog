<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\RequestQuotations;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RequestQuotationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = RequestQuotations::query()
            ->with([
                'product:id,name,sku',
                'statusChangedBy:id,name',
            ]);

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

    /**
     * Update status inquiry oleh Staff atau Admin.
     * Status: new → in_progress → closed (membutuhkan closed_reason: won|lost|invalid).
     * Juga mendukung membuka kembali inquiry yang sudah closed ke in_progress.
     */
    public function updateStatus(Request $request, RequestQuotations $quotation): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:new,in_progress,closed'],
            'closed_reason' => [
                'nullable',
                'string',
                'in:won,lost,invalid',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->status === 'closed' && empty($value)) {
                        $fail('Alasan penutupan wajib diisi saat menutup inquiry.');
                    }
                },
            ],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
            'updated_at' => ['required', 'date'], // Optimistic concurrency check
        ]);

        // Optimistic concurrency: cegah dua user memperbarui data yang sama secara bersamaan
        if ($quotation->updated_at->toISOString() !== $validated['updated_at']) {
            throw ValidationException::withMessages([
                'conflict' => 'Data inquiry telah diubah oleh pengguna lain. Muat ulang halaman untuk melihat data terbaru.',
            ]);
        }

        $updateData = [
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? $quotation->admin_notes,
            'status_changed_by' => Auth::id(),
            'status_changed_at' => now(),
        ];

        // Hanya simpan closed_reason saat status closed; hapus saat dibuka kembali
        if ($validated['status'] === 'closed') {
            $updateData['closed_reason'] = $validated['closed_reason'];
        } elseif ($quotation->status === 'closed') {
            $updateData['closed_reason'] = null;
        }

        $quotation->update($updateData);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Status inquiry berhasil diperbarui.',
        ]);
    }
}
