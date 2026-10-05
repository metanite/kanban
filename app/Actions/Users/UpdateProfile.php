<?php

namespace App\Actions\Users;

use App\Models\User;

class UpdateProfile
{
    /**
     * Update a user's profile information.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function handle(User $user, array $attributes): User
    {
        $user->fill($attributes);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return $user;
    }
}
