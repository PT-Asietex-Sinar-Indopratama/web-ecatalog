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
            ['name' => 'Admin Asietex', 'email' => 'admin@asietex.test'],
            ['name' => 'Dina Prasetya', 'email' => 'dina.prasetya@asietex.test'],
            ['name' => 'Rafi Mahendra', 'email' => 'rafi.mahendra@asietex.test'],
            ['name' => 'Maya Lestari', 'email' => 'maya.lestari@asietex.test'],
            ['name' => 'Fajar Nugroho', 'email' => 'fajar.nugroho@asietex.test'],
            ['name' => 'Nadia Safitri', 'email' => 'nadia.safitri@asietex.test'],
            ['name' => 'Arman Wijaya', 'email' => 'arman.wijaya@asietex.test'],
            ['name' => 'Siska Amelia', 'email' => 'siska.amelia@asietex.test'],
            ['name' => 'Yoga Firmansyah', 'email' => 'yoga.firmansyah@asietex.test'],
            ['name' => 'Putri Anggraini', 'email' => 'putri.anggraini@asietex.test'],
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
