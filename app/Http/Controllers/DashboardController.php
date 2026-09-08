<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use App\TaskStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the authenticated user's task board.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('dashboard', [
            'toDoTasks' => Inertia::scroll(fn (): LengthAwarePaginator => $this->tasksForStatus($user, TaskStatus::ToDo, 'to_do_page')),
            'inProgressTasks' => Inertia::scroll(fn (): LengthAwarePaginator => $this->tasksForStatus($user, TaskStatus::InProgress, 'in_progress_page')),
            'inReviewTasks' => Inertia::scroll(fn (): LengthAwarePaginator => $this->tasksForStatus($user, TaskStatus::InReview, 'in_review_page')),
            'doneTasks' => Inertia::scroll(fn (): LengthAwarePaginator => $this->tasksForStatus($user, TaskStatus::Done, 'done_page')),
            'assignees' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * @return LengthAwarePaginator<int, array<string, mixed>>
     */
    private function tasksForStatus(User $user, TaskStatus $status, string $pageName): LengthAwarePaginator
    {
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
                'assignee' => $task->assignee === null ? null : [
                    'id' => $task->assignee->id,
                    'name' => $task->assignee->name,
                ],
            ]);
    }
}
