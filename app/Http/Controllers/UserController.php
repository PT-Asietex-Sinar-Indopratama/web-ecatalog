<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = Users::with('roles:id,name');

        if ($request->filled('search')) {
            $query->where(function ($query) use ($request) {
                $query->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        $users = $query->orderBy('updated_at', 'desc')
            ->paginate(7)
            ->withQueryString();

        $roles = Role::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Dashboard/User/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'is_active' => 'required|boolean',
            'role' => 'required|exists:roles,name',
        ]);

        $user = Users::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'is_active' => $request->is_active,
        ]);

        $user->syncRoles([$request->role]);

        return redirect()
            ->route('dashboard.user')
            ->with('flash', [
                'type' => 'success',
                'message' => "User '{$request->name}' has been added.",
            ]);
    }

    public function update(Request $request, string $id)
    {
        $user = Users::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'is_active' => 'required|boolean',
            'role' => 'required|exists:roles,name',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'is_active' => $request->is_active,
        ];

        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $user->update($data);
        $user->syncRoles([$request->role]);

        return redirect()
            ->route('dashboard.user')
            ->with('flash', [
                'type' => 'success',
                'message' => "User '{$request->name}' has been updated.",
            ]);
    }

    public function destroy(string $id)
    {
        $user = Users::findOrFail($id);
        $user->delete();

        return redirect()
            ->route('dashboard.user')
            ->with('flash', [
                'type' => 'success',
                'message' => "User '{$user->name}' has been deleted.",
            ]);
    }
}
