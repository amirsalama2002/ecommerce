<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;


/**
 * Public Endpoints
 */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);

/**
 * Protected Endpoints - Requires Authentication
 */
Route::middleware('auth:sanctum')->group(function () {
    
    // Products
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/products/{id}/image', [ProductController::class, 'uploadImage']); // لو مطلوب رفع صورة بشكل منفصل

    // Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
});
