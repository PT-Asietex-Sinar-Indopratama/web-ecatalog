<?php

namespace App\Http\Controllers;

use App\Models\ProductCategories;
use App\Models\ProductFiles;
use App\Models\ProductImages;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Products::with([
            'category:id,name',
            'images:id,product_id,image_path,is_thumbnail',
            'files:id,product_id,file_path,file_name,file_type,is_downloadable',
            'thumbnailImage:id,product_id,image_path,is_thumbnail',
            'downloadableFile:id,product_id,file_path,file_name,file_type,is_downloadable',
        ]);

        if ($request->routeIs('main')) {
            $query->where('is_active', true);
        }

        if ($request->filled('search')) {
            $search = '%'.addcslashes(strtolower(trim($request->search)), '%_\\').'%';

            $query->where(function ($query) use ($search) {
                $query->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(sku) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(material) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(description) LIKE ?', [$search])
                    ->orWhereHas('category', function ($query) use ($search) {
                        $query->whereRaw('LOWER(name) LIKE ?', [$search])
                            ->orWhereRaw('LOWER(slug) LIKE ?', [$search]);
                    });
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        if ($request->filled('categories')) {
            $categories = $request->input('categories');
            $categories = is_array($categories) ? $categories : [$categories];

            $query->whereIn(
                'category_id',
                ProductCategories::idsIncludingDescendants($categories),
            );
        }

        $sort = $request->string('sort', 'latest')->toString();

        if (! in_array($sort, ['latest', 'oldest', 'name_asc', 'name_desc'], true)) {
            $sort = 'latest';
        }

        match ($sort) {
            'oldest' => $query->orderBy('updated_at')->orderBy('id'),
            'name_asc' => $query->orderBy('name')->orderBy('id'),
            'name_desc' => $query->orderByDesc('name')->orderByDesc('id'),
            default => $query->orderByDesc('updated_at')->orderByDesc('id'),
        };

        $products = $query
            ->paginate(7)
            ->appends($request->except('view_mode'));

        if ($request->routeIs('main')) {
            $categories = ProductCategories::hierarchyOptions(activeOnly: true);

            return Inertia::render('Index', [
                'products' => $products,
                'categories' => $categories,
                'filters' => [
                    'search' => $request->input('search', ''),
                    'categories' => $request->input('categories', []),
                    'sort' => $sort,
                ],
            ]);
        }

        $categories = ProductCategories::hierarchyOptions(activeOnly: true);

        return Inertia::render('Dashboard/Product/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = ProductCategories::hierarchyOptions(activeOnly: true);

        return Inertia::render('Dashboard/Product/FormCreateEdit', [
            'categories' => $categories,
        ]);
    }

    public function images(Request $request)
    {
        $query = ProductImages::with('product:id,name,sku');

        if ($request->filled('search')) {
            $query->where(function ($query) use ($request) {
                $query->where('image_path', 'like', '%'.$request->search.'%')
                    ->orWhereHas('product', function ($query) use ($request) {
                        $query->where('name', 'like', '%'.$request->search.'%')
                            ->orWhere('sku', 'like', '%'.$request->search.'%');
                    });
            });
        }

        $images = $query->orderBy('updated_at', 'desc')
            ->paginate(8)
            ->appends($request->only('search'));

        return Inertia::render('Dashboard/ProductImage/Index', [
            'images' => $images,
            'filters' => $request->only('search'),
        ]);
    }

    public function files(Request $request)
    {
        $query = ProductFiles::with('product:id,name,sku');

        if ($request->filled('search')) {
            $query->where(function ($query) use ($request) {
                $query->where('file_name', 'like', '%'.$request->search.'%')
                    ->orWhere('file_path', 'like', '%'.$request->search.'%')
                    ->orWhereHas('product', function ($query) use ($request) {
                        $query->where('name', 'like', '%'.$request->search.'%')
                            ->orWhere('sku', 'like', '%'.$request->search.'%');
                    });
            });
        }

        $files = $query->orderBy('updated_at', 'desc')
            ->paginate(8)
            ->appends($request->only('search'));

        return Inertia::render('Dashboard/ProductFile/Index', [
            'files' => $files,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:product_categories,id',
            'sku' => 'required|string|max:255|unique:products,sku',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'description' => 'nullable|string',
            'material' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'images' => 'nullable|array|max:1',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'files' => 'nullable|array|max:1',
            'files.*' => 'file|mimes:pdf|max:10240',
        ]);

        DB::transaction(function () use ($request) {
            $product = Products::create([
                'category_id' => $request->category_id,
                'sku' => $request->sku,
                'name' => $request->name,
                'slug' => $request->slug,
                'description' => $request->description,
                'material' => $request->material,
                'is_active' => $request->is_active,
                'created_by' => Auth::id(),
            ]);

            $this->storeProductImages($request, $product);
            $this->storeProductFiles($request, $product);
        });

        return redirect()
            ->route('dashboard.product')
            ->with('flash', [
                'type' => 'success',
                'message' => "Product '{$request->sku} {$request->name}' has been added.",
            ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Products $product)
    {
        abort_unless($product->is_active, 404);

        $product->load([
            'category:id,parent_id,name,slug',
            'category.parent:id,name,slug',
            'thumbnailImage:id,product_id,image_path,is_thumbnail',
            'downloadableFile:id,product_id,file_path,file_name,file_type,is_downloadable',
        ]);

        return Inertia::render('Product/Index', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Products::with(['images:id,product_id,image_path,is_thumbnail', 'files:id,product_id,file_path,file_name,file_type,is_downloadable'])->findOrFail($id);
        $categories = ProductCategories::hierarchyOptions(activeOnly: true);

        return Inertia::render('Dashboard/Product/FormCreateEdit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Products::findOrFail($id);

        $request->validate([
            'category_id' => 'required|exists:product_categories,id',
            'sku' => 'required|string|max:255|unique:products,sku,'.$id,
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'description' => 'nullable|string',
            'material' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'images' => 'nullable|array|max:1',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'files' => 'nullable|array|max:1',
            'files.*' => 'file|mimes:pdf|max:10240',
        ]);

        $assetErrors = [];

        if ($request->hasFile('images') && $product->images()->exists()) {
            $assetErrors['images'] = 'Delete the existing product image before uploading a new one.';
        }

        if ($request->hasFile('files') && $product->files()->exists()) {
            $assetErrors['files'] = 'Delete the existing product file before uploading a new one.';
        }

        if ($assetErrors !== []) {
            throw ValidationException::withMessages($assetErrors);
        }

        DB::transaction(function () use ($request, $product) {
            $product->update([
                'category_id' => $request->category_id,
                'sku' => $request->sku,
                'name' => $request->name,
                'slug' => $request->slug,
                'description' => $request->description,
                'material' => $request->material,
                'is_active' => $request->is_active,
            ]);

            $this->storeProductImages($request, $product);
            $this->storeProductFiles($request, $product);
        });

        return redirect()
            ->route('dashboard.product')
            ->with('flash', [
                'type' => 'success',
                'message' => "Product '{$product->sku} {$product->name}' has been updated.",
            ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Products::with(['images', 'files'])->findOrFail($id);

        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        foreach ($product->files as $file) {
            Storage::disk('public')->delete($file->file_path);
        }

        $product->delete();

        return redirect()
            ->route('dashboard.product')
            ->with('flash', [
                'type' => 'success',
                'message' => "Product '{$product->sku} {$product->name}' has been deleted.",
            ]);
    }

    public function destroyImage(ProductImages $image)
    {
        $product = $image->product;
        $wasThumbnail = $image->is_thumbnail;

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        if ($wasThumbnail) {
            $replacement = $product->images()->first();

            if ($replacement) {
                $replacement->update(['is_thumbnail' => true]);
            }
        }

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Product image has been deleted.',
        ]);
    }

    public function destroyFile(ProductFiles $file)
    {
        $product = $file->product;
        $wasDownloadable = $file->is_downloadable;

        Storage::disk('public')->delete($file->file_path);
        $file->delete();

        if ($wasDownloadable) {
            $replacement = $product->files()->first();

            if ($replacement) {
                $replacement->update(['is_downloadable' => true]);
            }
        }

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Product file has been deleted.',
        ]);
    }

    private function storeProductImages(Request $request, Products $product): void
    {
        $image = $request->file('images.0');

        if (! $image) {
            return;
        }

        $path = $image->store('products/images', 'public');

        $product->images()->create([
            'image_path' => $path,
            'is_thumbnail' => true,
        ]);
    }

    private function storeProductFiles(Request $request, Products $product): void
    {
        $file = $request->file('files.0');

        if (! $file) {
            return;
        }

        $path = $file->store('products/files', 'public');

        $product->files()->create([
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => 'pdf',
            'is_downloadable' => true,
        ]);
    }
}
