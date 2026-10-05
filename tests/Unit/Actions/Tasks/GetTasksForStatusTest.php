<?php

namespace Tests\Unit\Actions\Tasks;

use App\Actions\Tasks\GetTasksForStatus;
use App\Models\Task;
use App\Models\User;
use App\TaskStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GetTasksForStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_visible_tasks_with_the_expected_board_data(): void
    {
        $user = User::factory()->create();
        $assignee = User::factory()->create();
        $otherUser = User::factory()->create();

        $ownedTask = Task::factory()
            ->for($user, 'owner')
            ->for($assignee, 'assignee')
            ->create([
                'title' => 'Owned task',
                'status' => TaskStatus::ToDo,
            ]);
        $assignedTask = Task::factory()
            ->for($otherUser, 'owner')
            ->for($user, 'assignee')
            ->create([
                'title' => 'Assigned task',
                'status' => TaskStatus::ToDo,
            ]);
        Task::factory()->for($otherUser, 'owner')->create([
            'title' => 'Private task',
            'status' => TaskStatus::ToDo,
        ]);

        $paginator = (new GetTasksForStatus)->handle(
            $user,
            TaskStatus::ToDo,
            'to_do_page',
        );
        $tasks = $paginator->items();

        $this->assertSame(2, $paginator->total());
        $this->assertEqualsCanonicalizing(
            ['Owned task', 'Assigned task'],
            array_column($tasks, 'title'),
        );
        $this->assertSame(
            [
                'id' => $assignee->id,
                'name' => $assignee->name,
            ],
            collect($tasks)->firstWhere('id', $ownedTask->id)['assignee'],
        );
        $this->assertTrue(collect($tasks)->firstWhere('id', $ownedTask->id)['can_delete']);
        $this->assertFalse(collect($tasks)->firstWhere('id', $assignedTask->id)['can_delete']);
    }
}
