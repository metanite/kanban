<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use App\TaskPriority;
use App\TaskStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TaskBoardTest extends TestCase
{
    use RefreshDatabase;

    public function test_board_shows_tasks_owned_by_or_assigned_to_the_user(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Task::factory()->for($user, 'owner')->create([
            'title' => 'Owned task',
            'status' => TaskStatus::ToDo,
        ]);
        Task::factory()->for($user, 'assignee')->create([
            'title' => 'Assigned task',
            'status' => TaskStatus::ToDo,
        ]);
        Task::factory()->for($otherUser, 'owner')->create([
            'title' => 'Private task',
            'status' => TaskStatus::ToDo,
        ]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->has('toDoTasks.data', 2),
            );
    }

    public function test_user_can_create_a_task_with_all_supported_fields(): void
    {
        $owner = User::factory()->create();
        $assignee = User::factory()->create();

        $response = $this->actingAs($owner)->post(route('tasks.store'), [
            'title' => 'Prepare launch notes',
            'description' => 'Summarize the release highlights.',
            'due_date' => '2026-10-01',
            'priority' => TaskPriority::High->value,
            'assignee_id' => $assignee->id,
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('tasks', [
            'owner_id' => $owner->id,
            'assignee_id' => $assignee->id,
            'title' => 'Prepare launch notes',
            'description' => 'Summarize the release highlights.',
            'priority' => TaskPriority::High->value,
            'status' => TaskStatus::ToDo->value,
        ]);

        $this->assertSame('2026-10-01', Task::query()->firstOrFail()->due_date?->toDateString());
    }

    public function test_task_creation_rejects_missing_title_invalid_priority_and_unknown_assignee(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from(route('dashboard'))
            ->post(route('tasks.store'), [
                'title' => '',
                'priority' => 'urgent',
                'assignee_id' => 999,
            ]);

        $response
            ->assertSessionHasErrors(['title', 'priority', 'assignee_id'])
            ->assertRedirect(route('dashboard'));

        $this->assertDatabaseCount('tasks', 0);
    }

    public function test_owner_can_move_a_task_to_another_column(): void
    {
        $owner = User::factory()->create();
        $task = Task::factory()->for($owner, 'owner')->create([
            'status' => TaskStatus::ToDo,
        ]);

        $response = $this->actingAs($owner)->patch(route('tasks.status.update', $task), [
            'status' => TaskStatus::InReview->value,
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('dashboard'));

        $this->assertSame(TaskStatus::InReview, $task->refresh()->status);
    }

    public function test_assignee_can_move_a_task(): void
    {
        $owner = User::factory()->create();
        $assignee = User::factory()->create();
        $task = Task::factory()
            ->for($owner, 'owner')
            ->for($assignee, 'assignee')
            ->create(['status' => TaskStatus::InProgress]);

        $this->actingAs($assignee)
            ->patch(route('tasks.status.update', $task), [
                'status' => TaskStatus::Done->value,
            ])
            ->assertRedirect(route('dashboard'));

        $this->assertSame(TaskStatus::Done, $task->refresh()->status);
    }

    public function test_user_cannot_move_a_task_that_is_not_visible_to_them(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $task = Task::factory()->for($owner, 'owner')->create([
            'status' => TaskStatus::ToDo,
        ]);

        $this->actingAs($otherUser)
            ->patch(route('tasks.status.update', $task), [
                'status' => TaskStatus::Done->value,
            ])
            ->assertForbidden();

        $this->assertSame(TaskStatus::ToDo, $task->refresh()->status);
    }

    public function test_each_column_uses_its_own_paginator(): void
    {
        $user = User::factory()->create();

        Task::factory()
            ->count(21)
            ->for($user, 'owner')
            ->create(['status' => TaskStatus::ToDo]);

        $this->actingAs($user)
            ->get(route('dashboard', ['to_do_page' => 2]))
            ->assertInertia(fn (Assert $page) => $page
                ->has('toDoTasks.data', 1)
                ->has('inProgressTasks.data', 0)
                ->has('inReviewTasks.data', 0)
                ->has('doneTasks.data', 0),
            );
    }
}
