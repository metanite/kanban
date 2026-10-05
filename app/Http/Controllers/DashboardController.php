<?php

namespace App\Http\Controllers;

use App\Actions\Tasks\GetTasksForStatus;
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
    public function __invoke(
        Request $request,
        GetTasksForStatus $getTasksForStatus,
    ): Response {
        $user = $request->user();

        return Inertia::render('dashboard', [
            'toDoTasks' => Inertia::scroll(fn (): LengthAwarePaginator => $getTasksForStatus->handle($user, TaskStatus::ToDo, 'to_do_page')),
            'inProgressTasks' => Inertia::scroll(fn (): LengthAwarePaginator => $getTasksForStatus->handle($user, TaskStatus::InProgress, 'in_progress_page')),
            'inReviewTasks' => Inertia::scroll(fn (): LengthAwarePaginator => $getTasksForStatus->handle($user, TaskStatus::InReview, 'in_review_page')),
            'doneTasks' => Inertia::scroll(fn (): LengthAwarePaginator => $getTasksForStatus->handle($user, TaskStatus::Done, 'done_page')),
            'assignees' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }
}
