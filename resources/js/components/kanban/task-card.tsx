import { router } from '@inertiajs/react';
import { CalendarDays, GripVertical, Trash2, UserRound } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { destroy } from '@/actions/App/Http/Controllers/TaskController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { priorityClasses, statusLabels } from './constants';
import type { Task, TaskStatus } from './types';

export function TaskCard({
    task,
    isDragging,
    onDragStart,
    onMove,
}: {
    task: Task;
    isDragging: boolean;
    onDragStart: (taskId: number | null) => void;
    onMove: (taskId: number, status: TaskStatus) => void;
}) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    function deleteTask(): void {
        setIsDeleting(true);

        router.delete(destroy.url(task.id), {
            preserveScroll: true,
            onError: () => toast.error('Unable to remove this task.'),
            onSuccess: () => setIsDeleteDialogOpen(false),
            onFinish: () => setIsDeleting(false),
        });
    }

    return (
        <article
            id={`task-${task.id}`}
            data-task-id={task.id}
            className={cn(
                'rounded-lg border border-[#d9e2d8] bg-[#fbfcfa] p-3 text-[#17211b] shadow-sm dark:border-[#34483a] dark:bg-[#253329] dark:text-[#edf4ed]',
                isDragging && 'opacity-50 ring-2 ring-[#39704f]/30',
            )}
        >
            <div className="flex items-start gap-2">
                <button
                    type="button"
                    draggable
                    className="mt-0.5 shrink-0 cursor-grab rounded text-[#7b8b7e] outline-none focus-visible:ring-2 focus-visible:ring-[#39704f]/30 active:cursor-grabbing dark:text-[#9caf9e] dark:focus-visible:ring-[#a7d5b3]/30"
                    title={`Drag ${task.title}`}
                    aria-label={`Drag ${task.title}`}
                    onDragEnd={() => onDragStart(null)}
                    onDragStart={(event) => {
                        const taskCard =
                            event.currentTarget.closest<HTMLElement>(
                                '[data-task-id]',
                            );
                        const taskId = taskCard?.dataset.taskId;

                        if (taskId === undefined) {
                            event.preventDefault();
                            return;
                        }

                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setData('text/plain', taskId);

                        if (taskCard !== null) {
                            event.dataTransfer.setDragImage(taskCard, 24, 24);
                        }

                        onDragStart(Number(taskId));
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                >
                    <GripVertical className="size-4" />
                    <span className="sr-only">Drag task</span>
                </button>
                <div className="min-w-0 flex-1 space-y-2">
                    <p className="font-medium break-words">{task.title}</p>
                    {task.description !== null && (
                        <p className="line-clamp-2 text-sm break-words text-[#607064] dark:text-[#b7c5b8]">
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
                            <span className="inline-flex items-center gap-1 text-[#607064] dark:text-[#b7c5b8]">
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
                            <span className="inline-flex items-center gap-1 text-[#607064] dark:text-[#b7c5b8]">
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
                        className="h-8 w-full rounded-md border border-[#cbd8cc] bg-[#f4f6f1] px-2 text-xs outline-none focus-visible:border-[#39704f] focus-visible:ring-2 focus-visible:ring-[#39704f]/30 dark:border-[#405746] dark:bg-[#1d2a20] dark:focus-visible:border-[#a7d5b3] dark:focus-visible:ring-[#a7d5b3]/30"
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
                {task.can_delete && (
                    <Dialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0 text-[#7b8b7e] hover:bg-rose-500/10 hover:text-rose-600 dark:text-[#9caf9e] dark:hover:text-rose-300"
                                title="Remove task"
                                aria-label={`Remove ${task.title}`}
                                onPointerDown={(event) =>
                                    event.stopPropagation()
                                }
                            >
                                <Trash2 />
                                <span className="sr-only">Remove task</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Remove task?</DialogTitle>
                                <DialogDescription>
                                    This will permanently remove &quot;
                                    {task.title}&quot; from your board.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        variant="secondary"
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    variant="destructive"
                                    onClick={deleteTask}
                                    disabled={isDeleting}
                                >
                                    <Trash2 />
                                    {isDeleting ? 'Removing...' : 'Remove task'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </article>
    );
}
