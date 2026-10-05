<?php

namespace App\Actions\Tasks;

use App\Models\Task;
use App\TaskStatus;

class UpdateTaskStatus
{
    /**
     * Move a task to another board column.
     */
    public function handle(Task $task, TaskStatus $status): Task
    {
        $task->update(['status' => $status]);

        return $task;
    }
}
