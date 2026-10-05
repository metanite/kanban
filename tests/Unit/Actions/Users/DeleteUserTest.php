<?php

namespace Tests\Unit\Actions\Users;

use App\Actions\Users\DeleteUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeleteUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_deletes_a_user(): void
    {
        $user = User::factory()->create();

        (new DeleteUser)->handle($user);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
