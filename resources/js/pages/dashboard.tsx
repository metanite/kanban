import { Head } from '@inertiajs/react';
import {
    KanbanBoard,
    type Assignee,
    type TaskPaginator,
} from '@/components/kanban-board';
import { dashboard } from '@/routes';

type DashboardProps = {
    toDoTasks: TaskPaginator;
    inProgressTasks: TaskPaginator;
    inReviewTasks: TaskPaginator;
    doneTasks: TaskPaginator;
    assignees: Assignee[];
};

export default function Dashboard({
    toDoTasks,
    inProgressTasks,
    inReviewTasks,
    doneTasks,
    assignees,
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <KanbanBoard
                assignees={assignees}
                columns={{
                    toDoTasks,
                    inProgressTasks,
                    inReviewTasks,
                    doneTasks,
                }}
            />
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
