export type TaskStatus = 'to_do' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Assignee = { id: number; name: string };

export type Task = {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    priority: TaskPriority;
    status: TaskStatus;
    can_delete: boolean;
    assignee: Assignee | null;
};

export type TaskPaginator = { data: Task[] };

export type ColumnKey =
    | 'toDoTasks'
    | 'inProgressTasks'
    | 'inReviewTasks'
    | 'doneTasks';

export type NewTaskForm = {
    title: string;
    description: string;
    due_date: string;
    priority: TaskPriority;
    assignee_id: string;
};
