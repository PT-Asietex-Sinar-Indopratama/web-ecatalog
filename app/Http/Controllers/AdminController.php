<?php

namespace App\Http\Controllers;

use App\Models\ProductCategories;
use App\Models\Products;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $latestProducts = Products::with([
            'category:id,name',
            'images:id,product_id,image_path,is_thumbnail',
            'files:id,product_id,file_path,file_name,file_type,is_downloadable',
        ])
            ->latest('updated_at')
            ->limit(5)
            ->get([
                'id',
                'category_id',
                'sku',
                'name',
                'slug',
                'description',
                'material',
                'is_active',
                'updated_at',
            ]);
        $categories = ProductCategories::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'total_products' => Products::count(),
                'active_products' => Products::where('is_active', true)->count(),
                'active_categories' => ProductCategories::where('is_active', true)->count(),
                'missing_download_files' => Products::doesntHave('downloadableFile')->count(),
            ],
            'needsAttention' => [
                'missing_thumbnail' => Products::doesntHave('thumbnailImage')->count(),
                'missing_download_file' => Products::doesntHave('downloadableFile')->count(),
                'missing_description' => Products::whereNull('description')
                    ->orWhere('description', '')
                    ->count(),
                'inactive_products' => Products::where('is_active', false)->count(),
            ],
            'latestProducts' => $latestProducts,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
