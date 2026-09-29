<?php

namespace App\Http\Controllers;

use App\Models\ProductCategories;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ProductCategories::query()->with('parent:id,name');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        $category = $query->orderBy('updated_at', 'desc')
            ->paginate(7)
            ->withQueryString();

        return Inertia::render('Dashboard/ProductCategory/Index', [
            'category' => $category,
            'categoryOptions' => ProductCategories::hierarchyOptions(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Dashboard/ProductCategory/FormCreateEdit', [
            'categories' => ProductCategories::hierarchyOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'parent_id' => ['nullable', 'integer', 'exists:product_categories,id'],
            'name' => 'required|string|max:255',
            'slug' => ['required', 'string', 'max:255', 'unique:product_categories,slug'],
            'description' => 'required|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        ProductCategories::create($validated);

        return redirect()
            ->route('dashboard.product-category')
            ->with('flash', [
                'type' => 'success',
                'message' => "Product Category '{$validated['name']}' has been added.",
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
            'categories' => ProductCategories::hierarchyOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = ProductCategories::findOrFail($id);
        $validated = $request->validate([
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists('product_categories', 'id'),
                Rule::notIn([$category->id]),
            ],
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('product_categories', 'slug')->ignore($category->id),
            ],
            'description' => 'required|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $parentId = isset($validated['parent_id'])
            ? (int) $validated['parent_id']
            : null;

        $this->ensureParentDoesNotCreateCycle($category, $parentId);
        $category->update($validated);

        return redirect()
            ->route('dashboard.product-category')
            ->with('flash', [
                'type' => 'success',
                'message' => "Product Category '{$validated['name']}' has been updated.",
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

    private function ensureParentDoesNotCreateCycle(
        ProductCategories $category,
        ?int $parentId,
    ): void {
        $visited = [];

        while ($parentId !== null) {
            if ($parentId === $category->id || isset($visited[$parentId])) {
                throw ValidationException::withMessages([
                    'parent_id' => 'The selected parent would create a circular category hierarchy.',
                ]);
            }

            $visited[$parentId] = true;
            $nextParentId = ProductCategories::query()
                ->whereKey($parentId)
                ->value('parent_id');
            $parentId = $nextParentId === null ? null : (int) $nextParentId;
        }
    }
}
