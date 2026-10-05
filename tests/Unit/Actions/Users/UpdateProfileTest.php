<?php

namespace Tests\Unit\Actions\Users;

use App\Actions\Users\UpdateProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_updates_profile_data_and_resets_email_verification(): void
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
            'email_verified_at' => now(),
        ]);

        $updatedUser = (new UpdateProfile)->handle($user, [
            'name' => 'New Name',
            'email' => 'new@example.com',
        ]);

        $this->assertSame($user->id, $updatedUser->id);
        $this->assertSame('New Name', $updatedUser->name);
        $this->assertSame('new@example.com', $updatedUser->email);
        $this->assertNull($updatedUser->email_verified_at);
    }

    public function test_it_preserves_email_verification_when_email_is_unchanged(): void
    {
        $verifiedAt = now();
        $user = User::factory()->create([
            'email' => 'same@example.com',
            'email_verified_at' => $verifiedAt,
        ]);

        (new UpdateProfile)->handle($user, [
            'name' => 'Updated Name',
            'email' => 'same@example.com',
        ]);

        $this->assertNotNull($user->refresh()->email_verified_at);
    }
}
