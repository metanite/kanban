import { InfiniteScroll } from '@inertiajs/react';
import { TaskCard } from './task-card';
import { TaskSkeleton } from './task-skeleton';
import type { ColumnKey, Task, TaskStatus } from './types';

export function KanbanColumn({
    title,
    tasks,
    propName,
    status,
    draggedTaskId,
    onDrop,
    onDragStart,
    onMove,
}: {
    title: string;
    tasks: Task[];
    propName: ColumnKey;
    status: TaskStatus;
    draggedTaskId: number | null;
    onDrop: (status: TaskStatus) => void;
    onDragStart: (taskId: number | null) => void;
    onMove: (taskId: number, status: TaskStatus) => void;
}) {
    return (
        <section
            className="flex min-h-0 min-w-0 flex-col rounded-xl border border-[#cbd8cc] bg-[#e9efe8] dark:border-[#34483a] dark:bg-[#172119]"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDrop(status)}
        >
            <div className="flex items-center justify-between gap-2 px-4 py-3">
                <h2 className="font-semibold">{title}</h2>
                <span className="rounded-full bg-[#fbfcfa] px-2 py-0.5 text-xs text-[#607064] dark:bg-[#253329] dark:text-[#b7c5b8]">
                    {tasks.length}
                </span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
                <InfiniteScroll
                    data={propName}
                    buffer={160}
                    className="space-y-3"
                    loading={<TaskSkeleton />}
                >
                    {tasks.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-[#b8c9ba] px-3 py-8 text-center text-sm text-[#7b8b7e] dark:border-[#4c6752] dark:text-[#9caf9e]">
                            Drop a task here
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                isDragging={draggedTaskId === task.id}
                                onDragStart={onDragStart}
                                onMove={onMove}
                            />
                        ))
                    )}
                </InfiniteScroll>
            </div>
        </section>
    );
}
