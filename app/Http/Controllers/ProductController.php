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

            $query->whereIn('category_id', $categories);
        }

        $products = $query->orderBy('updated_at', 'desc')
            ->paginate(7)
            ->appends($request->except('view_mode'));

        if ($request->routeIs('main')) {
            $categories = ProductCategories::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']);

            return Inertia::render('Index', [
                'products' => $products,
                'categories' => $categories,
                'filters' => [
                    'search' => $request->input('search', ''),
                    'categories' => $request->input('categories', []),
                ],
            ]);
        }

        $categories = ProductCategories::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

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
        $categories = ProductCategories::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

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
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'files' => 'nullable|array',
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
                'message' => "Product '{$request->name}' has been added.",
            ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Products::with(['images:id,product_id,image_path,is_thumbnail', 'files:id,product_id,file_path,file_name,file_type,is_downloadable'])->findOrFail($id);
        $categories = ProductCategories::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

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
        $request->validate([
            'category_id' => 'required|exists:product_categories,id',
            'sku' => 'required|string|max:255|unique:products,sku,'.$id,
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'description' => 'nullable|string',
            'material' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'files' => 'nullable|array',
            'files.*' => 'file|mimes:pdf|max:10240',
            'thumbnail_image_id' => 'nullable|exists:product_images,id',
            'download_file_id' => 'nullable|exists:product_files,id',
        ]);

        DB::transaction(function () use ($request, $id) {
            $product = Products::findOrFail($id);

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
            $this->setThumbnailImage($product, $request->thumbnail_image_id);
            $this->setDownloadableFile($product, $request->download_file_id);
        });

        return redirect()
            ->route('dashboard.product')
            ->with('flash', [
                'type' => 'success',
                'message' => "Product '{$request->name}' has been updated.",
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
                'message' => "Product '{$product->name}' has been deleted.",
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

    public function setThumbnail(ProductImages $image)
    {
        $this->setThumbnailImage($image->product, $image->id);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Product thumbnail has been updated.',
        ]);
    }

    public function setDownloadFile(ProductFiles $file)
    {
        $this->setDownloadableFile($file->product, $file->id);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Product download file has been updated.',
        ]);
    }

    private function storeProductImages(Request $request, Products $product): void
    {
        if (! $request->hasFile('images')) {
            return;
        }

        foreach ($request->file('images') as $image) {
            $path = $image->store('products/images', 'public');

            $product->images()->create([
                'image_path' => $path,
                'is_thumbnail' => ! $product->images()->exists(),
            ]);
        }
    }

    private function storeProductFiles(Request $request, Products $product): void
    {
        if (! $request->hasFile('files')) {
            return;
        }

        foreach ($request->file('files') as $file) {
            $path = $file->store('products/files', 'public');

            $product->files()->create([
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => 'pdf',
                'is_downloadable' => ! $product->files()->exists(),
            ]);
        }
    }

    private function setThumbnailImage(Products $product, int|string|null $imageId): void
    {
        if (! $imageId) {
            return;
        }

        $image = $product->images()->whereKey($imageId)->first();

        if (! $image) {
            return;
        }

        $product->images()->update(['is_thumbnail' => false]);
        $image->update(['is_thumbnail' => true]);
    }

    private function setDownloadableFile(Products $product, int|string|null $fileId): void
    {
        if (! $fileId) {
            return;
        }

        $file = $product->files()->whereKey($fileId)->first();

        if (! $file) {
            return;
        }

        $product->files()->update(['is_downloadable' => false]);
        $file->update(['is_downloadable' => true]);
    }
}
