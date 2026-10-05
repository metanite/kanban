<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use App\TaskStatus;
use Illuminate\Database\Seeder;
use RuntimeException;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedTasks();
    }

    /**
     * Create tasks for the oldest user in the database.
     */
    public function seedTasks(int $count = 10, ?TaskStatus $status = null): void
    {
        $owner = User::query()->findOrFail(2);

        if ($owner === null) {
            throw new RuntimeException(
                'No users found. Run the default database seeder before creating tasks.',
            );
        }

        $factory = Task::factory()->count($count)->for($owner, 'owner');

        if ($status !== null) {
            $factory = $factory->state(['status' => $status]);
        }

        $factory->create();
    }
}
