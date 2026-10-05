import type { ColumnKey, TaskPriority, TaskStatus } from './types';

export const columns: Array<{
    key: ColumnKey;
    status: TaskStatus;
    title: string;
}> = [
    { key: 'toDoTasks', status: 'to_do', title: 'To-do' },
    { key: 'inProgressTasks', status: 'in_progress', title: 'In-progress' },
    { key: 'inReviewTasks', status: 'in_review', title: 'In-review' },
    { key: 'doneTasks', status: 'done', title: 'Done' },
];

export const statusLabels: Record<TaskStatus, string> = {
    to_do: 'To-do',
    in_progress: 'In-progress',
    in_review: 'In-review',
    done: 'Done',
};

export const priorityClasses: Record<TaskPriority, string> = {
    low: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    high: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
};
