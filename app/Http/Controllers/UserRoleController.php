<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserRoleController extends Controller
{
    public function index(Request $request)
    {
        $query = Role::query()->withCount('users')->with('permissions:id,name');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        $sortableColumns = [
            'name',
            'users_count',
            'updated_at',
        ];

        $sort = $request->string('sort', 'updated_at')->toString();
        $direction = $request->string('direction', 'desc')->toString();

        if (! in_array($sort, $sortableColumns, true)) {
            $sort = 'updated_at';
        }

        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        $roles = $query->orderBy($sort, $direction)
            ->orderBy('id', $direction)
            ->paginate(7)
            ->withQueryString();

        $allPermissions = Permission::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Dashboard/UserRole/Index', [
            'roles' => $roles,
            'allPermissions' => $allPermissions,
            'filters' => [
                'search' => $request->input('search', ''),
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web',
        ]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()
            ->route('dashboard.user-role')
            ->with('flash', [
                'type' => 'success',
                'message' => "User Role '{$request->name}' has been added.",
            ]);
    }

    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,'.$role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role->update([
            'name' => $request->name,
        ]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()
            ->route('dashboard.user-role')
            ->with('flash', [
                'type' => 'success',
                'message' => "User Role '{$request->name}' has been updated.",
            ]);
    }

    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return redirect()
            ->route('dashboard.user-role')
            ->with('flash', [
                'type' => 'success',
                'message' => "User Role '{$role->name}' has been deleted.",
            ]);
    }
}
