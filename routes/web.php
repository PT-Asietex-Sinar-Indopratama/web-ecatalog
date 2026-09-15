<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Public route
Route::get('/', [ProductController::class, 'index'])->name('main');

// Guest only
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'index'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Dashboard — hanya untuk role admin (via Spatie)
    Route::middleware('role:admin')->prefix('/dashboard')->name('dashboard.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('main');

        Route::get('/product_category', [ProductCategoryController::class, 'index'])->name('product-category');
        Route::get('/product_category/create', [ProductCategoryController::class, 'create'])->name('product-category.create');
        Route::post('/product_category/store', [ProductCategoryController::class, 'store'])->name('product-category.store');
        Route::get('/product_category/edit/{id}', [ProductCategoryController::class, 'edit'])->name('product-category.edit');
        Route::put('/product_category/update/{id}', [ProductCategoryController::class, 'update'])->name('product-category.update');
        Route::delete('/product_category/delete/{id}', [ProductCategoryController::class, 'destroy'])->name('product-category.destroy');
    });
});