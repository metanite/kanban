import { Skeleton } from '@/components/ui/skeleton';

export function TaskSkeleton() {
    return (
        <div className="space-y-2 pt-3">
            <Skeleton className="h-24 w-full bg-[#dce8dd] dark:bg-[#2b4030]" />
            <Skeleton className="h-20 w-full bg-[#dce8dd] dark:bg-[#2b4030]" />
        </div>
    );
}
