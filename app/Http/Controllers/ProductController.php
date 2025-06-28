<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    // عرض المنتجات مع الفلترة والكاش
    public function index(Request $request)
    {
        $cacheKey = 'products_' . md5(json_encode($request->all()));

        $products = Cache::remember($cacheKey, 60, function () use ($request) {
            $query = Product::query();

            if ($request->has('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }

            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }

            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            return $query->paginate(6);
        });

        return response()->json($products);
    }

    // إضافة منتج جديد مع رفع صورة
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric',
                'stock' => 'required|integer',
                'category' => 'required|string|max:255',
                'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            $imagePath = $request->file('image')->store('products', 'public');

            $product = Product::create([
                'name' => $request->name,
                'price' => $request->price,
                'stock' => $request->stock,
                'category' => $request->category,
                'image' => $imagePath,
            ]);

            return response()->json([
                'message' => 'Product created successfully',
                'product' => $product
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
