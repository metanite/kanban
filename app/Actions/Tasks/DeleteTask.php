<?php

namespace App\Actions\Tasks;

use App\Models\Task;

class DeleteTask
{
    /**
     * Remove a task from the board.
     */
    public function handle(Task $task): void
    {
        $task->delete();
    }
}
