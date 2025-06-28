<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'     => $this->faker->word(),
            'price'    => $this->faker->randomFloat(2, 10, 500),
            'stock'    => $this->faker->numberBetween(1, 100),
            'category' => $this->faker->randomElement(['Electronics', 'Clothing', 'Books']),
            'image'    => 'products/default.png',
        ];
    }
}


