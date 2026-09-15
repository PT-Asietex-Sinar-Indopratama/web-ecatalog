<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ProductCategories;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ProductCategories::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        $category = $query->orderBy('updated_at', 'desc')
            ->paginate(7)
            ->withQueryString();

        return Inertia::render('Dashboard/ProductCategory/Index', [
            'category' => $category,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    
    /**
     * Show the form for creating a new resource.
    */
    public function create()
    {
        return Inertia::render('Dashboard/ProductCategory/FormCreateEdit');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'is_active' => 'required|boolean',
        ]);
        ProductCategories::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'is_active' => $request->is_active,
        ]);
        return redirect()
        ->route('dashboard.product-category')
        ->with('flash', [
            'type' => 'success',
            'message' => "Product Category '{$request->name}' has been added.",
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
        $category = ProductCategories::findOrFail($id);
        return Inertia::render('Dashboard/ProductCategory/FormCreateEdit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
         $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'is_active' => 'required|boolean',
        ]);
        ProductCategories::where('id', $id)->update([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'is_active' => $request->is_active,
        ]);
        return redirect()
        ->route('dashboard.product-category')
        ->with('flash', [
            'type' => 'success',
            'message' => "Product Category '{$request->name}' has been updated.",
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = ProductCategories::findOrFail($id);
        $category->delete();
        return redirect()
        ->route('dashboard.product-category')
        ->with('flash', [
            'type' => 'success',
            'message' => "Product Category '{$category->name}' has been deleted.",
        ]);
    }
}
