<?php

namespace Tests\Unit\Actions\Tasks;

use App\Actions\Tasks\DeleteTask;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeleteTaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_deletes_a_task(): void
    {
        $task = Task::factory()->for(User::factory(), 'owner')->create();

        (new DeleteTask)->handle($task);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
}
