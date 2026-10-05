import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { store } from '@/actions/App/Http/Controllers/TaskController';
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
import { FormField } from './form-field';
import type { Assignee, NewTaskForm } from './types';

export function TaskCreateDialog({
    assignees,
    open,
    onOpenChange,
}: {
    assignees: Assignee[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<NewTaskForm>({
            title: '',
            description: '',
            due_date: '',
            priority: 'medium',
            assignee_id: '',
        });

    useEffect(() => {
        if (open) {
            clearErrors();
        }
    }, [clearErrors, open]);

    function createTask(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        post(store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                    <FormField label="Description" error={errors.description}>
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
                                        event.target
                                            .value as NewTaskForm['priority'],
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
                                <option key={assignee.id} value={assignee.id}>
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
    );
}
