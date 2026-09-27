import type { Paginated } from '@/types';

interface DataShowingProps {
    meta: Paginated<any>;
    label: string;
    className?: string;
}

export function DataShowing({
    meta,
    label,
    className = 'mb-4 text-sm text-muted-foreground',
}: DataShowingProps) {
    const from = meta.from ?? 0;
    const to = meta.to ?? 0;

    return (
        <p className={className}>
            Showing {from} - {to} of {meta.total} {label}
        </p>
    );
}
