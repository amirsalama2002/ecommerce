<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Support\Facades\Log;

class SendOrderNotification
{
    public function handle(OrderPlaced $event)
    {
        Log::info('Order placed. Order ID: ' . $event->order->id);
    }
}
