<?php

namespace App\Http\Controllers;

use App\Actions\Tasks\CreateTask;
use App\Actions\Tasks\DeleteTask;
use App\Actions\Tasks\UpdateTaskStatus;
use App\Http\Requests\DestroyTaskRequest;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Models\Task;
use App\TaskStatus;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Store a new task in the To-do column.
     */
    public function store(StoreTaskRequest $request, CreateTask $createTask): RedirectResponse
    {
        $createTask->handle($request->user(), $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task added.')]);

        return to_route('dashboard');
    }

    /**
     * Move a task to another board column.
     */
    public function updateStatus(
        UpdateTaskStatusRequest $request,
        Task $task,
        UpdateTaskStatus $updateTaskStatus,
    ): RedirectResponse {
        $updateTaskStatus->handle(
            $task,
            TaskStatus::from($request->validated()['status']),
        );

        return to_route('dashboard');
    }

    /**
     * Remove a task from the board.
     */
    public function destroy(
        DestroyTaskRequest $request,
        Task $task,
        DeleteTask $deleteTask,
    ): RedirectResponse {
        $deleteTask->handle($task);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task removed.')]);

        return to_route('dashboard');
    }
}
