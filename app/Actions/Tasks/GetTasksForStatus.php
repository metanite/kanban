<?php

namespace App\Actions\Tasks;

use App\Models\Task;
use App\Models\User;
use App\TaskStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetTasksForStatus
{
    /**
     * Load a paginated task column for the given user.
     */
    public function handle(
        User $user,
        TaskStatus $status,
        string $pageName,
    ): LengthAwarePaginator {
        return Task::query()
            ->visibleTo($user)
            ->where('status', $status->value)
            ->with('assignee:id,name')
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->paginate(perPage: 20, pageName: $pageName)
            ->through(fn (Task $task): array => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'due_date' => $task->due_date?->toDateString(),
                'priority' => $task->priority->value,
                'status' => $task->status->value,
                'can_delete' => $user->can('delete', $task),
                'assignee' => $task->assignee === null ? null : [
                    'id' => $task->assignee->id,
                    'name' => $task->assignee->name,
                ],
            ]);
    }
}
