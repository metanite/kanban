<?php

namespace App\Http\Controllers;

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
    public function store(StoreTaskRequest $request): RedirectResponse
    {
        Task::create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
            'status' => TaskStatus::ToDo,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task added.')]);

        return to_route('dashboard');
    }

    /**
     * Move a task to another board column.
     */
    public function updateStatus(UpdateTaskStatusRequest $request, Task $task): RedirectResponse
    {
        $task->update($request->validated());

        return to_route('dashboard');
    }

    /**
     * Remove a task from the board.
     */
    public function destroy(DestroyTaskRequest $request, Task $task): RedirectResponse
    {
        $task->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task removed.')]);

        return to_route('dashboard');
    }
}
