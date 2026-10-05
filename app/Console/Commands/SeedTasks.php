<?php

namespace App\Console\Commands;

use App\TaskStatus;
use Database\Seeders\TaskSeeder;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('tasks:seed {count=10 : Number of tasks to create} {status? : Optional status for every task}')]
#[Description('Seed tasks for the oldest user')]
class SeedTasks extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(TaskSeeder $taskSeeder): int
    {
        $count = filter_var($this->argument('count'), FILTER_VALIDATE_INT);

        if ($count === false || $count < 1) {
            $this->error('Count must be a positive integer.');

            return self::FAILURE;
        }

        $statusValue = $this->argument('status');
        $status = $statusValue === null ? null : TaskStatus::tryFrom($statusValue);

        if ($statusValue !== null && $status === null) {
            $allowedStatuses = implode(
                ', ',
                array_map(
                    static fn (TaskStatus $status): string => $status->value,
                    TaskStatus::cases(),
                ),
            );

            $this->error("Status must be one of: {$allowedStatuses}.");

            return self::FAILURE;
        }

        try {
            $taskSeeder->seedTasks($count, $status);
        } catch (RuntimeException $exception) {
            $this->error($exception->getMessage());

            return self::FAILURE;
        }

        $statusMessage = $status === null ? 'random statuses' : $status->value;
        $this->info("Created {$count} tasks with {$statusMessage}.");

        return self::SUCCESS;
    }
}
