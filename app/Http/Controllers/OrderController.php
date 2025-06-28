<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Events\OrderPlaced;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'products'   => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity'   => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => $request->user()->id,
            ]);

            foreach ($request->products as $productData) {
                $product = Product::findOrFail($productData['product_id']);

                if ($product->stock < $productData['quantity']) {
                    return response()->json(['message' => 'Product out of stock'], 400);
                }

                $product->decrement('stock', $productData['quantity']);
                $order->products()->attach($product->id, ['quantity' => $productData['quantity']]);
            }

            event(new OrderPlaced($order));

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
{
    $order = Order::with(['products'])->findOrFail($id);

    return response()->json([
        'id'      => $order->id,
        'products' => $order->products->map(function ($product) {
            return [
                'id'       => $product->id,
                'name'     => $product->name,
                'price'    => $product->price,
                'quantity' => $product->pivot->quantity,
            ];
        }),
        'total' => $order->products->sum(function ($product) {
            return $product->price * $product->pivot->quantity;
        }),
    ]);
}

}
