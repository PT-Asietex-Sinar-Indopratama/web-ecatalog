<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load('roles:id,name');

        return Inertia::render('Profile/Index', [
            'profile' => $user,
        ]);
    }
}
