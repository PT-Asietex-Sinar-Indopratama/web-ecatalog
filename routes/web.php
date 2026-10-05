<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestQuotationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Support\Facades\Route;

// Public route
Route::get('/', [ProductController::class, 'index'])->name('main');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('product.show');
Route::post('/products/{product}/request-quotation', [RequestQuotationController::class, 'store'])
    ->name('product.quotation.store');

// Guest only
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'index'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');

    // Dashboard — hanya untuk role admin (via Spatie)
    Route::middleware('role:admin')->prefix('/dashboard')->name('dashboard.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('main');

        Route::get('/product_category', [ProductCategoryController::class, 'index'])->name('product-category');
        Route::get('/product_category/create', [ProductCategoryController::class, 'create'])->name('product-category.create');
        Route::post('/product_category/store', [ProductCategoryController::class, 'store'])->name('product-category.store');
        Route::get('/product_category/edit/{id}', [ProductCategoryController::class, 'edit'])->name('product-category.edit');
        Route::put('/product_category/update/{id}', [ProductCategoryController::class, 'update'])->name('product-category.update');
        Route::delete('/product_category/delete/{id}', [ProductCategoryController::class, 'destroy'])->name('product-category.destroy');

        Route::get('/product', [ProductController::class, 'index'])->name('product');
        Route::get('/product/create', [ProductController::class, 'create'])->name('product.create');
        Route::post('/product/store', [ProductController::class, 'store'])->name('product.store');
        Route::get('/product/edit/{id}', [ProductController::class, 'edit'])->name('product.edit');
        Route::put('/product/update/{id}', [ProductController::class, 'update'])->name('product.update');
        Route::delete('/product/delete/{id}', [ProductController::class, 'destroy'])->name('product.destroy');
        Route::delete('/product/image/delete/{image}', [ProductController::class, 'destroyImage'])->name('product.image.destroy');
        Route::delete('/product/file/delete/{file}', [ProductController::class, 'destroyFile'])->name('product.file.destroy');
        Route::get('/product_images', [ProductController::class, 'images'])->name('product-images');
        Route::get('/product_files', [ProductController::class, 'files'])->name('product-files');
        Route::get('/request_quotations', [RequestQuotationController::class, 'index'])
            ->name('request-quotations');

        Route::get('/user', [UserController::class, 'index'])->name('user');
        Route::post('/user/store', [UserController::class, 'store'])->name('user.store');
        Route::put('/user/update/{id}', [UserController::class, 'update'])->name('user.update');
        Route::delete('/user/delete/{id}', [UserController::class, 'destroy'])->name('user.destroy');

        Route::get('/user_role', [UserRoleController::class, 'index'])->name('user-role');
        Route::post('/user_role/store', [UserRoleController::class, 'store'])->name('user-role.store');
        Route::put('/user_role/update/{id}', [UserRoleController::class, 'update'])->name('user-role.update');
        Route::delete('/user_role/delete/{id}', [UserRoleController::class, 'destroy'])->name('user-role.destroy');
    });
});
