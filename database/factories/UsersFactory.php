<?php

namespace Database\Factories;

use App\Models\Users;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<Users>
 */
class UsersFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $index = 0;

        $users = [
            ['name' => 'Sir Alex Ferguson', 'email' => 'alex.ferguson@asietex.test'],
            ['name' => 'Cristiano Ronaldo', 'email' => 'cristiano.ronaldo@asietex.test'],
            ['name' => 'Wayne Rooney', 'email' => 'wayne.rooney@asietex.test'],
            ['name' => 'Carlos Tevez', 'email' => 'carlos.tevez@asietex.test'],
            ['name' => 'Ryan Giggs', 'email' => 'ryan.giggs@asietex.test'],
            ['name' => 'Paul Scholes', 'email' => 'paul.scholes@asietex.test'],
            ['name' => 'Rio Ferdinand', 'email' => 'rio.ferdinand@asietex.test'],
            ['name' => 'Nemanja Vidic', 'email' => 'nemanja.vidic@asietex.test'],
            ['name' => 'Patrice Evra', 'email' => 'patrice.evra@asietex.test'],
            ['name' => 'Edwin van der Sar', 'email' => 'edwin.vandersar@asietex.test'],
            ['name' => 'user', 'email' => 'user@asietex.test'],
        ];

        $user = $users[$index % count($users)];
        $index++;

        return [
            'name' => $user['name'],
            'email' => $user['email'],
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => 'remember'.str_pad((string) $index, 3, '0', STR_PAD_LEFT),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
