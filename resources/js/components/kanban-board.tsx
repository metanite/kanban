import { InfiniteScroll, router, useForm } from '@inertiajs/react';
import { CalendarDays, GripVertical, Plus, UserRound } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    store,
    updateStatus,
} from '@/actions/App/Http/Controllers/TaskController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TaskStatus = 'to_do' | 'in_progress' | 'in_review' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

export type Assignee = { id: number; name: string };

type Task = {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    priority: TaskPriority;
    status: TaskStatus;
    assignee: Assignee | null;
};

export type TaskPaginator = { data: Task[] };

type KanbanBoardProps = {
    assignees: Assignee[];
    columns: Record<ColumnKey, TaskPaginator>;
};

type ColumnKey =
    | 'toDoTasks'
    | 'inProgressTasks'
    | 'inReviewTasks'
    | 'doneTasks';

type NewTaskForm = {
    title: string;
    description: string;
    due_date: string;
    priority: TaskPriority;
    assignee_id: string;
};

const columns: Array<{ key: ColumnKey; status: TaskStatus; title: string }> = [
    { key: 'toDoTasks', status: 'to_do', title: 'To-do' },
    { key: 'inProgressTasks', status: 'in_progress', title: 'In-progress' },
    { key: 'inReviewTasks', status: 'in_review', title: 'In-review' },
    { key: 'doneTasks', status: 'done', title: 'Done' },
];

const statusLabels: Record<TaskStatus, string> = {
    to_do: 'To-do',
    in_progress: 'In-progress',
    in_review: 'In-review',
    done: 'Done',
};

const priorityClasses: Record<TaskPriority, string> = {
    low: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    high: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
};

export function KanbanBoard({
    assignees,
    columns: taskColumns,
}: KanbanBoardProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<NewTaskForm>({
            title: '',
            description: '',
            due_date: '',
            priority: 'medium',
            assignee_id: '',
        });

    function createTask(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        post(store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsCreateDialogOpen(false);
            },
        });
    }

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
        <div className="flex h-full min-h-0 flex-1 flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        My board
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Tasks you own or that are assigned to you.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        clearErrors();
                        setIsCreateDialogOpen(true);
                    }}
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

            <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a task</DialogTitle>
                        <DialogDescription>
                            New tasks are added to the To-do column.
                        </DialogDescription>
                    </DialogHeader>
                    <form className="grid gap-4" onSubmit={createTask}>
                        <FormField label="Title" error={errors.title}>
                            <Input
                                autoFocus
                                value={data.title}
                                onChange={(event) =>
                                    setData('title', event.target.value)
                                }
                            />
                        </FormField>
                        <FormField
                            label="Description"
                            error={errors.description}
                        >
                            <textarea
                                className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                value={data.description}
                                onChange={(event) =>
                                    setData('description', event.target.value)
                                }
                            />
                        </FormField>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField label="Due date" error={errors.due_date}>
                                <Input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(event) =>
                                        setData('due_date', event.target.value)
                                    }
                                />
                            </FormField>
                            <FormField label="Priority" error={errors.priority}>
                                <select
                                    className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                    value={data.priority}
                                    onChange={(event) =>
                                        setData(
                                            'priority',
                                            event.target.value as TaskPriority,
                                        )
                                    }
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </FormField>
                        </div>
                        <FormField label="Assignee" error={errors.assignee_id}>
                            <select
                                className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                value={data.assignee_id}
                                onChange={(event) =>
                                    setData('assignee_id', event.target.value)
                                }
                            >
                                <option value="">Unassigned</option>
                                {assignees.map((assignee) => (
                                    <option
                                        key={assignee.id}
                                        value={assignee.id}
                                    >
                                        {assignee.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>
                                Add task
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function KanbanColumn({
    title,
    tasks,
    propName,
    status,
    onDrop,
    onDragStart,
    onMove,
}: {
    title: string;
    tasks: Task[];
    propName: ColumnKey;
    status: TaskStatus;
    onDrop: (status: TaskStatus) => void;
    onDragStart: (taskId: number | null) => void;
    onMove: (taskId: number, status: TaskStatus) => void;
}) {
    return (
        <section
            className="bg-muted/40 flex min-h-72 min-w-0 flex-col rounded-xl border"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDrop(status)}
        >
            <div className="flex items-center justify-between gap-2 px-4 py-3">
                <h2 className="font-semibold">{title}</h2>
                <span className="bg-background text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                    {tasks.length}
                </span>
            </div>
            <InfiniteScroll
                data={propName}
                buffer={160}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-3"
                loading={<TaskSkeleton />}
            >
                {tasks.length === 0 ? (
                    <div className="text-muted-foreground rounded-lg border border-dashed px-3 py-8 text-center text-sm">
                        Drop a task here
                    </div>
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDragStart={onDragStart}
                            onMove={onMove}
                        />
                    ))
                )}
            </InfiniteScroll>
        </section>
    );
}

function TaskCard({
    task,
    onDragStart,
    onMove,
}: {
    task: Task;
    onDragStart: (taskId: number | null) => void;
    onMove: (taskId: number, status: TaskStatus) => void;
}) {
    return (
        <article
            draggable
            className="bg-card text-card-foreground cursor-grab rounded-lg border p-3 shadow-sm active:cursor-grabbing"
            onDragEnd={() => onDragStart(null)}
            onDragStart={(event) => {
                event.dataTransfer.effectAllowed = 'move';
                onDragStart(task.id);
            }}
        >
            <div className="flex items-start gap-2">
                <GripVertical className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                    <p className="font-medium break-words">{task.title}</p>
                    {task.description !== null && (
                        <p className="text-muted-foreground line-clamp-2 text-sm break-words">
                            {task.description}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                            className={cn(
                                'rounded-full px-2 py-0.5 font-medium capitalize',
                                priorityClasses[task.priority],
                            )}
                        >
                            {task.priority}
                        </span>
                        {task.due_date !== null && (
                            <span className="text-muted-foreground inline-flex items-center gap-1">
                                <CalendarDays className="size-3" />
                                {new Intl.DateTimeFormat(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                }).format(
                                    new Date(`${task.due_date}T00:00:00`),
                                )}
                            </span>
                        )}
                        {task.assignee !== null && (
                            <span className="text-muted-foreground inline-flex items-center gap-1">
                                <UserRound className="size-3" />
                                {task.assignee.name}
                            </span>
                        )}
                    </div>
                    <label
                        className="sr-only"
                        htmlFor={`task-status-${task.id}`}
                    >
                        Move {task.title}
                    </label>
                    <select
                        id={`task-status-${task.id}`}
                        className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-md border px-2 text-xs outline-none focus-visible:ring-[3px]"
                        value={task.status}
                        onChange={(event) =>
                            onMove(task.id, event.target.value as TaskStatus)
                        }
                        onPointerDown={(event) => event.stopPropagation()}
                    >
                        {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </article>
    );
}

function FormField({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {children}
            {error !== undefined && (
                <p className="text-destructive text-sm">{error}</p>
            )}
        </div>
    );
}

function TaskSkeleton() {
    return (
        <div className="space-y-2 pt-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-20 w-full" />
        </div>
    );
}
