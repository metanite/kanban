import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateStatus } from '@/actions/App/Http/Controllers/TaskController';
import { Button } from '@/components/ui/button';
import { KanbanColumn } from './kanban/kanban-column';
import { columns } from './kanban/constants';
import { TaskCreateDialog } from './kanban/task-create-dialog';
import type {
    Assignee,
    ColumnKey,
    TaskPaginator,
    TaskStatus,
} from './kanban/types';

type KanbanBoardProps = {
    assignees: Assignee[];
    columns: Record<ColumnKey, TaskPaginator>;
};

export type { Assignee, TaskPaginator } from './kanban/types';

export function KanbanBoard({
    assignees,
    columns: taskColumns,
}: KanbanBoardProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

    function moveTask(taskId: number, status: TaskStatus): void {
        router.patch(
            updateStatus.url(taskId),
            { status },
            {
                preserveScroll: true,
                onError: () => toast.error('Unable to move this task.'),
            },
        );
    }

    function handleDrop(status: TaskStatus): void {
        if (draggedTaskId !== null) {
            moveTask(draggedTaskId, status);
        }

        setDraggedTaskId(null);
    }

    return (
        <div className="flex h-[calc(100svh-3rem)] max-h-[calc(100svh-3rem)] min-h-0 flex-1 flex-col gap-4 overflow-hidden bg-[#f4f6f1] p-4 text-[#17211b] md:h-[calc(100svh-4rem)] md:max-h-[calc(100svh-4rem)] dark:bg-[#101411] dark:text-[#edf4ed]">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        My board
                    </h1>
                    <p className="text-sm text-[#607064] dark:text-[#b7c5b8]">
                        Tasks you own or that are assigned to you.
                    </p>
                </div>
                <Button
                    className="bg-[#1f5138] text-white hover:bg-[#16402b] dark:bg-[#8fcea8] dark:text-[#12251a] dark:hover:bg-[#a7d5b3]"
                    onClick={() => setIsCreateDialogOpen(true)}
                >
                    <Plus /> Add task
                </Button>
            </div>

            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-4">
                {columns.map((column) => (
                    <KanbanColumn
                        key={column.key}
                        title={column.title}
                        tasks={taskColumns[column.key].data}
                        propName={column.key}
                        status={column.status}
                        onDrop={handleDrop}
                        onDragStart={setDraggedTaskId}
                        onMove={moveTask}
                    />
                ))}
            </div>

            <TaskCreateDialog
                assignees={assignees}
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />
        </div>
    );
}
