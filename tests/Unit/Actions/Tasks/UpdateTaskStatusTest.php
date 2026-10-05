<?php

namespace Tests\Unit\Actions\Tasks;

use App\Actions\Tasks\UpdateTaskStatus;
use App\Models\Task;
use App\Models\User;
use App\TaskStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateTaskStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_moves_a_task_to_the_requested_status(): void
    {
        $task = Task::factory()
            ->for(User::factory(), 'owner')
            ->create(['status' => TaskStatus::ToDo]);

        $updatedTask = (new UpdateTaskStatus)->handle(
            $task,
            TaskStatus::Done,
        );

        $this->assertSame($task->id, $updatedTask->id);
        $this->assertSame(TaskStatus::Done, $updatedTask->status);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => TaskStatus::Done->value,
        ]);
    }
}
