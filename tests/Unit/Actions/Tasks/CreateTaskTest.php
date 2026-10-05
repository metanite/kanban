<?php

namespace Tests\Unit\Actions\Tasks;

use App\Actions\Tasks\CreateTask;
use App\Models\Task;
use App\Models\User;
use App\TaskPriority;
use App\TaskStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateTaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_to_do_task_for_the_owner(): void
    {
        $owner = User::factory()->create();

        $task = (new CreateTask)->handle($owner, [
            'title' => 'Prepare launch notes',
            'description' => 'Summarize the release highlights.',
            'priority' => TaskPriority::High,
        ]);

        $this->assertInstanceOf(Task::class, $task);
        $this->assertSame($owner->id, $task->owner_id);
        $this->assertSame(TaskStatus::ToDo, $task->status);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'owner_id' => $owner->id,
            'title' => 'Prepare launch notes',
            'status' => TaskStatus::ToDo->value,
        ]);
    }
}
