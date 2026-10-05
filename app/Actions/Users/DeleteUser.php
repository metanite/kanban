<?php

namespace App\Actions\Users;

use App\Models\User;

class DeleteUser
{
    /**
     * Permanently delete a user.
     */
    public function handle(User $user): void
    {
        $user->delete();
    }
}
