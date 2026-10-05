<?php

namespace Tests\Unit\Actions\Fortify;

use App\Actions\Fortify\CreateNewUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CreateNewUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_validates_and_creates_a_user(): void
    {
        $user = (new CreateNewUser)->create([
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertInstanceOf(User::class, $user);
        $this->assertSame('New User', $user->name);
        $this->assertSame('new@example.com', $user->email);
        $this->assertTrue(Hash::check('password', $user->password));
    }
}
