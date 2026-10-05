<?php

namespace App\Actions\Tasks;

use App\Models\Task;
use App\Models\User;
use App\TaskStatus;

class CreateTask
{
    /**
     * Create a task owned by the given user.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function handle(User $owner, array $attributes): Task
    {
        return Task::create([
            ...$attributes,
            'owner_id' => $owner->id,
            'status' => TaskStatus::ToDo,
        ]);
    }
}
