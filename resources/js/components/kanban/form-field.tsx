import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

export function FormField({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
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
