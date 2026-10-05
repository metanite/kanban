<?php

namespace Tests\Feature\Console\Commands;

use App\Models\Task;
use App\Models\User;
use App\TaskStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeedTasksTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_the_requested_number_of_tasks_with_the_requested_status(): void
    {
        $user = User::factory()->create(['id' => 2]);

        $this->artisan('tasks:seed', [
            'count' => 3,
            'status' => TaskStatus::Done->value,
        ])->assertSuccessful();

        $this->assertDatabaseCount('tasks', 3);
        $this->assertSame(
            3,
            Task::query()
                ->where('owner_id', $user->id)
                ->where('status', TaskStatus::Done->value)
                ->count(),
        );
    }

    public function test_it_rejects_an_unknown_status_without_creating_tasks(): void
    {
        User::factory()->create();

        $this->artisan('tasks:seed', [
            'count' => 3,
            'status' => 'blocked',
        ])->assertFailed();

        $this->assertDatabaseCount('tasks', 0);
    }
}
