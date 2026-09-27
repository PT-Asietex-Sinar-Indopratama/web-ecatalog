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
            ['name' => 'Sir Alex Ferguson', 'email' => 'alex.ferguson@manutd.test'],
            ['name' => 'Cristiano Ronaldo', 'email' => 'cristiano.ronaldo@manutd.test'],
            ['name' => 'Wayne Rooney', 'email' => 'wayne.rooney@manutd.test'],
            ['name' => 'Carlos Tevez', 'email' => 'carlos.tevez@manutd.test'],
            ['name' => 'Ryan Giggs', 'email' => 'ryan.giggs@manutd.test'],
            ['name' => 'Paul Scholes', 'email' => 'paul.scholes@manutd.test'],
            ['name' => 'Rio Ferdinand', 'email' => 'rio.ferdinand@manutd.test'],
            ['name' => 'Nemanja Vidic', 'email' => 'nemanja.vidic@manutd.test'],
            ['name' => 'Patrice Evra', 'email' => 'patrice.evra@manutd.test'],
            ['name' => 'Edwin van der Sar', 'email' => 'edwin.vandersar@manutd.test'],
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
