<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AdminController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public book routes
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::get('/books/categories/list', [BookController::class, 'categories']);
Route::get('/books/age-categories/list', [BookController::class, 'ageCategories']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Book download (requires authentication)
    Route::get('/books/{id}/download', [BookController::class, 'download']);
    
    // Admin only routes
    Route::middleware('admin')->group(function () {
        // Admin dashboard
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/admin/books', [AdminController::class, 'allBooks']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::get('/admin/download-stats', [AdminController::class, 'downloadStats']);
        
        // Book management
        Route::post('/admin/books', [BookController::class, 'store']);
        Route::put('/admin/books/{id}', [BookController::class, 'update']);
        Route::delete('/admin/books/{id}', [BookController::class, 'destroy']);
    });
});
