<?php

namespace Tests\Unit\Actions\Fortify;

use App\Actions\Fortify\ResetUserPassword;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ResetUserPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_resets_a_users_password(): void
    {
        $user = User::factory()->create(['password' => 'old-password']);

        (new ResetUserPassword)->reset($user, [
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
        $this->assertFalse(Hash::check('old-password', $user->password));
    }
}
