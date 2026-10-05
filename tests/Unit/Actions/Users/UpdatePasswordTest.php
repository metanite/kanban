<?php

namespace Tests\Unit\Actions\Users;

use App\Actions\Users\UpdatePassword;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UpdatePasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_updates_a_users_password(): void
    {
        $user = User::factory()->create(['password' => 'old-password']);

        (new UpdatePassword)->handle($user, 'new-password');

        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
        $this->assertFalse(Hash::check('old-password', $user->password));
    }
}
